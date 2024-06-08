import {
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Icon,
  Center,
  Heading,
} from '@chakra-ui/react';
import { HiArrowNarrowLeft, HiArrowNarrowRight } from 'react-icons/hi';
import Button from '../components/button';
import { FC, useEffect } from 'react';
import { TableContainer } from '@chakra-ui/react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { parseIntSafe } from '../utils/helpers/parse-int-safe';
import { ConsoleLog } from '../utils/debug/console-log';
import { ru } from 'date-fns/locale';
import { format, formatDistanceToNow } from 'date-fns';
import { useFinancialHistory } from '../features/finances';
import { isGraphQLRequestError } from '../utils/graphql/is-graphql-request-error';
import { GraphQLError } from 'graphql';
import { useGetMe } from '../features/auth';

const Finances: FC = () => {
  const { data: getMeResult } = useGetMe();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();
  const before = searchParams.get('before') ?? null;
  const after = searchParams.get('after') ?? null;

  useEffect(() => {
    if(!getMeResult?.me) {
      navigate(`/login?redirect=${pathname}${search}`);
    }
  }, [getMeResult]);

  const {
    data: financialHistoryResult,
    error,
    isPending,
  } = useFinancialHistory(
    {
      take: 12,
      after: parseIntSafe(after!),
      before: parseIntSafe(before!),
    },
    {
      retry: 1,
      meta: {
        toastEnabled: false,
      },
    }
  );

  useEffect(() => {
    if (financialHistoryResult?.financialHistory.edges.length === 0) {
      setSearchParams(params => {
        const query = new URLSearchParams(params.toString());

        query.delete('after');
        query.delete('before');

        return query;
      });
    }
  }, [financialHistoryResult]);

  const fetchNextPage = () => {
    if (financialHistoryResult?.financialHistory.pageInfo.hasNextPage) {
      setSearchParams(params => {
        const query = new URLSearchParams(params.toString());

        query.set(
          'after',
          `${financialHistoryResult.financialHistory.pageInfo.endCursor}`
        );
        query.delete('before');

        return query;
      });
    }
  };

  const fetchPreviousPage = () => {
    if (financialHistoryResult?.financialHistory.pageInfo.hasPreviousPage) {
      setSearchParams(params => {
        const query = new URLSearchParams(params.toString());

        query.set(
          'before',
          `${financialHistoryResult.financialHistory.pageInfo.startCursor}`
        );
        query.delete('after');

        return query;
      });
    }
  };

  if(error) {
    if(isGraphQLRequestError(error)) {
      if(error.response.errors[0].extensions.statusCode === 401) {
        throw new GraphQLError('Не удалось получить финансовые операции. Необходимо авторизоваться.');
      } else {
        throw error;
      }
    } else {
      throw error;
    }
  }

  return (
    <>
      {isPending ? (
        <TableContainer>
          <Table variant='simple' size='md'>
            <Thead>
              <Tr>
                <Th isNumeric>Доход</Th>
                <Th isNumeric>Расход</Th>
                <Th isNumeric>Текущий баланс</Th>
                <Th>Обновлено</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td isNumeric>...</Td>
                <Td isNumeric>...</Td>
                <Td isNumeric>...</Td>
                <Td>...</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      ) : financialHistoryResult.financialHistory.edges
          .length !== 0 ? (
        <TableContainer>
          <Table variant='simple' size={{ base: 'sm', '2xl': 'md' }}>
            <Thead>
              <Tr>
                <Th isNumeric>Доход</Th>
                <Th isNumeric>Расход</Th>
                <Th isNumeric>Текущий баланс</Th>
                <Th>Обновлено</Th>
              </Tr>
            </Thead>
            <Tbody>
              {financialHistoryResult.financialHistory.edges.map(f => (
                <Tr key={f.id}>
                  <Td isNumeric>{f.income}</Td>
                  <Td isNumeric>{f.expenses}</Td>
                  <Td isNumeric>{f.currentBalance}</Td>
                  <Td>
                    {format(new Date(f.updatedAt), 'MM.dd.yyyy, HH:mm:ss', {
                      locale: ru,
                    })}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Center>
          <Heading>Нет данных :(</Heading>
        </Center>
      )}
      {isPending
        ? null
        : financialHistoryResult.financialHistory.edges.length !== 0 &&
          (financialHistoryResult.financialHistory.pageInfo.hasNextPage ||
            financialHistoryResult.financialHistory.pageInfo
              .hasPreviousPage) && (
            <Flex
              py={3}
              justify={'center'}
              direction={['column', 'row']}
              gap={2}
            >
              <Button
                variant={'ghost'}
                onClick={() => {
                  fetchPreviousPage();
                }}
                hasMore={
                  !financialHistoryResult.financialHistory.pageInfo
                    .hasPreviousPage
                }
                leftIcon={<Icon as={HiArrowNarrowLeft} />}
                spinnerPlacement='start'
                loadingText='Предыдущая'
              >
                Предыдущая
              </Button>
              <Button
                variant='ghost'
                onClick={fetchNextPage}
                hasMore={
                  !financialHistoryResult.financialHistory.pageInfo.hasNextPage
                }
                rightIcon={<Icon as={HiArrowNarrowRight} />}
                loadingText='Следующая'
                spinnerPlacement='end'
              >
                Следующая
              </Button>
            </Flex>
          )}
    </>
  );
};

export default Finances;
