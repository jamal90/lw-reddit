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
    @Ctx() { em }: AppContext
  ): Promise<typeof UserResponse> {
    const hashedPassword = await argon2.hash(options.password);
    const user = await em.create(User, {
      userName: options.userName,
      email: options.email,
      password: hashedPassword,
    });

    try {
      await em.persistAndFlush(user);
    } catch (err) {
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
            error: "Invalid password provider",
          },
        ],
      };
    }

    // todo - FIX ME! TS error
    req.session.userId = user.id;
    console.log(`Session User ID: ${req.session.userId}`);

    return user;
  }

  @Query(() => User)
  async me(@Ctx() { em, req }: AppContext): Promise<User | null> {
    if (req.session && req.session.userId) {
      return await em.findOne(User, { id: req.session.userId });
    }

    console.error("User is not logged in");
    return null;
  }
}
