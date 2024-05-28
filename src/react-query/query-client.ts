import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import {
  persistQueryClient,
  removeOldestQuery,
} from '@tanstack/react-query-persist-client';
import { createStandaloneToast } from '@chakra-ui/react';
import { isGraphQLRequestError } from '../utils/graphql/is-graphql-request-error';
import { ConsoleLog } from '../utils/debug/console-log';

const { toast } = createStandaloneToast();

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError(error, query) {
      ConsoleLog({ state: query.state });

      if (isGraphQLRequestError(error)) {
        toast({
          title: 'Ошибка',
          description: error.response.errors[0].message,
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      } else if (error instanceof Error) {
        toast({
          title: 'Ошибка',
          description: `${error.message} (╯‵□′)╯︵┻━┻`,
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    },
  }),
  // mutationCache: new MutationCache({
  //   onError(error) {
  //     if (isGraphQLRequestError(error)) {
  //       toastIdRef.current = toast({
  //         title: 'Logout',
  //         description: `${error.response.errors[0].message}`,
  //         status: 'error',
  //         isClosable: true,
  //       });
  //     }
  //   }
  // }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10, // it was 15 min
      gcTime: 1000 * 60 * 60 * 24, // garbage collected in 24 hours
    },
  },
});

// const persister = createSyncStoragePersister({
//   storage: window !== undefined ? (window as Window).localStorage : undefined,
//   retry: removeOldestQuery,
// });
//
// persistQueryClient({
//   queryClient,
//   persister,
//   maxAge: 1000 * 60 * 60 * 24,
// });

export default queryClient;
