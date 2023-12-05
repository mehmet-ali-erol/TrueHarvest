import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { polygon as turfPolygon } from '@turf/turf';
import { useUser } from './UserContext'; // replace 'path-to-user-context' with the actual path
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Farm.css';
import center from '@turf/center';

const Farm = () => {
  const { selectedFarm } = useUser();
  const { userEmail } = useUser();
  const mapContainer = useRef(null);
  const [formData, setFormData] = useState({
    fieldName: '',
    fieldAddress: '',
    cropType: '',
    sowTime: '',
    expectedHarvestTime: '',
  });

  console.log(selectedFarm);
  console.log(userEmail);

  useEffect(() => {
    let coordinates;
    const initializeMap = async () => {
      try {
        if (!userEmail || !selectedFarm) {
          // If userEmail or selectedFarm is not available, don't proceed with the fetch
          return;
        }
  
        // Fetch farm details based on userEmail and selectedFarm
        const response = await fetch(`http://localhost:3002/farmrouter/getfarmdetails?userEmail=${userEmail}&selectedFarm=${selectedFarm}`);
  
        if (!response.ok) {
          throw new Error(`Request failed with status: ${response.status}`);
        }
  
        const farmDetails = await response.json();
        console.log(farmDetails);
  
        // If farm details exist, set the form data
        if (farmDetails) {
          setFormData({
            fieldName: farmDetails.farmname || '',
            fieldAddress: farmDetails.address || '',
            cropType: farmDetails.cropyypes || '',
            sowTime: farmDetails.sowsime || '',
            expectedHarvestTime: farmDetails.expectedharvesttime || '',
          });
          coordinates = farmDetails.coordinates;
          console.log(coordinates);
        }
  
        const farmPolygon = turfPolygon([coordinates]);
        const farmCenter = center(farmPolygon).geometry.coordinates.reverse();
  
        const map = L.map(mapContainer.current, {
          center: farmCenter,
          zoom: 13,
          layers: [
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png', {
              maxZoom: 19,
            }),
          ],
          dragging: false,
          touchZoom: false,
          doubleClickZoom: false,
          scrollWheelZoom: false,
          boxZoom: false,
          keyboard: false,
        });
  
        L.polygon(coordinates, { color: 'red' }).addTo(map);
        map.fitBounds(L.polygon(coordinates).getBounds());
  
        return () => {
          map.remove();
        };
      } catch (error) {
        console.error('Error:', error.message);
      }
    };
  
    initializeMap();
  }, []);
  

  const sendRequest = async (url, data) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedFarm, data }),
      });      
      console.log(data);

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleSaveFarmName = () => {
    sendRequest('http://localhost:3002/farmrouter/savefarmname', formData.fieldName );
  };

  const handleSaveFarmAddress = () => {
    sendRequest('http://localhost:3002/farmrouter/savefarmaddress', formData.fieldAddress );
  };

  const handleAddCropType = () => {
    sendRequest('http://localhost:3002/farmrouter/addcroptype', formData.cropType );
  };

  const handleSaveSowTime = () => {
    sendRequest('http://localhost:3002/farmrouter/savesowtime', formData.sowTime );
  };

  const handleSaveExpectedHarvestTime = () => {
    sendRequest('http://localhost:3002/farmrouter/saveexpectedharvesttime',  formData.expectedHarvestTime);
  };

  return (
    <Container className="main-container">
      {/* ... (existing code) */}
      <Container className="field-details-container">
        <br></br>
        <h2>Field Information</h2>
        <br></br>
        <Container className="main-container">
          {/* ... */}
            <Container className="map-container" ref={mapContainer} />
          {/* ... */}
        </Container>
        <Form>
          <Form.Group as={Row} controlId="formFieldName" className="mb-3">
            <Form.Label column sm="2">
              Field Name
            </Form.Label>
            <Col sm="7">
              <Form.Control
                type="text"
                placeholder="Enter field name"
                value={formData.fieldName}
                onChange={(e) => setFormData({ ...formData, fieldName: e.target.value })}
              />
            </Col>
            <Col sm="2">
              <Button variant="success" onClick={handleSaveFarmName}>
                Confirm
              </Button>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formFieldAddress" className="mb-3">
            <Form.Label column sm="2">
              Address
            </Form.Label>
            <Col sm="7">
              <Form.Control
                type="text"
                placeholder="Enter address"
                value={formData.fieldAddress}
                onChange={(e) => setFormData({ ...formData, fieldAddress: e.target.value })}
              />
            </Col>
            <Col sm="2">
              <Button variant="success" onClick={handleSaveFarmAddress}>
                Confirm
              </Button>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formCropType" className="mb-3">
            <Form.Label column sm="2">
              Crop Type
            </Form.Label>
            <Col sm="7">
              <Form.Control
                type="text"
                placeholder="Enter crop type"
                value={formData.cropType}
                onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
              />
            </Col>
            <Col sm="2">
              <Button variant="success" onClick={handleAddCropType}>
                Confirm
              </Button>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formSowTime" className="mb-3">
            <Form.Label column sm="2">
              Sow Time
            </Form.Label>
            <Col sm="7">
              <Form.Control
                type="date"
                value={formData.sowTime}
                onChange={(e) => setFormData({ ...formData, sowTime: e.target.value })}
              />
            </Col>
            <Col sm="2">
              <Button variant="success" onClick={handleSaveSowTime}>
                Confirm
              </Button>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formExpectedHarvestTime" className="mb-3">
            <Form.Label column sm="2">
              Expected Harvest Time
            </Form.Label>
            <Col sm="7">
              <Form.Control
                type="date"
                value={formData.expectedHarvestTime}
                onChange={(e) =>
                  setFormData({ ...formData, expectedHarvestTime: e.target.value })
                }
              />
            </Col>
            <Col sm="2">
              <Button variant="success" onClick={handleSaveExpectedHarvestTime}>
                Confirm
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Container>
    </Container>
  );
};

export default Farm;
