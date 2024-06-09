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
  Alert,
  AlertIcon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  Stack,
  StackDivider,
  ModalHeader,
  ModalCloseButton,
  Box,
  ModalBody,
  Spinner,
  Editable,
  EditablePreview,
  EditableTextarea,
  Tooltip,
  useColorModeValue,
  Textarea,
  ModalFooter,
} from '@chakra-ui/react';
import {
  HiArrowNarrowLeft,
  HiArrowNarrowRight,
  HiPencil,
  HiOutlineTrash,
} from 'react-icons/hi';
import Button from '../components/button';
import { FC, useEffect } from 'react';
import { TableContainer } from '@chakra-ui/react';
import { useLoans } from '../features/loans';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { parseIntSafe } from '../utils/helpers/parse-int-safe';
import { ConsoleLog } from '../utils/debug/console-log';
import { ru } from 'date-fns/locale';
import { formatDistanceToNow } from 'date-fns';
import { useDeleteLoan, useLoanById } from '../features/loan-by-id';
import { Form, Formik, FormikHelpers } from 'formik';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import NumberInput from '../components/number-input';
import SelectWrapper from '../components/select-wrapper';
import TextareaInput from '../components/textarea-input';
import { useUpdateLoan } from '../features/loan-by-id/use-update-loan';
import {
  LoanStatus,
  MutationUpdateLoanArgs,
  MutationDelLoanArgs,
} from '../gql/graphql';
import { useGetMe } from '../features/auth';

type HandleSubmitProps = (
  values: InitialValues,
  formikHelpers: FormikHelpers<InitialValues>
) => void | Promise<any>;

const numberFormatValuesSchema = z
  .object({
    floatValue: z.number(),
    formattedValue: z.string(),
    value: z.string(),
  })
  .partial()
  .refine(
    values => {
      return values.value !== undefined;
    },
    {
      message: 'Поле обязательное!',
    }
  )
  .refine(
    values => {
      const parsedValue = parseInt(values.value!);

      return (
        !isNaN(parsedValue) &&
        isFinite(parsedValue) &&
        parsedValue >= Number.MIN_SAFE_INTEGER &&
        parsedValue <= Number.MAX_SAFE_INTEGER
      );
    },
    {
      message: `Число выходит за рамки!`,
    }
  );

const statusKeys = Object.values(LoanStatus);

export type StatusKey = (typeof statusKeys)[number];

const statusMapText: Record<StatusKey, string> = {
  PENDING: 'В РАССМОТРЕНИИ',
  APPROVED: 'ОДОБРЕН',
  REJECTED: 'ОТКЛОНЕН',
  ACTIVE: 'ДЕЙСТВУЮЩИЙ',
  PAID: 'ВЫПЛАЧЕН',
  DEFAULTED: 'ПРОСРОЧЕН',
};

const statusMap: Record<StatusKey, JSX.Element> = {
  PENDING: (
    <Alert status='info' variant='solid'>
      <AlertIcon />В РАССМОТРЕНИИ
    </Alert>
  ),
  APPROVED: (
    <Alert status='success' variant='solid'>
      <AlertIcon />
      ОДОБРЕН
    </Alert>
  ),
  REJECTED: (
    <Alert status='error' variant='solid'>
      <AlertIcon />
      ОТКЛОНЕН
    </Alert>
  ),
  ACTIVE: (
    <Alert status='info' variant='solid'>
      <AlertIcon />
      ДЕЙСТВУЮЩИЙ
    </Alert>
  ),
  PAID: (
    <Alert status='success' variant='solid'>
      <AlertIcon />
      ВЫПЛАЧЕН
    </Alert>
  ),
  DEFAULTED: (
    <Alert status='warning' variant='solid'>
      <AlertIcon />
      ПРОСРОЧЕН
    </Alert>
  ),
};

const statusValues = [
  LoanStatus.Active,
  LoanStatus.Approved,
  LoanStatus.Defaulted,
  LoanStatus.Paid,
  LoanStatus.Pending,
  LoanStatus.Rejected,
] as const;

const Schema = z.object({
  term: numberFormatValuesSchema.refine(values => values.floatValue! <= 60, {
    message: 'Не больше 5 лет(60 месяцев)',
  }),
  amount: numberFormatValuesSchema,
  status: z.enum(statusValues, { required_error: 'Нужно выбрать статус!' }),
  comment: z.string().optional(),
});

