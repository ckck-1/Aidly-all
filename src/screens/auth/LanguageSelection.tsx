
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLanguage } from '../../store/features/settingsSlice';
import { updateUserLanguage } from '../../store/features/authSlice';
import { Language } from '../../store/features/settingsSlice';
import { updateUserProfile } from '../../services/authService';
import { toast } from 'sonner';

interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];

const LanguageSelection: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLanguageSelect = async (language: Language) => {
    try {
      dispatch(setLanguage(language));
      
      // Update user language in Redux
      dispatch(updateUserLanguage(language));
      
      // Get current user from localStorage
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        // Update user profile with new language
        const updatedUser = await updateUserProfile(user.id, { language });
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      // Navigate to the main app
      navigate('/');
      toast.success(`Language set to ${language}`);
    } catch (error) {
      toast.error('Failed to set language');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-50">
      <div className="w-full max-w-md text-center mb-8">
        <h1 className="text-4xl font-bold aidly-gradient-text mb-2">AIDLY</h1>
        <p className="text-gray-600">Your AI Health Assistant</p>
      </div>
      
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Choose Your Language</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className="aidly-card flex items-center space-x-3 p-4 hover:bg-gray-50 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-2xl">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;
