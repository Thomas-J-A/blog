import React from 'react';

import { useAuth } from '../context/AuthContext';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const CommentForm = ({ postId, setComments }) => {
  const { authState } = useAuth();

  const initialValues = {
    content: '',
  };

  const validationSchema = Yup.object().shape({
    content: Yup.string().required('Required'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await fetch('http://localhost:3000/api/comments', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: values.content,
          author: authState.currentUser._id,
          post: postId,
        }),
      });

      const body = await response.json();

      if (response.status === 201) {
        // Comment successfully added to database
        // To display latest comment, refetch all comments again from API and update state
        const response2 = await fetch(`http://localhost:3000/api/comments?post=${ postId }`, {
          method: 'GET',
          mode: 'cors',
        });

        const body2 = await response2.json();
        
        if (response2.status === 200) {
          // GET request successful
          resetForm();
          return setComments(body2);
        }

        throw new Error(body2.message);
      }

      throw new Error(body.message);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ touched, errors, isSubmitting }) => (
        <Form noValidate className="post-detail_comments_form">

          <div className="form-group">
            <label htmlFor="post-detail_comments_form_content"></label>
            <Field
              as="textarea"
              id="post-detail_comments_form_content"
              name="content"
              placeholder="Leave a comment..."
              className={touched.content && errors.content ? "field_error" : null}
            />
            <ErrorMessage name="content" component="div" className="feedback_error" />
          </div>

          <button type="submit" disabled={isSubmitting}>Submit</button>
        </Form>
      )}
    </Formik>
  );
};

export default CommentForm;
