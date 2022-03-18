import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faDoorOpen, faLock } from '@fortawesome/free-solid-svg-icons';

import loginImg from '../../public/images/login.png';

const Login = () => {
  // const [error, setError] = useState(null);

  const { logIn } = useAuth();

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
        return logIn(body);
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
      // setError(err);
      console.log(err.message);
    }
  };

  // if (error) {
  //   return (
  //     <div className="error">
  //       <p>Oops, something went wrong...</p>
  //     </div>
  //   );
  // }

  return (
    <main className="login">
      <div id="login_wrapper">

        <img src={loginImg} alt="Flower illustration" id="login_flower-img" />

        <div id="login_form-wrapper">

          <div id="login_header">
            <div id="login_header_text">
              <h2>Log In</h2>
              <p>Tell me <span>everything</span></p>
            </div>
            <FontAwesomeIcon icon={faDoorOpen} alt="" />
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ touched, errors, isSubmitting }) => (
              <Form autoComplete="off" noValidate>

                <div className="form-group">
                  <label htmlFor="login_email">Email</label>
                  <div className={`input-with-icon ${touched.email && errors.email ? "field_error" : null}`}>
                    <FontAwesomeIcon icon={faEnvelope} />
                    <Field
                      type="email"
                      id="login_email"
                      name="email"
                      placeholder="johndoe@example.com"
                    />
                  </div>
                  <ErrorMessage name="email" component="div" className="feedback_error" />
                </div>

                <div className="form-group">
                  <label htmlFor="login_password">Password</label>
                  <div className={`input-with-icon ${touched.password && errors.password ? "field_error" : null}`}>
                    <FontAwesomeIcon icon={faLock} />
                    <Field
                      type="password"
                      id="login_password"
                      name="password"
                    />
                  </div>
                  <ErrorMessage name="password" component="div" className="feedback_error" />
                </div>

                <button type="submit" disabled={isSubmitting}>LOG IN</button>
                <p className="form-msg">Don't have an account? <Link to="/register">Register</Link></p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </main>
  );
};

export default Login;
