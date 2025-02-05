import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Login successful!');
        navigate('/chat');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      alert('An error occurred');
      console.error(error);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100'>
      <form onSubmit={handleSubmit} className='w-80 rounded-lg bg-white p-6 shadow-lg'>
        <h2 className='mb-4 text-center text-xl font-bold'>Login</h2>
        <Input label='Username' name='username' onChange={handleChange} required />
        <Input label='Password' name='password' type='password' onChange={handleChange} required />
        <Button type='submit' className='mt-4 w-full'>
          Login
        </Button>
        <p className='mt-4 text-center text-sm'>
          Don't have an account?{' '}
          <span className='cursor-pointer text-indigo-600' onClick={() => navigate('/signup')}>
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
