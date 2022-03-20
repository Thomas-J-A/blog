import React from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartCrack } from '@fortawesome/free-solid-svg-icons';

const NotFound = () => {
  return (
    <main className="not-found">
      <FontAwesomeIcon icon={faHeartCrack} />
      <h1>404 Not Found</h1>
      <p>Go to <Link to="/">homepage</Link></p>
    </main>
  );
};

export default NotFound;
