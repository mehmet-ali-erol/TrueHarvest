const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
        required: true,
    },
    farmowneremail: {
        required: true,
        type: String,
      },
    farmname: {
      required: false,
      type: String,
    },
    address: {
      required: false,
      type: String,
    },

    croptypes: {
      required: false,
      type: String,
    },

    sowtime: {
      required: false,
      type: Date,
    },

    expectedharvesttime: {
      required: false,
      type: Date,
    },

    coordinates: [{ type: [Number], required: true }],
  });

const Farm = mongoose.model('Farm', farmSchema);

module.exports = Farm;