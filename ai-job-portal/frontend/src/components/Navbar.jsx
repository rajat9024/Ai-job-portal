import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Job Care</Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link className={location.pathname === '/' ? 'active' : ''} to="/">Home</Link>
        </li>
        {token && (
          <>
           <li>
          <Link className={location.pathname === '/jobs' ? 'active' : ''} to="/jobs">Jobs</Link>
        </li>
            <li>
              <Link className={location.pathname === '/profile' ? 'active' : ''} to="/profile">Profile</Link>
            </li>
            <li>
              <Link className={location.pathname === '/resume' ? 'active' : ''} to="/resume">Resume</Link>
            </li>
            <li>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}
        {!token && (
          <>
            <li>
              <Link className={location.pathname === '/login' ? 'active' : ''} to="/login">Login</Link>
            </li>
            <li>
              <Link className={location.pathname === '/register' ? 'active' : ''} to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
