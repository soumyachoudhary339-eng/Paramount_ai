import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const TargetIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const getInitials = (label) => {
  if (!label) return '?';
  const parts = label.trim().split(/\s+/);
  const initials = parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0].slice(0, 2);
  return initials.toUpperCase();
};

export const TopHeader = ({ user, activeRole }) => {
  const { handleLogout, loading } = useAuth();
  const displayName = user?.name || user?.email || 'Student';

  return (
    <header
      className="h-16 bg-white px-6 flex items-center justify-between sticky top-0 z-10"
      style={{ borderBottom: '1px solid #E7E8F5' }}
    >
      <div>
        {activeRole && (
          <span
            className="flex items-center gap-1.5 w-fit text-xs px-3 py-1 rounded-full font-semibold"
            style={{ background: '#EEF0FD', color: '#4F46E5', border: '1px solid #C7C9F5' }}
          >
            <TargetIcon />
            Target: {activeRole}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
          style={{ background: 'linear-gradient(135deg, #4F46E5, #7C6EF6)' }}
          aria-hidden="true"
        >
          {getInitials(displayName)}
        </div>

        <div className="text-right">
          <p className="text-xs font-bold" style={{ color: '#1B1F3B' }}>
            {displayName}
          </p>
          <p className="text-[10px]" style={{ color: '#9295B8' }}>
            Candidate Account
          </p>
        </div>

        <button
          onClick={handleLogout}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition active:scale-[0.97] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ml-2"
          style={{
            color: '#E11D48',
            border: '1px solid #FBD1D9',
            background: 'transparent',
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.background = '#FEF2F2';
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.background = 'transparent';
          }}
        >
          <LogoutIcon />
          {loading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </header>
  );
};

export default TopHeader;