const express = require('express');
const router = express.Router();
const Farm = require('../models/Farm');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');

router.use(bodyParser.json());

router.get('/getfarmdetails', async (req, res) => {
    const { userEmail, selectedFarm } = req.query;
    const objectId = new ObjectId(selectedFarm);

    // Check if userEmail and selectedFarm are provided
    if (!userEmail || !selectedFarm) {
      return res.status(400).json({ error: 'Invalid request parameters' });
    }
    console.log(selectedFarm);
  
    try {
      // Retrieve farm details based on userEmail and selectedFarm from MongoDB
      const farmDetails = await Farm.findOne({
        farmowneremail: userEmail,
        _id: objectId,
      });
  
      if (farmDetails) {
        return res.json(farmDetails);
      }
  
      return res.status(404).json({ error: 'Farm details not found' });
    } catch (error) {
      console.error('Error:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/savefarmname', async (req, res) => {
    try {
      const { selectedFarm, data } = req.body;
      const objectId = new ObjectId(selectedFarm);
  
      const farm = await Farm.findOneAndUpdate(
        { '_id': objectId }, 
        { $set: { 'farmname': data } }, 
      );
  
      res.json({ success: true, farm });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });

router.post('/savefarmaddress', async (req, res) => {
    try {
        const { selectedFarm, data } = req.body;
        const objectId = new ObjectId(selectedFarm);
    
        const farm = await Farm.findOneAndUpdate(
          { '_id': objectId }, 
          { $set: { 'address': data } }, 
        );
    
        res.json({ success: true, farm });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      }
    });

router.post('/addcroptype', async (req, res) => {
  try {
    const { selectedFarm, cropType } = req.body;

    const coordsArray = selectedFarm.split(',').map(Number);

    // Group the coordinates into pairs
    const coordinates = [];
    for (let i = 0; i < coordsArray.length; i += 2) {
      coordinates.push([coordsArray[i], coordsArray[i + 1]]);
    }

    const farm = await Farm.findOneAndUpdate(
      { 'coordinates': { $eq: coordinates } },
      { $push: { cropTypes: cropType } },
      { new: true }
    );

    res.json({ success: true, farm });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

router.post('/savesowtime', async (req, res) => {
    try {
        const { selectedFarm, data } = req.body;
        const objectId = new ObjectId(selectedFarm);
    
        const farm = await Farm.findOneAndUpdate(
          { '_id': objectId }, 
          { $set: { 'sowtime': data } }, 
        );
    
        res.json({ success: true, farm });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      }
    });

router.post('/saveexpectedharvesttime', async (req, res) => {
    try {
        const { selectedFarm, data } = req.body;
        const objectId = new ObjectId(selectedFarm);
    
        const farm = await Farm.findOneAndUpdate(
          { '_id': objectId }, 
          { $set: { 'expectedharvesttime': data } }, 
        );
    
        res.json({ success: true, farm });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      }
    });
module.exports = router;
