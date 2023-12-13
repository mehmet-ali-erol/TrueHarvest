const express = require('express');
const router = express.Router();
const Farm = require('../models/Farm');
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // Add this line to parse JSON in the request body

router.post('/registerfarm', async (req, res) => {
  const { coordinates, email } = req.body;

  if (!coordinates || !Array.isArray(coordinates)) {
    return res.status(400).json({ error: 'Invalid coordinates format' });
  }

  try {
    // Retrieve the count of farms owned by the user
    const userFarmCount = await Farm.countDocuments({ farmowneremail: email });

    // Generate the farm name based on the count
    const farmName = `Farm ${userFarmCount + 1}`;

    // Create a new farm instance and save it to the database
    const newFarm = new Farm({ farmowneremail: email, coordinates, farmname: farmName });
    await newFarm.save();

    // Include the farm ID and name in the response
    return res.status(201).json({ message: 'Farm created successfully', id: newFarm._id, name: farmName });
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
    res.json(farms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;