import { useUser } from './UserContext'; 
import { polygon as turfPolygon, intersect as turfIntersect } from '@turf/turf';
import { point as turfPoint } from '@turf/turf';
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
  let fetchedFarms;

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3002/maprouter/getfarms?email=${encodeURIComponent(userEmail)}`);
      fetchedFarms = response.data;
      console.log(fetchedFarms);

      // Save to localStorage
      sessionStorage.setItem('farms', JSON.stringify(fetchedFarms));
      setLoading(false);
      console.log("false1");
    } catch (error) {
      console.error('Error fetching farms:', error);
      setLoading(false);
      console.log("false1");
    }
  };


  useEffect(() => {
    console.log('Running useEffect');
    const localFarms = sessionStorage.getItem('farms');
    if (localFarms && JSON.parse(localFarms).length > 0) {
      // If farms exist in localStorage and are not empty, use them
      fetchedFarms = JSON.parse(localFarms);
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
        // OpenStreetMap
        const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        });

        // Sentinel Hub WMS service
        const baseUrl = 'https://services.sentinel-hub.com/ogc/wms/8e927087-dcc3-4082-a0ea-96f67fff9809';
        const sentinelHub = L.tileLayer.wms(baseUrl, {
          tileSize: 512,
          attribution: '&copy; <a href="http://www.sentinel-hub.com/" target="_blank">Sentinel Hub</a>',
          urlProcessingApi: 'https://services.sentinel-hub.com/ogc/wms/1d4de4a3-2f50-493c-abd8-861dec3ae6b2',
          maxcc: 20,
          minZoom: 6,
          maxZoom: 9,
          preset: 'AGRICULTURE',
          layers: 'AGRICULTURE',
          time: '2023-06-01/2023-12-01',
        });

        const baseMaps = {
          'OpenStreetMap': osm,
        };
        const overlayMaps = {
          'Sentinel Hub WMS': sentinelHub,
        };

        const map = L.map('devTestingDemo', {
          center: [41.4535, 31.7894], // lat/lng in EPSG:4326
          zoom: 9,
          layers: [osm, sentinelHub],
        });

        L.control.layers(baseMaps, overlayMaps).addTo(map);

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
          edit: {
            featureGroup: new L.FeatureGroup(),
            remove: true,
          },
        });
        map.addControl(drawControl);
        console.log("ff");
        console.log(fetchedFarms);
        console.log(userEmail);

        map.addLayer(drawnItems);
        if (Array.isArray(fetchedFarms)) {
          fetchedFarms.forEach(farm => {
            const polygon = L.polygon(farm, { color: 'green' });
            drawnItems.addLayer(polygon);
          });
        }

        // Handle drawn layers
        map.on('draw:created', async (event) => {

          const onPolygonDrawn = (newPolygon) => {
            newPolygon.push(newPolygon[0]);     
            console.log(newPolygon);
            console.log("nn");
            // Convert the new polygon to a GeoJSON object
            const newPolygonGeoJSON = turfPolygon([newPolygon]);
          
            for (const farm of fetchedFarms) {
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

            if (confirmed &&  onPolygonDrawn(coordinates)) {
              fetchedFarms.push(coordinates);
              sessionStorage.setItem('farms', JSON.stringify(fetchedFarms));
              try {
                const response = await fetch('http://localhost:3002/maprouter/registerfarm', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ coordinates, email: userEmail }),
                });

                if (response.ok) {
                  console.log('Coordinates successfully sent to the server');
                  layer.setStyle({color: 'green'})
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
          const matchingFarm = fetchedFarms.find((farm) => {
            console.log(farm);
            const existingPolygonGeoJSON = turfPolygon([farm]);
            const isPointInside = booleanPointInPolygon(clickedPoint, existingPolygonGeoJSON);
            return isPointInside;
          });

          // If a matching farm is found, display a popup
          if (matchingFarm) {
            const farmIndex = fetchedFarms.indexOf(matchingFarm);
            const farmPageURL = `/farm/${farmIndex}`; // Adjust the URL based on your routing logic

            // Display a confirmation prompt
            const confirmed = window.confirm(`Go to the specific page for Farm ${farmIndex + 1}?`);

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
