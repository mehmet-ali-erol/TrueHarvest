import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useUser} from '../UserContext'; 
import { polygon as turfPolygon, intersect as turfIntersect } from '@turf/turf';
const booleanPointInPolygon = require('@turf/turf').booleanPointInPolygon;
const L = require('leaflet');
const axios = require('axios');
require('leaflet/dist/leaflet.css');
require('leaflet-draw/dist/leaflet.draw.css');
require('leaflet-draw');
require('../assets/css/MapAddFarm.css');
const serverHost = process.env.REACT_APP_SERVER_HOST;


const MapDraw = () => {
  // Current user email
  const { userEmail } = useUser();
  const drawnItems = new L.FeatureGroup();
  const [loading, setLoading] = useState(true);
  const { setSelectedFarm } = useUser();
  const mapRef = useRef(null);
  const [zoomCoordinates, setZoomCoordinates] = useState(null);


  let fetchedFarms;
  let fetchedFarmsCoordiantes;
  let fetchedFarmsIDs;
  let fetchedFarmsNames;
  console.log(userEmail);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${serverHost}/maprouter/getfarms?email=${encodeURIComponent(userEmail)}`);
      fetchedFarms = response.data;
      fetchedFarmsCoordiantes = fetchedFarms.map(farm => farm.coordinates);
      fetchedFarmsIDs = fetchedFarms.map(farm => farm._id);
      fetchedFarmsNames = fetchedFarms.map(farm => farm.farmname);
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
    const localNames = sessionStorage.getItem('farmnames');
    if (localFarms && JSON.parse(localFarms).length > 0) {
      // If farms exist in localStorage and are not empty, use them
      fetchedFarmsCoordiantes = JSON.parse(localFarms);
      fetchedFarmsIDs = JSON.parse(localIDs);
      fetchedFarmsNames = JSON.parse(localNames);
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
        mapRef.current = map;

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
        
        
        const zoomToCoordinatesControl = L.control({ position: 'topleft' });
        zoomToCoordinatesControl.onAdd = () => {
          const zoomDiv = L.DomUtil.create('div', 'zoom-to-coordinates-control');
          zoomDiv.innerHTML = `
              <form id="zoomForm">
              <div class="custom-input">
                <label for="latitude"></label>
                <input
                  type="text"
                  class="form-control"
                  id="latitude"
                  placeholder="Latitude"
                  required
                />
              </div>
              <div class="custom-input">
                <label for="longitude"></label>
                <input
                  type="text"
                  class="form-control"
                  id="longitude"
                  placeholder="Longitude"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary">
                Zoom
              </button>
            </form>
          `;
        
          const form = zoomDiv.querySelector('#zoomForm');
          form.addEventListener('submit', (e) => {
            e.preventDefault();
            const latitude = parseFloat(form.querySelector('#latitude').value);
            const longitude = parseFloat(form.querySelector('#longitude').value);
            if (!isNaN(latitude) && !isNaN(longitude)) {
              map.setView([latitude, longitude], 15);
            } else {
              alert('Please enter valid coordinates');
            }
            e.stopPropagation();
          });
        
          return zoomDiv;
        };
        map.addControl(zoomToCoordinatesControl);

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
                alert('The new polygon overlaps with an existing polygon.');
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
                const response = await fetch(`${serverHost}/maprouter/registerfarm`, {
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

        return () => {
          // Clean up when component unmounts
          map.remove();
        };
    }
  }, [loading]); // Empty dependency array ensures useEffect runs only once

  const flyToFarmLocation = (coordinates) => {
    // Assuming mapRef.current exists and has a flyToBounds method
    if (mapRef.current) {
      // Create a LatLngBounds object with the given coordinates
      const bounds = L.latLngBounds(coordinates);
  
      // Fly to the bounds of the specified coordinates
      mapRef.current.flyToBounds(bounds);
    }
  };

  const handleZoomToCoordinates = () => {
    if (zoomCoordinates && zoomCoordinates.length === 2) {
      // Assuming mapRef.current exists and has a flyTo method
      if (mapRef.current) {
        mapRef.current.flyTo(zoomCoordinates, 15); // Zoom to the coordinates with a zoom level of 15
      }
    } else {
      alert('Please enter valid coordinates.');
    }
  };

  return (
    <div>
      <Header />
      <div className="content d-flex">
        <Sidebar flyToFarmLocation={flyToFarmLocation} />
        <div id="devTestingDemo" style={{ height: 'calc(100vh - 70px)', width: '100%' }} />
      </div>
    </div>
  );
};

export default MapDraw;

