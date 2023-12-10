import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../assets/css/Main.css'; // Make sure to adjust the path according to your project structure

const Main = () => {
    return (
        <div className="container-fluid m-0 p-0">
            <Header />
            <Sidebar />
          
        </div>
    );
};

export default Main;