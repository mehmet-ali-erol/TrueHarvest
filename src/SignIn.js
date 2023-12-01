import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SignIn.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignin = () => {
    // Implement logic
    console.log('Login clicked with:', { email, password, rememberMe });
  };

  return (
    <Container className="signin-container">
      <Row>
        <Col xs={12} md={6} className="signin-image">
          <h1>TrueHarvest</h1>
          <h2><i>Make sure it's harvested</i></h2>
        </Col>
        <Col xs={12} md={6} className="signin-form">
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
            <Form.Group controlId="formRememberMe" className="mb-3">
              <InputGroup>
                <InputGroup.Checkbox
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <Form.Label className="ms-2">Remember me</Form.Label>
              </InputGroup>
            </Form.Group>
            <Link to="/home" className="no-underline">
            <div className="d-grid gap-2">
              <Button variant="success" onClick={handleSignin}>
                SIGN IN
              </Button>
            </div>
            </Link>
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
