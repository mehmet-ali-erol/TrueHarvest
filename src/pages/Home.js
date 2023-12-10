const React = require('react');
const { Container, Button, Navbar, Nav, Form, Image } = require('react-bootstrap');
require('bootstrap/dist/css/bootstrap.min.css');
require('../assets/css/Home.css');


const Home = () => {
  const handleAddFarm = () => {
    // Implement logic
    console.log('Add Farm clicked');
  };

  return (
    <Container className="home-container">
      <Navbar bg="dark" variant="dark" className="d-flex p-4">
        <Navbar.Brand>TrueHarvest</Navbar.Brand>
        <Nav className="ml-auto">
          <Form.Control type="date" className="mr-2" />
        </Nav>
      </Navbar>

      <Container className="page-container">
        <div className="add-farm-container">
          <Image src={require('../assets/img/map_icon.png')} alt="Farm Image" className="mr-2" rounded />
          <br></br>
          <Button variant="light" onClick={handleAddFarm}>
            <b>Add farm</b>
          </Button>
        </div>
      </Container>
    </Container>
  );
};

export default Home;
