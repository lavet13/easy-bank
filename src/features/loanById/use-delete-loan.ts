import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { DeleteLoanMutation, DeleteLoanMutationVariables } from "../../gql/graphql";
import { graphql } from "../../gql";
import client from "../../graphql-client";

export const useDeleteLoan = (
  options?: UseMutationOptions<DeleteLoanMutation, Error, DeleteLoanMutationVariables>
) => {
  const deleteLoan = graphql(`
    mutation DeleteLoan($id: ID!) {
      delLoan(id: $id)
    }
  `);

  return useMutation({
    mutationFn: (variables: DeleteLoanMutationVariables) => {
      return client.request(deleteLoan, variables);
    },
    ...options,
  });
};


