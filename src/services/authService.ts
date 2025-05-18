
import { User } from '../types/auth';

// Simulating authentication service
// In a real app, this would connect to Firebase/Supabase

export const loginWithEmailPassword = async (email: string, password: string): Promise<User> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate validation
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  
  if (password.length < 6) {
    throw new Error('Invalid credentials');
  }
  
  // Return mock user data
  return {
    id: 'user-123',
    email,
    name: email.split('@')[0],
    language: 'en'
  };
};

export const registerWithEmailPassword = async (email: string, password: string, name: string): Promise<User> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate validation
  if (!email || !password || !name) {
    throw new Error('All fields are required');
  }
  
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  
  // Return mock user data
  return {
    id: 'user-' + Math.random().toString(36).substr(2, 9),
    email,
    name,
    language: 'en'
  };
};

export const logout = async (): Promise<void> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  // In a real app, this would clear the session with Firebase/Supabase
};

export const getCurrentUser = async (): Promise<User | null> => {
  // Simulate API call to check if user is logged in
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const savedUser = localStorage.getItem('user');
  return savedUser ? JSON.parse(savedUser) : null;
};

export const updateUserProfile = async (userId: string, data: Partial<User>): Promise<User> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Get current user data
  const savedUser = localStorage.getItem('user');
  const currentUser = savedUser ? JSON.parse(savedUser) : null;
  
  if (!currentUser) {
    throw new Error('User not found');
  }
  
  // Update and save
  const updatedUser = { ...currentUser, ...data };
  localStorage.setItem('user', JSON.stringify(updatedUser));
  
  return updatedUser;
};
