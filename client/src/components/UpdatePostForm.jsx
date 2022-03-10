import React, { useState, useRef, useEffect } from 'react';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';

const UpdatePostForm = ({ post, setPost, setIsEditMode }) => {
  const [imageURL, setImageURL] = useState(null);
  const fileInputRef = useRef();

  // Store initialValues in local state so that it can be
  // updated in useEffect hook; this will reset the form values
  // when enableReinitialize is set to true on Formik component
  const [initialValues, setInitialValues] = useState({
    title: post.title,
    content: post.content,
    image: null,
    isPublished: post.isPublished,
  });

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .max(40, 'Title must be less than 40 characters')
      .required('Required'),
    content: Yup.string()
      .required('Required'),
    image: Yup.mixed()
      .test('fileSize', 'File must be less than 2MB', (value) => value.size < 1024 * 1024 * 2)
      .required('Required'),
    isPublished: Yup.boolean()
      .required('Required'),
  })

  const handleSubmit = async (values) => {
    try {
      let formData = new FormData();

      formData.append('title', values.title);
      formData.append('content', values.content);
      formData.append('image', values.image);
      formData.append('isPublished', values.isPublished);

      const response = await fetch(`http://localhost:3000/api/posts/${ post._id }`, {
        method: 'PUT',
        mode: 'cors',
        credentials: 'include',
        body: formData,
      });

      const body = await response.json();

      if (response.status === 200) {
        // Post updated successfully on server
        setIsEditMode(false);
        return setPost(body);
      }

      throw new Error(body.message);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      const response = await fetch(`http://localhost:3000/${post.imageURL}`);
      const body = await response.blob();

      // (re)set Formik's values.image to returned blob (OR File created from blob)
      setInitialValues((prevValue) => ({...prevValue, image: body}));
      
      // Generates a temporary URL of the blob to use as img src
      setImageURL(URL.createObjectURL(body));
    };

    fetchImage();
  }, []);

  const handleFileChange = (e, setFieldValue) => {
    const file = e.target.files[0];

    setFieldValue('image', file);
    setImageURL(URL.createObjectURL(file));
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true} // After initialValues is updated in state, reset form to new initialValues (with image: <blob>)
    >
      {({ values, touched, errors, setFieldValue, setFieldTouched, isSubmitting }) => (
        <Form noValidate>

          <div className="form-group">
            {/* Label must be visibly hidden, so use aria-label attribute instead of <label> element*/}
            {/* <label htmlFor="post-detail_form_title" hidden>Title</label> */}
            <Field
              type="text"
              id="post-detail_form_title"
              name="title"
              placeholder="React is awesome"
              className={touched.title && errors.title ? "field_error" : null}
              aria-label="Title"
            />
            <ErrorMessage name="title" component="div" className="feedback_error" />
          </div>

          <p>{post.createdAt}</p>

          <div className="form-group">
            <label htmlFor="post-detail_form_is-published">
              <Field
                type="checkbox"
                id="post-detail_form_is-published"
                name="isPublished"
              />
              {values.isPublished ? 'Published' : 'Unpublished'}
            </label>
          </div>

          <div className="form-group">
            {imageURL && <img src={imageURL} alt="" />}

            {/* Only show filename in UI after user selects a new one */}
            {values.image instanceof File && 
              <span>{values.image.name}</span>
            }
            <input
              type="file"
              id="post-detail_form_image"
              name="image"
              aria-label="Image"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setFieldValue)}
              ref={fileInputRef}
            />
            <FontAwesomeIcon
              icon={faPenToSquare}
              onClick={() => fileInputRef.current.click()}
              onBlur={() => setFieldTouched('image', true)}
              tabIndex="0"
            />
            <ErrorMessage name="image" component="div" className="feedback_error" />
          </div>

          <div className="form-group">
            <Field
              as="textarea"
              id="post-detail_form_content"
              name="content"
              placeholder="React is the best JavaScript framework..."
              className={touched.content && errors.content ? "field_error" : null}
              aria-label="Content"
            />
            <ErrorMessage name="content" component="div" className="feedback_error" />
          </div>

          <button type="button" onClick={() => setIsEditMode(false)}>Cancel</button>
          <button type="submit" disabled={isSubmitting}>Update</button>
        </Form>
      )}
    </Formik>
  );
};

export default UpdatePostForm;
