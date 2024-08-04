import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @PrimaryKey()
  @Field(() => Int)
  id!: number;

  @Property({ type: "string", length: 255, unique: true })
  @Field(() => String)
  userName!: string;

  @Property({ type: "string", length: 512 })
  @Field(() => String)
  email?: string;

  @Property({ type: "text" })
  password!: string;

  @Field(() => String)
  @Property({ type: "timestamp" })
  createdAt? = new Date();

  @Field(() => String)
  @Property({ type: "timestamp", onUpdate: () => new Date() })
  updatedAt? = new Date();
}
