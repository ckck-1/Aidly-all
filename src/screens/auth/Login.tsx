
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../../store/features/authSlice';
import { loginWithEmailPassword } from '../../services/authService';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    dispatch(loginStart());
    
    try {
      const user = await loginWithEmailPassword(email, password);
      dispatch(loginSuccess(user));
      localStorage.setItem('user', JSON.stringify(user));
      
      // Check if user has a language set
      if (!user.language) {
        navigate('/language');
      } else {
        navigate('/');
      }
      
      toast.success('Login successful');
    } catch (error) {
      dispatch(loginFailure(error instanceof Error ? error.message : 'Login failed'));
      toast.error(error instanceof Error ? error.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-50">
      <div className="w-full max-w-md text-center mb-8">
        <h1 className="text-4xl font-bold aidly-gradient-text mb-2">AIDLY</h1>
        <p className="text-gray-600">Your AI Health Assistant</p>
      </div>
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">Welcome Back</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-aidly-red focus:border-aidly-red"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-aidly-red focus:border-aidly-red"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full py-2 px-4 aidly-gradient rounded-lg text-white font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-aidly-red font-medium">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
