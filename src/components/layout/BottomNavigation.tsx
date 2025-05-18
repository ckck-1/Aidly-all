
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mic, MessageSquare, Thermometer, User } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="sticky bottom-0 z-10 bg-white border-t border-gray-200 shadow-md">
      <div className="max-w-md mx-auto px-2">
        <div className="flex justify-around">
          <NavItem 
            to="/voice" 
            icon={<Mic size={20} />} 
            label="Voice" 
            isActive={isActive('/voice')} 
          />
          <NavItem 
            to="/chat" 
            icon={<MessageSquare size={20} />} 
            label="Chat" 
            isActive={isActive('/chat')} 
          />
          <NavItem 
            to="/symptoms" 
            icon={<Thermometer size={20} />} 
            label="Symptoms" 
            isActive={isActive('/symptoms')} 
          />
          <NavItem 
            to="/profile" 
            icon={<User size={20} />} 
            label="Profile" 
            isActive={isActive('/profile')} 
          />
        </div>
      </div>
    </nav>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => {
  return (
    <Link 
      to={to} 
      className={`flex flex-col items-center justify-center py-2 px-3 transition-colors ${
        isActive ? 'text-aidly-red' : 'text-gray-500'
      }`}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-aidly-red mt-1" />}
    </Link>
  );
};

export default BottomNavigation;
