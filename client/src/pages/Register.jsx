import React from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Register = () => {
  const { logIn } = useAuth();

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required('Required'),
    lastName: Yup.string()
      .required('Required'),
    email: Yup.string()
      .email('Invalid email')
      // TODO: Async check if email already exists, 
      // instead of using API response in submit handler
      .required('Required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .max(12, 'Password must be less than 12 characters')
      .required('Required'),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Required'),
  });

  const handleSubmit = async (values, { setFieldError }) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        }),
      });
      
      const body = await response.json();

      if (response.status === 201) {
        // Form submission successful on server
        return logIn(body);
      }

      if (response.status === 409) {
        // Update FormikProps.errors.email to inform user that email already exists
        return setFieldError('email', 'Email already exists')
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
    <div className="register">
      <h2>Register</h2>
      <p>Fill in this form or else</p>

      <Formik 
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        // validateOnChange={false} // Disable validation on every keystroke
        // validateOnBlur={false} // Disable validation on every blur event
      >
        {({ touched, errors, isSubmitting }) => (
          <Form noValidate>

            <div className="form-group">
              <label htmlFor="register_firstname">First Name</label>
              <Field
                type="text"
                id="register_firstname"
                name="firstName"
                placeholder="John"
                className={touched.firstName && errors.firstName ? "field_error" : null}
              />
              <ErrorMessage name="firstName" component="div" className="feedback_error" />
            </div>

            <div className="form-group">
              <label htmlFor="register_lastname">Last Name</label>
              <Field
                type="text"
                id="register_lastname"
                name="lastName"
                placeholder="Doe"
                className={touched.lastName && errors.lastName ? "field_error" : null}
              />
              <ErrorMessage name="lastName" component="div" className="feedback_error" />
            </div>

            <div className="form-group">
              <label htmlFor="register_email">Email</label>
              <Field
                type="email"
                id="register_email"
                name="email"
                placeholder="johndoe@example.com"
                className={touched.email && errors.email ? "field_error" : null}
              />
              <ErrorMessage name="email" component="div" className="feedback_error" />
            </div>

            <div className="form-group">
              <label htmlFor="register_password">Password</label>
              <Field
                type="password"
                id="register_password"
                name="password"
                className={touched.password && errors.password ? "field_error" : null}
              />
              <ErrorMessage name="password" component="div" className="feedback_error" />
            </div>

            <div className="form-group">
              <label htmlFor="register_password-confirmation">Confirm Password</label>
              <Field
                type="password"
                id="register_password-confirmation"
                name="passwordConfirmation"
                className={touched.passwordConfirmation && errors.passwordConfirmation ? "field_error" : null}
              />
              <ErrorMessage name="passwordConfirmation" component="div" className="feedback_error" />
            </div>

            {/* <button type="submit" disabled={!(dirty && isValid) || isSubmitting}>REGISTER</button> */}
            <button type="submit" disabled={isSubmitting}>REGISTER</button>
            <p>Already have an account? <Link to="/login">Log in</Link></p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
