import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const CreatePost = () => {
  const navigate = useNavigate();

  const initialValues = {
    title: '',
    content: '',
    isPublished: false,
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .max(20, 'Title must be less than 20 characters')
      .required('Required'),
    content: Yup.string()
      .required('Required'),
    isPublished: Yup.boolean()
      .required('Required'),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: values.title,
          content: values.content,
          isPublished: values.isPublished,
        }),
      });

      const body = await response.json();

      if (response.status === 201) {
        // Post successfully added to database
        return navigate(`/posts/${body._id}`);
      }

      if (response.status === 500) {
        // Unknown error on server, caught by Express error handling middleware
        throw new Error(body.message);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="create-post">
      <h2>Create Post</h2>
      <p>Definitely do not plagiarize</p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form noValidate>

            <div className="form-group">
              <label htmlFor="create-post_title">Title</label>
              <Field
                type="text"
                id="create-post_title"
                name="title"
                placeholder="React is awesome"
                className={touched.title && errors.title ? "field_error" : null}
              />
              <ErrorMessage name="title" component="div" className="feedback_error" />
            </div>

            <div className="form-group">
              <label htmlFor="create-post_content">Content</label>
              <Field
                as="textarea"
                id="create-post_content"
                name="content"
                placeholder="React is the best JavaScript framework..."
                className={touched.content && errors.content ? "field_error" : null}
              />
              <ErrorMessage name="content" component="div" className="feedback_error" />
            </div>

            <div className="form-group">
              <label htmlFor="create-post_is-published">
                <Field
                  type="checkbox"
                  id="create-post_is-published"
                  name="isPublished"
                />
                Publish Now
              </label>
              {/* <ErrorMessage name="isPublished" component="div" className="feedback_error" /> */}
            </div>

            <button type="submit" disabled={isSubmitting}>POST</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreatePost;
