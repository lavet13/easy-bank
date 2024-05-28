import { cardAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys);

const baseStyle = definePartsStyle({
  container: {
    transitionTimingFunction: 'ease-in-out',
    transitionDuration: 'normal',
    transitionProperty: 'common',
    _hover: {
      bg: 'chakra-subtle-bg',
    },
  },
});

const Card = defineMultiStyleConfig({
  baseStyle,
});

export default Card;
