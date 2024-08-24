import { ValidationError } from "apollo-server-express";
import { FieldError, FieldErrors } from "src/resolvers/ApiResponses";

export function handleUserRegisterError(err: any): FieldErrors {
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

  return {
    errors: [
      {
        field: "generic",
        error: "internal server error",
      },
    ],
  };
}
