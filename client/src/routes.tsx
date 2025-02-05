import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to='/login' />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
