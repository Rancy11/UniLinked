import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          UniLinked
        </Link>

        {/* Navigation */}
        <div className="navbar-nav">
          
          {user ? (
            <>
              {/* Navigation Pills */}
              <div className="nav-pills">
                <Link to="/" className="nav-link">
                  Feed
                </Link>
                
                <Link to="/opportunities" className="nav-link">
                  Opportunities
                </Link>
                
                <Link to="/communities" className="nav-link">
                  Communities
                </Link>
                
                <Link to="/events" className="nav-link">
                  Events
                </Link>
                
                <Link to="/achievements" className="nav-link">
                  Achievements
                </Link>
                
                <Link to="/profile" className="nav-link">
                  Profile
                </Link>
              </div>

              {/* User Section */}
              <div className="user-section">
                {/* User Avatar & Info */}
                <div className="user-info">
                  <div className="user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="user-details">
                    <div className="user-name">
                      {user.name}
                    </div>
                    <div className="user-role">
                      {user.role}
                    </div>
                  </div>
                </div>
                
                {/* Logout Button */}
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Auth Buttons for logged out users */}
              <div className="auth-buttons">
                <Link to="/login" className="auth-link">
                  Login
                </Link>
                
                <Link to="/signup" className="signup-btn">
                  Get Started
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;