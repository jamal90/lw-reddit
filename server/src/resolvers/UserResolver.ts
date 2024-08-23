import { User } from "./../entities/User";
import { AppContext } from "./../types";
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
import argon2 from "argon2";
import { FieldError, FieldErrors } from "./ApiResponses";
import { validateOrReject, ValidationError } from "class-validator";
import { Request } from "express";
import { SESSION_COOKIE } from "./../constants";

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
      console.error("ERR: ", err);
      if (err instanceof Error) {
        console.error("Error Name: ", err.name);
        if (err.name === "UniqueConstraintViolationException") {
          return {
            errors: [
              {
                field: "userName",
                error: "User name must be unique",
              },
            ],
          };
        }
      } else if (err instanceof Array && err[0] instanceof ValidationError) {
        const errors: FieldError[] = err.map((error: ValidationError) => {
          return {
            field: error.property,
            error: Object.values(error.constraints || {}).join(", "),
          };
        });

        return { errors };
      }
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

  private setSessionCookie(req: Request, user: User) {
    // todo - FIX ME! TS error
    req.session.userId = user.id;
    console.log(`Session User ID: ${req.session.userId}`);
  }
}
