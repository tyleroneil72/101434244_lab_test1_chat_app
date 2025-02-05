# Lab Test One

101434244, Tyler O'Neil

1. GiHub Repo
   Git used with useful commit log, proper headings (chore, feature, etc)
2. Working Signup Page
   Username must be unique checked from database
3. Working Login/Logout
   Using Local Storage for session
4. MongoDB Validation
   Proper validation on all schemas, cannot crash
5. Room Join/Leave
   You can join and leave rooms by selecting them from the sidebar
6. Typing Indicator
   Typing indicator works on 1-1 messaging
7. Chat Functionality with MongoDB Storage
   All messages are persisted in Mongo

## Example

<img width="1496" alt="Chat side by side" src="https://github.com/user-attachments/assets/de6e49da-4ddb-40d6-80b5-42c370671614" />

## To Run Locally

1. Create .env file in root with Mongo Database and PORT

```dotenv
MONGO_URI=mongodb://admin:adminpassword@localhost:27017/chat-room?authSource=admin
PORT=3000
```

2. run build in root

```bash
npm run build
```

3. Run start in root

```bash
npm run start
```
