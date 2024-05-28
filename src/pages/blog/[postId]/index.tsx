import { Box, Center, Container, Heading, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { usePostById } from '../../../features/postById';
import { ConsoleLog } from '../../../utils/debug/console-log';

type PostByIdRouteParams = {
  postId: string;
};

const PostById: FC = () => {
  const { postId } = useParams<PostByIdRouteParams>() as PostByIdRouteParams;
  const { data: postByIdResult, error, isError } = usePostById(postId, { retry: 1 });
  ConsoleLog({ error, isError });

  if(error) {
    throw error;
  }

  const title = postByIdResult.postById.title;
  const content = postByIdResult.postById.content;

  return (
    <Container>
      <Center>
        <Heading>{title}</Heading>
      </Center>
      <Box>
        <Text>{content}</Text>
      </Box>
    </Container>
  );
};

export default PostById;
