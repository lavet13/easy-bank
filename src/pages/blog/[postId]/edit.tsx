import { FC } from 'react';
import { useParams } from 'react-router-dom';

type EditPostRouteParams = {
  postId: string;
};

const EditPost: FC = () => {
  const { postId } = useParams<EditPostRouteParams>() as EditPostRouteParams;

  return <h1>Edit postId: {postId}</h1>;
};

export default EditPost;
