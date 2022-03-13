import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const CreatePost = () => {
  const [thumbnailURL, setThumbnailURL] = useState(null);
  const fileInputRef = useRef();

  const navigate = useNavigate();

  const initialValues = {
    title: '',
    content: '',
    image: null,
    isPublished: false,
  };

  // Validations are run in parallel so no guarantee 
  // on order, and all tests run together
  // In custom validations, truthy values equate to true, falsy values equate to false
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .max(40, 'Title must be less than 40 characters')
      .required('Required'),
    content: Yup.string()
      .required('Required'),
    image: Yup.mixed()
      .test('fileSize', 'File must be less than 2MB', (value) => value ? value.size < 1024 * 1024 * 2 : true)
      .required('Required'),
    isPublished: Yup.boolean()
      .required('Required'),
    });
    
  const handleSubmit = async (values) => {
    try {
      let formData = new FormData();

      formData.append('title', values.title);
      formData.append('content', values.content);
      formData.append('image', values.image);
      formData.append('isPublished', values.isPublished);

      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: formData,
      });

      // When sending multipart/form-data you must use FormData, and must
      // **not** include the Content-Type in the headers; the browser will
      // set this plus the boundary.  JSON.stringify is used for
      // application/json data.
      // multipart/form-data = FormData, application/json = JSON.stringify     

      const body = await response.json();

      if (response.status === 201) {
        // Post successfully added to database
        return navigate(`/posts/${body._id}`);
      }

      // Unknown error on server, caught by Express error handling middleware
      throw new Error(body.message);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleFileChange = (e, setFieldValue) => {
    const file = e.target.files[0];

    setFieldValue('image', file);

    // Generates a temporary URL for the file to use as thumbnail src
    setThumbnailURL(URL.createObjectURL(file));
  };

  return (
    <main className="create-post">
      <h2>Create Post</h2>
      <p>Definitely do not plagiarize</p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ touched, errors, setFieldValue, setFieldTouched, isSubmitting }) => (
          <Form autocomplete="off" noValidate>

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
              <input
                type="file"
                id="create-post_image"
                name="image"
                aria-label="Image"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setFieldValue)}
                ref={fileInputRef}
              />
              <button type="button"
                className={touched.image && errors.image ? "field_error" : null}
                onClick={() => fileInputRef.current.click()} // Programmatically clicks input[type="file"] field
                onBlur={() => setFieldTouched('image', true)} // sets touched.image to true, and triggers validation
              >
                Upload Image
              </button>
              {thumbnailURL && <img src={thumbnailURL} alt="" id="create-post_thumbnail" />}
              <ErrorMessage name="image" component="div" className="feedback_error" />
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
    </main>
  );
};

export default CreatePost;
