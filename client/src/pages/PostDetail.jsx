import React from 'react';
import { useParams } from 'react-router-dom';

const PostDetail = () => {
  const { id } = useParams();

  return (
    <div>
      <p>Post detail for {id}</p>
    </div>
  );
};

export default PostDetail;
