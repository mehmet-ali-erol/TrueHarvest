const React = require('react');
const { useEffect } = require('react');
const L = require('leaflet');
require('leaflet/dist/leaflet.css');
require('leaflet-draw/dist/leaflet.draw.css');
require('leaflet-draw');


const Map = () => {
  useEffect(() => {
    // OpenStreetMap
    const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });

    // Sentinel Hub WMS service
    const baseUrl = 'https://services.sentinel-hub.com/ogc/wms/8e927087-dcc3-4082-a0ea-96f67fff9809';
    const sentinelHub = L.tileLayer.wms(baseUrl, {
      tileSize: 512,
      attribution: '&copy; <a href="http://www.sentinel-hub.com/" target="_blank">Sentinel Hub</a>',
      urlProcessingApi: 'https://services.sentinel-hub.com/ogc/wms/1d4de4a3-2f50-493c-abd8-861dec3ae6b2',
      maxcc: 20,
      minZoom: 6,
      maxZoom: 9,
      preset: 'AGRICULTURE',
      layers: 'AGRICULTURE',
      time: '2023-06-01/2023-12-01',
    });

    const baseMaps = {
      'OpenStreetMap': osm,
    };
    const overlayMaps = {
      'Sentinel Hub WMS': sentinelHub,
    };

    const map = L.map('devTestingDemo', {
      center: [12.064837960671127, 8.485565185546875], // lat/lng in EPSG:4326
      zoom: 9,
      layers: [osm, sentinelHub],
    });

    L.control.layers(baseMaps, overlayMaps).addTo(map);

    // Add the draw control
    const drawControl = new L.Control.Draw({
      draw: {
        polygon: true,
        marker: false,
        circlemarker: false,
        polyline: false,
        rectangle: false,
        circle: false,
      },
      edit: {
        featureGroup: new L.FeatureGroup(),
        remove: true,
      },
    });
    map.addControl(drawControl);

    // Create a layer group for drawn polygons
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    // Handle drawn layers
    map.on('draw:created', async (event) => {
      const layer = event.layer;

      if (layer instanceof L.Polygon) {
        // Extract coordinates
        const coordinates = layer.getLatLngs()[0].map(point => [point.lat, point.lng]);

        // Display confirmation prompt
        const confirmed = window.confirm('Do you want to confirm the area of the drawn farm?');

        if (confirmed) {
          try {
            const response = await fetch('http://localhost:3002/maprouter/registerfarm', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ coordinates }),
            });

            if (response.ok) {
              console.log('Coordinates successfully sent to the server');
              drawnItems.addLayer(layer); // Add the confirmed layer to the drawnItems group
            } else {
              console.error('Failed to send coordinates to the server');
            }
          } catch (error) {
            console.error('Error sending coordinates:', error);
          }
        } else {
          // Remove the layer if not confirmed
          map.removeLayer(layer);
        }
      }
    });

    return () => {
      // Clean up when component unmounts
      map.remove();
    };
  }, []); // Empty dependency array ensures useEffect runs only once

  return (
    <div id="devTestingDemo" style={{ height: '100vh', width: '100%' }} />
  );
};

export default Map;