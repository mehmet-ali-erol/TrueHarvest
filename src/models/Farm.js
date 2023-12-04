const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
    farmowneremail: {
        required: true,
        type: String,
      },
    coordinates: [{ type: [Number], required: true }],
  });

const Farm = mongoose.model('Farm', farmSchema);

module.exports = Farm;