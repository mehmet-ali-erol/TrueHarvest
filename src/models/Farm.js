const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
    farmowner: {
        required: true,
        type: String,
      },
    coordinates: [{ type: [Number], required: true }],
  });

const Farm = mongoose.model('Farm', farmSchema);

module.exports = Farm;