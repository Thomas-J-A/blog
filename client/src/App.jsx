import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import { AuthContext } from './context/auth';

import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import NotFound from './pages/NotFound';

const App = () => {
  // Fetch user details from localStorage if they exist (persist data over refreshes)
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('currentUser')));

  return (
    <Router>
      <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/create-post"
            element={
              <PrivateRoute role="admin">
                <CreatePost />
              </PrivateRoute>
            } 
          />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </AuthContext.Provider>
    </Router>
  );
};

export default App;
