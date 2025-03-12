# Chat Room App

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![ESLint](https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E)

## Description
The app includes a working signup page where usernames must be unique and checked against the database. Users can log in and log out with session management handled via Local Storage. MongoDB enforces proper validation on all schemas to prevent crashes. Users can join and leave chat rooms by selecting them from the sidebar. A typing indicator is implemented for one-on-one messaging. All chat messages are stored and persisted in MongoDB.

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

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any inquiries or questions, you can reach me at tyleroneildev@gmail.com
or on my linkedin at https://ca.linkedin.com/in/tyler-oneil-dev
