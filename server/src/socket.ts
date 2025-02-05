import { Server } from 'socket.io';
import { Message } from './models/Message';

const initializeSocket = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinRoom', (room) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });

    socket.on('sendMessage', async (data) => {
      const { room, username, message } = data;
      const newMessage = new Message({ room, username, message });

      await newMessage.save();
      io.to(room).emit('receiveMessage', newMessage);
    });

    socket.on('typing', ({ room, username }) => {
      socket.to(room).emit('userTyping', username);
    });

    socket.on('stopTyping', ({ room }) => {
      socket.to(room).emit('userStoppedTyping');
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

export default initializeSocket;
