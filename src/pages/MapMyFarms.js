import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useUser } from '../UserContext';
import { polygon as turfPolygon, intersect as turfIntersect } from '@turf/turf';
import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
const booleanPointInPolygon = require('@turf/turf').booleanPointInPolygon;

const MapMyFarms = () => {
  // Current user email
  const { userEmail } = useUser();
  const drawnItems = new L.FeatureGroup();
  const [loading, setLoading] = useState(true);
  const { setSelectedFarm } = useUser();
  const [polygons, setPolygons] = useState([]);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const mapRef = useRef(null);
  const fetchedFarmsCoordiantesRef = useRef([]);
  const fetchedFarmsNamesRef = useRef([]);
  const fetchedFarmsIDsRef = useRef([]);
  const drawnItemsRef = useRef(new L.FeatureGroup());


  let fetchedFarms;
  let fetchedFarmsCoordiantes;
  let fetchedFarmsIDs;
  let fetchedFarmsNames;
  console.log(userEmail);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3002/maprouter/getfarms?email=${encodeURIComponent(userEmail)}`);
      fetchedFarms = response.data;
      fetchedFarmsCoordiantes = fetchedFarms.map(farm => farm.coordinates);
      fetchedFarmsIDs = fetchedFarms.map(farm => farm._id);
      fetchedFarmsNames = fetchedFarms.map(farm => farm.farmname || "Empty Name");
      fetchedFarmsCoordiantesRef.current = fetchedFarmsCoordiantes; 
      fetchedFarmsIDsRef.current = fetchedFarmsIDs; 
      fetchedFarmsNamesRef.current = fetchedFarmsNames; 

      // Save to localStorage
      sessionStorage.setItem('farms', JSON.stringify(fetchedFarmsCoordiantes));
      sessionStorage.setItem('farmids', JSON.stringify(fetchedFarmsIDs));
      sessionStorage.setItem('farmnames', JSON.stringify(fetchedFarmsNames));
      setLoading(false);
      console.log("false1");
    } catch (error) {
      console.error('Error fetching farms:', error);
      setLoading(false);
      console.log("false1");
    }
  };

  useEffect(() => {
    window.onbeforeunload = () => sessionStorage.clear();

    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  useEffect(() => {
    console.log('Running useEffect');
    const localFarms = sessionStorage.getItem('farms');
    const localIDs = sessionStorage.getItem('farmids');
    const localnames = sessionStorage.getItem('farmnames');
    if (localFarms && JSON.parse(localFarms).length > 0) {
      // If farms exist in localStorage and are not empty, use them
      fetchedFarmsCoordiantesRef.current = JSON.parse(localFarms);
      fetchedFarmsIDsRef.current = JSON.parse(localIDs);
      fetchedFarmsNamesRef.current = JSON.parse(localnames);
      setLoading(false);

    } else {
      // Otherwise, fetch farms from the server
      fetchData();
      console.log(loading);
    }
  }, [loading]);

  useEffect(() => {
    if (!loading) {
      // Esri World Imagery
      const esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a> contributors',
      });

      // Open Street View
      const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      });

      const baseMaps = {
        'Satelite': esri,
      };
      const overlayMaps = {
        'Open Street Map': osm,
      };

      const map = L.map('devTestingDemo', {
        center: [41.4535, 31.7894], // lat/lng in EPSG:4326
        zoom: 9,
        layers: [esri],
        maxZoom: 18,
        minZoom: 5,
      });
      mapRef.current = map; // Add this line
      console.log(fetchedFarmsCoordiantesRef.current);
      console.log(fetchedFarmsNamesRef.current);
      console.log(fetchedFarmsIDsRef.current);

      L.control.layers(baseMaps, overlayMaps).addTo(map);
      map.addLayer(drawnItems);
      if (Array.isArray(fetchedFarmsCoordiantesRef.current)) {
        fetchedFarmsCoordiantesRef.current.forEach((farm, index) => {
          const polygon = L.polygon(farm, { color: 'red' });
          drawnItems.addLayer(polygon);
          setPolygons((oldPolygons) => [
            ...oldPolygons,
            { polygon, index, farmInfo: fetchedFarmsNamesRef.current[index] },
          ]);
        });
      }


      // Inside the useEffect after creating the map
      map.on('click', (e) => {
        const clickedPoint = [e.latlng.lat, e.latlng.lng];

        // Check if the clicked point is within any of the existing farm polygons
        const matchingFarmIndex = fetchedFarmsCoordiantesRef.current.findIndex((farm) => {
          const existingPolygonGeoJSON = turfPolygon([farm]);
          const isPointInside = booleanPointInPolygon(clickedPoint, existingPolygonGeoJSON);
          return isPointInside;
        });

        // If a matching farm is found, display a popup
        if (matchingFarmIndex !== -1) {
          const matchingFarm = fetchedFarmsIDsRef.current[matchingFarmIndex];
          setSelectedFarm(matchingFarm);
          const farmPageURL = `/farm`; // Adjust the URL based on your routing logic

          // Display a confirmation prompt
          const confirmed = window.confirm(`Go to the specific page for this farm?`);

          if (confirmed) {
            // Redirect to the specific farm page
            window.location.href = farmPageURL;
          }
        }
      });

      return () => {
        // Clean up when component unmounts
        map.remove();
      };
    }
  }, [loading]); // Empty dependency array ensures useEffect runs only once

  const handlePolygonChange = (e) => {
    const selectedPolygon = polygons.find(p => p.index === parseInt(e.target.value));
    setSelectedPolygon(selectedPolygon);
    console.log(selectedPolygon);
    if (selectedPolygon) {
      mapRef.current.flyToBounds(selectedPolygon.polygon.getBounds());
    }
  };

  const flyToFarmLocation = (coordinates) => {
    // Assuming mapRef.current exists and has a flyToBounds method
    if (mapRef.current) {
      // Create a LatLngBounds object with the given coordinates
      const bounds = L.latLngBounds(coordinates);
  
      const reRenderFunction = () => {
        mapRef.current.fire('viewreset');
      };
      
      // Smoothly animate the map to fit the bounds of the polygon
      mapRef.current.flyToBounds(bounds, { duration: 1.5, easeLinearity: 0.5 });
      
      // Attach an event listener to the map movement
      mapRef.current.on('move', reRenderFunction);
      
      // Remove the event listener after 1.5 seconds
      setTimeout(() => {
        mapRef.current.off('move', reRenderFunction);
      }, 1500);
      
    }
  };

  return (

    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      <Header />
      <div className="content d-flex">
        <Sidebar flyToFarmLocation={flyToFarmLocation}/>
        <div id="devTestingDemo" style={{ height: 'calc(100vh - 70px)', width: '100%' }} />
      </div>
    </div>
  );
};

export default MapMyFarms;
