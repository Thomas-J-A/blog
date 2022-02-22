import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ role, children }) => {
  const location = useLocation();

  const { authState, isAuthenticated, isLoggingOut } = useAuth();

  // Ignore this route guard when logging out since it only runs as
  // a result of updating state (authState, triggers a re-render), 
  // and is not a deliberate attempt to access a private route 
  if (isLoggingOut) {
    return children; // or null, or <Loading />
  }

  if (!isAuthenticated()) {
    // User not logged in
    return <Navigate to='/login' replace state={{ from: location.pathname }} />;
  }

  if (role && role !== authState.currentUser.role) {
    // User logged in but route is role-protected,
    // and user doesn't have appropriate role
    return <Navigate to='/' replace />
  }

  // User has correct authentication/authorization statuses
  return children;
};

export default PrivateRoute;
