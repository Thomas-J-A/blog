import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const user = await response.json();
      setCurrentUser(user);
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      <p>Tell me <span>everything</span></p>
      {/* {error && <p>{error}</p>} */}

      <form onSubmit={handleSubmit}>
        <label htmlFor="login_email">Email</label>
        <input
          type="email"
          id="login_email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="login_password">Password</label>
        <input
          type="password"
          id="login_password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">LOG IN</button>

        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
};

export default Login;
