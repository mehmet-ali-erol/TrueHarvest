const express = require('express');
const router = express.Router();
const Farm = require('../models/Farm');
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // Add this line to parse JSON in the request body

router.post('/registerfarm', async (req, res) => {
  const { coordinates, email } = req.body; // Corrected this line

  if (!coordinates || !Array.isArray(coordinates)) {
    return res.status(400).json({ error: 'Invalid coordinates format' });
  }

  try {
    // Create a new farm instance and save it to the database
    const newFarm = new Farm({ farmowneremail: email, coordinates });
    await newFarm.save();
    return res.status(201).json({ message: 'Farm created successfully', farm: newFarm });
  } catch (error) {
    console.error('Error creating farm:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/getfarms', async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const farms = await Farm.find({ farmowneremail: email }); 

    // Extract coordinates from farms and send only coordinates in the response
    const coordinatesArray = farms.map(farm => farm.coordinates);
    res.json(coordinatesArray);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;