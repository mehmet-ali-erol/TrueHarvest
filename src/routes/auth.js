const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the username already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'E-mail already exists.' });
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

router.post('/change-password', async (req, res) => {
  try {
    const { userEmail, password } = req.body;

    // Find the user with the provided email
    const user = await User.findOne({ email: userEmail });

    // Update the password
    user.password = password;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error during password change:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint for changing username
router.post('/change-username', async (req, res) => {
  try {
    const { userEmail, userName } = req.body;

    // Find the user with the provided email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      // User not found
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the username
    user.username = userName;
    await user.save();

    res.json({ message: 'Username changed successfully' });
  } catch (error) {
    console.error('Error during username change:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;