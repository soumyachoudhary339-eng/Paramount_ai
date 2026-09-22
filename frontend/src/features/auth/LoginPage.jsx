import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUserApi } from '../../api/authService';
import { loginUser } from '../auth/authSlice';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await loginUserApi(formData);
      console.log("Backend Response:", data); 
      
      const token = data.token || data.accessToken;
      if (token) {
        localStorage.setItem('token', token);
      }

      dispatch(loginUser(data));
      navigate('/dashboard', { replace: true });

    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Side: Branding & Visual Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(168,85,247,0.15),_transparent_50%)]"></div>
        
        {/* Logo Container Fix */}
        <div className="flex flex-col z-10">
          <div className="flex items-center gap-2">
            <img 
              src="/paramount_ai_logo.png" 
              alt="Paramount AI Logo" 
              className="w-9 h-9 object-contain shrink-0" 
            />
            <span className="text-xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-600">
              PARAMOUNT AI
            </span>
          </div>
          <span className="text-xs ml-10 font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mt-0.5">
            Career Platform
          </span>
        </div>

        <div className="my-auto max-w-lg z-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">
            Accelerate your career with AI-powered guidance.
          </h1>
          <p className="text-purple-200 text-base leading-relaxed">
            Analyze your resume, track skill gaps, and follow customized step-by-step career roadmaps tailored specifically for your target role.
          </p>
        </div>

        <div className="text-xs text-purple-300 font-medium z-10">
          Better Skills → Bigger Opportunities
        </div>
      </div>

      {/* Right Side: Login Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md">
          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-sm text-gray-500 mt-1">Please enter your details to sign in.</p>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200 disabled:opacity-50 cursor-pointer shadow-md shadow-purple-200"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-purple-600 font-semibold hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;