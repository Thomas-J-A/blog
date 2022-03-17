import React from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faBars, faX, faHouse, faPenClip, faRightFromBracket, faUserPlus, faRightToBracket, faAngleRight } from '@fortawesome/free-solid-svg-icons';

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

      <div className="header_logo">
        <Link to="/">
          <h1>Blogged Down</h1>
          <p>...blah blah blah</p>
        </Link>
      </div>

      {isAuthenticated() && (
        <div className="header_greeting">
          <FontAwesomeIcon icon={faUser} />
          <p>Hello, {authState.currentUser.firstName}</p>
        </div>
      )}

      <nav>
        <ul className="main-nav">
          <li>
            <Link to="/">
                {/* <FontAwesomeIcon icon={faHouse} /> */}
                Home
            </Link>
          </li>

          {isAuthenticated() && isAdmin() && 
            <li>
              <Link to="/create-post">
                {/* <FontAwesomeIcon icon={faPenClip} /> */}
                Create Post
              </Link>
            </li>
          }

          {isAuthenticated() ? ( 
            <li
              onClick={handleLogOut}
              className="main-nav_logout push-right"
            >  
              {/* <FontAwesomeIcon icon={faRightFromBracket} /> */}
              Logout
            </li>
          ) : ( 
            <>
              <li className="push-right">
                <Link to="/register">
                  {/* <FontAwesomeIcon icon={faUserPlus} /> */}
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login">
                  {/* <FontAwesomeIcon icon={faRightToBracket} /> */}
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
