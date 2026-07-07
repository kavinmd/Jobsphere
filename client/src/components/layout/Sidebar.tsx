import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Search,
  FileText,
  User,
  Briefcase,
  PlusCircle,
  Users,
  LogOut,
  Zap,
  ChevronRight,
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user, logout, isStudent, isManager } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const studentLinks = [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/search', icon: Search, label: 'Search Jobs' },
    { to: '/student/applications', icon: FileText, label: 'My Applications' },
    { to: '/student/profile', icon: User, label: 'Profile' },
  ];

  const managerLinks = [
    { to: '/manager/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/manager/jobs', icon: Briefcase, label: 'My Jobs' },
    { to: '/manager/jobs/new', icon: PlusCircle, label: 'Post a Job' },
    { to: '/manager/profile', icon: User, label: 'Profile' },
  ];

  const links = isStudent ? studentLinks : managerLinks;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="sidebar flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6172f4, #f43f9a)' }}>
          <Zap size={16} className="text-white" />
        </div>
        <div>
          <span className="text-white font-bold text-base">JobSphere</span>
          <p className="text-xs text-white/40 leading-none">
            {isManager ? 'Hiring Manager' : 'Student Portal'}
          </p>
        </div>
      </div>

      {/* User Info */}
      <div className="mx-3 mt-4 mb-2 p-3 rounded-xl" style={{ background: 'rgba(97,114,244,0.08)', border: '1px solid rgba(97,114,244,0.15)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
               style={{ background: 'linear-gradient(135deg, #6172f4, #f43f9a)' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-white/40 text-xs truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-3 space-y-1">
        {links.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} className="flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight size={14} className="opacity-50" />}
            </Link>
          );
        })}
      </nav>

      {/* Role Badge */}
      <div className="px-3 pb-2">
        <div className="px-4 py-2 rounded-lg text-center text-xs font-medium" 
             style={{ background: isManager ? 'rgba(244,63,154,0.1)' : 'rgba(97,114,244,0.1)', 
                      color: isManager ? '#f9a8d4' : '#a5b8fc',
                      border: `1px solid ${isManager ? 'rgba(244,63,154,0.2)' : 'rgba(97,114,244,0.2)'}` }}>
          {isManager ? '👔 Hiring Manager' : '🎓 Student'}
        </div>
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
          style={{ color: 'rgba(255,255,255,0.5)' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)';
            (e.currentTarget as HTMLElement).style.color = '#fca5a5';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)';
          }}
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
