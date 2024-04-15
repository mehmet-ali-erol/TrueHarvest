import Header from '../components/Header';
import { useUser} from '../UserContext'; 
import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { polygon as turfPolygon, intersect as turfIntersect } from '@turf/turf';
const booleanPointInPolygon = require('@turf/turf').booleanPointInPolygon;
const L = require('leaflet');
const axios = require('axios');
const wellknown = require('wellknown');
require('leaflet/dist/leaflet.css');
require('leaflet-draw/dist/leaflet.draw.css');
require('leaflet-draw');
require('../assets/css/MapAddFarm.css');

const MapAddFarmSelect = () => {
  const [dropdown1, setDropdown1] = useState('');
  const [dropdown2, setDropdown2] = useState('');
  const [dropdown3, setDropdown3] = useState('');
  const [textField1, setTextField1] = useState('');
  const [textField2, setTextField2] = useState('');
  const [dropdown1Options, setDropdown1Options] = useState([]);
  const [dropdown2Options, setDropdown2Options] = useState([]);
  const [dropdown3Options, setDropdown3Options] = useState([]);

  // Current user email
  const { userEmail } = useUser();
  const drawnItems = new L.FeatureGroup();
  const [loading, setLoading] = useState(true);
  const { setSelectedFarm } = useUser();
  const mapRef = useRef(null);
  const fetchedFarmsCoordiantesRef = useRef([]);
  const fetchedFarmsIDsRef = useRef([]);
  const drawnItemsRef = useRef(new L.FeatureGroup());



  let fetchedFarms;
  let fetchedFarmsCoordiantes;
  let fetchedFarmsIDs;
  let fetchedFarmsNames;

  const fetchDropdownOptions = async (type, parentId = null) => {
    try {
      // Conditionally include parent ID in the URL if it is not null
      const url = parentId
        ? `http://localhost:3002/${type}/${parentId}`
        : `http://localhost:3002/${type}`;
        const response = await axios.get(url);
        console.log(response.data);
        const options = response.data; // Assuming the response directly contains an array of cities, districts, etc.
        switch (type) {
          case 'fetchCities':
            setDropdown1Options(options["cities"].map(city => ({ key: city.property_id, label: city.property_text })));
            break;
          case 'fetchDistricts':
            setDropdown2Options(options["districts"].map(district => ({ key: district.property_id, label: district.property_text })));
            break;
          case 'fetchNeighborhoods':
            setDropdown3Options(options["neighborhoods"].map(neighborhood => ({ key: neighborhood.property_id, label: neighborhood.property_text })));
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(`Error fetching ${type}s:`, error);
      }
    };

  const handleDropdown1Change = async (value) => {
    setDropdown1(value);
    setDropdown2('');
    setDropdown3('');
    setTextField1('');
    setTextField2('');
    
    // Reset the options for dropdown2 and dropdown3
    setDropdown2Options([]);
    setDropdown3Options([]);

    // Fetch districts based on the selected city
    if (value) {
      fetchDropdownOptions('fetchDistricts', value);
    }
  };

  const handleDropdown2Change = async (value) => {
    setDropdown2(value);
    setDropdown3('');
    setTextField1('');
    setTextField2('');

    // Fetch neighborhoods based on the selected district
    if (value) {
      fetchDropdownOptions('fetchNeighborhoods', value);
    }
  };

  const handleDropdown3Change = (value) => {
    setDropdown3(value);
  };

  useEffect(() => {
    // Fetch cities initially
    fetchDropdownOptions('fetchCities');
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3002/maprouter/getfarms?email=${encodeURIComponent(userEmail)}`);
      fetchedFarms = response.data;
      fetchedFarmsCoordiantes = fetchedFarms.map(farm => farm.coordinates);
      fetchedFarmsIDs = fetchedFarms.map(farm => farm._id);
      fetchedFarmsNames = fetchedFarms.map(farm => farm.farmname);
      fetchedFarmsCoordiantesRef.current = fetchedFarmsCoordiantes; 
      fetchedFarmsIDsRef.current = fetchedFarmsIDs; 


      // Save to localStorage
      sessionStorage.setItem('farms', JSON.stringify(fetchedFarmsCoordiantes));
      sessionStorage.setItem('farmids', JSON.stringify(fetchedFarmsIDs));
      sessionStorage.setItem('farmnames', JSON.stringify(fetchedFarmsNames));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching farms:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    window.onbeforeunload = () => sessionStorage.clear();
  
    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  useEffect(() => {
    const localFarms = sessionStorage.getItem('farms');
    const localIDs = sessionStorage.getItem('farmids');
    const localNames = sessionStorage.getItem('farmnames');
    if (localFarms && JSON.parse(localFarms).length > 0) {
      // If farms exist in localStorage and are not empty, use them
      fetchedFarmsCoordiantesRef.current = JSON.parse(localFarms);
      fetchedFarmsIDsRef.current = JSON.parse(localIDs);
      fetchedFarmsNames = JSON.parse(localNames);
      setLoading(false);

    } else {
      // Otherwise, fetch farms from the server
      fetchData();
      console.log(loading);
    }
  }, [loading]);

  useEffect(() => {
    // Fetch the values from the server and set the state...
  }, []);

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
          zoomSnap: 0,
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
            polygon: false,
            marker: false,
            circlemarker: false,
            polyline: false,
            rectangle: false,
            circle: false,
          },
        });
        map.addControl(drawControl);

        map.addLayer(drawnItems);
        drawnItemsRef.current = drawnItems;
        if (Array.isArray(fetchedFarmsCoordiantesRef.current)) {
          fetchedFarmsCoordiantesRef.current.forEach(farm => {
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
                  onclick="event.stopPropagation();"
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
                  onclick="event.stopPropagation();"
                />
              </div>
              <button type="submit" class="btn btn-primary" onclick="event.stopPropagation();">
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

        const reRenderFunction = ()=>{
          map.fire('viewreset');
        };
        
        map.on('click', async (e) => {
          const clickedPoint = [e.latlng.lat, e.latlng.lng];
            try {
              const response = await axios.get(`http://localhost:3002/fetchLocationByPoint/${clickedPoint[0]}/${clickedPoint[1]}`);
              const coordinates = response.data.geometry.coordinates[0];
              await coordinates.forEach(function (coordinate) {
                coordinate.reverse();
              })
                
              if (!coordinates) {
                console.error('Invalid response format or missing coordinates.');
                return;
              }
              const pcoordinates = coordinates;
              let availablecoordinate = true;
            
              for (const farm of fetchedFarmsCoordiantesRef.current) {
                // Convert the existing polygon to a GeoJSON object
                const existingPolygonGeoJSON = turfPolygon([farm]);
            
                // Check if the new polygon contains any point of the existing polygon
                const containsPoint = booleanPointInPolygon(clickedPoint, existingPolygonGeoJSON);
            
                if (containsPoint) {
                  // If the point is inside the existing polygon, the new polygon overlaps
                  alert('The selected field overlaps with an existing field.');
                  availablecoordinate = false;
                }
              }

              if ( availablecoordinate){
                // Draw the polygon on the map
                const polygon = L.polygon(pcoordinates, { color: 'blue' });
                drawnItems.addLayer(polygon);

                // Smoothly animate the map to fit the bounds of the polygon
                map.flyToBounds(polygon.getBounds(), { duration: 1.5, easeLinearity: 0.5 });
                map.on('move',reRenderFunction)
                setTimeout(()=>{
                  map.off('move',reRenderFunction);
                },1500);

                // Delay the confirmation prompt to ensure it appears after the animation
                setTimeout(() => {
                  // Display confirmation prompt
                  const confirmed = window.confirm('Do you want to confirm the area of the drawn farm?');

                  if (confirmed) {
                    fetchedFarmsCoordiantesRef.current.push(pcoordinates);
                    sessionStorage.setItem('farms', JSON.stringify(fetchedFarmsCoordiantesRef.current));
                  
                    fetch('http://localhost:3002/maprouter/registerfarm', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ coordinates: pcoordinates, email: userEmail }),
                    })
                      .then((response) => response.json())
                      .then((responseData) => {
                        if (responseData && responseData.id) {
                          const farmId = responseData.id;
                  
                          fetchedFarmsIDsRef.current.push(farmId);
                          sessionStorage.setItem('farmids', JSON.stringify(fetchedFarmsIDsRef.current));
                  
                          console.log('Coordinates successfully sent to the server');
                          polygon.setStyle({ color: 'yellow' });
                        } else {
                          console.error('Failed to send coordinates to the server:', responseData);
                        }
                  
                      })
                      .catch((error) => {
                        console.error('Error sending coordinates:', error);
                        drawnItems.removeLayer(polygon);
                      });
                  } else {
                    // Remove the layer if not confirmed
                    drawnItems.removeLayer(polygon);
                  }
                },2500);
              }
            } catch (error) {
              alert('There is no registered parcel at the specified location.');
            }
          });
        
        return () => {
          // Clean up when component unmounts
          map.remove();
        };
    }
  }, [loading]); // Empty dependency array ensures useEffect runs only once

  const handleFindField = async (fetchedFarmsCoordiantesRefP, fetchedFarmsIDsP, drawnItemsRefP) => {
    try {
      const pcoordinates = await fetchCoordinates();
      if (pcoordinates) { 
        const polygon = L.polygon(pcoordinates);
        drawnItemsRefP.current.addLayer(polygon);

        // Smoothly animate the map to fit the bounds of the polygon
        mapRef.current.flyToBounds(polygon.getBounds(), { duration: 1.5, easeLinearity: 0.5 });

        // Delay the confirmation prompt to ensure it appears after the animation
        setTimeout(() => {
          // Display confirmation prompt
          const confirmed = window.confirm('Do you want to confirm the area of the drawn farm?');

          if (confirmed) {
            fetchedFarmsCoordiantesRefP.current.push(pcoordinates);
            sessionStorage.setItem('farms', JSON.stringify(fetchedFarmsCoordiantesRefP.current));
          
            fetch('http://localhost:3002/maprouter/registerfarm', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ coordinates: pcoordinates, email: userEmail }),
            })
              .then((response) => response.json())
              .then((responseData) => {
                if (responseData && responseData.id) {
                  const farmId = responseData.id;
          
                  fetchedFarmsIDsP.current.push(farmId);
                  sessionStorage.setItem('farmids', JSON.stringify(fetchedFarmsIDsP.current));
          
                  console.log('Coordinates successfully sent to the server');
                  polygon.setStyle({ color: 'yellow' });
                } else {
                  console.error('Failed to send coordinates to the server:', responseData);
                }
          
              })
              .catch((error) => {
                console.error('Error sending coordinates:', error);
                drawnItems.removeLayer(polygon);
              });
          } else {
            // Remove the layer if not confirmed
            drawnItemsRefP.current.removeLayer(polygon);
          }
        },2500);
      } else {
        // Display an error message or alert
        console.error('Please fill in all dropdowns and text fields before finding the field.');
      }
    } catch (error) {
      console.error('Error handling find field:', error.message);
    }
  };

  const fetchCoordinates = async () => {
    try {
      // Validate inputs
      if (!dropdown1 || !dropdown2 || !dropdown3 || !textField1 || !textField2) {
        alert('Please fill in all dropdowns and text fields before finding the field.');
        return;
      }
  
      const response = await axios.get(`http://localhost:3002/fetchParcel/${dropdown3}/${textField1}/${textField2}`);
      const coordinates = response.data.geometry.coordinates[0];
      coordinates.forEach(function (coordinate) {
        coordinate.reverse();
      })
        
      if (!coordinates) {
        console.error('Invalid response format or missing coordinates.');
        return;
      }
      return coordinates;
  
    } catch (error) {
      console.error('Error fetching coordinates:', error.message);
      alert('The parcel with specified information does not exist.')
    }
  };


  return (
      <Container fluid className="header-container m-0 p-0">
        <Header />
        <Row className="align-items-center m-0">
          <Col xs={2} className="left-side">
            <h1>Let us locate your field using parcel information.</h1>
            <br></br>
            <Form className="form-custom">
              <Form.Select className="mb-3" onChange={(e) => handleDropdown1Change(e.target.value)}>
                {dropdown1Options.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
      
                ))}
              </Form.Select>
              <Form.Select className="mb-3" onChange={(e) => handleDropdown2Change(e.target.value)}>
                {dropdown2Options.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
      
                ))}
              </Form.Select>
              <Form.Select className="mb-3" onChange={(e) => handleDropdown3Change(e.target.value)}>
                {dropdown3Options.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
      
                ))}
              </Form.Select>
              <Form.Control
                type="text"
                placeholder="Land"
                value={textField1}
                onChange={(e) => setTextField1(e.target.value)}
                disabled={!dropdown1 || !dropdown2 || !dropdown3}
              />
              <Form.Control
                type="text"
                placeholder="Parcel"
                value={textField2}
                onChange={(e) => setTextField2(e.target.value)}
                disabled={!dropdown1 || !dropdown2 || !dropdown3}
              />
              
            </Form>
            <Button variant="success" name="findfield" onClick={() => handleFindField(fetchedFarmsCoordiantesRef, fetchedFarmsIDsRef, drawnItemsRef)}>Find Field</Button>

          </Col>
          <Col xs={10} className="right-side p-0">
                <div id="devTestingDemo" style={{ height: 'calc(100vh - 70px)', width: '100%' }} />
          </Col>
        </Row>
      </Container>
    );
  };

export default MapAddFarmSelect;
