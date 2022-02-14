import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/auth';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Login = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email')
      .required('Required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .max(12, 'Password must be less than 12 characters')
      .required('Required'),
  });

  const handleSubmit = async (values, { setFieldError }) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const body = await response.json();

      if (response.status === 200) {
        // Form submission successful on server
        setCurrentUser(body);
        return navigate('/');
      }

      if (response.status === 401) {
        // Either email or password is incorrect
        if (body.message === 'Invalid email') {
          return setFieldError('email', 'Email not found');
        }

        return setFieldError('password', 'Password incorrect')
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
    <div className="login">
      <h2>Login</h2>
      <p>Tell me <span>everything</span></p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form noValidate>

            <div className="form-group">
              <label htmlFor="login_email">Email</label>
              <Field
                type="email"
                id="login_email"
                name="email"
                placeholder="johndoe@example.com"
                className={touched.email && errors.email ? "field_error" : null}
              />
              <ErrorMessage name="email" component="div" className="feedback_error" />
            </div>

            <div className="form-group">
              <label htmlFor="login_password">Password</label>
              <Field
                type="password"
                id="login_password"
                name="password"
                className={touched.password && errors.password ? "field_error" : null}
              />
              <ErrorMessage name="password" component="div" className="feedback_error" />
            </div>

            <button type="submit" disabled={isSubmitting}>LOG IN</button>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
