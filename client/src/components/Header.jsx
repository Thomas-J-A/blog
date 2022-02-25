import React from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons'

const Header = () => {
  const { authState, logOut, isAuthenticated, isAdmin } = useAuth();

  const handleLogOut = async () => {
    try {
      await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      logOut();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          {isAuthenticated() && isAdmin() && 
            <li><Link to="/create-post">Create Post</Link></li>
          }
          {isAuthenticated() ? ( 
            <>
              <li>
                <FontAwesomeIcon icon={faUser} />
                <p>Hello, <span>{authState.currentUser.firstName}</span></p>
              </li>
              <li>  
                <button type="button" onClick={handleLogOut}>LOGOUT</button>
              </li>
            </>
          ) : ( 
            <>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/login">Login</Link></li>
            </>
          )}
        </ul>
      </nav>
      <h1>Blogged Down</h1>
      <p>blah blah blah</p>
    </header>
  );
};

export default Header;
