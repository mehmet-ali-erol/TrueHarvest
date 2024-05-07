const express = require('express');
const axios = require('axios');
const router = express.Router();
const instance = require('../sentinelHub.js'); // import the axios instance
const Farm = require('../models/Farm');
const evalscript_ndvi_monthly = require('../evalscript/evalscript_ndvi_monthly.js');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');


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
      { $set: { 'farmname': data } }
    );
    console.log(farm);
    return res.status(200);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
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

router.post('/statistics', async (req, res) => {
  const { sowingTime, harvestTime, coordinates } = req.body;
  const stats_request = {
    "input": {
      "bounds": {
        "geometry": {
          "type": "Polygon",
          "coordinates": [coordinates]
        },
        "properties": {
          "crs": "http://www.opengis.net/def/crs/EPSG/0/32633"
        }
      },
      "data": [
        {
          "type": "sentinel-2-l2a",
          "dataFilter": {
            "mosaickingOrder": "leastCC"
          }
        }
      ]
    },
    "aggregation": {
      "timeRange": {
        "from": sowingTime,
        "to": harvestTime
      },
      "aggregationInterval": {
        "of": "P1M"
      },
      "evalscript": evalscript_ndvi_monthly,
      "resx": 10,
      "resy": 10
    }
  };

  const url = "api/v1/statistics";
  instance.post(url, stats_request)
    .then(response => {
      if (response.data && response.data.data) {
        const results = response.data.data.map((item, index) => {
          if (item.outputs && item.outputs.data && item.outputs.data.bands && item.outputs.data.bands.monthly_max_ndvi && item.outputs.data.bands.monthly_max_ndvi.stats) {
            const date = new Date(item.interval.from);
            const month = date.getMonth() + 1; // getMonth is zero-based, so add 1 to get the correct month number
            console.log(month, ":", item.outputs.data.bands.monthly_max_ndvi.stats.mean)
            return {
              month: month,
              mean: item.outputs.data.bands.monthly_max_ndvi.stats.mean
            };
          } else {
            console.log(`Item ${index} does not have the expected structure.`);
            return null;
          }
        }).filter(result => result !== null); // Remove null items
        const dataObject = { ndviData: results };
        console.log(dataObject); // Log the results
        res.status(200).json(dataObject); // Return 200 status code with results
      } else {
        console.log('Response data does not have the expected structure.');
        res.status(404).send('Response data does not have the expected structure.'); // Return 404 status code
      }
    })
    .catch(error => {
      console.error('An error occurred:', error);
      res.status(500).send('An error occurred.'); // Return 500 status code
    });
});


