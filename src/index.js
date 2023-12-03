import AppRouter from './components/AppRouter';
const React = require('react');
const ReactDOM = require('react-dom/client');
require('./index.css');

// Importing the Bootstrap CSS
require('bootstrap/dist/css/bootstrap.min.css');


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);

