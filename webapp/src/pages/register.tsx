import React from "react";
import { Formik, Form } from "formik";
import { Button } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useMutation } from "urql";

interface RegisterProps {}

const REGISTER_MUTATION = `
mutation registerUser($username: String!, $email: String!, $password: String! ) {
  register(options: {
    email: $email,
    userName: $username,
    password: $password
  }) {
    __typename
    ... on User {
      id
      userName
      email
      createdAt
      updatedAt
    }
    ... on FieldErrors {
      errors {
        field
        error
      }
    }
  }
}
`;

const Register: React.FC<RegisterProps> = () => {
  const [{ fetching }, register] = useMutation(REGISTER_MUTATION);

  return (
    <Wrapper>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values) => {
          console.log(values);
          return register(values);
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <InputField name="email" label="Email" placeholder="email" />
            <InputField
              name="username"
              label="User Name"
              placeholder="username"
            />
            <InputField
              name="password"
              label="Password"
              placeholder="password"
              type="password"
            />
            <Button mt={4} type="submit" isLoading={isSubmitting}>
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
