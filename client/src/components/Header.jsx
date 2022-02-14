import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/auth';

const Header = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAuth();

  const logOut = async () => {
    try {
      await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setCurrentUser(null);
      navigate('/login');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          {currentUser && currentUser.role === 'admin' && 
            <li><Link to="/create-post">Create Post</Link></li>
          }
          {currentUser ? ( 
            <>
              <li>
                <i className="fas fa-user-alt" />
                <p>Logged in as: <span>{currentUser.firstName}</span></p>
              </li>
              <li>  
                <button type="button" onClick={logOut}>LOGOUT</button>
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
