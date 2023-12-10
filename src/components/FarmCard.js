import FarmImage from '../assets/img/field_img.jpg';
const React = require('react');
const { useState, useRef, useEffect } = require('react');
const { Container, Row, Col, Form, Button, Image } = require('react-bootstrap');
const { Link } = require('react-router-dom');
require('bootstrap/dist/css/bootstrap.min.css');
require('../assets/css/FarmCard.css')

const FarmCard = () => {
  const imgRef = useRef()
  const [imgSrc, setImgSrc] = useState(null)

  useEffect(() => {
    setImgSrc(FarmImage)
  }, []);

  return (
    <div className="container">
      <div className="card bg-gradient-light" style={{ width: '12rem', height: '7rem' }}>
        <div className="card-body">
          <div className="row">
            <div className="col-4">
              <img src={FarmImage} ref={setImgSrc} className="rounded mx-auto d-block" alt="..." style={{ width: '50px', height: '50px' }} />
            </div>
            <div className="col-8">
              <div className="row">
                <p className="fw-bold m-0">Farm Name</p>
                <p className="fw-normal m-0">Plant Name</p>
              </div>
            </div>
          </div>
          <div className="row">
            <p className="fw-light">Address</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmCard;