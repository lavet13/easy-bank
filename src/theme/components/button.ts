import { defineStyleConfig } from '@chakra-ui/react';

const Button = defineStyleConfig({
  baseStyle: _ => {
    return {
      _loading: {
        cursor: 'not-allowed',
      },
      _disabled: {
        cursor: 'not-allowed',
      },
    };
  },
});

export default Button;
