const React = require('react');
const { Container, Button, Form, Row, Col } = require('react-bootstrap');
require('bootstrap/dist/css/bootstrap.min.css');
require('./Farm.css');

const Farm = () => {
  const handleFarm = () => {
    // Implement logic
    console.log('Add Farm clicked');
  };
  
  return (
    <Container className="main-container">
      <Button variant="light" className="mb-3 mr-2">
        <b>Chart</b>
      </Button>
      <Button variant="light" className="mb-3">
        <b>Analysis</b>
      </Button>
      <br></br>
      <br></br>
      <br></br>
      
      <Container className="map-container">

      </Container>

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
              <Form.Control type="text" placeholder="Enter field name" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formFieldAddress" className="mb-3">
            <Form.Label column sm="2">
              Address
            </Form.Label>
            <Col sm="9">
              <Form.Control type="text" placeholder="Enter address" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formCropType" className="mb-3">
            <Form.Label column sm="2">
              Crop Type
            </Form.Label>
            <Col sm="9">
              <Form.Control type="text" placeholder="Enter crop type" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formSowTime" className="mb-3">
            <Form.Label column sm="2">
              Sow Time
            </Form.Label>
            <Col sm="9">
              <Form.Control type="datetime-local" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formExpectedHarvestTime" className="mb-3">
            <Form.Label column sm="2">
              Expected Harvest Time
            </Form.Label>
            <Col sm="9">
              <Form.Control type="datetime-local" />
            </Col>
          </Form.Group>

        </Form>
      </Container>
    </Container>
  );
};

export default Farm;
