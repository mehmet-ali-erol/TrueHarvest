import React, { useState, useRef, useEffect } from 'react';
import { Container, Image } from 'react-bootstrap';
import FarmImage from '../assets/img/field_img.jpg';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import '../assets/css/FarmCard.css';

const FarmCard = ({ farm }) => {
  const imgRef = useRef();
  const [imgSrc, setImgSrc] = useState(null);
  const navigate = useNavigate();
  const { setSelectedFarm } = useUser();

  const handleFarmSelect = () => {
    setSelectedFarm(farm._id);
    navigate('/farm');
  };

  useEffect(() => {
    setImgSrc(FarmImage);
  }, []);

  return (
    <div className="container" onClick={handleFarmSelect}>
      <div className="card bg-gradient-light" style={{ width: '250px', height: '100px' }}>
        <div className="card-body">
          <div className="row">
            <div className="col-4">
              <Image src={FarmImage} ref={imgRef} className="rounded mx-auto d-block" alt="Farm" style={{ width: '70px', height: '70px' }} />
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
