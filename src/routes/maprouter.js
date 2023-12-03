const express = require('express');
const router = express.Router();
const Farm = require('../models/Farm');
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // Add this line to parse JSON in the request body

router.post('/registerfarm', async (req, res) => {
    const { coordinates } = req.body;
    console.log(coordinates);

    if (!coordinates || !Array.isArray(coordinates)) {
      return res.status(400).json({ error: 'Invalid coordinates format' });
    }
  
    try {
      // Create a new farm instance and save it to the database
      const newFarm = new Farm({ coordinates });
      await newFarm.save();
  
      return res.status(201).json({ message: 'Farm created successfully', farm: newFarm });
    } catch (error) {
      console.error('Error creating farm:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router

