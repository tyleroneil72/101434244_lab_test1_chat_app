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

router.get('/rooms/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const rooms = await Room.find({
      $or: [
        { name: { $not: /^DM_/ } }, // Public rooms
        { name: new RegExp(`DM_${username}_|DM_.*_${username}`) } // DMs that include this user
      ]
    });

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

router.post('/dm', async (req, res) => {
  try {
    const { user1, user2 } = req.body;

    const roomName = `DM_${[user1, user2].sort().join('_')}`;

    let room = await Room.findOne({ name: roomName });

    if (!room) {
      room = new Room({ name: roomName });
      await room.save();
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Error creating DM room', error });
  }
});

export default router;
