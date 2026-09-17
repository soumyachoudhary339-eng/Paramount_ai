import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Top Navbar */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-blue-600">AI Career Platform</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">{user?.name || 'Student'}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 border border-red-200 px-3 py-1 rounded hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-65px)] p-4 space-y-2 hidden md:block">
          <Link to="/dashboard" className="block p-3 rounded hover:bg-blue-50 text-gray-700 font-medium">
            📊 Dashboard
          </Link>
          <Link to="/roadmap" className="block p-3 rounded hover:bg-blue-50 text-gray-700 font-medium">
            🗺️ Career Roadmap
          </Link>
          <Link to="/resume-analyzer" className="block p-3 rounded hover:bg-blue-50 text-gray-700 font-medium">
            🔍 Resume Analyzer
          </Link>
          <Link to="/resume-maker" className="block p-3 rounded hover:bg-blue-50 text-gray-700 font-medium">
            📝 Resume Builder
          </Link>
        </aside>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};