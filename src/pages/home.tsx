import { Box, Center, Container, Flex, Heading } from '@chakra-ui/react';
import { FC } from 'react';

const Home: FC = () => {
  return (
    <Center flex='1'>
      <Container maxW={'600px'} flex='1'>
        <Flex justify='center'>
          <Heading>
            <Box as={'span'} sx={{ fontWeight: 400 }}>
              Easy
            </Box>
            -_BANK
          </Heading>
        </Flex>
      </Container>
    </Center>
  );
};

export default Home;
