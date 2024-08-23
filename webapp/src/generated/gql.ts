/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "fragment UserInfo on User {\n  id\n  userName\n  email\n}": types.UserInfoFragmentDoc,
    "mutation Login($options: UserLoginRequest!) {\n  login(options: $options) {\n    __typename\n    ... on User {\n      ...UserInfo\n    }\n    ... on FieldErrors {\n      errors {\n        field\n        error\n      }\n    }\n  }\n}": types.LoginDocument,
    "mutation registerUser($userName: String!, $email: String!, $password: String!) {\n  register(options: {email: $email, userName: $userName, password: $password}) {\n    __typename\n    ... on User {\n      ...UserInfo\n    }\n    ... on FieldErrors {\n      errors {\n        field\n        error\n      }\n    }\n  }\n}": types.RegisterUserDocument,
    "query Me {\n  me {\n    ...UserInfo\n  }\n}": types.MeDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment UserInfo on User {\n  id\n  userName\n  email\n}"): (typeof documents)["fragment UserInfo on User {\n  id\n  userName\n  email\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Login($options: UserLoginRequest!) {\n  login(options: $options) {\n    __typename\n    ... on User {\n      ...UserInfo\n    }\n    ... on FieldErrors {\n      errors {\n        field\n        error\n      }\n    }\n  }\n}"): (typeof documents)["mutation Login($options: UserLoginRequest!) {\n  login(options: $options) {\n    __typename\n    ... on User {\n      ...UserInfo\n    }\n    ... on FieldErrors {\n      errors {\n        field\n        error\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation registerUser($userName: String!, $email: String!, $password: String!) {\n  register(options: {email: $email, userName: $userName, password: $password}) {\n    __typename\n    ... on User {\n      ...UserInfo\n    }\n    ... on FieldErrors {\n      errors {\n        field\n        error\n      }\n    }\n  }\n}"): (typeof documents)["mutation registerUser($userName: String!, $email: String!, $password: String!) {\n  register(options: {email: $email, userName: $userName, password: $password}) {\n    __typename\n    ... on User {\n      ...UserInfo\n    }\n    ... on FieldErrors {\n      errors {\n        field\n        error\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Me {\n  me {\n    ...UserInfo\n  }\n}"): (typeof documents)["query Me {\n  me {\n    ...UserInfo\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;