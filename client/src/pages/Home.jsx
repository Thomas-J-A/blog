import React, { useState, useEffect } from 'react';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(async () => {
    try {
      // Clear any current errors
      setError(null);

      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const body = await response.json();

      if (response.status === 200) {
        // GET request successful
        setIsLoading(false);
        return setPosts(body);
      }

      if (response.status === 500) {
        // Unknown error on server, caught by Express error handling middleware
        throw new Error(body.message);
      }
    } catch (err) {
      setIsLoading(false);
      setError(err);
    }
  }, []);

  if (error) {
    return (
      <div className="error">
        <p>Oops, something went wrong...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="home">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="posts">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="post">
              <p>{post.title}</p>
              <p>{post.isPublished.toString()}</p>
              <p>{post.content}</p>
              <p>{post.createdAt}</p>
            </div>
          ))
        ) : (
          <p>There are no posts to display</p>
        )}
      </div>
    </div>
  );
};

export default Home;
