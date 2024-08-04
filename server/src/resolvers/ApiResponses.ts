import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class FieldError {
  @Field()
  field!: string;

  @Field()
  error!: string;
}

@ObjectType()
export class FieldErrors {
  @Field(() => [FieldError])
  errors!: [FieldError];
}