type FormSchema = Omit<z.infer<typeof Schema>, 'status'>;

type InitialValues = FormSchema & { status: StatusKey | '' };

const Loan: FC = () => {
  const { data: getMeResult } = useGetMe();
  const navigate = useNavigate();

  useEffect(() => {
    if (!getMeResult?.me) {
      navigate(`/login`);
    }
  }, []);

  const initialValues: InitialValues = {
    term: { formattedValue: '', value: '', floatValue: undefined },
    amount: { formattedValue: '', value: '', floatValue: undefined },
    comment: '',
    status: '',
  };

  const handleSubmit: HandleSubmitProps = async (values, actions) => {
    ConsoleLog('submitted!');
    ConsoleLog({ values });

    // Check if the status is empty and handle accordingly
    if (!values.status) {
      // Handle the error or set a default status
      // For example, you might want to set a default status or show a validation error
      console.error('Status cannot be empty');
      actions.setSubmitting(false);
      return;
    }

    const payload: MutationUpdateLoanArgs = {
      input: {
        id: loanIdToEdit,
        text: values.comment ?? '',
        amount: +values.amount.value!,
        status: values.status,
        term: +values.term.value!,
      },
    };

    await updateLoan({ ...payload });
    refetchLoans();

    actions.setSubmitting(false);
    actions.resetForm();
    handleEditClose();
  };

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDelOpen,
    onOpen: onDelOpen,
    onClose: onDelClose,
  } = useDisclosure();
  const [searchParams, setSearchParams] = useSearchParams();
  const before = searchParams.get('before') ?? null;
  const after = searchParams.get('after') ?? null;
  const loanIdToEdit = searchParams.get('edit')!;
  const loanIdToDelete = searchParams.get('del')!;

  const {
    data: loansResult,
    error,
    isPending,
    refetch: refetchLoans,
  } = useLoans(
    {
      take: 12,
      after: parseIntSafe(after!),
      before: parseIntSafe(before!),
    },
    {
      meta: {
        toastEnabled: false,
      },
    }
  );

  const {
    data: loanByIdResult,
    fetchStatus,
    status,
    refetch: refetchLoanById,
  } = useLoanById(loanIdToEdit || loanIdToDelete, {
    enabled: !!(loanIdToEdit || loanIdToDelete),
  });

  const { mutateAsync: updateLoan } = useUpdateLoan();
  const { mutateAsync: deleteLoan } = useDeleteLoan();

  const handleEditOpen = (id: string) => () => {
    setSearchParams(params => {
      const query = new URLSearchParams(params.toString());

      query.set('edit', id);

      return query;
    });

    onEditOpen();
  };

  const handleDeleteOpen = (id: string) => () => {
    setSearchParams(params => {
      const query = new URLSearchParams(params.toString());

      query.set('del', id);

      return query;
    });

    onDelOpen();
  };

  const handleDelClose = () => {
    onDelClose();
    setSearchParams(params => {
      const query = new URLSearchParams(params.toString());
      query.delete('del');
      return query;
    });
  };

  const handleEditClose = () => {
    refetchLoanById();
    onEditClose();
    setSearchParams(params => {
      const query = new URLSearchParams(params.toString());
      query.delete('edit');
      return query;
    });
  };

  useEffect(() => {
    if (loanByIdResult?.loanById && loanIdToEdit) {
      onEditOpen();
    }
    if (loanByIdResult?.loanById && loanIdToDelete) {
      onDelOpen();
    }
  }, [loanByIdResult]);

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

  return (
    <>
      {isPending ? (
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
              <Tr>
                <Td>...</Td>
                <Td>...</Td>
                <Td isNumeric>...</Td>
                <Td isNumeric>...</Td>
                <Td>...</Td>
                <Td>
                  <Flex gap='1'>
                    <IconButton
                      colorScheme='blue'
                      aria-label='Edit loan'
                      icon={<Icon as={HiPencil} boxSize='5' />}
                    />
                    <IconButton
                      colorScheme='red'
                      aria-label='Delete loan'
                      icon={<Icon as={HiOutlineTrash} boxSize='5' />}
                    />
                  </Flex>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      ) : loansResult.loans.edges.length !== 0 ? (
        <TableContainer>
          <Table variant='simple' size={{ base: 'sm', '2xl': 'md' }}>
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
                  <Td>{statusMap[l.status]}</Td>
                  <Td>
                    <Flex gap='1'>
                      <IconButton
                        colorScheme='blue'
                        aria-label='Edit loan'
                        icon={<Icon as={HiPencil} boxSize='5' />}
                        onClick={handleEditOpen(l.id)}
                      />
                      <IconButton
                        colorScheme='red'
                        aria-label='Delete loan'
                        icon={<Icon as={HiOutlineTrash} boxSize='5' />}
                        onClick={handleDeleteOpen(l.id)}
                      />
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
      {isPending
        ? null
        : loansResult.loans.edges.length !== 0 &&
          (loansResult.loans.pageInfo.hasNextPage ||
            loansResult.loans.pageInfo.hasPreviousPage) && (
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
      <Modal size='xl' isOpen={isEditOpen} onClose={handleEditClose}>
        <ModalOverlay />

        <ModalContent>
          <Stack divider={<StackDivider />}>
            <Box>
              <ModalHeader sx={{ display: 'flex', alignItems: 'center' }}>
                Редактирование{' '}
                {fetchStatus === 'fetching' && status === 'success' && (
                  <Spinner />
                )}
              </ModalHeader>
              <ModalCloseButton />
            </Box>
            <ModalBody pb={5}>
              {/* For initial loading */}
              {fetchStatus === 'fetching' && status === 'pending' ? (
                <Spinner />
              ) : (
                <Formik
                  initialValues={initialValues}
                  validationSchema={toFormikValidationSchema(Schema)}
                  enableReinitialize={true}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, setValues }) => {
                    useEffect(() => {
                      if (loanByIdResult)
                        setValues({
                          term: {
                            formattedValue: `${loanByIdResult.loanById.term}`,
                            value: `${loanByIdResult.loanById.term}`,
                            floatValue: loanByIdResult.loanById.term,
                          },
                          amount: {
                            formattedValue: `${loanByIdResult.loanById.amount}`,
                            value: `${loanByIdResult.loanById.amount}`,
                            floatValue: loanByIdResult.loanById.amount,
                          },
                          comment: loanByIdResult.loanById.comment?.text ?? '',
                          status: loanByIdResult.loanById.status,
                        });
                    }, []);

                    return (
                      <Form>
                        <NumberInput
                          name='term'
                          label='Срок кредита(в месяцах)'
                          placeholder='Срок кредита'
                        />
                        <NumberInput
                          name='amount'
                          label='Сумма кредита'
                          placeholder='Сумма кредита'
                          suffix=' ₽'
                        />
                        <SelectWrapper
                          name='status'
                          label='Выберите статус кредита'
                          placeholder='Выберите статус кредита'
                          data={Object.entries(statusMapText).map(
                            ([value, label]) => ({
                              label,
                              value,
                            })
                          )}
                        />
                        <TextareaInput label='Комментарий' name='comment' />

                        <Button
                          w={['full', 'auto']}
                          isLoading={isSubmitting}
                          mt={4}
                          type='submit'
                        >
                          Подтвердить
                        </Button>
                      </Form>
                    );
                  }}
                </Formik>
              )}
            </ModalBody>
          </Stack>
        </ModalContent>
      </Modal>
      <Modal size='xl' isOpen={isDelOpen} onClose={handleDelClose}>
        <ModalOverlay />

        <ModalContent>
          <Stack divider={<StackDivider />}>
            <Box>
              <ModalHeader sx={{ display: 'flex', alignItems: 'center' }}>
                Удаление
              </ModalHeader>
              <ModalCloseButton />
            </Box>
            <ModalBody pb={5}>
              Вы действительно хотите удалить кредит с идентификатором №{' '}
              {loanByIdResult?.loanById.id}
            </ModalBody>
            <ModalFooter gap={'2'} flexDirection={['column', 'row']}>
              <Button
                onClick={async () => {
                  const payload: MutationDelLoanArgs = {
                    id: loanIdToDelete,
                  };
                  await deleteLoan({ ...payload });
                  refetchLoans();
                  handleDelClose();
                }}
                alignSelf='stretch'
                colorScheme='red'
              >
                Удалить
              </Button>
              <Button onClick={handleDelClose} alignSelf='stretch'>
                Отмена
              </Button>
            </ModalFooter>
          </Stack>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Loan;
