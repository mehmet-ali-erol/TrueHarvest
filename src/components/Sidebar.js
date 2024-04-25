import React, { useState, useEffect } from 'react';
import '../assets/css/Sidebar.css';
import { useUser } from '../UserContext';
import FarmCard from './FarmCard';
const serverHost = process.env.REACT_APP_SERVER_HOST;


const Sidebar = ({ flyToFarmLocation }) => {
  const { userEmail } = useUser();
  const [farmData, setFarmData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${serverHost}/maprouter/getfarms?email=${encodeURIComponent(userEmail)}`);
        if (response.ok) {
          const data = await response.json();
          setFarmData(data);
        } else {
          console.error('Error fetching farm data:', response.status);
        }
      } catch (error) {
        console.error('Error fetching farm data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="sidebar">
      <h2>My Farms</h2>
      <ul>
        {farmData.map((farm) => (
          <li key={farm._id}>
            <FarmCard farm={farm} flyToFarmLocation={flyToFarmLocation}/>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
