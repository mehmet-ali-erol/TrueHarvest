import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../assets/img/background.jpeg';
import '../assets/css/Header.css';

const Header = () => {
    return (
        <div className="header navbar navbar-dark bg-dark bg-gradient">
            <Link to="/main" className="navbar-brand ms-3">True Harvest</Link>
            <Link to="/mapmyfarms" className="navbar-text">My Farms</Link>
            <Link to="/mapaddfarmselect" className="navbar-text">Add Existing Farm</Link>
            <Link to="/mapaddfarmdraw" className="navbar-text">Draw Farm</Link>
            <Link to="/signin" className="navbar-text">Logout</Link>

            <Link to="/profile">
                <div className="d-flex me-3">
                    <img src={Icon} alt="icon" width="50" height="50" className='rounded-circle' />
                </div>
            </Link>
        </div>
    );
}

export default Header;
