import { useTransition, FC } from 'react';
import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
} from '@chakra-ui/react';

type ButtonProps = {
  onClick: () => void;
  hasMore: boolean;
} & ChakraButtonProps;

const Button: FC<ButtonProps> = ({ onClick, hasMore, ...props }) => {
  const [isPending, startTransition] = useTransition();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    startTransition(() => {
      onClick(e);
    });
  };

  return (
    <ChakraButton
      onClick={handleClick}
      isDisabled={isPending || hasMore}
      isLoading={isPending}
      {...props}
    />
  );
};

export default Button;
