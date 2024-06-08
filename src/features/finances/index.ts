import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { graphql } from "../../gql";
import { FinancesQuery } from "../../gql/graphql";
import { InitialDataOptions } from "../../utils/graphql/initial-data-options";
import client from "../../graphql-client";
import { ConsoleLog } from "../../utils/debug/console-log";

type UseFinancesProps = {
  take?: number;
  before?: number | null;
  after?: number | null;
  query?: string;
};

export const useFinancialHistory = (
  { take, after, before, query }: UseFinancesProps,
  options?: InitialDataOptions<FinancesQuery>
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

  const finances = graphql(`
    query Finances ($input: FinansInput!) {
      financialHistory(input: $input) {
        edges {
          id
          income
          expenses
          currentBalance
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

  return useQuery<FinancesQuery>({
    queryKey: [(finances.definitions[0] as any).name.value, { input }],
    queryFn: async () => {
      return client.request(finances, { input });
    },
    placeholderData: keepPreviousData,
    ...options,
  });
};
