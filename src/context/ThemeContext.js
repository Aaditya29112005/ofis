import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DARK_THEME, LIGHT_THEME, COLORS } from '../theme/colors';

const ThemeContext = createContext();
const THEME_KEY = '@app_theme';

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // Load persisted theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_KEY);
        if (saved !== null) {
          setIsDark(saved === 'dark');
        }
      } catch (e) {
        // Silently fail, use default
      }
      setIsReady(true);
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newValue = !isDark;
    setIsDark(newValue);
    try {
      await AsyncStorage.setItem(THEME_KEY, newValue ? 'dark' : 'light');
    } catch (e) {
      // Silently fail
    }
  };

  const theme = isDark ? DARK_THEME : LIGHT_THEME;

  const activeColors = {
    ...COLORS,
    ...theme,
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors: activeColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
