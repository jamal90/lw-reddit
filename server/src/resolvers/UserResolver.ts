import { User } from "./../entities/User";
import { AppContext } from "./../types";
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from "type-graphql";
import argon2 from "argon2";

@InputType()
class UserCreateRequest {
  @Field()
  userName!: string;

  @Field()
  email?: string;

  @Field()
  password!: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg("options") options: UserCreateRequest,
    @Ctx() { em }: AppContext
  ): Promise<User | null> {
    const hashedPassword = await argon2.hash(options.password);
    const user = await em.create(User, {
      userName: options.userName,
      email: options.email,
      password: hashedPassword,
    });
    await em.persistAndFlush(user);
    return user;
  }
}
