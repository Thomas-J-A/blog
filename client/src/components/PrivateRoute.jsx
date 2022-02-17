import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../context/auth';

const PrivateRoute = ({ role, children }) => {
  const location = useLocation();
  const { currentUser } = useAuth();

  if (!currentUser) {
    // User not logged in
    return <Navigate to='/login' replace state={{ from: location.pathname }} />;
  }

  if (role && role !== currentUser.role) {
    // User logged in but route is role-protected,
    // and user doesn't have appropriate role
    return <Navigate to='/' replace />
  }

  // User has correct authentication/authorization statuses
  return children;
};

export default PrivateRoute;
 