import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../assets/css/Main.css'; // Make sure to adjust the path according to your project structure

const Main = () => {
    return (
        <div className="container-fluid m-0 p-0">
            <Header />
            <Sidebar />
            <Link to="/mapmyfarms" className="btn btn-primary">My Farms</Link> {/* Add this line */}
            <Link to="/mapaddfarmselect" className="btn btn-primary">Add Existing Farm</Link> {/* Add this line */}
            <Link to="/mapaddfarmdraw" className="btn btn-primary">Draw Farm</Link> {/* Add this line */}
        </div>
    );
};

export default Main;