import bcrypt from 'bcryptjs';
import express from 'express';
import { User } from '../models/User';

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { firstname, lastname, username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: 'Username already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ firstname, lastname, username, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up', error });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    res.status(200).json({ message: 'Login successful', user: { username: user.username } });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

export default router;
