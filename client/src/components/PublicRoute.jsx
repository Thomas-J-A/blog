import React from 'react';
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../context/auth';

const PublicRoute = ({ children }) => {
  const location = useLocation();
  const { currentUser } = useAuth();

  // if location.state exists, redirect via
  // navigate call in /login instead (skip this condition)
  if (currentUser && !location.state) {
    return <Navigate to='/' replace />;
  }

  return children;
};

export default PublicRoute;
