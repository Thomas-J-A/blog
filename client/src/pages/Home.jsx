import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitterSquare, faFacebookSquare, faGithubSquare, faPinterestSquare } from '@fortawesome/free-brands-svg-icons';

import { format } from 'date-fns';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    const fetchPostsAndComments = async () => {
      try {
        const responses = await Promise.all([
          fetch('http://localhost:3000/api/posts', {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
            },
          }),
          fetch('http://localhost:3000/api/comments', {
            method: 'GET',
            mode: 'cors',
            header: {
              'Content-Type': 'application/json',
            },
          }),
        ]);
        
        if (responses.every((r) => r.status === 200)) {
          // All GET requests successful
          const bodies = await Promise.all(responses.map((r) => r.json()));

          setPosts(bodies[0]);
          setComments(bodies[1]);
          setIsLoading(false);
        } else {
          // One or both requests encountered an error on server
          const resWithError = responses.find((r) => r.status === 500);
          const body = await resWithError.json();

          throw new Error(body.message);
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchPostsAndComments();    
  }, []);

  const countComments = (postId) => {
    const count = comments.reduce((prevValue, currValue) => (
      currValue.post === postId ? prevValue + 1 : prevValue
    ), 0);

    return count;
  };

  if (isLoading) {
    return (
      <div className="home">
        <p>Loading...</p>
      </div>
    );
  }

  let filteredPosts;
  if (isAuthenticated() && isAdmin()) {
    // Show published and unpublished to admin users
    filteredPosts = posts;
  } else {
    // Only display published posts to regular users
    filteredPosts = posts.filter((post) => post.isPublished);
  }

  return (
    <div className="home">
      <div className="posts">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Link to={`/posts/${post._id}`} key={post._id}>
              <div className="post">
                <p>{post.title}</p>
                {isAuthenticated() && isAdmin() &&
                  <p>{post.isPublished ? 'Published' : 'Unpublished'}</p>
                }
                <p>{post.content}</p>
                <p>{format(new Date(post.createdAt), 'MMM dd, yyyy')}</p>
                <p>Comments: {countComments(post._id)}</p>
              </div>
            </Link>
          ))
        ) : (
          <p>There are no posts to display.</p>
        )}
      </div>
      <div className="sidebar">
        <p>About me</p>
        {/* image */}
        <p>
          My name is Gideon. I am 12 years old and I blog about my life.
        </p>
        <p>Talk to me</p>
        <div>
          <FontAwesomeIcon icon={faTwitterSquare} />
          <FontAwesomeIcon icon={faFacebookSquare} />
          <FontAwesomeIcon icon={faGithubSquare} />
          <FontAwesomeIcon icon={faPinterestSquare} />
        </div>
      </div>
    </div>
  );
};

export default Home;
