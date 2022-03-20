import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitterSquare, faFacebookSquare, faGithubSquare, faPinterestSquare } from '@fortawesome/free-brands-svg-icons';
import { faComment } from '@fortawesome/free-regular-svg-icons';

import { format } from 'date-fns';

import profilePic from '../../public/images/profile.jpg';

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
      <main className="loading">
        <p>Loading...</p>
      </main>
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
    <main className="home">
      <div className="posts_wrapper">
        <div className="posts">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div className="post" key={post._id}>
                <img src={`http://localhost:3000/${post.imageURL}`} alt="" />
                <div className="post_content">
                  <p className="post_title">{post.title}</p>
                  {isAuthenticated() && isAdmin() &&
                    <p className="post_is-published">{post.isPublished ? 'Published' : 'Unpublished'}</p>
                  }
                  <div className="post_date-and-comments">
                    <p>Posted on {format(new Date(post.createdAt), 'MMM dd, yyyy')}</p>
                    <p>
                      <FontAwesomeIcon icon={faComment} />
                      {countComments(post._id)}
                    </p>
                  </div>
                  <Link to={`/posts/${post._id}`} id="post_read-now">Read Now</Link>
                </div>
              </div>
            ))
          ) : (
            <p>There are no posts to display.</p>
          )}
        </div>
      </div>

      <div className="sidebar">
        <h3>About me</h3>
        <img src={profilePic} alt="A trail through a forest, sun beaming through trees" />
        <p>
        Lorem ipsum dolor sit amet. A quod praesentium eos dolor modi nam consequatur provident. Qui harum minus vel praesentium quis cum autem rerum id culpa consequuntur. 33 dolore facere ut blanditiis ullam ea maiores omnis id corrupti aspernatur. 
        </p>
        <h3>Talk to me</h3>
        <div>
          <FontAwesomeIcon icon={faTwitterSquare} className="sidebar_social-icon" />
          <FontAwesomeIcon icon={faFacebookSquare} className="sidebar_social-icon" />
          <FontAwesomeIcon icon={faGithubSquare} className="sidebar_social-icon" />
          <FontAwesomeIcon icon={faPinterestSquare} className="sidebar_social-icon" />
        </div>
      </div>
    </main>
  );
};

export default Home;
