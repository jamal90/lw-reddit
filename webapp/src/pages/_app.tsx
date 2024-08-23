import { ChakraProvider } from "@chakra-ui/react";

import theme from "../theme";
import { AppProps } from "next/app";
import { Provider, createClient, fetchExchange } from "urql";
import { cacheExchange, Cache, QueryInput } from "@urql/exchange-graphcache";
import { LogoutMutation, MeDocument, MeQuery } from "./../generated/graphql";

function typedUpdateQuery<Result, Target>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, t: Target) => Target
) {
  cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

function MyApp({ Component, pageProps }: AppProps) {
  const client = createClient({
    url: "http://localhost:4000/graphql",
    exchanges: [
      cacheExchange({
        updates: {
          Mutation: {
            logout: (result, _args, cache, _info) => {
              if (result) {
                typedUpdateQuery<LogoutMutation, MeQuery>(
                  cache,
                  { query: MeDocument },
                  result,
                  (resultAlias, target) => {
                    if (resultAlias) target.me = null;
                    return target;
                  }
                );

                // not type safe
                cache.updateQuery({ query: MeDocument }, (data) => {
                  data.userName = null;
                  return data;
                });
              }
            },
          },
        },
      }),
      fetchExchange,
    ],
    fetchOptions: {
      credentials: "include",
    },
  });
  return (
    <Provider value={client}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
