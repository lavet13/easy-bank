import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Container,
  Heading,
  HStack,
  LinkBox,
  LinkOverlay,
  Spinner,
  Text,
  Grid,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { FC, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePosts } from '../../features/posts';
import { parseIntSafe } from '../../utils/helpers/parse-int-safe';
import { Link as RouterLink } from 'react-router-dom';
import { HiArrowNarrowLeft } from 'react-icons/hi';
import { HiArrowNarrowRight } from 'react-icons/hi';
import Button from '../../components/button';

const BlogPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const before = searchParams.get('before') ?? null;
  const after = searchParams.get('after') ?? null;

  const { data: postsResult, error } = usePosts(
    {
      take: 4,
      after: parseIntSafe(after!),
      before: parseIntSafe(before!),
      query,
    },
  );

  useEffect(() => {
    if (postsResult?.posts.edges.length === 0) {
      setSearchParams(params => {
        const query = new URLSearchParams(params.toString());

        query.delete('after');
        query.delete('before');

        return query;
      });
    }
  }, [postsResult]);

  // const isFetchingBackwards = !!(before && isFetching);
  // const isFetchingForwards = !!(after && isFetching);

  const fetchNextPage = () => {
    if (postsResult?.posts.pageInfo.hasNextPage) {
      setSearchParams(params => {
        const query = new URLSearchParams(params.toString());

        query.set('after', `${postsResult.posts.pageInfo.endCursor}`);
        query.delete('before');
        query.delete('q');

        return query;
      });
    }
  };

  const fetchPreviousPage = () => {
    if (postsResult?.posts.pageInfo.hasPreviousPage) {
      setSearchParams(params => {
        const query = new URLSearchParams(params.toString());

        query.set('before', `${postsResult.posts.pageInfo.startCursor}`);
        query.delete('after');
        query.delete('q');

        return query;
      });
    }
  };

  if (error) {
    throw error;
  }

  return (
    <Container>
      <Grid
        templateColumns={'repeat(auto-fill, minmax(15rem, 1fr))'}
        gap='40px'
        mb={2}
      >
        {postsResult.posts.edges.map(post => (
          <LinkBox key={post.id} as='article'>
            <Card height='100%' variant='outline'>
              <CardHeader>
                <Text as='time' dateTime=''>
                  TODO: время
                </Text>
                <Heading size='md'>
                  <LinkOverlay
                    sx={{
                      _hover: {
                        textDecoration: 'underline',
                      },
                    }}
                    as={RouterLink}
                    to={`${post.id}`}
                  >
                    {post.title}
                  </LinkOverlay>
                </Heading>
              </CardHeader>
              <CardBody>
                <Text height='100%' display={'flex'} alignItems='end'>
                  {post.preview}
                </Text>
              </CardBody>
            </Card>
          </LinkBox>
        ))}
      </Grid>
      {postsResult.posts.edges.length === 0 && (
        <Center>
          <Heading>No posts :(</Heading>
        </Center>
      )}
      {postsResult.posts.edges.length !== 0 && (
        <Flex py={3} justify={'center'} direction={['column', 'row']} gap={2}>
          <Button
            variant={'ghost'}
            onClick={() => {
              fetchPreviousPage();
            }}
            hasMore={!postsResult.posts.pageInfo.hasPreviousPage}
            leftIcon={<Icon as={HiArrowNarrowLeft} />}
            spinnerPlacement='start'
            loadingText='Предыдущая'
          >
            Предыдущая
          </Button>
          <Button
            variant='ghost'
            onClick={fetchNextPage}
            hasMore={!postsResult.posts.pageInfo.hasNextPage}
            rightIcon={<Icon as={HiArrowNarrowRight} />}
            loadingText='Следующая'
            spinnerPlacement='end'
          >
            Следующая
          </Button>
        </Flex>
      )}
    </Container>
  );
};

export default BlogPage;
