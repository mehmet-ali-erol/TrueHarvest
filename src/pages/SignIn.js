import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { GoogleLogin } from '@react-oauth/google';
import logo from '../assets/img/long_logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/SignIn.css';
const serverHost = process.env.REACT_APP_SERVER_HOST;
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSignin = async () => {
    try {
      setError(null);

      if (!email || !password) {
        setError('Please enter both email and password.');
        return;
      }

      const response = await fetch(`${serverHost}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        console.log('Login successful!');
        setUser(email);
        navigate('/start-screen');
      } else {
        setError('Login failed. Please check your email and password.');
      }
    } catch (error) {
      console.error('An error occurred during sign-in:', error);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  const handleGoogleSignin = async (response) => {
    try {
      const { credential } = response;

      // Optionally, decode the JWT to access the user's details (not recommended for secure use cases)
      // This is client-side decoding for demonstration purposes only
      const decodedToken = JSON.parse(atob(credential.split('.')[1]));
      const { email, name } = decodedToken;
      console.log('User Email:', email);
      console.log('User Name:', name);
      console.log('token:', decodedToken);

      // Ideally, send the credential (ID token) to your backend for verification
      const backendResponse = await fetch(`${serverHost}/auth/google-signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log(backendResponse.ok);
      if (backendResponse.ok) {
        console.log('Google Sign-In successful. User data retrieved in the backend.');
        // Handle user session setup or redirection here
        setUser(email);
        setAuthenticated(true); // Set authenticated state to true
        navigate('/start-screen');
      } else {
        setError('Google Sign-In failed. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred during Google sign-in:', error);
      setError('An unexpected error occurred. Please try again later.');
    }
  };


  return (
    <Container className="signin-container">
      <Row>
        <Col xs={6} md={6} className="signin-image">
          <img src={logo} alt="TrueHarvest" style={{ width: '550px', height: '550px' }} />
        </Col>
        <Col xs={6} md={6} className="signin-form">
          <Form>
            <Form.Group controlId="formUsername">
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
              <Form.Label> PASSWORD</Form.Label>
              <Form.Control
                type="password"
                placeholder="**************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <br></br>
            {error && <p className="text-danger">{error}</p>}
            <div className="d-grid gap-2">
              <Button variant="success" onClick={handleSignin}>
                SIGN IN
              </Button>
            </div>
            <br></br>
            <div className="d-grid gap-2">
              <GoogleLogin
                clientId={clientId}
                width="360px"
                text='signin_with'
                theme='filled'
                onSuccess={handleGoogleSignin}
              />
            </div>
            <p className="mt-3">
              You do not have an account?{' '}
              <Link to="/signup" className="text-success text-decoration-underline">
                SIGN UP
              </Link>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;