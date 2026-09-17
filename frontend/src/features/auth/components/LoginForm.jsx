import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';

export const LoginForm = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { handleLogin } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin({ name: 'Rahul Sharma', email: credentials.email });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md border">
      <h3 className="text-xl font-bold text-gray-800">Login to Account</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email Address</label>
        <input
          type="email"
          required
          placeholder="student@college.edu"
          className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          required
          placeholder="••••••••"
          className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-medium transition"
      >
        Sign In
      </button>
    </form>
  );
};