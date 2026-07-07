import React from 'react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="page-wrapper flex">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-6 lg:p-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
