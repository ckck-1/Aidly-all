
import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import Header from './Header';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 max-w-md w-full mx-auto p-4">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;
