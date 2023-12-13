import React from 'react';
import { Link } from 'react-router-dom'; 
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../assets/css/Main.css'; 

const Main = () => {
    return (
        <div className="container-fluid m-0 p-0">
            <Header />
            <Sidebar />
        </div>
    );
};

export default Main;