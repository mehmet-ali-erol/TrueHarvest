// server.js

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const authRoutes = require('./src/routes/auth');
const mapRoutes = require('./src/routes/maprouter');
const farmRoutes = require('./src/routes/farmrouter');

const app = express();
app.use(morgan('combined'));
const port = 3002;

// Enable CORS
app.use(cors());
app.use(express.json());

// Connect to MongoDB or Amazon DocumentDB
mongoose.connect('mongodb://localhost:27017/harvesters', {
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


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
