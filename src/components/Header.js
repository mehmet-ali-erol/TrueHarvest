import React from 'react';
import Icon from '../assets/img/background.jpeg'; // Replace with your actual Icon component or path
import '../assets/css/Header.css'; // Import the CSS file

const Header = () => {
    return (
        <div className="header navbar navbar-dark bg-dark bg-gradient">
            <a className="navbar-brand ms-3" href="#home">True Harvest</a>
            <div className="d-flex me-3">
                <img src={Icon} alt="icon" width="50" height="50" className='rounded-circle' />
            </div>
        </div>
    );
}

export default Header;