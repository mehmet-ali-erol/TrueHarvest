import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import MapAddFarmSelect from './pages/MapAddFarmSelect';
import MapAddFarmDraw from './pages/MapAddFarmDraw';
import MapMyFarms from './pages/MapMyFarms';
import Farm from './pages/Farm'
import Main from './pages/Main'
import Analysis from './pages/Analysis'
import StartScreen from './pages/StartScreen';
import Profile from './pages/Profile';

const React = require('react');
const { useEffect, useState } = require('react');
const { Routes, Route, Navigate } = require('react-router-dom');
export default function AppRouter() {
  const [data, setData] = useState([]);
  // useEffect(() => {
  //   // Fetch data from the server
  //   fetch('http://localhost:3000/api/data')
  //     .then(response => response.json())
  //     .then(data => setData(data))
  //     .catch(error => console.error('Error fetching data:', error));
  // }, []);
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signin" />} />
      <Route path="/signin" element={<SignIn/>} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/home" element={<Home/>} />
      <Route path="/mapaddfarmselect" element={<MapAddFarmSelect/>} />
      <Route path="/mapaddfarmdraw" element={<MapAddFarmDraw/>} />
      <Route path="/mapmyfarms" element={<MapMyFarms/>} />
      <Route path="/farm" element={<Farm/>} />
      <Route path="/main" element={<MapMyFarms/>} />
      <Route path="/start-screen" element={<StartScreen/>} />
      <Route path="/analysis" element={<Analysis/>} />
      <Route path="/profile" element={<Profile/>} />

    </Routes>
  );
}