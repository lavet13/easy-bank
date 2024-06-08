import { graphql } from '../../gql';
import { CurrentBalanceQuery } from '../../gql/graphql';
import client from '../../graphql-client';
import { InitialDataOptions } from '../../utils/graphql/initial-data-options';
import { ConsoleLog } from '../../utils/debug/console-log';
import { useQuery } from '@tanstack/react-query';

export const useCurrentBalance = (options?: InitialDataOptions<CurrentBalanceQuery>) => {
  const currentBalance = graphql(`
    query CurrentBalance {
      currentBalance
    }
  `);

  return useQuery<CurrentBalanceQuery>({
    queryKey: [(currentBalance.definitions[0] as any).name.value],
    queryFn: async ({ queryKey }) => {
      ConsoleLog({ what: queryKey });
      return client.request({
        document: currentBalance,
      });
    },
    refetchOnWindowFocus: true,
    ...options,
  });
};

