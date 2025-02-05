import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO API call
    console.log('Signing up...', formData);
    navigate('/chat');
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100'>
      <form onSubmit={handleSubmit} className='w-80 rounded-lg bg-white p-6 shadow-lg'>
        <h2 className='mb-4 text-center text-xl font-bold'>Sign Up</h2>
        <Input label='First Name' name='firstname' onChange={handleChange} required />
        <Input label='Last Name' name='lastname' onChange={handleChange} required />
        <Input label='Username' name='username' onChange={handleChange} required />
        <Input label='Password' name='password' type='password' onChange={handleChange} required />
        <Button type='submit' className='w-full'>
          Sign Up
        </Button>
        <p className='mt-4 text-center text-sm'>
          Already have an account?{' '}
          <span className='cursor-pointer text-indigo-600' onClick={() => navigate('/login')}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
