import React from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from './components/LoginForm';

export const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <div className="md:w-1/2 bg-blue-600 text-white flex flex-col justify-center p-8 md:p-12">
        <div className="max-w-md mx-auto space-y-4">
          <span className="bg-blue-500 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Viksit Bharat 2047 Initiative
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
            AI-Powered Career Readiness & Employability Platform
          </h1>
          <p className="text-blue-100">
            Bridge campus learning to corporate readiness with custom AI roadmaps, instant ATS resume analysis, and dynamic skill tracking.
          </p>
        </div>
      </div>

      <div className="md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <LoginForm />
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Register & Set Career Goal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};