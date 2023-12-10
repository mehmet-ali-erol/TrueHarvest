import React from 'react';
import '../assets/css/Sidebar.css';
import FarmCard from './FarmCard'; // Make sure to adjust the path according to your project structure

const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li >
                    <FarmCard />
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;