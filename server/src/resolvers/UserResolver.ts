import argon2 from "argon2";
import { validateOrReject } from "class-validator";
import { Request } from "express";
import {
  Arg,
  createUnionType,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { v4 } from "uuid";
import { REDIS_PASS_RESET_PREFIX, SESSION_COOKIE } from "./../constants";
import { User } from "./../entities/User";
import { AppContext } from "./../types";
import { handleUserRegisterError } from "./../utils/errorHandler";
import sendEmail from "./../utils/sendEmail";
import { FieldErrors } from "./ApiResponses";

@InputType()
class UserCreateRequest {
  @Field()
  userName!: string;

  @Field()
  email?: string;

  @Field()
  password!: string;
}

@InputType()
class UserLoginRequest {
  @Field()
  userName!: string;

  @Field()
  password!: string;
}

const UserResponse = createUnionType({
  name: "UserResponse",
  types: () => [User, FieldErrors] as const,
  resolveType: (value) => {
    if ("id" in value) {
      return User;
    } else {
      return FieldErrors;
    }
  },
});

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UserCreateRequest,
    @Ctx() { req, em }: AppContext
  ): Promise<typeof UserResponse> {
    let user = await em.create(User, {
      userName: options.userName,
      email: options.email,
      password: options.password,
    });

    try {
      await validateOrReject(user);
      user.password = await argon2.hash(options.password);
      await em.persistAndFlush(user);
      this.setSessionCookie(req, user);
    } catch (err) {
      return handleUserRegisterError(err);
    }

    return user;
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UserLoginRequest,
    @Ctx() { em, req }: AppContext
  ): Promise<typeof UserResponse> {
    const user = await em.findOne(User, { userName: options.userName });
    if (!user) {
      return {
        errors: [
          {
            field: "userName",
            error: "User does not exist",
          },
        ],
      };
    }

    const validLogin = await argon2.verify(user.password, options.password);
    if (!validLogin) {
      console.error("login attemp failed with incorrect password");
      return {
        errors: [
          {
            field: "password",
            error: "Invalid password provided",
          },
        ],
      };
    }

    this.setSessionCookie(req, user);
    return user;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: AppContext): Promise<Boolean> {
    return new Promise((resolve) => {
      res.clearCookie(SESSION_COOKIE);
      req.session.destroy((err) => {
        if (err) {
          console.error("Error clearing the session");
          resolve(false);
          return;
        }

        resolve(true);
      });
    });
  }

  @Query(() => User)
  async me(@Ctx() { em, req }: AppContext): Promise<User | null> {
    if (req.session && req.session.userId) {
      return await em.findOne(User, { id: req.session.userId });
    }

    console.error("User is not logged in");
    return null;
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { em, redis }: AppContext
  ): Promise<Boolean> {
    const user = await em.findOne(User, { email: email });
    if (!user) return false;

    const passwordResetToken = v4();
    // key set to expire in 30 min
    redis.set(REDIS_PASS_RESET_PREFIX + passwordResetToken, user.id, {
      EX: 1000 * 60 * 30,
    });
    const messageInfo = await sendEmail(
      email,
      `
      Hi ${user.userName}, <br/>
      You can reset your password by following this link: <a href='http://localhost:4000/reset-password/${passwordResetToken}'>Reset Password</a><br/>
      Best, <br/>
      👻
      `
    );

    return messageInfo.messageId != null;
  }

  private setSessionCookie(req: Request, user: User) {
    // todo - FIX ME! TS error
    req.session.userId = user.id;
    console.log(`Session User ID: ${req.session.userId}`);
  }
}
