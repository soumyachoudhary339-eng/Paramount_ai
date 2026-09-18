import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const DashboardIcon = ({ active }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3.5" y="12" width="4" height="8.5" rx="1" stroke={active ? '#4F46E5' : '#9295B8'} strokeWidth="1.6" />
    <rect x="10" y="7" width="4" height="13.5" rx="1" stroke={active ? '#4F46E5' : '#9295B8'} strokeWidth="1.6" />
    <rect x="16.5" y="3.5" width="4" height="17" rx="1" stroke={active ? '#4F46E5' : '#9295B8'} strokeWidth="1.6" />
  </svg>
);

const RouteIcon = ({ active }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="6" cy="6" r="2.3" stroke={active ? '#4F46E5' : '#9295B8'} strokeWidth="1.6" />
    <circle cx="18" cy="18" r="2.3" stroke={active ? '#4F46E5' : '#9295B8'} strokeWidth="1.6" />
    <path
      d="M8 7c0 4 2 5 5 5h1c2 0 3 1 3 3.5"
      stroke={active ? '#4F46E5' : '#9295B8'}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const SearchIcon = ({ active }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="10.5" cy="10.5" r="6.5" stroke={active ? '#4F46E5' : '#9295B8'} strokeWidth="1.6" />
    <path d="M19 19l-4.3-4.3" stroke={active ? '#4F46E5' : '#9295B8'} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const DocIcon = ({ active }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M7 3h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"
      stroke={active ? '#4F46E5' : '#9295B8'}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M14 3v5h5" stroke={active ? '#4F46E5' : '#9295B8'} strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

export const Sidebar = ({ degree }) => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', Icon: DashboardIcon },
    { label: 'Career Roadmap', path: '/roadmap', Icon: RouteIcon },
    { label: 'Resume Analyzer', path: '/resume-analyzer', Icon: SearchIcon },
    { label: 'Resume Builder', path: '/resume-maker', Icon: DocIcon },
  ];

  return (
    <aside
      className="w-64 bg-white min-h-screen flex flex-col justify-between p-4"
      style={{ borderRight: '1px solid #E7E8F5' }}
    >
      <div>
        <Link
          to="/dashboard"
          className="flex items-center gap-2.5 px-2 py-3 mb-6 border-b transition-opacity hover:opacity-80"
          style={{ borderColor: '#EEEFF7' }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C6EF6)', boxShadow: '0 2px 8px rgba(79,70,229,0.25)' }}
          >
            CF
          </div>
          <span className="font-bold text-sm tracking-tight" style={{ color: '#1B1F3B' }}>
            AI Career Platform
          </span>
        </Link>

        <nav className="space-y-1">
          {navItems.map(({ label, path, Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  isActive ? 'font-semibold' : ''
                }`
              }
              style={({ isActive }) => ({
                background: isActive ? '#EEF0FD' : 'transparent',
                color: isActive ? '#4F46E5' : '#5B6178',
              })}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[3px] rounded-full"
                      style={{ background: '#4F46E5' }}
                      aria-hidden="true"
                    />
                  )}
                  <Icon active={isActive} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {degree && (
        <div className="p-3 rounded-2xl" style={{ background: '#F8F8FD', border: '1px solid #E7E8F5' }}>
          <p className="text-[10px] font-semibold" style={{ color: '#9295B8' }}>
            Active track
          </p>
          <p className="text-xs font-semibold truncate mt-0.5" style={{ color: '#1B1F3B' }}>
            {degree}
          </p>
        </div>
      )}
    </aside>
  );
};