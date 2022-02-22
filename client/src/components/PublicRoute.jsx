import React from 'react';
import { Navigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoggingIn } = useAuth();

  // Ignore this route guard when logging in since it only runs as
  // a result of updating state (authState, triggers a re-render),
  // and is not a deliberate attempt to access a public route
  if (isLoggingIn) {
    return children; // or null, or <Loading />
  }

  if (isAuthenticated()) {
    // User already logged in, redirect to homepage
    return <Navigate to='/' replace />;
  }

  return children;
};

export default PublicRoute;
