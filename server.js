// server.js

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const authRoutes = require('./src/routes/auth');
const mapRoutes = require('./src/routes/maprouter');
const farmRoutes = require('./src/routes/farmrouter');


//location controllers
const fetchCitiesController = require('./src/controllers/fetchCitiesController');
const fetchLocationByPointController = require('./src/controllers/fetchLocationByPointController');
const fetchDistrictsController = require('./src/controllers/fetchDistrictsController');
const fetchNeighborhoodsController = require('./src/controllers/fetchNeighborhoodsController');
const fetchParcelController = require('./src/controllers/fetchParcelController');


const app = express();
app.use(morgan('combined'));
const port = 3002;

// Enable CORS
app.use(cors());
app.use(express.json());

// Connect to MongoDB or Amazon DocumentDB
mongoose.connect('mongodb+srv://deniz:harvester@cluster0.swcbnj3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to the database');
});

// Use the API routes
app.use('/auth', authRoutes);
app.use('/maprouter', mapRoutes);
app.use('/farmrouter', farmRoutes);
app.get('/fetchCities', fetchCitiesController.fetchCities);
app.get('/fetchLocationByPoint/:lat/:lng', fetchLocationByPointController.fetchLocationByPoint);
app.get('/fetchDistricts/:cityId', fetchDistrictsController.fetchDistricts);
app.get('/fetchNeighborhoods/:districtId', fetchNeighborhoodsController.fetchNeighborhoods);
app.get('/fetchParcel/:neighbourhoodId/:landId/:parcelId', fetchParcelController.fetchParcel);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