// Endpoint to save NDVI values
router.post('/saveNdviValues', async (req, res) => {
  const { userEmail, selectedFarm, ndviData } = req.body;
  // Check if userEmail, selectedFarm, and ndviData are provided
  if (!userEmail || !selectedFarm || !ndviData) {
    return res.status(400).json({ error: 'Invalid request parameters' });
  }

  const objectId = new ObjectId(selectedFarm);

  try {
    // Update farm details with ndviData based on userEmail and selectedFarm
    const updatedFarm = await Farm.findOneAndUpdate(
      { farmowneremail: userEmail, _id: objectId },
      { $set: ndviData },
      { new: true }
    );
    if (!updatedFarm) {
      return res.status(404).json({ error: 'Farm not found' });
    }

    return res.json({ message: 'NDVI values saved successfully' });
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to get NDVI values
router.get('/getNdviValues', async (req, res) => {
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

    if (farmDetails && farmDetails.ndviData) {
      const ndviData = farmDetails.ndviData;
      return res.json({ ndviData });
    }

    return res.status(404).json({ error: 'NDVI values not found for the farm' });
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }

});

// Endpoint to update NDVI values
router.put('/updateNdviValues', async (req, res) => {
  const { userEmail, selectedFarm, ndviData } = req.body;

  // Check if userEmail, selectedFarm, and ndviData are provided
  if (!userEmail || !selectedFarm || !ndviData) {
    return res.status(400).json({ error: 'Invalid request parameters' });
  }

  const objectId = new ObjectId(selectedFarm);

  try {
    // Update farm details with ndviData based on userEmail and selectedFarm
    const updatedFarm = await Farm.findOneAndUpdate(
      { farmowneremail: userEmail, _id: objectId },
      { $set: { ndviData } },
      { new: true }
    );

    if (!updatedFarm) {
      return res.status(404).json({ error: 'Farm not found' });
    }

    return res.json({ message: 'NDVI values updated successfully' });
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to delete NDVI values
router.delete('/deleteNdviValues', async (req, res) => {
  const { userEmail, selectedFarm } = req.body;

  // Check if userEmail and selectedFarm are provided
  if (!userEmail || !selectedFarm) {
    return res.status(400).json({ error: 'Invalid request parameters' });
  }

  const objectId = new ObjectId(selectedFarm);

  try {
    // Update farm details with ndviData based on userEmail and selectedFarm
    const updatedFarm = await Farm.findOneAndUpdate(
      { farmowneremail: userEmail, _id: objectId },
      { $unset: { ndviData: 1 } },
      { new: true }
    );

    if (!updatedFarm) {
      return res.status(404).json({ error: 'Farm not found' });
    }

    return res.json({ message: 'NDVI values deleted successfully' });
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/getPrediction', async (req, res) => {
  const { sowingTime, harvestTime, coordinates } = req.body;

  // Calculate min_lat, max_lat, min_lon, and max_lon from coordinates
  const min_lat = Math.min(...coordinates.map(coord => coord[0]));
  const max_lat = Math.max(...coordinates.map(coord => coord[0]));
  const min_lon = Math.min(...coordinates.map(coord => coord[1]));
  const max_lon = Math.max(...coordinates.map(coord => coord[1]));
  console.log("sowingtime:", sowingTime, "harvesttime:" , harvestTime);

  // Construct the URL for the request
  const url = `http://localhost:8000/export-and-predict/?min_lon=${min_lon}&max_lon=${max_lon}&min_lat=${min_lat}&max_lat=${max_lat}&start_date=${sowingTime}&end_date=${harvestTime}`;

  try {
    // Send the GET request
    const response = await axios.get(url); 
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});



// Endpoint to save prediction data
router.post('/savePrediction', async (req, res) => {
  const { userEmail, selectedFarm, predData } = req.body;

  // Check if userEmail, selectedFarm, and predData are provided
  if (!userEmail || !selectedFarm || !predData) {
    return res.status(400).json({ error: 'Invalid request parameters' });
  }

  const objectId = new ObjectId(selectedFarm);

  try {
    // Update farm details with predData based on userEmail and selectedFarm
    const updatedFarm = await Farm.findOneAndUpdate(
      { farmowneremail: userEmail, _id: objectId },
      { $set: predData },
      { new: true }
    );

    if (!updatedFarm) {
      return res.status(404).json({ error: 'Farm not found' });
    }

    return res.json({ message: 'Prediction data saved successfully' });
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// Endpoint to delete prediction data
router.delete('/deletePredictionData', async (req, res) => {
  const { userEmail, selectedFarm } = req.body;

  // Check if userEmail and selectedFarm are provided
  if (!userEmail || !selectedFarm) {
    return res.status(400).json({ error: 'Invalid request parameters' });
  }

  const objectId = new ObjectId(selectedFarm);

  try {
    // Update farm details to remove predData based on userEmail and selectedFarm
    const updatedFarm = await Farm.findOneAndUpdate(
      { farmowneremail: userEmail, _id: objectId },
      { $unset: { predData: "" } },
      { new: true }
    );

    if (!updatedFarm) {
      return res.status(404).json({ error: 'Farm not found' });
    }

    return res.json({ message: 'Prediction data deleted successfully' });
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;