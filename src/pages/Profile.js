import React, { useState, useRef } from 'react';
import Header from '../components/Header';
import Image from '../assets/img/background.jpeg'
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Profile.css';

const Profile = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInput = useRef();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        current_password: '',
        new_password: '',
    });

    const handleImageClick = () => {
        fileInput.current.click();
    }

    const handleFileChange = async (event) => {
        setSelectedFile(event.target.files[0]);

        const formData = new FormData();
        formData.append('file', event.target.files[0]);

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            // Handle successful upload
        } else {
            // Handle error
        }
    }
    return (
        <div className="container-fluid m-0 p-0 flex-column">
            <Header />
            <div className="profile-content d-flex">
                <div className="container">
                    <div className="row justify-content-center mt-3">
                        <div className="d-flex justify-content-center align-items-center" style={{ width: '200px', height: '200px' }}>
                            <img class="rounded-circle" src={Image} alt="Profile" onClick={handleImageClick} style={{ width: '80%', height: '80%', objectFit: 'cover', border: '3px solid #000' }} />
                            <input type="file" ref={fileInput} style={{ display: 'none' }} onChange={handleFileChange} />
                        </div>
                        <Form>
                            <Form.Group as={Row} controlId="formFieldName" className="mb-3">
                                <Form.Label column sm="2">
                                    Username
                                </Form.Label>
                                <Col sm="7">
                                    <Form.Control type="text" placeholder="Enter a new username" value={formData.fieldName} />
                                </Col>
                                <Col sm="2">
                                    <Button variant="success" size="lg">
                                        Update
                                    </Button>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="formFieldAddress" className="mb-3">
                                <Form.Label column sm="2">
                                    Current Password
                                </Form.Label>
                                <Col sm="7">
                                    <Form.Control type="text" placeholder="Enter current password" value={formData.fieldAddress} />
                                </Col>
                                <Col sm="2">
                                    <Button variant="success" size="lg">
                                        Update
                                    </Button>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="formCropType" className="mb-3">
                                <Form.Label column sm="2">
                                    New Password
                                </Form.Label>
                                <Col sm="7">
                                    <Form.Control type="text" placeholder="Enter new password" value={formData.cropType} />
                                </Col>
                                <Col sm="2">
                                    <Button variant="success" size="lg">
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