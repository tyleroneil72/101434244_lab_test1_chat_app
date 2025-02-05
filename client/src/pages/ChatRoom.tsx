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

const ChatRoom = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string>('General');
  const [newMessage, setNewMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`/api/chat/rooms/${user.username}`);
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, [user.username]);

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

  const handleStartDM = async (otherUser: string) => {
    if (otherUser === user.username) return; // Prevent self-DM

    try {
      const response = await fetch('/api/chat/dm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user1: user.username, user2: otherUser })
      });

      const dmRoom = await response.json();
      setCurrentRoom(dmRoom.name);
    } catch (error) {
      console.error('Error creating DM:', error);
    }
  };

  const getRoomDisplayName = (roomName: string) => {
    if (!roomName.startsWith('DM_')) return roomName;

    const users = roomName.replace('DM_', '').split('_');
    const otherUser = users.find((username) => username !== user.username);

    return otherUser ? `${otherUser} (DM)` : 'Direct Message';
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
              {getRoomDisplayName(room.name)}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div className='flex w-3/4 flex-col'>
        <div className='flex justify-between bg-white p-4 shadow-md'>
          <h2 className='text-lg font-bold text-indigo-600'>Room: {getRoomDisplayName(currentRoom)}</h2>
          <button onClick={logout} className='rounded-lg bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600'>
            Logout
          </button>
        </div>

        {/* Messages */}
        <div className='flex-1 space-y-3 overflow-y-auto p-4'>
          {messages.map((msg) => {
            const isUserMessage = msg.username === user.username;
            const formattedTime = new Date(msg.timestamp).toLocaleString();

            return (
              <div key={msg._id} className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs rounded-lg p-3 shadow-md md:max-w-sm lg:max-w-md ${
                    isUserMessage ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-black'
                  }`}
                >
                  <div
                    className='cursor-pointer text-sm font-semibold hover:underline'
                    onClick={() => handleStartDM(msg.username)}
                  >
                    {msg.username}
                  </div>
                  <div className='text-md'>{msg.message}</div>
                  <div className={`mt-1 text-xs ${isUserMessage ? 'text-gray-300' : 'text-gray-700'}`}>
                    {formattedTime}
                  </div>
                </div>
              </div>
            );
          })}
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

export default ChatRoom;
