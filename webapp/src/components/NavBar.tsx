import { Box, Button, Flex, Link, Text } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

export const NavBar: React.FC<{}> = ({}) => {
  const [{ data, fetching, error }, userInfo] = useMeQuery();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  let body = null;
  if (fetching) {
    <Text> Loading user info </Text>;
  } else if (!data?.me?.id) {
    body = (
      <>
        <NextLink href="/register">
          <Link mr={2}>Register</Link>
        </NextLink>
        <NextLink href="/login">
          <Link>Login</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <>
        <Flex>
          <Text ml="auto">Hello, {data.me.userName}</Text>
          <Button
            ml={2}
            isLoading={logoutFetching}
            onClick={async (event) => {
              event.preventDefault();
              await logout({});
            }}
          >
            Logout
          </Button>
        </Flex>
      </>
    );
  }

  return (
    <Flex p={4} bg="tomato">
      <Box ml="auto">{body}</Box>
    </Flex>
  );
};
