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
      <nav className="main-nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          {isAuthenticated() && isAdmin() && 
            <li id="main-nav_create-post"><Link to="/create-post">Create Post</Link></li>
          }
          {isAuthenticated() ? ( 
            <>
              <li className="push-right" id="main-nav_greeting">
                <FontAwesomeIcon icon={faUser} />
                <p>Hello, {authState.currentUser.firstName}</p>
              </li>
              <li>  
                <button type="button" onClick={handleLogOut} id="main-nav_logout">LOGOUT</button>
              </li>
            </>
          ) : ( 
            <>
              <li className="push-right"><Link to="/register">Register</Link></li>
              <li id="main-nav_login"><Link to="/login">Login</Link></li>
            </>
          )}
        </ul>
      </nav>
      <div id="main-title">
        <h1>Blogged Down</h1>
        <p>blah blah blah</p>
      </div>
    </header>
  );
};

export default Header;
