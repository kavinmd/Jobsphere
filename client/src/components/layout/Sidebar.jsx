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
  LogOut,
  ChevronRight,
  Users,
} from 'lucide-react';


const Sidebar = () => {
  const { logout, isStudent, isManager } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const studentLinks = [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/search', icon: Search, label: 'Search Jobs' },
    { to: '/student/applications', icon: FileText, label: 'My Applications' },
    { to: '/student/profile', icon: User, label: 'Profile' },
  ];

  const managerLinks = [
    { to: '/manager/dashboard',    icon: LayoutDashboard, label: 'Dashboard'    },
    { to: '/manager/jobs',         icon: Briefcase,       label: 'My Jobs'      },
    { to: '/manager/applications', icon: Users,           label: 'Applications' },
    { to: '/manager/jobs/new',     icon: PlusCircle,      label: 'Post a Job'   },
    { to: '/manager/profile',      icon: User,            label: 'Profile'      },
  ];

  const links = isStudent ? studentLinks : managerLinks;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="sidebar flex flex-col">

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

      {/* Logout */}
      <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
          style={{ color: 'rgba(255,255,255,0.5)' }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            e.currentTarget.style.color = '#fca5a5';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
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
