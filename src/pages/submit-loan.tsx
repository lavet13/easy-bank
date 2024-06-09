import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Center,
  Container,
} from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import { FC, ReactNode, useEffect, useState } from 'react';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import Button from '../components/button';
import NumberInput from '../components/number-input';
import { useCreateLoan } from '../features/loan-by-id';
import { ConsoleLog } from '../utils/debug/console-log';
import { MutationCreateLoanArgs } from '../gql/graphql';
import { isGraphQLRequestError } from '../utils/graphql/is-graphql-request-error';
import { GraphQLError } from 'graphql';
import { useGetMe } from '../features/auth';
import { useLocation, useNavigate } from 'react-router-dom';

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

const Schema = z.object({
  term: numberFormatValuesSchema.refine(values => values.floatValue! <= 60, {
    message: 'Не больше 5 лет(60 месяцев)',
  }),
  amount: numberFormatValuesSchema,
});

type InitialValues = z.infer<typeof Schema>;

const SubmitLoan: FC = () => {
  const { data: getMeResult } = useGetMe();
  const navigate = useNavigate();
  const [isReset, setIsReset] = useState(false);

  const handleReset = () => setIsReset(!isReset);

  const initialValues: InitialValues = {
    term: { formattedValue: '', value: '', floatValue: undefined },
    amount: { formattedValue: '', value: '', floatValue: undefined },
  };

  useEffect(() => {
    if (!getMeResult?.me) {
      navigate(`/login`);
    }
  }, []);

  const { mutateAsync: createLoan, error, data } = useCreateLoan();

  const handleSubmit: HandleSubmitProps = async (values, actions) => {
    ConsoleLog('submitted!');
    ConsoleLog({ values });

    const payload: MutationCreateLoanArgs = {
      input: {
        term: values.term.floatValue!,
        amount: values.amount.floatValue!,
      },
    };

    await createLoan({ ...payload });

    actions.setSubmitting(false);
    actions.resetForm();
    setIsReset(false);
  };

  if (error) {
    if (isGraphQLRequestError(error)) {
      if (error.response.errors[0].extensions.statusCode === 401) {
        throw new GraphQLError(
          'Не удалось оформить заявку. Необходимо зарегистрироваться или авторизоваться.'
        );
      } else {
        throw error;
      }
    } else {
      throw error;
    }
  }

  let content: ReactNode | null = null;

  content = (
    <Center flex='1'>
      <Container maxW={'600px'} flex='1'>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={toFormikValidationSchema(Schema)}
        >
          {({ isSubmitting }) => {
            return (
              <Form>
                <NumberInput
                  shouldFocus
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
      </Container>
    </Center>
  );

  if (data && !isReset) {
    content = (
      <Center flex='1'>
        <Container maxW={'600px'} flex='1'>
          <Alert
            status='success'
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
              Подтверждено!
            </AlertTitle>
            <AlertDescription maxWidth='sm'>
              Кредит оформлен! Ждите ответа от менеджера!
            </AlertDescription>
            <Button
              mt={6}
              px={6}
              py={4}
              colorScheme='green'
              variant='outline'
              onClick={handleReset}
            >
              Оформить кредит
            </Button>
          </Alert>
        </Container>
      </Center>
    );
  }

  return content;
};

export default SubmitLoan;
