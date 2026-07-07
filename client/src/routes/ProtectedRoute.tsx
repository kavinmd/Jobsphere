import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0b1a' }}>
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-primary-400 border-t-transparent spinner mx-auto mb-4" />
          <p className="text-white/50 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
