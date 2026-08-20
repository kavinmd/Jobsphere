import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Briefcase, GraduationCap, ChevronDown, LogOut, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout, isManager } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <header className="top-navbar">
      {/* JobSphere Logo in navbar spacer */}
      <div className="top-navbar-spacer">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)' }}
          >
            <Zap size={16} color="#ffffff" />
          </div>
          <div>
            <span className="navbar-brand-name">JobSphere</span>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="top-navbar-content">
        {/* Dark / Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          <span className="theme-toggle-track">
            <span className={`theme-toggle-thumb ${theme === 'dark' ? 'dark' : ''}`} />
          </span>
          <span className="theme-toggle-icon">
            {theme === 'dark' ? (
              <Moon size={15} className="text-blue-400" />
            ) : (
              <Sun size={15} className="text-amber-500" />
            )}
          </span>
          <span className="theme-toggle-label">
            {theme === 'dark' ? 'Dark' : 'Light'}
          </span>
        </button>

        {/* Divider */}
        <div className="navbar-divider" />

        {/* Role Badge */}
        <div className={`navbar-role-badge ${isManager ? 'manager' : 'student'}`}>
          {isManager ? (
            <Briefcase size={13} />
          ) : (
            <GraduationCap size={13} />
          )}
          <span>{isManager ? 'Hiring Manager' : 'Student'}</span>
        </div>

        {/* Divider */}
        <div className="navbar-divider" />

        {/* User Avatar + Name Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="navbar-user-btn"
            aria-label="User menu"
          >
            <div className="navbar-avatar">
              {initials}
            </div>
            <div className="navbar-user-info">
              <span className="navbar-user-name">{user?.name}</span>
              <span className="navbar-user-email">{user?.email}</span>
            </div>
            <ChevronDown
              size={14}
              className={`navbar-chevron ${dropdownOpen ? 'open' : ''}`}
            />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <>
              {/* backdrop to close on outside click */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="navbar-dropdown">
                <div className="navbar-dropdown-header">
                  <div className="navbar-avatar navbar-avatar-lg">
                    {initials}
                  </div>
                  <div>
                    <p className="navbar-dropdown-name">{user?.name}</p>
                    <p className="navbar-dropdown-email">{user?.email}</p>
                  </div>
                </div>
                <div className="navbar-dropdown-divider" />
                <button
                  onClick={handleLogout}
                  className="navbar-dropdown-logout"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
