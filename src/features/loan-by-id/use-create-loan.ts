import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { CreateLoanMutation, CreateLoanMutationVariables } from "../../gql/graphql";
import { graphql } from "../../gql";
import client from "../../graphql-client";

export const useCreateLoan = (
  options?: UseMutationOptions<CreateLoanMutation, Error, CreateLoanMutationVariables>
) => {
  const createLoan = graphql(`
    mutation CreateLoan($input: CreateLoanInput!) {
      createLoan(input: $input) {
        id
      }
    }
  `);

  return useMutation({
    mutationFn: (variables: CreateLoanMutationVariables) => {
      return client.request(createLoan, variables);
    },
    ...options,
  });
};

