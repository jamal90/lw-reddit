/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
import gql from "graphql-tag";
import * as Urql from "urql";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type FieldError = {
  __typename?: "FieldError";
  error: Scalars["String"]["output"];
  field: Scalars["String"]["output"];
};

export type FieldErrors = {
  __typename?: "FieldErrors";
  errors: Array<FieldError>;
};

export type Mutation = {
  __typename?: "Mutation";
  createPost: Post;
  deletePost: Scalars["Boolean"]["output"];
  login: UserResponse;
  logout: Scalars["Boolean"]["output"];
  register: UserResponse;
  updatePost: Post;
};

export type MutationCreatePostArgs = {
  content: Scalars["String"]["input"];
  title: Scalars["String"]["input"];
  userName: Scalars["String"]["input"];
};

export type MutationDeletePostArgs = {
  id: Scalars["Float"]["input"];
};

export type MutationLoginArgs = {
  options: UserLoginRequest;
};

export type MutationRegisterArgs = {
  options: UserCreateRequest;
};

export type MutationUpdatePostArgs = {
  content: Scalars["String"]["input"];
  id: Scalars["Float"]["input"];
  title: Scalars["String"]["input"];
};

export type Post = {
  __typename?: "Post";
  content: Scalars["String"]["output"];
  createdAt: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  title: Scalars["String"]["output"];
  updatedAt: Scalars["String"]["output"];
  userName: Scalars["String"]["output"];
};

export type Query = {
  __typename?: "Query";
  hello: Scalars["String"]["output"];
  me: User;
  post?: Maybe<Post>;
  posts: Array<Post>;
};

export type QueryPostArgs = {
  id: Scalars["Int"]["input"];
};

export type User = {
  __typename?: "User";
  createdAt: Scalars["String"]["output"];
  email: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  updatedAt: Scalars["String"]["output"];
  userName: Scalars["String"]["output"];
};

export type UserCreateRequest = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
  userName: Scalars["String"]["input"];
};

export type UserLoginRequest = {
  password: Scalars["String"]["input"];
  userName: Scalars["String"]["input"];
};

export type UserResponse = FieldErrors | User;

export type UserInfoFragment = {
  __typename?: "User";
  id: number;
  userName: string;
  email: string;
} & { " $fragmentName"?: "UserInfoFragment" };

export type LoginMutationVariables = Exact<{
  options: UserLoginRequest;
}>;

export type LoginMutation = {
  __typename?: "Mutation";
  login:
    | {
        __typename: "FieldErrors";
        errors: Array<{
          __typename?: "FieldError";
          field: string;
          error: string;
        }>;
      }
    | ({ __typename: "User" } & {
        " $fragmentRefs"?: { UserInfoFragment: UserInfoFragment };
      });
};

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = { __typename?: "Mutation"; logout: boolean };

export type RegisterUserMutationVariables = Exact<{
  userName: Scalars["String"]["input"];
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
}>;

export type RegisterUserMutation = {
  __typename?: "Mutation";
  register:
    | {
        __typename: "FieldErrors";
        errors: Array<{
          __typename?: "FieldError";
          field: string;
          error: string;
        }>;
      }
    | ({ __typename: "User" } & {
        " $fragmentRefs"?: { UserInfoFragment: UserInfoFragment };
      });
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = {
  __typename?: "Query";
  me: { __typename?: "User" } & {
    " $fragmentRefs"?: { UserInfoFragment: UserInfoFragment };
  };
};

export type ReadPostsQueryVariables = Exact<{ [key: string]: never }>;

export type ReadPostsQuery = {
  __typename?: "Query";
  posts: Array<{
    __typename: "Post";
    id: number;
    title: string;
    content: string;
    userName: string;
    createdAt: string;
    updatedAt: string;
  }>;
};

// export const UserInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]} as unknown as DocumentNode<UserInfoFragment, unknown>;
// export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserLoginRequest"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserInfo"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FieldErrors"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
// export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
// export const RegisterUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"registerUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"userName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userName"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserInfo"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FieldErrors"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]} as unknown as DocumentNode<RegisterUserMutation, RegisterUserMutationVariables>;
// export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserInfo"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
// export const ReadPostsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"readPosts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"posts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<ReadPostsQuery, ReadPostsQueryVariables>;
export const UserInfoFragmentDoc = gql`
  fragment UserInfo on User {
    id
    userName
    email
  }
`;
export const LoginDocument = gql`
  mutation Login($options: UserLoginRequest!) {
    login(options: $options) {
      __typename
      ... on User {
        ...UserInfo
      }
      ... on FieldErrors {
        errors {
          field
          error
        }
      }
    }
  }
  ${UserInfoFragmentDoc}
`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
}
export const LogoutDocument = gql`
  mutation Logout {
    logout
  }
`;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(
    LogoutDocument
  );
}
export const RegisterUserDocument = gql`
  mutation registerUser(
    $userName: String!
    $email: String!
    $password: String!
  ) {
    register(
      options: { email: $email, userName: $userName, password: $password }
    ) {
      __typename
      ... on User {
        ...UserInfo
      }
      ... on FieldErrors {
        errors {
          field
          error
        }
      }
    }
  }
  ${UserInfoFragmentDoc}
`;

export function useRegisterUserMutation() {
  return Urql.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(
    RegisterUserDocument
  );
}
export const MeDocument = gql`
  query Me {
    me {
      ...UserInfo
    }
  }
  ${UserInfoFragmentDoc}
`;

export function useMeQuery(
  options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, "query">
) {
  return Urql.useQuery<MeQuery, MeQueryVariables>({
    query: MeDocument,
    ...options,
  });
}
export const ReadPostsDocument = gql`
  query readPosts {
    posts {
      __typename
      id
      title
      content
      userName
      createdAt
      updatedAt
    }
  }
`;

export function useReadPostsQuery(
  options?: Omit<Urql.UseQueryArgs<ReadPostsQueryVariables>, "query">
) {
  return Urql.useQuery<ReadPostsQuery, ReadPostsQueryVariables>({
    query: ReadPostsDocument,
    ...options,
  });
}
