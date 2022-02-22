import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

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





// import React from 'react';
// import { Formik, Field, Form, ErrorMessage } from 'formik';
// import * as Yup from 'yup';

// import { authenticationService } from '@/_services';

// class LoginPage extends React.Component {
//     constructor(props) {
//         super(props);

//         // redirect to home if already logged in
//         if (authenticationService.currentUserValue) { 
//             this.props.history.push('/');
//         }
//     }

//     render() {
//         return (
//             <div>
//                 <div className="alert alert-info">
//                     Username: test<br />
//                     Password: test
//                 </div>
//                 <h2>Login</h2>
//                 <Formik
//                     initialValues={{
//                         username: '',
//                         password: ''
//                     }}
//                     validationSchema={Yup.object().shape({
//                         username: Yup.string().required('Username is required'),
//                         password: Yup.string().required('Password is required')
//                     })}
//                     onSubmit={({ username, password }, { setStatus, setSubmitting }) => {
//                         setStatus();
//                         authenticationService.login(username, password)
//                             .then(
//                                 user => {
//                                     const { from } = this.props.location.state || { from: { pathname: "/" } };
//                                     this.props.history.push(from);
//                                 },
//                                 error => {
//                                     setSubmitting(false);
//                                     setStatus(error);
//                                 }
//                             );
//                     }}
//                     render={({ errors, status, touched, isSubmitting }) => (
//                         <Form>
//                             <div className="form-group">
//                                 <label htmlFor="username">Username</label>
//                                 <Field name="username" type="text" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} />
//                                 <ErrorMessage name="username" component="div" className="invalid-feedback" />
//                             </div>
//                             <div className="form-group">
//                                 <label htmlFor="password">Password</label>
//                                 <Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
//                                 <ErrorMessage name="password" component="div" className="invalid-feedback" />
//                             </div>
//                             <div className="form-group">
//                                 <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Login</button>
//                                 {isSubmitting &&
//                                     <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
//                                 }
//                             </div>
//                             {status &&
//                                 <div className={'alert alert-danger'}>{status}</div>
//                             }
//                         </Form>
//                     )}
//                 />
//             </div>
//         )
//     }
// }

// export { LoginPage };