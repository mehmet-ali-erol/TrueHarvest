import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/StartScreen.css'; // Make sure to adjust the path according to your project structure

const StartScreen = ({ history }) => {
    let navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            navigate('/main'); // replace '/main' with the actual path to your Main.js page
        }, 3000);
    }, [navigate]);

    return (
        <div className="start-screen">
            <h1>True Harvest</h1>
            <div className="loading-stick"></div>
        </div>
    );
};

export default StartScreen;