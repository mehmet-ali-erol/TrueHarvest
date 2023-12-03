const React = require('react');
const { useState } = require('react');
const { Container, Row, Col, Form, Button } = require('react-bootstrap');
const { Link } = require('react-router-dom');
require('bootstrap/dist/css/bootstrap.min.css');
require('./SignUp.css');

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');

  const handleSignUp = () => {
    // Create an object with user data
    const userData = {
      username,
      email,
      password,
      reEnterPassword,
    };

    // Make an HTTP POST request to your backend
    fetch('http://localhost:3002/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Registration successful:', data);
        // Optionally, you can redirect the user or perform other actions upon successful registration.
      })
      .catch(error => {
        console.error('Error during registration:', error);
        // Handle errors or display error messages to the user.
      });
  };

  return (
    <Container className="signup-container">
      <Row>
        <Col xs={12} md={6} className="signup-image">
          <h1>TrueHarvest</h1>
          <h2><i>Make sure it's harvested</i></h2>
        </Col>
        <Col xs={12} md={6} className="signup-form">
          <Form>
            <Form.Group controlId="formUsername">
              <Form.Label>USERNAME</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <br></br>
            <Form.Group controlId="formEmail">
              <Form.Label>EMAIL</Form.Label>
              <Form.Control
                type="email"
                placeholder="user@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <br></br>
            <Form.Group controlId="formPassword">
              <Form.Label>PASSWORD</Form.Label>
              <Form.Control
                type="password"
                placeholder="**************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <br></br>
            <Form.Group controlId="formReEnterPassword">
              <Form.Label>RE-ENTER PASSWORD</Form.Label>
              <Form.Control
                type="password"
                placeholder="**************"
                value={reEnterPassword}
                onChange={(e) => setReEnterPassword(e.target.value)}
              />
            </Form.Group>
            <br></br>
            <div className="d-grid gap-2">
              <Button variant="success" onClick={handleSignUp}>
                SIGN UP
              </Button>
            </div>
            <p className="mt-3">
              You already have an account?{' '}
              <Link to="/signin" className="text-success text-decoration-underline">
                SIGN IN
              </Link>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;
