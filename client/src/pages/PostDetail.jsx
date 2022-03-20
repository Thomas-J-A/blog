import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import UpdatePostForm from '../components/UpdatePostForm';
import CommentForm from '../components/CommentForm';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleLeft, faPenToSquare, faTrashCan, faXmarkCircle } from '@fortawesome/free-regular-svg-icons';

import { format, formatDistance } from 'date-fns';

const PostDetail = () => {
  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();

  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const responses = await Promise.all([
          fetch(`http://localhost:3000/api/posts/${ id }`, {
            method: 'GET',
            mode: 'cors',
          }),
          fetch(`http://localhost:3000/api/comments?post=${ id }`, {
            method: 'GET',
            mode: 'cors',
          }),
        ]);

        if (responses.every((r) => r.status === 200)) {
          // All GET requests successful
          const bodies = await Promise.all(responses.map((r) => r.json()));

          setPost(bodies[0]);
          setComments(bodies[1]);
          setIsLoading(false)
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

    fetchPostAndComments();
  }, []);

  // const toggleIsEditMode = () => {
  //   setIsEditMode((prevValue) => !prevValue);
  // };

  const removePost = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${ id }`, {
        method: 'DELETE',
        mode: 'cors',
        credentials: 'include',
      });

      const body = await response.json();

      if (response.status === 200) {
        return navigate('/');
      }

      throw new Error(body.message);
    } catch (err) {
      console.log(err.message);
    }
  };

  const removeComment = async (commentId, postId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/comments/${ commentId }`, {
        method: 'DELETE',
        mode: 'cors',
        credentials: 'include',
      });

      const body = await response.json();

      if (response.status === 200) {
        // DELETE request successful
        // To sync UI, refetch all comments again from API and update state
        const response2 = await fetch(`http://localhost:3000/api/comments?post=${ postId }`, {
          method: 'GET',
          mode: 'cors',
        });

        const body2 = await response2.json();

        if (response2.status === 200) {
          // GET request successful
          return setComments(body2);
        }

        throw new Error(body2.message);
      }

      throw new Error(body.message);
    } catch (err) {
      console.log(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="post-detail">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="post-detail">
      <div className="post-detail_wrapper">

        <Link to="/" className="post-detail_back-btn"><FontAwesomeIcon icon={faCircleLeft} />All Posts</Link>

        <div className="post-detail_post">
          {isEditMode ? (
            <UpdatePostForm post={post} setPost={setPost} setIsEditMode={setIsEditMode} />
          ) : (
            <>
              <div className="post-detail_title_edit-btns">
                <h1 className="post-detail_title">{post.title}</h1>
                {isAuthenticated() && isAdmin() &&
                  <>
                    <FontAwesomeIcon icon={faPenToSquare} onClick={() => setIsEditMode(true)} className="post-detail_edit-btn" />
                    <FontAwesomeIcon icon={faTrashCan} onClick={() => removePost()} className="post-detail_remove-btn" />
                  </>
                }
              </div>
              <p className="post-detail_date">{`Posted on ${format(new Date(post.createdAt), 'MMM dd, yyyy')}`}</p>
              {isAuthenticated() && isAdmin() &&
                <p className="post-detail_is-published">{post.isPublished ? 'Published' : 'Unpublished'}</p>
              }
              <img src={`http://localhost:3000/${post.imageURL}`} alt="" className="post-detail_img" />
              <p className="post-detail_content">{post.content}</p>
            </>
          )}
        </div>
      
        <div className="post-detail_comments">
          {!isAuthenticated() &&
            <p className="post-detail_comments_prompt"><Link to="/login">Log in</Link> or <Link to="/register">create an account</Link> to leave a comment</p>
          }
          <h2>Comments ({comments.length})</h2>
          {isAuthenticated() && <CommentForm postId={id} setComments={setComments} />}
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div className="post-detail_comment" key={comment._id}>
                <div className="post-detail_comment_top">
                  <p>{`${comment.author.firstName} ${comment.author.lastName}`}</p>
                  <p>{formatDistance(new Date(comment.createdAt), new Date(), { addSuffix: true })}</p>
                </div>  
                <p className="post-detail_comment_content">{comment.content}</p>
                {isAuthenticated() && isAdmin() && <FontAwesomeIcon icon={faXmarkCircle} onClick={() => removeComment(comment._id, id)} />}
              </div>
            ))
          ) : (
            <p>Be the first to comment.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default PostDetail;

// {comment.comments.map(comment => (
//   <CommentItem key={comment._id} comment={comment} />
// ))}