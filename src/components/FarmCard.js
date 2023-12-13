import React, { useState, useRef, useEffect } from 'react';
import { Container, Image } from 'react-bootstrap';
import FarmImage from '../assets/img/field_img.jpg';
import '../assets/css/FarmCard.css';

const FarmCard = ({ farm }) => {
  const imgRef = useRef();
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    setImgSrc(FarmImage);
  }, []);

  return (
    <div className="container">
      <div className="card bg-gradient-light" style={{ width: '12rem', height: 'auto' }}>
        <div className="card-body">
          <div className="row">
            <div className="col-4">
              <Image src={FarmImage} ref={imgRef} className="rounded mx-auto d-block" alt="Farm" style={{ width: '50px', height: '50px' }} />
            </div>
            <div className="col-12 col-md-8">
              <div className="row">
                <p className="fw-bold m-0">{farm.farmname || 'Unnamed Farm'}</p>
                {/* <p className="fw-normal m-0">{farm.plantName}</p> */}
              </div>
            </div>
          </div>
          <div className="row">
            {/* <p className="fw-light">{farm.address}</p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmCard;
