import SignIn from './SignIn';
import SignUp from './SignUp';
import Home from './Home';
import Map from './Map'

const React = require('react');
const { useEffect, useState } = require('react');
const { BrowserRouter: Router, Routes, Route, Navigate } = require('react-router-dom');


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
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signin" element={<SignIn/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/map" element={<Map/>} />
      </Routes>
    </Router>
  );
}
