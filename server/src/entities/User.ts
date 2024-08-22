import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { MinLength } from "class-validator";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @PrimaryKey()
  @Field(() => Int)
  id!: number;

  @Property({ type: "string", length: 255, unique: true })
  @Field(() => String)
  @MinLength(3, { message: "Username should have at least 3 characters" })
  userName!: string;

  @Property({ type: "string", length: 512 })
  @MinLength(7, { message: "Email should have at least 7 characters" })
  @Field(() => String)
  email?: string;

  @Property({ type: "text" })
  @MinLength(3, { message: "Password should have at least 3 characters" })
  password!: string;

  @Field(() => String)
  @Property({ type: "timestamp" })
  createdAt? = new Date();

  @Field(() => String)
  @Property({ type: "timestamp", onUpdate: () => new Date() })
  updatedAt? = new Date();
}
