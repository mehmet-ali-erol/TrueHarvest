import { useUser } from '../UserContext';
import React, { useState, useRef } from 'react';
import Header from '../components/Header';
import Image from '../assets/img/default-profile.png'
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Profile.css';

const Profile = () => {
    const { userEmail } = useUser();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleChangeUserName = async () => {
        try {
          setError(null);
    
          if (!userName) {
            alert('Please enter a username.');
            return;
          }
    
          const response = await fetch('http://localhost:3002/auth/change-username', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userEmail, userName }),
          });
    
          if (response.ok) {
            alert('Username was succesfully changed!');
          } else {
            alert('There was a problem.');
          }
        } catch (error) {
          setError('An unexpected error occurred. Please try again later.');
        }
      };    

      const handleChangePassword = async () => {
        try {
          setError(null);
    
          if (!password) {
            alert('Please enter a password.');
            return;
          }
    
          const response = await fetch('http://localhost:3002/auth/change-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userEmail, password }),
          });
    
          if (response.ok) {
            alert('Password was succesfully changed!');
          } else {
            alert('There was a problem.');
          }
        } catch (error) {
          setError('An unexpected error occurred. Please try again later.');
        }
      }; 


    return (
        <div className="container-fluid m-0 p-0 flex-column">
            <Header />
            <div className="profile-content d-flex">
                <div className="container">
                    <div className="row justify-content-center mt-3">
                        <div className="d-flex justify-content-center align-items-center" style={{ width: '200px', height: '200px' }}>
                            <img class="rounded-circle" src={Image} alt="Profile" style={{ marginBottom: '59px', width: '80%', height: '80%', objectFit: 'cover', border: '2px solid #000' }} />
                        </div>
                        <Form className="form-profile">
                            <Form.Group as={Row} controlId="formFieldName" className="mb-3">
                                <Form.Label column sm="2">
                                    Username
                                </Form.Label>
                                <Col sm="7">
                                    <Form.Control type="text" placeholder="Enter a new username" value={userName} onChange={(e) => setUserName(e.target.value)}/>
                                </Col>
                                <Col sm="2">
                                    <Button variant="success" size="lg"  onClick={handleChangeUserName}>
                                        Update
                                    </Button>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="formCropType" className="mb-3">
                                <Form.Label column sm="2">
                                    New Password
                                </Form.Label>
                                <Col sm="7">
                                    <Form.Control type="text" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </Col>
                                <Col sm="2">
                                    <Button variant="success" size="lg" onClick={handleChangePassword}>
                                        Update
                                    </Button>
                                </Col>
                            </Form.Group>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Profile;