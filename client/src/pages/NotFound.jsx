import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <main className="not-found">
      <p>404 Not Found</p>
      <p>Go to <Link to="/">Homepage</Link></p>
    </main>
  );
};

export default NotFound;
