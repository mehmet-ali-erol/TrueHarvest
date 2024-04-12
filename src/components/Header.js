import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../assets/img/default-profile.png';
import '../assets/css/Header.css';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';




const Header = () => {
  const [activeLink, setActiveLink] = useState('/main');

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
      <NavLink to="/main" activeClassName="active" className="navbar-brand ms-3 text-decoration-none">
        True Harvest
      </NavLink>
      <NavLink to="/mapmyfarms" activeClassName="active" className="navbar-text text-decoration-none large-font">
        My Farms
      </NavLink>
      <NavLink to="/mapaddfarmselect" activeClassName="active" className="navbar-text text-decoration-none large-font">
        Add Existing Farm
      </NavLink>
      <NavLink to="/mapaddfarmdraw" activeClassName="active" className="navbar-text text-decoration-none large-font">
        Draw Farm
      </NavLink>
      <NavLink to="/signin" activeClassName="active" className="navbar-text text-decoration-none large-font" onClick={handleLogout}>
        Logout
      </NavLink>
      <NavLink to="/profile" activeClassName="active" className="d-flex me-3">
        <img src={Icon} alt="icon" width="50" height="50" className="rounded-circle" />
      </NavLink>
    </div>
  );
};

export default Header;