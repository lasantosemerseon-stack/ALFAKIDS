import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  mode: ThemeMode;
  toggle: () => void;
  colors: typeof darkColors;
}

const darkColors = {
  bg: '#0D0D0D',
  bgSecondary: '#1A1A1A',
  card: 'rgba(30, 30, 30, 0.8)',
  cardBorder: 'rgba(191, 150, 99, 0.15)',
  primary: '#BF9663',
  secondary: '#D97016',
  accent: '#9D4CDD',
  accentBlue: '#2563EB',
  text: '#FFFFFF',
  textSecondary: '#A3A3A3',
  textGold: '#BF9663',
  surface: 'rgba(30, 30, 30, 0.6)',
  locked: 'rgba(255,255,255,0.15)',
};

const lightColors = {
  bg: '#F8F5F2',
  bgSecondary: '#EEEAE5',
  card: 'rgba(255, 255, 255, 0.9)',
  cardBorder: 'rgba(191, 150, 99, 0.25)',
  primary: '#BF9663',
  secondary: '#D97016',
  accent: '#9D4CDD',
  accentBlue: '#2563EB',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textGold: '#9A7B19',
  surface: 'rgba(255, 255, 255, 0.8)',
  locked: 'rgba(0,0,0,0.1)',
};

const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  toggle: () => {},
  colors: darkColors,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    AsyncStorage.getItem('theme').then(saved => {
      if (saved === 'light' || saved === 'dark') setMode(saved);
    });
  }, []);

  const toggle = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    AsyncStorage.setItem('theme', next);
  };

  const colors = mode === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ mode, toggle, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
