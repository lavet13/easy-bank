import { Box, Button, VStack, Text, Center } from '@chakra-ui/react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { FC, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './__footer';
import Header from './__header';
import { ErrorBoundary } from 'react-error-boundary';
import { isGraphQLRequestError } from '../../utils/graphql/is-graphql-request-error';

const Layout: FC = () => {
  return (
    <VStack justifyContent={'space-between'} minH={'100vh'} spacing={0}>
      <Header />
      <Box display='flex' flexDirection='column' flex='1 1' alignSelf='stretch'>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              FallbackComponent={({ error, resetErrorBoundary }) => {
                const location = useLocation();
                const errorLocation = useRef(location.pathname);

                useEffect(() => {
                  if (location.pathname !== errorLocation.current) {
                    resetErrorBoundary();
                  }
                }, [location.pathname]);

                const errorMessage = isGraphQLRequestError(error)
                  ? error.response.errors[0].message
                  : error.message;

                return (
                  <Center justifyContent='center' flex='1' w='full'>
                    <Box alignSelf='center'>
                      There was an error!{' '}
                      <Button
                        colorScheme='blue'
                        variant='outline'
                        onClick={() => resetErrorBoundary()}
                      >
                        Try again
                      </Button>
                      <Text>Error: {errorMessage}</Text>
                    </Box>
                  </Center>
                );
              }}
              onReset={reset}
            >
              <Outlet />
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </Box>
      <Footer />
    </VStack>
  );
};

export default Layout;
