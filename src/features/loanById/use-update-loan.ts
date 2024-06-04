import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { UpdateLoanMutation, UpdateLoanMutationVariables } from "../../gql/graphql";
import { graphql } from "../../gql";
import client from "../../graphql-client";

export const useUpdateLoan = (
  options?: UseMutationOptions<UpdateLoanMutation, Error, UpdateLoanMutationVariables>
) => {
  const updateLoan = graphql(`
    mutation UpdateLoan($input: UpdateLoanInput!) {
      updateLoan(input: $input) {
        id
        amount
        term
        status
      }
    }
  `);

  return useMutation({
    mutationFn: (variables: UpdateLoanMutationVariables) => {
      return client.request(updateLoan, variables);
    },
    ...options,
  });
};

