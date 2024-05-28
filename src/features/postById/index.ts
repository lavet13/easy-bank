import { graphql } from '../../gql';
import { PostByIdQuery } from '../../gql/graphql';
import client from '../../graphql-client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { InitialDataOptions } from '../../utils/graphql/initial-data-options';
import { ConsoleLog } from '../../utils/debug/console-log';

export const usePostById = (postId: string, options?: InitialDataOptions<PostByIdQuery>) => {
  const postById = graphql(`
    query PostById($postId: ID!) {
      postById(postId: $postId) {
        id
        title
        content
        categories {
          id
          name
        }
      }
    }
  `);

  return useSuspenseQuery<PostByIdQuery>({
    queryKey: [(postById.definitions[0] as any).name.value, { postId }],
    queryFn: ({ queryKey }) => {
      ConsoleLog({ what: queryKey });
      return client.request({
        document: postById,
        variables: { postId },
      });
    },
    ...options,
  });
};
