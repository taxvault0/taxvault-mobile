import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../constants/theme';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState(systemColorScheme || 'light');
  const [customColors, setCustomColors] = useState(colors);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const themeColors = {
    light: {
      background: '#FFFFFF',
      surface: '#F5F7FA',
      text: '#111827',
      textSecondary: '#6C757D',
      border: '#E4E7EB',
      ...customColors,
    },
    dark: {
      background: '#111827',
      surface: '#1F2937',
      text: '#F5F7FA',
      textSecondary: '#9AA2B0',
      border: '#374151',
      ...customColors,
    },
  };

  const currentTheme = themeColors[theme];

  const value = {
    theme,
    colors: currentTheme,
    toggleTheme,
    setCustomColors,
    isDark: theme === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
