import { useQuery } from "@tanstack/react-query";
import { graphql } from "../../gql";
import { MeQuery } from "../../gql/graphql";
import client from "../../graphql-client";
import { InitialDataOptions } from "../../utils/graphql/initial-data-options";

export const useGetMe = (options?: InitialDataOptions<MeQuery>) => {
  const me = graphql(`
    query Me {
      me {
        id
        email
        name
        role
      }
    }
  `);

  return useQuery<MeQuery>({
    queryKey: [(me.definitions[0] as any).name.value],
    queryFn: async () => {
      return client.request(me);
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    ...options,
  });
};


