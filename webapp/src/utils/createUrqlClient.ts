import { fetchExchange } from "urql";
import { cacheExchange, Cache, QueryInput } from "@urql/exchange-graphcache";
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  RegisterUserMutation,
  LoginMutation,
} from "../generated/graphql";

function typedUpdateQuery<Result, Target>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, t: Target) => Target
) {
  cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

export const createUrqlClient = (ssrExchange: any) => ({
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
          login: (result, _args, cache, _info) => {
            typedUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              result,
              (resAlias, target) => {
                if (resAlias.login.__typename === "User") {
                  target = { me: resAlias };
                } else {
                  target.me = null;
                }

                return target;
              }
            );
          },
          register: (result, _args, cache, _info) => {
            typedUpdateQuery<RegisterUserMutation, MeQuery>(
              cache,
              { query: MeDocument },
              result,
              (resAlias, target) => {
                if (resAlias.register.__typename === "User") {
                  target = { me: resAlias };
                } else {
                  target.me = null;
                }

                return target;
              }
            );
          },
        },
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
  fetchOptions: {
    credentials: "include" as RequestCredentials,
  },
});
