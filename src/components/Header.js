import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../assets/img/background.jpeg';
import '../assets/css/Header.css';

const Header = () => {
  const handleLogout = () => {
    // Clear local storage
    localStorage.clear();

    // Clear session storage
    sessionStorage.clear();

    // Optionally, you may want to redirect the user to the login page
    // You can use React Router's history object or another navigation method for this
    // For example: history.push('/signin');
  };

  return (
    <div className="header navbar navbar-dark bg-dark bg-gradient">
      <Link to="/main" className="navbar-brand ms-3">
        True Harvest
      </Link>
      <Link to="/mapmyfarms" className="navbar-text">
        My Farms
      </Link>
      <Link to="/mapaddfarmselect" className="navbar-text">
        Add Existing Farm
      </Link>
      <Link to="/mapaddfarmdraw" className="navbar-text">
        Draw Farm
      </Link>
      <Link to="/signin" className="navbar-text" onClick={handleLogout}>
        Logout
      </Link>

      <Link to="/profile">
        <div className="d-flex me-3">
          <img src={Icon} alt="icon" width="50" height="50" className="rounded-circle" />
        </div>
      </Link>
    </div>
  );
};

export default Header;
