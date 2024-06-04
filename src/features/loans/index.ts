import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { graphql } from "../../gql";
import { LoansQuery } from "../../gql/graphql";
import { InitialDataOptions } from "../../utils/graphql/initial-data-options";
import client from "../../graphql-client";
import { ConsoleLog } from "../../utils/debug/console-log";

type UseLoansProps = {
  take?: number;
  before?: number | null;
  after?: number | null;
  query?: string;
};

export const useLoans = (
  { take, after, before, query }: UseLoansProps,
  options?: InitialDataOptions<any>
) => {
  const input: Record<string, any> = {};
  ConsoleLog({ before, after });

  if (after !== null && after !== undefined) {
    input.after = after;
  }
  if (before !== null && before !== undefined) {
    input.before = before;
  }
  if (take !== undefined && take !== null) {
    input.take = take;
  }
  if (query?.length !== 0) {
    input.query = query;
  }
  ConsoleLog({ input });

  const loans = graphql(`
    query Loans ($input: LoansInput!) {
      loans(input: $input) {
        edges {
          id
          term
          amount
          status
          createdAt
          updatedAt
        }
        pageInfo {
          endCursor
          hasNextPage

          startCursor
          hasPreviousPage
        }
      }
    }
  `);

  return useQuery<LoansQuery>({
    queryKey: [(loans.definitions[0] as any).name.value, { input }],
    queryFn: async () => {
      // await new Promise(resolve => setTimeout(() => resolve(0), 10000000));
      return client.request(loans, { input });
    },
    placeholderData: keepPreviousData,
    ...options,
  });
};
