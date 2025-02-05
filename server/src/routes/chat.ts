import express from 'express';
import { Message } from '../models/Message';
import { Room } from '../models/Room';

const router = express.Router();

// Get all rooms
router.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rooms', error });
  }
});

// Get messages for a specific room
router.get('/messages/:room', async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.room }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error });
  }
});

// Send a message
router.post('/messages', async (req, res) => {
  try {
    const { room, username, message } = req.body;
    const newMessage = new Message({ room, username, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error });
  }
});

export default router;
