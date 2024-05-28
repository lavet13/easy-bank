import { Heading, Button, VStack } from '@chakra-ui/react';
import { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const NotFound: FC = () => {
  return (
    <VStack spacing={4} sx={{ textAlign: 'center' }}>
      <Heading id='test' sx={{ textAlign: 'center' }}>
        Not Found
      </Heading>
      <Button as={RouterLink} to="/">Go Back</Button>
    </VStack>
  );
};

export default NotFound;
