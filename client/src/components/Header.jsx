import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faBars, faX, faHouse, faPenClip, faRightFromBracket, faUserPlus, faRightToBracket, faAngleRight } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

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

  const handleToggle = () => {
    setIsOpen((prevValue) => !prevValue);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header>
      
      <div className="header_mobile-wrapper">
        <div className="header_logo">
          <Link to="/" onClick={closeMenu}>
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

        <FontAwesomeIcon icon={faBars} onClick={handleToggle} className="header_dropdown-icon" />
      </div>

      <nav>
        <ul className={isOpen ? "main-nav is-active" : " main-nav"}>
          <li>
            <Link to="/" onClick={closeMenu}>
                {/* <FontAwesomeIcon icon={faHouse} /> */}
                Home
            </Link>
          </li>

          {isAuthenticated() && isAdmin() && 
            <li>
              <Link to="/create-post" onClick={closeMenu}>
                {/* <FontAwesomeIcon icon={faPenClip} /> */}
                Create
              </Link>
            </li>
          }

          {isAuthenticated() ? ( 
            <li>
              <span onClick={() => {
                handleLogOut();
                closeMenu();
              }}>
                {/* <FontAwesomeIcon icon={faRightFromBracket} /> */}
                Logout
              </span>
            </li>
          ) : ( 
            <>
              <li>
                <Link to="/register" onClick={closeMenu}>
                  {/* <FontAwesomeIcon icon={faUserPlus} /> */}
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" onClick={closeMenu}>
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
