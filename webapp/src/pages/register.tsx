import React from "react";
import { Formik, Form } from "formik";
import { Button } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useRegisterUserMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
  const [_, register] = useRegisterUserMutation();
  const router = useRouter();

  return (
    <Wrapper>
      <Formik
        initialValues={{ userName: "", password: "", email: "" }}
        onSubmit={async (values, { setErrors }) => {
          console.log(values);
          const res = await register(values);
          if (res.data?.register.__typename === "FieldErrors") {
            setErrors(toErrorMap(res.data.register.errors));
          } else if (res.data?.register.__typename === "User") {
            console.log(
              `user id ${res.data.register.id} registered successfully`
            );
            router.push("/");
          }
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <InputField name="email" label="Email" placeholder="email" />
            <InputField
              name="userName"
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

export default withUrqlClient(createUrqlClient)(Register);
