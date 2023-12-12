import React from 'react';
import Icon from '../assets/img/background.jpeg'; // Replace with your actual Icon component or path
import '../assets/css/Header.css'; // Import the CSS file

const Header = () => {
    return (
        <div className="header navbar navbar-dark bg-dark bg-gradient">
                <div className="col-12 col-md-4">
                    <a className="navbar-brand ms-3" href="#home">True Harvest</a>
                </div>
                <div className="col-12 col-md-8 d-flex justify-content-end">
                    <img src={Icon} alt="icon" width="50" height="50" className='rounded-circle me-3' />
                </div>
        </div>
    );
}

export default Header;