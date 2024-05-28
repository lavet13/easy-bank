import { keepPreviousData, useSuspenseQuery } from "@tanstack/react-query";
import { graphql } from "../../gql";
import { PostsQuery } from "../../gql/graphql";
import { InitialDataOptions } from "../../utils/graphql/initial-data-options";
import client from "../../graphql-client";
import { ConsoleLog } from "../../utils/debug/console-log";

type UsePostsProps = {
  take?: number;
  before?: number | null;
  after?: number | null;
  query?: string;
};

export const usePosts = (
  { take, after, before, query }: UsePostsProps,
  options?: InitialDataOptions<PostsQuery>
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

  const posts = graphql(`
    query Posts($input: PostsInput!) {
      posts(input: $input) {
        edges {
          id
          title
          preview(size: MEDIUM)
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

  return useSuspenseQuery<PostsQuery>({
    queryKey: [(posts.definitions[0] as any).name.value, { input }],
    queryFn: async () => {
      // await new Promise(resolve => setTimeout(() => resolve(0), 10000000));
      return client.request(posts, { input });
    },
    placeholderData: keepPreviousData,
    ...options,
  });
};
