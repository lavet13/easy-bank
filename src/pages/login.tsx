import {
  Button,
  Center,
  Container,
  ToastId,
  useToast,
  Link as ChakraLink,
  Flex,
} from '@chakra-ui/react';
import { Formik, FormikHelpers, FormikProps, Form } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { z } from 'zod';
import { FC, useRef, useEffect } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Persist } from '../components/persist-form';
import TextInput from '../components/text-input';
import { useGetMe, useLogin } from '../features/auth';
import { ConsoleLog } from '../utils/debug/console-log';
import { isFormRefNotNull } from '../utils/form/is-form-ref-not-null';
import { isGraphQLRequestError } from '../utils/graphql/is-graphql-request-error';
import PasswordInput from '../components/password-input';
import { queryString } from '../utils/helpers/queryString';

type InitialValues = {
  login: string;
  password: string;
};

type HandleSubmitProps = (
  values: InitialValues,
  formikHelpers: FormikHelpers<InitialValues>
) => void | Promise<any>;

const Schema = z.object({
  login: z.string({
    required_error: 'Логин обязателен!',
  }),
  password: z.string({
    required_error: 'Пароль обязателен',
  }),
});


const Login: FC = () => {
  const initialValues: z.infer<typeof Schema> = {
    login: '',
    password: '',
  };

  const formRef = useRef<FormikProps<InitialValues>>(null);
  const navigate = useNavigate();
  const toast = useToast();
  const toastIdRef = useRef<ToastId | null>(null);
  const { refetch, data: getMeResult } = useGetMe();
  const { mutateAsync: loginUser } = useLogin();

  useEffect(() => {
    if(getMeResult?.me) {
      const redirect = queryString('redirect');

      navigate(`${redirect || '/'}`);
    }
  }, [getMeResult]);

  const handleSubmit: HandleSubmitProps = async values => {
    if (isFormRefNotNull(formRef)) {
      try {
        await loginUser({ loginInput: values });
        formRef.current.resetForm();
        formRef.current.setStatus('submitted');
        refetch(); // refetching user

        if (toastIdRef.current) {
          toast.close(toastIdRef.current);
        }

        toastIdRef.current = toast({
          title: 'Логин',
          description: 'Успешно зашли!',
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
                  name='login'
                  label='Логин'
                  placeholder='Ввести логин'
                />
                <PasswordInput
                  placeholder='Ввести пароль'
                  variant='filled'
                  name='password'
                  label='Пароль'
                />

                <Button
                  type='submit'
                  isLoading={isSubmitting}
                  mt='4'
                  spinnerPlacement='end'
                  loadingText='Проверка'
                  width={['100%', 'auto']}
                >
                  Войти
                </Button>

                <Persist name='login-form' />
              </Form>
            );
          }}
        </Formik>
        Нет аккаунта? Зарегестрироваться можно{' '}
        <Button
          minW={'initial'}
          px='0'
          colorScheme='blue'
          variant='link'
          as={Link}
          to='/signup'
        >
          тут
        </Button>
      </Container>
    </Center>
  );
};

export default Login;
