import {
  Box,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Center,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  Skeleton,
  SkeletonText,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';

const suspenseFallbackMap = new Map([
  [
    'blog',
    <Container>
      <Grid
        templateColumns={'repeat(auto-fill, minmax(15rem, 1fr))'}
        gap='40px'
        mb={2}
      >
        {Array.from({ length: 6 }).map((_, idx) => (
          <Box key={idx} as='article'>
            <Card height='100%' variant='outline'>
              <CardHeader>
                <Skeleton mb={2} height={'10px'} width={'80%'} />
                <Heading size='md'>
                  <Skeleton height={'10px'} />
                </Heading>
              </CardHeader>
              <CardBody>
                <SkeletonText noOfLines={4} />
              </CardBody>
            </Card>
          </Box>
        ))}
      </Grid>

      <Flex py={3} justify={'center'} direction={['column', 'row']} gap={2}>
        <Skeleton width='180px' height='50px' />
        <Skeleton width='180px' height='50px' />
      </Flex>
    </Container>,
  ],
]);

export default suspenseFallbackMap;
