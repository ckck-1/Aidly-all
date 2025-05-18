import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { logout } from '../../store/features/authSlice';
import { Language, setLanguage, toggleNotifications, toggleDarkMode } from '../../store/features/settingsSlice';
import { updateUserProfile, logout as logoutService } from '../../services/authService';
import { toast } from 'sonner';
import { LogOut, Languages, Bell, BellOff, ThermometerSun } from 'lucide-react';

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { language, notificationsEnabled, darkMode } = useSelector((state: RootState) => state.settings);
  const { temperature } = useSelector((state: RootState) => state.health);
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  
  const handleLogout = async () => {
    try {
      await logoutService();
      dispatch(logout());
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value as Language;
    dispatch(setLanguage(newLanguage));
    toast.success(`Language changed to ${newLanguage}`);
  };
  
  const handleToggleNotifications = () => {
    dispatch(toggleNotifications());
    toast.success(notificationsEnabled ? 'Notifications disabled' : 'Notifications enabled');
  };
  
  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
    toast.success(darkMode ? 'Light mode enabled' : 'Dark mode enabled');
  };
  
  const handleUpdateProfile = async () => {
    if (!user) return;
    
    try {
      await updateUserProfile(user.id, { name });
      
      // Update local storage
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const userData = JSON.parse(userJson);
        userData.name = name;
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      setIsEditing(false);
      toast.success('Profile updated');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };
  
  const formatTemperature = (temp: number) => {
    return `${temp.toFixed(1)}°C`;
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div className="flex flex-col space-y-6">
      {/* User info card */}
      <div className="aidly-card">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-aidly-lightgray rounded-full flex items-center justify-center">
            <span className="text-2xl font-medium text-aidly-darkgray">
              {user?.name.charAt(0) || 'U'}
            </span>
          </div>
          
          <div className="flex-1">
            {isEditing ? (
              <div className="mb-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Your name"
                />
              </div>
            ) : (
              <h2 className="text-xl font-semibold">{user?.name}</h2>
            )}
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>
        
        {isEditing ? (
          <div className="flex space-x-2 mt-4">
            <button
              onClick={handleUpdateProfile}
              className="aidly-gradient text-white py-1 px-4 rounded-lg text-sm font-medium"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-200 text-gray-700 py-1 px-4 rounded-lg text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 bg-white border border-gray-300 text-gray-700 py-1 px-4 rounded-lg text-sm font-medium"
          >
            Edit Profile
          </button>
        )}
      </div>
      
      {/* Temperature readings */}
      <div className="aidly-card">
        <div className="flex items-center space-x-2 mb-4">
          <ThermometerSun size={20} className="text-aidly-red" />
          <h3 className="text-lg font-semibold">Temperature Log</h3>
        </div>
        
        {temperature ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{formatTemperature(temperature.value)}</div>
              <div className="text-sm text-gray-500">{formatDate(temperature.timestamp)}</div>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                temperature.value > 37.5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}
            >
              {temperature.value > 37.5 ? 'Elevated' : 'Normal'}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No temperature readings yet</p>
        )}
      </div>
      
      {/* Settings */}
      <div className="aidly-card">
        <h3 className="text-lg font-semibold mb-4">Settings</h3>
        
        <div className="space-y-4">
          {/* Language */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Languages size={18} className="text-gray-600" />
              <label htmlFor="language" className="text-gray-700">Language</label>
            </div>
            <select
              id="language"
              value={language}
              onChange={handleLanguageChange}
              className="border border-gray-300 rounded-lg px-3 py-1 bg-white"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="zh">中文</option>
              <option value="ja">日本語</option>
            </select>
          </div>
          
          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {notificationsEnabled ? (
                <Bell size={18} className="text-gray-600" />
              ) : (
                <BellOff size={18} className="text-gray-600" />
              )}
              <span className="text-gray-700">Notifications</span>
            </div>
            <button
              onClick={handleToggleNotifications}
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                notificationsEnabled ? 'bg-aidly-red' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
      
      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="flex items-center justify-center space-x-2 w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Profile;
