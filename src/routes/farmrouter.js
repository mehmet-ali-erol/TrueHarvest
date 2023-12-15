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
    const { selectedFarm, data } = req.body;
    const objectId = new ObjectId(selectedFarm);

    const farm = await Farm.findOneAndUpdate(
      { '_id': objectId },
      { $push: { 'croptypes': data } },
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

router.post('/deletefarm', async (req, res) => {
  try {
    const { selectedFarm, data } = req.body;
    const objectId = new ObjectId(selectedFarm);

    // delete farm
    await Farm.deleteOne({ '_id': objectId });

    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

router.get('/getcroptypes', async (req, res) => {
  const { userEmail, selectedFarm } = req.query;
  const objectId = new ObjectId(selectedFarm);

  // Check if userEmail and selectedFarm are provided
  if (!userEmail || !selectedFarm) {
    return res.status(400).json({ error: 'Invalid request parameters' });
  }

  try {
    // Retrieve farm details based on userEmail and selectedFarm from MongoDB
    const farmDetails = await Farm.findOne({
      farmowneremail: userEmail,
      _id: objectId,
    });

    if (farmDetails && farmDetails.croptypes) {
      const croptypes = farmDetails.croptypes;
      return res.json({ croptypes });
    }

    return res.status(404).json({ error: 'Croptypes not found for the farm' });
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to delete a crop type
router.post('/deletecroptype', async (req, res) => {
  const { userEmail, selectedFarm, currentCropType } = req.body;
  const objectId = new ObjectId(selectedFarm);

    // Check if userEmail and selectedFarm are provided
    if (!userEmail || !selectedFarm || !currentCropType) {
      return res.status(400).json({ error: 'Invalid request parameters' });
    }

  try {
      // Retrieve farm details based on userEmail and selectedFarm from MongoDB
      const farm = await Farm.findOne({
        farmowneremail: userEmail,
        _id: objectId,
      });
    

    // Check if the farm and crop types exist
    if (farm && farm.croptypes) {
      const cropTypeIndex = farm.croptypes.indexOf(currentCropType);

      // Check if the crop type exists in the array
      if (cropTypeIndex !== -1) {
        // Remove the crop type from the array
        farm.croptypes.splice(cropTypeIndex, 1);

        // Save the updated farm with the removed crop type
        await farm.save();

        // Send success response
        return res.json({ success: true, farm });
      } else {
        // Crop type not found, send failure response
        return res.status(404).json({ success: false, error: 'Crop type not found' });
      }
    } else {
      // Farm or crop types not found, send failure response
      return res.status(404).json({ success: false, error: 'Farm or crop types not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
