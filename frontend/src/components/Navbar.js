import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          UniLinked
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-nav">
          {user ? (
            <>
              <div className="nav-pills">
                <Link to="/" className="nav-link">Feed</Link>
                <Link to="/opportunities" className="nav-link">Opportunities</Link>
                <Link to="/communities" className="nav-link">Communities</Link>
                <Link to="/events" className="nav-link">Events</Link>
                <Link to="/achievements" className="nav-link">Achievements</Link>
                <Link to="/profile" className="nav-link">Profile</Link>
              </div>
              <div className="user-section">
                <div className="user-info">
                  <div className="user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-details">
                    <div className="user-name">{user.name}</div>
                    <div className="user-role">{user.role}</div>
                  </div>
                </div>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-link">Login</Link>
              <Link to="/signup" className="signup-btn">Get Started</Link>
            </div>
          )}
        </div>

        {/* Hamburger Button (mobile only) */}
        <button
          className={`hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-menu${menuOpen ? ' mobile-menu--open' : ''}`}>
        {user ? (
          <>
            <div className="mobile-user-info">
              <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
              <div>
                <div className="user-name">{user.name}</div>
                <div className="user-role">{user.role}</div>
              </div>
            </div>
            <div className="mobile-nav-links">
              <Link to="/" className="mobile-nav-link" onClick={closeMenu}>Feed</Link>
              <Link to="/opportunities" className="mobile-nav-link" onClick={closeMenu}>Opportunities</Link>
              <Link to="/communities" className="mobile-nav-link" onClick={closeMenu}>Communities</Link>
              <Link to="/events" className="mobile-nav-link" onClick={closeMenu}>Events</Link>
              <Link to="/achievements" className="mobile-nav-link" onClick={closeMenu}>Achievements</Link>
              <Link to="/profile" className="mobile-nav-link" onClick={closeMenu}>Profile</Link>
            </div>
            <button onClick={handleLogout} className="mobile-logout-btn">Logout</button>
          </>
        ) : (
          <div className="mobile-auth-buttons">
            <Link to="/login" className="auth-link" onClick={closeMenu}>Login</Link>
            <Link to="/signup" className="signup-btn" onClick={closeMenu}>Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;