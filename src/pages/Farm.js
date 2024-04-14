import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { polygon as turfPolygon } from '@turf/turf';
import { useUser } from '../UserContext'; // replace 'path-to-user-context' with the actual path
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/Farm.css';
import center from '@turf/center';
import Header from '../components/Header';

const Farm = () => {
  const { selectedFarm } = useUser();
  const { userEmail } = useUser();
  const mapContainer = useRef(null);
  const navigate = useNavigate();
  const [allCropTypes, setAllCropTypes] = useState([]);
  const [currentCropType, setCurrentCropType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [coordinates, setCoordinates] = useState();
  const [chartData, setChartData] = useState(null);
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
    fetchCropTypes();
    if (allCropTypes) {
      setLoading(false)
    };
  }, [loading]);

  useEffect(() => {
    if (!loading && !loaded) {
      setLoaded(true);
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
              sowTime: farmDetails.sowtime || '',
              expectedHarvestTime: farmDetails.expectedharvesttime || '',
            });

            coordinates = farmDetails.coordinates;
            setCoordinates(coordinates);
          }
          console.log(allCropTypes);

          const farmPolygon = turfPolygon([coordinates]);
          const farmCenter = center(farmPolygon).geometry.coordinates.reverse();

          const map = L.map(mapContainer.current, {
            center: farmCenter,
            zoom: 13,
            layers: [
              L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png', {
                maxZoom: 18,
                minZoom: 2,
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
    }
  }, [loading]);

  useEffect(() => {
    const fetchAnalysisResult = async () => {
      try {
        // Extract the necessary parameters from farmDetails
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
        const sowingTime = farmDetails.sowtime;
        const harvestTime = farmDetails.expectedharvesttime;
        const coordinates = farmDetails.coordinates;

        // Call sendAnalysisRequest function
        const analysisResult = await sendNdviAnalysisRequest({ sowingTime, harvestTime, coordinates });

        // Send analysisResult to /saveNdviValues endpoint
        const ndvi_response = await fetch('http://localhost:3002/farmrouter/saveNdviValues', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userEmail: userEmail,
            selectedFarm: selectedFarm,
            ndviData: analysisResult,
          }),
        });

        if (!ndvi_response.ok) {
          throw new Error(`Request failed with status: ${ndvi_response.status}`);
        }
        console.log(analysisResult);

      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    if (!loading && !loaded) {
      setLoaded(true);
      fetchAnalysisResult();
    }
  }, [loading, loaded]);

  async function sendNdviAnalysisRequest(data) {
    const { sowingTime, harvestTime, coordinates } = data;
    const url = 'http://localhost:3002/farmrouter/statistics'; // replace with your server URL
    const requestBody = {
      sowingTime,
      harvestTime,
      coordinates
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

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
      return result;
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const sendAnalysisRequest = async (url, data) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });
      console.log(data)
      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  function getMinMaxCoordinates(coordinates) {
    const longitudes = coordinates.map(coordinate => coordinate[1]);
    const latitudes = coordinates.map(coordinate => coordinate[0]);

    const minLongitude = Math.min(...longitudes);
    const maxLongitude = Math.max(...longitudes);
    const minLatitude = Math.min(...latitudes);
    const maxLatitude = Math.max(...latitudes);

    return [{ min_lat: minLatitude, max_lat: maxLatitude }, { min_lon: minLongitude, max_lon: maxLongitude }];
  }

  const handleSaveFarmName = async () => {
    const result = await sendRequest('http://localhost:3002/farmrouter/savefarmname', formData.fieldName);

    if (result && result.success) {
    } else {
      alert('Farm name update failed. Please try again.');
    }
  };

  const handleSaveFarmAddress = async () => {
    const result = await sendRequest('http://localhost:3002/farmrouter/savefarmaddress', formData.fieldAddress);

    if (result && result.success) {
    } else {
      alert('Farm address update failed. Please try again.');
    }
  };

  const handleAddCropType = async () => {
    const result = await sendRequest('http://localhost:3002/farmrouter/addcroptype', formData.cropType);

    if (result && result.success) {
    } else {
      alert('Crop type addition failed. Please try again.');
    }
    setLoading(true);
  };

  const handleSaveSowTime = async () => {
    const result = await sendRequest('http://localhost:3002/farmrouter/savesowtime', formData.sowTime);

    if (result && result.success) {
    } else {
      alert('Sow time update failed. Please try again.');
    }
  };

  const handleSaveExpectedHarvestTime = async () => {
    const result = await sendRequest('http://localhost:3002/farmrouter/saveexpectedharvesttime', formData.expectedHarvestTime);

    if (result && result.success) {
    } else {
      alert('Expected harvest time update failed. Please try again.');
    }
  };

  const handleDeleteFarm = async () => {
    const result = await sendRequest('http://localhost:3002/farmrouter/deletefarm', formData.fieldName);

    if (result && result.success) {
      navigate('/main');
    } else {
      alert('Farm deletion failed.');
      console.error('Farm deletion failed:', result);
    }
  };

  const handleDeleteCropType = async () => {
    console.log(userEmail);
    console.log(selectedFarm);
    console.log(currentCropType);

    if (currentCropType) {
      try {
        const response = await fetch('http://localhost:3002/farmrouter/deletecroptype', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userEmail,
            selectedFarm,
            currentCropType,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setLoading(true); // Trigger a reload of crop types
        } else {
          alert('Crop type deletion failed.');
          console.error('Crop type deletion failed:', result);
        }
      } catch (error) {
        alert('An error occurred while deleting the crop type.');
        console.error('Error:', error);
      }
    } else {
      alert('Crop not selected.');
    }
  };

  const fetchCropTypes = async () => {
    try {
      const response = await fetch(`http://localhost:3002/farmrouter/getcroptypes?userEmail=${userEmail}&selectedFarm=${selectedFarm}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setAllCropTypes(data.croptypes);
    } catch (error) {
    }
  };

  const handleUpdateFieldInformation = async () => {
    try {
      await handleSaveFarmName();
      await handleSaveFarmAddress();
      await handleSaveSowTime();
      await handleSaveExpectedHarvestTime();
      await handleAddCropType();
      await handleDeleteCropType();

      alert('Field information updated successfully');

      sendAnalysisRequest('http://localhost:3002/analysisrouter/getanalysis', {
        sowTime: formData.sowTime,
        harvestTime: formData.expectedHarvestTime,
        coordinates: getMinMaxCoordinates(coordinates),
      });
    } catch (error) {
      console.error(error);
      alert('An error occurred while updating field information');
    }
  };


  return (
    <Container fluid className="m-0 p-0">
      <Header />
      <Container className="main-container">
        <Link to="/analysis">
          <Button variant="dark" size="lg" className="mb-3 mr-2">
            Chart
          </Button>
        </Link>
        <Link to="/farm">
          <Button type="analysis" variant="success" size="lg" className="mb-3">
            Analysis
          </Button>
        </Link>
        <Button type="Delete" variant="danger" size="lg" onClick={handleDeleteFarm}>
          Delete Farm
        </Button>
        <br></br>
        <br></br>

        <Container className="map-container" ref={mapContainer} />

        <Container className="field-details-container">
          <br></br>
          <h2>Field Information</h2>
          <br></br>
          <Form>
            <Form.Group as={Row} controlId="formFieldName" className="mb-3">
              <Form.Label column sm="2">
                Field Name
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  type="text"
                  placeholder="Enter field name"
                  value={formData.fieldName}
                  onChange={(e) => setFormData({ ...formData, fieldName: e.target.value })}
                />
              </Col>

            </Form.Group>

            <Form.Group as={Row} controlId="formFieldAddress" className="mb-3">
              <Form.Label column sm="2">
                Address
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  type="text"
                  placeholder="Enter address"
                  value={formData.fieldAddress}
                  onChange={(e) => setFormData({ ...formData, fieldAddress: e.target.value })}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formSowTime" className="mb-3">
              <Form.Label column sm="2">
                Sow Time
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  type="date"
                  value={formData.sowTime.split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, sowTime: e.target.value })}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formExpectedHarvestTime" className="mb-3">
              <Form.Label column sm="2">
                Expected Harvest Time
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  type="date"
                  value={formData.expectedHarvestTime.split('T')[0]}
                  onChange={(e) =>
                    setFormData({ ...formData, expectedHarvestTime: e.target.value })
                  }
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formCropType" className="mb-3">
              <Form.Label column sm="2">
                Add Crop Type
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  type="text"
                  placeholder="Enter crop type"
                  value={formData.cropType}
                  onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formDeleteCropType" className="mb-3">
              <Form.Label column sm="2">
                Delete Crop Type
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  as="select"
                  onChange={(e) => setCurrentCropType(e.target.value)}
                >
                  <option value="">Select Crop Type to Delete</option>
                  {allCropTypes.map((cropType) => (
                    <option key={cropType} value={cropType}>
                      {cropType}
                    </option>
                  ))}
                </Form.Control>
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formUpdateButton" className="mb-3 mr-0">
              <Col sm="11" className="d-flex justify-content-end" >
                <Button variant="success" size="lg" onClick={handleUpdateFieldInformation}>
                  Update
                </Button>
              </Col>
            </Form.Group>
          </Form>

        </Container>
      </Container>
    </Container>
  );
};

export default Farm;