import React from "react";
import { Formik, Form } from "formik";
import { Button } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const [_, login] = useLoginMutation();
  const router = useRouter();

  return (
    <Wrapper>
      <Formik
        initialValues={{ userName: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          console.log(values);
          const res = await login({ options: values });
          if (res.data?.login.__typename === "FieldErrors") {
            setErrors(toErrorMap(res.data.login.errors));
          } else if (res.data?.login.__typename === "User") {
            console.log(`user id ${res.data.login.id} registered successfully`);
            router.push("/");
          }
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form>
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
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Login;
