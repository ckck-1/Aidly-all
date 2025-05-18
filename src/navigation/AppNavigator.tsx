import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

// Auth Screens
import Login from '../screens/auth/Login';
import Signup from '../screens/auth/Signup';
import LanguageSelection from '../screens/auth/LanguageSelection';

// Main Screens
import Layout from '../components/layout/Layout';
import VoiceAgent from '../screens/main/VoiceAgent';
import TextChat from '../screens/main/TextChat';
import SymptomAnalyzer from '../screens/main/SymptomAnalyzer';
import Profile from '../screens/main/Profile';

// Other Screens
import FeverAlert from '../screens/alerts/FeverAlert';

const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { hasFever } = useSelector((state: RootState) => state.health);
  
  // Routes that don't require authentication
  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/language" element={<LanguageSelection />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // If the user has a fever, show the alert screen
  if (hasFever) {
    return <FeverAlert />;
  }

  // Authenticated routes
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/voice" replace />} />
          <Route path="/voice" element={<VoiceAgent />} />
          <Route path="/chat" element={<TextChat />} />
          <Route path="/symptoms" element={<SymptomAnalyzer />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/language" element={<LanguageSelection />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppNavigator;
