import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

// Public pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student pages
import StudentDashboard from './pages/student/Dashboard';
import JobSearch from './pages/student/JobSearch';
import ApplicationHistory from './pages/student/ApplicationHistory';
import StudentProfile from './pages/student/Profile';

// Manager pages
import ManagerDashboard from './pages/manager/Dashboard';
import MyJobs from './pages/manager/MyJobs';
import PostJob from './pages/manager/PostJob';
import EditJob from './pages/manager/EditJob';
import ApplicantTracker from './pages/manager/ApplicantTracker';
import ManagerProfile from './pages/manager/Profile';

const App: React.FC = () => {
  const { isAuthenticated, isStudent, isManager } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={isAuthenticated
        ? <Navigate to={isManager ? '/manager/dashboard' : '/student/dashboard'} replace />
        : <Login />}
      />
      <Route path="/register" element={isAuthenticated
        ? <Navigate to={isManager ? '/manager/dashboard' : '/student/dashboard'} replace />
        : <Register />}
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Student Routes */}
        <Route element={<RoleRoute allowedRole="student" />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/search" element={<JobSearch />} />
          <Route path="/student/applications" element={<ApplicationHistory />} />
          <Route path="/student/profile" element={<StudentProfile />} />
        </Route>

        {/* Manager Routes */}
        <Route element={<RoleRoute allowedRole="hiring_manager" />}>
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route path="/manager/jobs" element={<MyJobs />} />
          <Route path="/manager/jobs/new" element={<PostJob />} />
          <Route path="/manager/jobs/:id/edit" element={<EditJob />} />
          <Route path="/manager/jobs/:jobId/applicants" element={<ApplicantTracker />} />
          <Route path="/manager/profile" element={<ManagerProfile />} />
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
