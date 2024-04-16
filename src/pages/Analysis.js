import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { useUser } from '../UserContext';
import HeatMap from 'react-heatmap-grid';
import Chart from 'chart.js/auto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faChartBar, faChartPie } from '@fortawesome/free-solid-svg-icons';
import '../assets/css/Analysis.css'; // Make sure to adjust the path according to your project structure

const Analysis = () => {

  const [chartType, setChartType] = useState('line');
  const [view, setView] = useState('chart');
  const { selectedFarm } = useUser();
  const { userEmail } = useUser();
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  useEffect(() => {
    const initializeAnalysis = async () => {
      try {

        if (!userEmail || !selectedFarm) {
          // If userEmail or selectedFarm is not available, don't proceed with the fetch
          return;
        }

        console.log(userEmail, selectedFarm);

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
    // You'll need to provide your own data for the heatmap
    const xLabels = ['1', '2', '3'];
    const yLabels = ['A', 'B', 'C'];
    const data = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];

    return (
      <div>
        <HeatMap
          xLabels={xLabels}
          yLabels={yLabels}
          data={data}
        />
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
                Chart
              </button>

              <button
                className={`btn btn-lg ${view === 'prediction' ? 'btn-success' : 'btn-dark'}`}
                type="top-button"
                onClick={() => setView('prediction')}
              >
                Prediction
              </button>
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
                <h2>Chart Information</h2>
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