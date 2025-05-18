
import React from 'react';
import { useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  
  // Get the page title based on the current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/voice':
        return 'Voice Assistant';
      case '/chat':
        return 'Chat';
      case '/symptoms':
        return 'Symptom Analyzer';
      case '/profile':
        return 'My Profile';
      default:
        return 'AIDLY';
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="max-w-md mx-auto p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold aidly-gradient-text">{getPageTitle()}</h1>
        <div className="w-8 h-8 bg-aidly-lightgray rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-aidly-darkgray">AI</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
