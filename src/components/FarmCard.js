import React, { useState, useRef, useEffect } from 'react';
import { Container, Image } from 'react-bootstrap';
import FarmImage from '../assets/img/field_img.jpg';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import '../assets/css/FarmCard.css';
import L from 'leaflet';
import { polygon as turfPolygon } from '@turf/turf';
import center from '@turf/center';

const FarmCard = ({ farm, flyToFarmLocation  }) => {
  const imgRef = useRef();
  const [imgSrc, setImgSrc] = useState(null);
  const navigate = useNavigate();
  const { setSelectedFarm } = useUser();
  const mapContainer = useRef(null);

  const handleFarmSelect = () => {
    setSelectedFarm(farm._id);
    flyToFarmLocation(farm.coordinates);
  };


  useEffect(() => {
    const initializeMap = async () => {
      try {
        const farmPolygon = turfPolygon([farm.coordinates]);
        const farmCenter = center(farmPolygon).geometry.coordinates.reverse();

        const map = L.map(mapContainer.current, {
          center: farmCenter,
          zoom: 13,
          zoomControl: false,
          attributionControl: false,
          layers: [
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png', {
              maxZoom: 18,
              minZoom: 2,
            }),
          ],
          dragging: false,
          touchZoom: false,
          doubleClickZoom: false,
          scrollWheelZoom: false,
          boxZoom: false,
          keyboard: false,
        });

        L.polygon(farm.coordinates, { color: 'red' }).addTo(map);
        map.fitBounds(L.polygon(farm.coordinates).getBounds());

        return () => {
          map.remove();
        };
      } catch (error) {
      }
    };
    initializeMap();
  }, []);

  return (
    <div className="container" onClick={handleFarmSelect}>
      <div className="card bg-gradient-light" style={{ width: '250px', height: '100px' }}>
        <div className="card-body">
          <div className="row">
            <div className="col-4">
              <Container className="map-container2" ref={mapContainer} />
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
