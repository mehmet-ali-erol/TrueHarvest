import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { Line, Bar, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faChartBar, faChartPie } from '@fortawesome/free-solid-svg-icons';
import '../assets/css/Analysis.css'; // Make sure to adjust the path according to your project structure

const Analysis = () => {

  const [chartType, setChartType] = useState('line');
  const [view, setView] = useState('chart');

  // Sample data for the line charts
  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [10, 25, 45, 30, 50],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };


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

  const renderContent = () => {
    switch (view) {
      case 'chart':
        return renderChart();
      case 'analysis':
        // Render nothing for now
        return null;
      default:
        return renderChart();
    }
  }


  return (
    <div className="container-fluid m-0 p-0 flex-column">
      <Header />
      <div className="content d-flex">
        <div className='container'>
          <div className="row mt-2">
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <Link to="/farm">
              <button
                className={`btn btn-lg me-md-2 ${view === 'analysis' ? 'btn-success' : 'btn-dark'}`}
                type="button"
                onClick={() => setView('analysis')}
              >
                Analysis
              </button>
              </Link>
              <button
                className={`btn btn-lg ${view === 'chart' ? 'btn-success' : 'btn-dark'}`}
                type="button"
                onClick={() => setView('chart')}
              >
                Chart
              </button>
            </div>

          </div>

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
              <div className="btn-group" role="group" aria-label="Button group">
                <button className="btn btn-success" type="button">
                  NDVI
                </button>
                <button className="btn btn-dark" type="button">
                  NDWI
                </button>
                <button className="btn btn-dark" type="button">
                  NDMI
                </button>
              </div>

            </div>
          </div>

          <div className="row mt-4 justify-content-center">
            {/* Add two Line charts side by side */}
            <div className="col-md-6">
              {renderContent()}
            </div>
            <div className="col-md-6">
              {renderContent()}
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
