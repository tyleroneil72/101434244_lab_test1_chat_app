import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ChatRoom from './pages/ChatRoom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to='/login' />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/chat' element={<ChatRoom />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
