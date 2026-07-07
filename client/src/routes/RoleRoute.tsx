import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RoleRouteProps {
  allowedRole: 'student' | 'hiring_manager';
}

const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRole }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.role !== allowedRole) {
    // Redirect to correct dashboard based on actual role
    const redirect = user?.role === 'hiring_manager' ? '/manager/dashboard' : '/student/dashboard';
    return <Navigate to={redirect} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
