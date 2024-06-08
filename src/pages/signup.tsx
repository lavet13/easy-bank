import { FC, useEffect, useRef } from 'react';
import {
  Center,
  Container,
  Flex,
  Button,
  useToast,
  ToastId,
} from '@chakra-ui/react';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { z } from 'zod';
import TextInput from '../components/text-input';
import PasswordInput from '../components/password-input';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { MutationSignupArgs } from '../gql/graphql';
import { useSignup } from '../features/auth/use-signup';
import { isGraphQLRequestError } from '../utils/graphql/is-graphql-request-error';
import { Link, useNavigate } from 'react-router-dom';
import { useGetMe } from '../features/auth';
import { Persist } from '../components/persist-form';
import { ConsoleLog } from '../utils/debug/console-log';
import { queryString } from '../utils/helpers/queryString';

type HandleSubmitProps = (
  values: InitialValues,
  formikHelpers: FormikHelpers<InitialValues>
) => void | Promise<any>;

const Schema = z
  .object({
    name: z.string().optional(),
    email: z
      .string({
        required_error: 'E-mail обязателен!',
      })
      .email({ message: 'E-mail некорректен!' }),
    password: z.string({
      required_error: 'Пароль обязателен',
    }),
    confirm: z.string({
      required_error: 'Пароль обязателен!',
    }),
  })
  .refine(data => data.password === data.confirm, {
    message: 'Пароли не совпадают!',
    path: ['confirm'],
  })
  .refine(data => data.password === data.confirm, {
    message: 'Пароли не совпадают!',
    path: ['password'],
  });

type InitialValues = z.infer<typeof Schema>;

const Signup: FC = () => {
  const toast = useToast();
  const toastIdRef = useRef<ToastId | null>(null);
  const formRef = useRef<FormikProps<InitialValues>>(null);
  const navigate = useNavigate();

  const initialValues: InitialValues = {
    name: '',
    email: '',
    password: '',
    confirm: '',
  };

  const { mutateAsync: signup } = useSignup();
  const { refetch, data: getMeResult } = useGetMe();

  useEffect(() => {
    if(getMeResult?.me) {
      const redirect = queryString('redirect');

      navigate(`${redirect || '/'}`);
    }
  }, [getMeResult]);

  const handleSubmit: HandleSubmitProps = async (values, actions) => {
    if (formRef.current !== null) {
      try {
        const { email, name, password } = values;

        const payload: MutationSignupArgs = {
          signupInput: {
            email,
            name: name ?? '',
            password,
          },
        };

        await signup({ ...payload });

        actions.resetForm();
        actions.setStatus('submitted');
        refetch();

        if (toastIdRef.current) {
          toast.close(toastIdRef.current);
        }

        toastIdRef.current = toast({
          title: 'Регистрация',
          description: 'Успешно зарегестрировались!',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (error: unknown) {
        if (isGraphQLRequestError(error)) {
          if (toastIdRef.current) {
            toast.close(toastIdRef.current);
          }

          toastIdRef.current = toast({
            title: 'Логин',
            description: `${error.response.errors[0].message}`,
            status: 'error',
            isClosable: true,
          });
        } else if (error instanceof Error) {
          if (toastIdRef.current) {
            toast.close(toastIdRef.current);
          }

          toastIdRef.current = toast({
            title: 'Логин',
            description: `${error.message}`,
            status: 'error',
            isClosable: true,
          });
        }

        formRef.current.setStatus('error');
      } finally {
        formRef.current.setSubmitting(false);
      }
    }
  };

  return (
    <Center flex='1'>
      <Container maxW={'600px'} flex='1'>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={toFormikValidationSchema(Schema)}
          innerRef={formRef}
        >
          {({ isSubmitting }) => {
            return (
              <Form>
                <TextInput
                  variant='filled'
                  shouldFocus
                  name='name'
                  label='Никнейм'
                  placeholder='Можно оставить пустым поле'
                />
                <TextInput
                  variant='filled'
                  name='email'
                  label='E-mail'
                  placeholder='Введите E-mail'
                />
                <PasswordInput
                  placeholder='Ввести пароль'
                  variant='filled'
                  name='password'
                  label='Пароль'
                />
                <PasswordInput
                  placeholder='Повторите пароль'
                  variant='filled'
                  name='confirm'
                  label='Повторите пароль'
                />

                <Button
                  type='submit'
                  isLoading={isSubmitting}
                  mt='4'
                  spinnerPlacement='end'
                  loadingText='Проверка'
                  width={['100%', 'auto']}
                >
                  Зарегестрироваться
                </Button>

                <Persist name='signup-form' />
              </Form>
            );
          }}
        </Formik>
        Есть аккаунт? Войти в аккаунт можно{' '}
        <Button
          minW={'initial'}
          px='0'
          colorScheme='blue'
          variant='link'
          as={Link}
          to='/login'
        >
          тут
        </Button>
      </Container>
    </Center>
  );
};

export default Signup;
