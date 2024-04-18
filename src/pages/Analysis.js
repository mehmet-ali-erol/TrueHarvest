import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { useUser } from '../UserContext';
import HeatMap from 'react-heatmap-grid';
import Chart from 'chart.js/auto';
import { scaleLinear } from 'd3-scale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faChartBar, faChartPie } from '@fortawesome/free-solid-svg-icons';
import { Spin } from 'antd'; // Assuming you're using Ant Design for UI components

import '../assets/css/Analysis.css'; // Make sure to adjust the path according to your project structure

const Analysis = () => {

  const [chartType, setChartType] = useState('line');
  const [view, setView] = useState('chart');
  const { selectedFarm } = useUser();
  const { userEmail } = useUser();
  const chartRef = useRef(null);
  const [farmCoordinates, setFarmCoordinates] = useState();
  const [predictionData, setPredictionData] = useState();
  const [chartData, setChartData] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  useEffect(() => {
    const initializeAnalysis = async () => {
      try {

        if (!userEmail || !selectedFarm) {
          // If userEmail or selectedFarm is not available, don't proceed with the fetch
          return;
        }
        // Fetch farm details based on userEmail and selectedFarm
        const response = await fetch(`http://localhost:3002/farmrouter/getfarmdetails?userEmail=${userEmail}&selectedFarm=${selectedFarm}`);

        if (!response.ok) {
          throw new Error(`Request failed with status: ${response.status}`);
        }

        const farmDetails = await response.json();
        setFarmCoordinates(farmDetails.coordinates);

        // Fetch NDVI values from /getNdviValues endpoint
        const ndviResponse = await fetch(`http://localhost:3002/farmrouter/getNdviValues?userEmail=${userEmail}&selectedFarm=${selectedFarm}`);

        if (!ndviResponse.ok) {
          throw new Error(`Request failed with status: ${ndviResponse.status}`);
        }

        const ndviData = await ndviResponse.json();
        if (ndviData && Array.isArray(ndviData.ndviData)) {
          // Update chartData using the setChartData function
          setChartData({
            labels: ndviData.ndviData.map(data => monthNames[data.month - 1]),
            datasets: [
              {
                label: 'NDVI',
                data: ndviData.ndviData.map(data => data.mean),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
              },
            ],
          });
        }
        const labels = ndviData.ndviData.map(data => `Month ${data.month}`);
        console.log(chartData)
        console.log(labels);
        setDataLoaded(true);

      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    initializeAnalysis();
  }, []);


  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <div className="chart-container"><Line data={chartData} /></div>;
      case 'bar':
        return <div className="chart-container"><Bar data={chartData} /></div>;
      case 'pie':
        return <div className="chart-container"><Pie data={chartData} /></div>;
      default:
        return <div className="chart-container"><Line data={chartData} /></div>;
    }
  }


  const renderHeatmap = () => {
    if (isLoading) {
      return <Spin className= "spin-prediction" size="large"/>;
    }
    if (!farmCoordinates || !predictionData || !predictionData.prediction_rate) {
      return (
        <div>
          <HeatMap
            xLabels={['1', '2', '3']}
            yLabels={['A', 'B', 'C']}
            data={[[1, 2, 3], [4, 5, 6], [7, 8, 9]]}
          />
        </div>
      );
    }


    console.log("Selam")
    return (
      <div className="heatmap-container">
        <div className="heatmap-title">Latitude vs Longtitude Graph</div>
        <div className="heatmap-prediction">
          <HeatMap
            xLabels={farmCoordinates.map(coord => Number(coord[0]).toFixed(2))} // lat values
            yLabels={farmCoordinates.map(coord => Number(coord[1]).toFixed(2))} // lon values
            data={predictionData.prediction_rate}
            yLabelWidth={100} // Adjust label width to add space
            cellStyle={(background, value, min, max, data, x, y) => ({
              background: `rgba(${255 * (1 - (value - min) / (max - min))}, 255, 0, ${1 - (max - value) / (max - min)})`,
              fontSize: "11px",
            })}
            cellRender={(value) => value && `${value.toFixed(2)}`}
            title={(value, unit) => `${value}`}
            />
        </div>
      </div>
    );
  }


  const renderContent = () => {
    switch (view) {
      case 'chart':
        return renderChart();
      case 'analysis':
        // Render nothing for now
        return null;
      case 'prediction':
        return renderHeatmap();
      default:
        return renderChart();
    }
  }

  async function handlePrediction() {
    setIsLoading(true);
    // Fetch farm details based on userEmail and selectedFarm
    const response = await fetch(`http://localhost:3002/farmrouter/getfarmdetails?userEmail=${userEmail}&selectedFarm=${selectedFarm}`);

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    const farmDetails = await response.json();

    const sowingTime = farmDetails.sowtime;
    const harvestTime = farmDetails.expectedharvesttime;
    const coordinates = farmDetails.coordinates;

    const responsePrediction = await fetch('http://localhost:3002/farmrouter/getPrediction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sowingTime, harvestTime, coordinates }),
    });

    if (!responsePrediction.ok) {
      console.error('Failed to get prediction');
      return;
    }
    const prediction = await responsePrediction.json();
    setPredictionData(prediction);
    console.log('Prediction:', prediction);
    setIsLoading(false);
  }

  return (
    <div className="container-fluid m-0 p-0 flex-column">
      <Header />
      <div className="content-charts d-flex">
        <div className='container'>
          <div className="row mt-2">
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Link to="/farm">
                <button
                  className={`btn btn-lg me-md-2 ${view === 'analysis' ? 'btn-success' : 'btn-dark'}`}
                  type="top-button"
                  onClick={() => setView('analysis')}
                >
                  Information
                </button>
              </Link>
              <button
                className={`btn btn-lg ${view === 'chart' ? 'btn-success' : 'btn-dark'}`}
                type="top-button"
                onClick={() => setView('chart')}
              >
                Graph
              </button>

              <button
                className={`btn btn-lg ${view === 'prediction' ? 'btn-success' : 'btn-dark'}`}
                type="top-button"
                onClick={() => setView('prediction')}
              >
                Prediction
              </button>
            </div>
            <div className="row mt-2">
              <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                {view === 'prediction' && (
                  <div>
                    <button
                      className="btn btn-dark btn-lg btn-lg-text"
                      type="top-button"
                      onMouseOver={(e) => e.currentTarget.classList.replace('btn-dark', 'btn-success')}
                      onMouseOut={(e) => e.currentTarget.classList.replace('btn-success', 'btn-dark')}
                      onClick={handlePrediction}
                    >
                      Get Prediction
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {view !== 'prediction' && (
            <div className="row mt-4">
              <div className="d-flex justify-content-between">
                <div className="btn-group" role="group" aria-label="Button group">
                  <button
                    className={`btn ${chartType === 'line' ? 'btn-success' : 'btn-dark'}`}
                    type="button"
                    onClick={() => setChartType('line')}
                  >
                    <FontAwesomeIcon icon={faChartLine} />
                  </button>
                  <button
                    className={`btn ${chartType === 'bar' ? 'btn-success' : 'btn-dark'}`}
                    type="button"
                    onClick={() => setChartType('bar')}
                  >
                    <FontAwesomeIcon icon={faChartBar} />
                  </button>
                  <button
                    className={`btn ${chartType === 'pie' ? 'btn-success' : 'btn-dark'}`}
                    type="button"
                    onClick={() => setChartType('pie')}
                  >
                    <FontAwesomeIcon icon={faChartPie} />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="row mt-4 justify-content-center">
            {view !== 'prediction' && (
              <div className="col-md-6">
                {dataLoaded && renderContent()}
              </div>
            )}
            <div className="col-md-6">
              {dataLoaded && renderContent()}
            </div>
          </div>
          <div className="row mt-4 justify-content-center">
            {view === 'chart' && (
              <div className="text-center">
                <h2>Graph Information</h2>
                <div className="d-flex align-items-center">
                  <label className="me-3 ms-3">Match rate of charts:</label>
                  <div className="border rounded p-2" style={{ width: '80%', height: '30px' }}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

  );
};

export default Analysis;