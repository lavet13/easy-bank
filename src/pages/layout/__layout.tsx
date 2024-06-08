import {
  Box,
  Button,
  VStack,
  Text,
  Center,
  Container,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
} from '@chakra-ui/react';
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
                  <Center flex='1'>
                    <Container maxW={'600px'} flex='1'>
                      <Alert
                        status='error'
                        variant='subtle'
                        flexDirection='column'
                        alignItems='center'
                        justifyContent='center'
                        textAlign='center'
                        maxW='container.lg'
                        mx='auto'
                        py='5'
                      >
                        <AlertIcon boxSize='40px' mr={0} />
                        <AlertTitle mt={4} mb={1} fontSize='lg'>
                          Произошла ошибка!
                        </AlertTitle>
                        <AlertDescription maxWidth='sm'>
                          {errorMessage}
                        </AlertDescription>
                        <Button
                          mt={6}
                          px={6}
                          py={4}
                          colorScheme='red'
                          variant='outline'
                          onClick={() => resetErrorBoundary()}
                        >
                          Повторить запрос
                        </Button>
                      </Alert>
                    </Container>
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
