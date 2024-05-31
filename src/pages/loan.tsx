import {
  Container,
  Flex,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  Icon,
  Center,
  Heading,
  IconButton,
} from '@chakra-ui/react';
import { HiArrowNarrowLeft, HiArrowNarrowRight, HiPencil, HiOutlineTrash } from 'react-icons/hi';
import Button from '../components/button';
import { FC, useEffect } from 'react';
import { TableContainer } from '@chakra-ui/react';
import { useLoans } from '../features/loans';
import { useSearchParams } from 'react-router-dom';
import { parseIntSafe } from '../utils/helpers/parse-int-safe';
import { ConsoleLog } from '../utils/debug/console-log';
import { ru } from 'date-fns/locale';
import { formatDistanceToNow } from 'date-fns';

const Loan: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const before = searchParams.get('before') ?? null;
  const after = searchParams.get('after') ?? null;

  const { data: loansResult, error } = useLoans({
    take: 2,
    after: parseIntSafe(after!),
    before: parseIntSafe(before!),
  });

  useEffect(() => {
    if (loansResult?.loans.edges.length === 0) {
      setSearchParams(params => {
        const query = new URLSearchParams(params.toString());

        query.delete('after');
        query.delete('before');

        return query;
      });
    }
  }, [loansResult]);

  const fetchNextPage = () => {
    if (loansResult?.loans.pageInfo.hasNextPage) {
      setSearchParams(params => {
        const query = new URLSearchParams(params.toString());

        query.set('after', `${loansResult.loans.pageInfo.endCursor}`);
        query.delete('before');

        return query;
      });
    }
  };

  const fetchPreviousPage = () => {
    if (loansResult?.loans.pageInfo.hasPreviousPage) {
      setSearchParams(params => {
        const query = new URLSearchParams(params.toString());

        query.set('before', `${loansResult.loans.pageInfo.startCursor}`);
        query.delete('after');

        return query;
      });
    }
  };

  if (error) {
    throw error;
  }

  ConsoleLog({ loansResult });

  return (
    <Container maxW={'container.xl'}>
      {loansResult.loans.edges.length !== 0 ? (
        <TableContainer>
          <Table variant='simple' size='md'>
            <Thead>
              <Tr>
                <Th>Создано</Th>
                <Th>Обновлено</Th>
                <Th isNumeric>Срок кредита(в месяцах)</Th>
                <Th isNumeric>Сумма кредита</Th>
                <Th>Статус</Th>
                <Th>Действия</Th>
              </Tr>
            </Thead>
            <Tbody>
              {loansResult.loans.edges.map(l => (
                <Tr key={l.id}>
                  <Td>
                    {formatDistanceToNow(new Date(l.createdAt), {
                      addSuffix: true,
                      locale: ru,
                      includeSeconds: true,
                    })}
                  </Td>
                  <Td>
                    {formatDistanceToNow(new Date(l.updatedAt), {
                      addSuffix: true,
                      locale: ru,
                      includeSeconds: true,
                    })}
                  </Td>
                  <Td isNumeric>{l.term}</Td>
                  <Td isNumeric>{l.amount}</Td>
                  <Td>{l.status}</Td>
                  <Td>
                    <Flex gap='1'>
                      <IconButton colorScheme="blue" aria-label="Edit loan" icon={<Icon as={HiPencil} boxSize="5" />} />
                      <IconButton colorScheme="red" aria-label="Delete loan" icon={<Icon as={HiOutlineTrash} boxSize="5" />} />
                    </Flex>
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
      {loansResult.loans.edges.length !== 0 &&
        loansResult.loans.pageInfo.hasNextPage && (
          <Flex py={3} justify={'center'} direction={['column', 'row']} gap={2}>
            <Button
              variant={'ghost'}
              onClick={() => {
                fetchPreviousPage();
              }}
              hasMore={!loansResult.loans.pageInfo.hasPreviousPage}
              leftIcon={<Icon as={HiArrowNarrowLeft} />}
              spinnerPlacement='start'
              loadingText='Предыдущая'
            >
              Предыдущая
            </Button>
            <Button
              variant='ghost'
              onClick={fetchNextPage}
              hasMore={!loansResult.loans.pageInfo.hasNextPage}
              rightIcon={<Icon as={HiArrowNarrowRight} />}
              loadingText='Следующая'
              spinnerPlacement='end'
            >
              Следующая
            </Button>
          </Flex>
        )}
    </Container>
  );
};

export default Loan;
