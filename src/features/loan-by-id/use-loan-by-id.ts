import { graphql } from '../../gql';
import { LoanByIdQuery } from '../../gql/graphql';
import client from '../../graphql-client';
import { InitialDataOptions } from '../../utils/graphql/initial-data-options';
import { ConsoleLog } from '../../utils/debug/console-log';
import { useQuery } from '@tanstack/react-query';

export const useLoanById = (id: string, options?: InitialDataOptions<LoanByIdQuery>) => {
  const loanById = graphql(`
    query LoanById($id: ID!) {
      loanById(id: $id) {
        id
        amount
        term
        status
        comment {
          text
        }
      }
    }
  `);

  return useQuery<LoanByIdQuery>({
    queryKey: [(loanById.definitions[0] as any).name.value, { id }],
    queryFn: async ({ queryKey }) => {
      ConsoleLog({ what: queryKey });
      return client.request({
        document: loanById,
        variables: { id },
      });
    },
    ...options,
  });
};

