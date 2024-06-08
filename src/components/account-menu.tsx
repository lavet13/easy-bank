import {
  Alert,
  AlertTitle,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Spinner,
  ToastId,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { FC, useRef } from 'react';
import { NumericFormat } from 'react-number-format';
import { useNavigate } from 'react-router-dom';
import { useGetMe, useLogout } from '../features/auth';
import { useCurrentBalance } from '../features/current-balance';
import queryClient from '../react-query/query-client';
import { ConsoleLog } from '../utils/debug/console-log';
import { isGraphQLRequestError } from '../utils/graphql/is-graphql-request-error';

type AccountMenuProps = {
  onClose: () => void;
};

const AccountMenu: FC<AccountMenuProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const toastIdRef = useRef<ToastId | null>(null);
  const { isPending: getMePending, isRefetching } = useGetMe();
  const { isOpen, onOpen, onClose: onCloseMenu } = useDisclosure();

  const { mutateAsync: logout } = useLogout({
    onSuccess: () => {
      queryClient.setQueryData(['Me'], null);
    },
    onError: error => {
      if (isGraphQLRequestError(error)) {
        if (toastIdRef.current) {
          toast.close(toastIdRef.current);
        }

        toastIdRef.current = toast({
          title: 'Logout',
          description: `${error.response.errors[0].message}`,
          status: 'error',
          isClosable: true,
        });
      }
    },
  });

  return (
    <Menu onClose={onCloseMenu} onOpen={onOpen}>
      <MenuButton
        as={Button}
        colorScheme='blue'
        isLoading={getMePending || isRefetching}
        isDisabled={getMePending || isRefetching}
        spinnerPlacement='start'
        loadingText={'Проверка'}
      >
        Аккаунт
      </MenuButton>
      <MenuList>
        <MenuGroup title='Профиль'>
          <Alert status='info' flex='1 1' flexWrap={'wrap'}>
            <Flex
              flex='1'
              justify='center'
              alignItems='center'
              direction='column'
            >
              <AlertTitle fontSize='0.9rem'>Баланс</AlertTitle>
              {isOpen && <CurrentBalance />}
            </Flex>
          </Alert>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup>
          <MenuItem
            onClick={() => {
              navigate('/settings');
              onClose();
            }}
          >
            Настройки
          </MenuItem>
          <MenuItem
            onClick={async () => {
              try {
                await logout();
                if (toastIdRef.current) {
                  toast.close(toastIdRef.current);
                }
                toastIdRef.current = toast({
                  title: 'Logout',
                  description: 'Успешно вышли из аккаунта! ᕦ(ò_óˇ)ᕤ',
                  status: 'success',
                  duration: 2000,
                  isClosable: true,
                });
                navigate('/');
                onClose();
              } catch (error) {
                if (isGraphQLRequestError(error)) {
                  if (toastIdRef.current) {
                    toast.close(toastIdRef.current);
                  }

                  toastIdRef.current = toast({
                    title: 'Logout',
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
              }
            }}
          >
            Выйти
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
};

const CurrentBalance: FC = () => {
  const {
    data: currentBalanceResult,
    isError,
    isPending,
  } = useCurrentBalance({
    retry: false,
  });
  ConsoleLog({ currentBalanceResult });

  if (isPending) {
    return <Spinner color='blue.800' size={'md'} />;
  }

  if (isError) {
    return <AlertTitle>Произошла ошибка!</AlertTitle>;
  }

  return (
    <NumericFormat
      value={currentBalanceResult.currentBalance}
      displayType='text'
      suffix=' ₽'
      renderText={value => <AlertTitle>{value}</AlertTitle>}
    />
  );
};

export default AccountMenu;
