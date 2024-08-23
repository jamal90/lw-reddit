import { Box, Flex, Link, Text } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";

export const NavBar: React.FC<{}> = ({}) => {
  const [{ data, fetching, error }, userInfo] = useMeQuery();

  let body = null;
  if (fetching) {
    <Text> Loading user info </Text>;
  } else if (!data?.me.id) {
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
          <NextLink href="/logout">
            <Link ml={2}>Logout</Link>
          </NextLink>
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
