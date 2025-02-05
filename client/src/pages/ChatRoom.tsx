import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../utils/Socket';

interface Room {
  _id: string;
  name: string;
}

interface Message {
  _id: string;
  room: string;
  username: string;
  message: string;
  timestamp: string;
}

const Chatroom = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string>('General');
  const [newMessage, setNewMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/chat/rooms');
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const fetchMessages = async (room: string) => {
    try {
      const response = await fetch(`/api/chat/messages/${room}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const joinAndFetchMessages = useCallback(() => {
    socket.emit('joinRoom', currentRoom);
    fetchMessages(currentRoom);
  }, [currentRoom]);

  useEffect(() => {
    joinAndFetchMessages();

    const messageListener = (message: Message) => {
      setMessages((prev) => [...prev, { ...message, timestamp: message.timestamp || new Date().toISOString() }]);
    };

    socket.off('receiveMessage', messageListener);
    socket.on('receiveMessage', messageListener);

    return () => {
      socket.off('receiveMessage', messageListener);
    };
  }, [currentRoom, joinAndFetchMessages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData: Message = {
      _id: Date.now().toString(),
      room: currentRoom,
      username: user.username,
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    socket.emit('sendMessage', messageData);
    setNewMessage('');
  };

  const logout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Sidebar */}
      <div className='w-1/4 bg-indigo-600 p-4 text-white'>
        <h2 className='text-lg font-bold'>Rooms</h2>
        <ul>
          {rooms.map((room) => (
            <li
              key={room._id}
              onClick={() => setCurrentRoom(room.name)}
              className={`mt-2 cursor-pointer rounded-lg p-2 ${
                currentRoom === room.name ? 'bg-indigo-400' : 'hover:bg-indigo-500'
              }`}
            >
              {room.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div className='flex w-3/4 flex-col'>
        <div className='flex justify-between bg-white p-4 shadow-md'>
          <h2 className='text-lg font-bold text-indigo-600'>Room: {currentRoom}</h2>
          <button onClick={logout} className='rounded-lg bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600'>
            Logout
          </button>
        </div>

        {/* Messages */}
        <div className='flex-1 overflow-y-auto p-4'>
          {messages.map((msg) => (
            <div key={msg._id} className='mb-2'>
              <span className='font-bold text-indigo-600'>{msg.username}: </span>
              {msg.message}
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className='flex bg-white p-4 shadow-md'>
          <input
            type='text'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder='Type a message...'
            className='flex-1 rounded-lg border p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
          />
          <button
            onClick={sendMessage}
            className='ml-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700'
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatroom;
