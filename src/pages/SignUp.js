import logo from '../assets/img/long_logo.png';
const React = require('react');
const { useState } = require('react');
const { Container, Row, Col, Form, Button } = require('react-bootstrap');
const { Link, useNavigate } = require('react-router-dom');
require('bootstrap/dist/css/bootstrap.min.css');
require('../assets/css/SignUp.css');

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      setError(null);
      // Check if any field is empty
      if (!username || !email || !password || !reEnterPassword) {
        setError('Please fill in all fields.');
        return;
      }

      // Check if password and re-entered password match
      if (password !== reEnterPassword) {
        setError('Passwords do not match.');
        return;
      }

      if (!isValidEmail(email)) {
        setError('Please enter a valid email address.');
        return;
      }

      // Create an object with user data
      const userData = {
        username,
        email,
        password,
      };

      // Make an HTTP POST request to your backend
      const response = await fetch('http://localhost:3002/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Registration successful:', data);
        alert('Registration successful');
        navigate('/signin');
      } else {
        setError('This email address already exists in the system..');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Container className="signup-container">
      <Row>
        <Col xs={6} className="signup-image">
          <img src={logo} alt="TrueHarvest" style={{ width: '550px', height: '550px' }} />
        </Col>
        <Col xs={6} className="signup-form">
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
            <Form.Group controlId="formBasicEmail">
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
            {error && <p className="text-danger">{error}</p>}
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

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default SignUp;
