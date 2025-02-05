import cors from 'cors';
import { config as dotenvConfig } from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import path from 'path';
import { Room } from './models/Room';
import authRoutes from './routes/auth';
import chatRoutes from './routes/chat';
import initializeSocket from './socket';

dotenvConfig({ path: path.join(__dirname, '../../../.env') });

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';

const httpServer = createServer(app);

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, '../../../client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../client/dist', 'index.html'));
});

const io = initializeSocket(httpServer);

const predefinedRooms = [
  'General',
  'DevOps',
  'Full Stack Development',
  'Data Science',
  'Machine Learning',
  'Cyber Security',
  'Capstone',
  'Mobile Development',
  'Data Structures and Algorithms'
];

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const existingRooms = await Room.find({}, 'name');
    const existingRoomNames = existingRooms.map((room) => room.name);

    for (const roomName of predefinedRooms) {
      if (!existingRoomNames.includes(roomName)) {
        await Room.create({ name: roomName });
      }
    }

    httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
})();
