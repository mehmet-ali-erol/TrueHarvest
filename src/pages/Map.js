import { useUser} from '../UserContext'; 
import { polygon as turfPolygon, intersect as turfIntersect } from '@turf/turf';
const booleanPointInPolygon = require('@turf/turf').booleanPointInPolygon;
const React = require('react');
const { useEffect } = require('react');
const L = require('leaflet');
const axios = require('axios');
const { useState } = require('react');
require('leaflet/dist/leaflet.css');
require('leaflet-draw/dist/leaflet.draw.css');
require('leaflet-draw');

const Map = () => {
  // Current user email
  const { userEmail } = useUser();
  const drawnItems = new L.FeatureGroup();
  const [loading, setLoading] = useState(true);
  const { setSelectedFarm } = useUser();

  let fetchedFarms;
  let fetchedFarmsCoordiantes;
  let fetchedFarmsIDs;
  console.log(userEmail);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3002/maprouter/getfarms?email=${encodeURIComponent(userEmail)}`);
      fetchedFarms = response.data;
      fetchedFarmsCoordiantes = fetchedFarms.map(farm => farm.coordinates);
      fetchedFarmsIDs = fetchedFarms.map(farm => farm._id);

      // Save to localStorage
      sessionStorage.setItem('farms', JSON.stringify(fetchedFarmsCoordiantes));
      sessionStorage.setItem('farmids', JSON.stringify(fetchedFarmsIDs));
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
    if (localFarms && JSON.parse(localFarms).length > 0) {
      // If farms exist in localStorage and are not empty, use them
      fetchedFarmsCoordiantes = JSON.parse(localFarms);
      fetchedFarmsIDs = JSON.parse(localIDs);
      setLoading(false);

    } else {
      // Otherwise, fetch farms from the server
      fetchData();
      console.log(loading);
    }
  }, [loading]);

  useEffect(() => {
    if ( !loading)
    {
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

        L.control.layers(baseMaps, overlayMaps).addTo(map);
        L.drawLocal.draw.toolbar.buttons.polygon = 'Draw your field.';

        // Add the draw control
        const drawControl = new L.Control.Draw({
          draw: {
            polygon: true,
            marker: false,
            circlemarker: false,
            polyline: false,
            rectangle: false,
            circle: false,
          },
        });
        map.addControl(drawControl);

        map.addLayer(drawnItems);
        if (Array.isArray(fetchedFarmsCoordiantes)) {
          fetchedFarmsCoordiantes.forEach(farm => {
            const polygon = L.polygon(farm, { color: 'red' });
            drawnItems.addLayer(polygon);
          });
        }

        // Handle drawn layers
        map.on('draw:created', async (event) => {

          const onPolygonDrawn = (newPolygon) => {
            newPolygon.push(newPolygon[0]);     

            // Convert the new polygon to a GeoJSON object
            const newPolygonGeoJSON = turfPolygon([newPolygon]);
          
            for (const farm of fetchedFarmsCoordiantes) {
              // Convert the existing polygon to a GeoJSON object
              const existingPolygonGeoJSON = turfPolygon([farm]);
          
              // Check if the new polygon intersects with the existing polygon
              const intersection = turfIntersect(newPolygonGeoJSON, existingPolygonGeoJSON);
          
              if (intersection) {
                // If the intersection is not null, the new polygon overlaps with the existing polygon
                console.error('The new polygon overlaps with an existing polygon.');
                return false;
              }
            }
          
            // If we reach this point, the new polygon does not overlap with any existing polygons
            console.log('The new polygon does not overlap with any existing polygons.');
            return true;
          };

          const layer = event.layer;

          if (layer instanceof L.Polygon) {
            // Extract coordinates
            const coordinates = layer.getLatLngs()[0].map(point => [point.lat, point.lng]);

            // Display confirmation prompt
            const confirmed = window.confirm('Do you want to confirm the area of the drawn farm?');

            if (confirmed && onPolygonDrawn(coordinates)) {
              fetchedFarmsCoordiantes.push(coordinates);
              sessionStorage.setItem('farms', JSON.stringify(fetchedFarmsCoordiantes));
              try {
                const response = await fetch('http://localhost:3002/maprouter/registerfarm', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ coordinates, email: userEmail }),
                });
            
                if (response.ok) {
                  const responseData = await response.json(); // Assuming the server returns JSON with farm ID
                  const farmId = responseData.id; 

                  fetchedFarmsIDs.push(farmId);
                  console.log(farmId);
                  sessionStorage.setItem('farmids', JSON.stringify(fetchedFarmsIDs));
            
                  console.log('Coordinates successfully sent to the server');
                  layer.setStyle({ color: 'yellow' });
                  drawnItems.addLayer(layer); // Add the confirmed layer to the drawnItems group
                } else {
                  console.error('Failed to send coordinates to the server');
                }
              } catch (error) {
                console.error('Error sending coordinates:', error);
              }
            } else {
              // Remove the layer if not confirmed
              map.removeLayer(layer);
            }
          }
        });

        // Inside the useEffect after creating the map
        map.on('click', (e) => {
          const clickedPoint = [e.latlng.lat, e.latlng.lng];

          // Check if the clicked point is within any of the existing farm polygons
          const matchingFarmIndex = fetchedFarmsCoordiantes.findIndex((farm) => {
            const existingPolygonGeoJSON = turfPolygon([farm]);
            const isPointInside = booleanPointInPolygon(clickedPoint, existingPolygonGeoJSON);
            return isPointInside;
          });

          // If a matching farm is found, display a popup
          if (matchingFarmIndex !== -1) {
            const matchingFarm = fetchedFarmsIDs[matchingFarmIndex];
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

  return (
    <div id="devTestingDemo" style={{ height: '100vh', width: '100%' }} />
  );
};

export default Map;
