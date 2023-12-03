const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  email: {
    type: String,
  },
});
const User = mongoose.model('User', userSchema);

module.exports = User;