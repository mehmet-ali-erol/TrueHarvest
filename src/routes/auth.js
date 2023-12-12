const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the username already exists in the database
    const existingUser = await User.findOne({ username });
    console.log
    if (existingUser) {
      res.status(400).json({ error: 'Username already exists.' });
    }

    // Create a new user
    const newUser = new User({
      username,
      email,
      password,
    });

    // Save the user to the database
    await newUser.save();

    res.json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user with the provided email
    const user = await User.findOne({ email });

    if (user && user.password === password) {
      // Authentication successful
      res.status(200).json({ message: 'Authentication successful' });
    } else {
      // Authentication failed
      res.status(401).json({ message: 'Authentication failed' });
    }
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;