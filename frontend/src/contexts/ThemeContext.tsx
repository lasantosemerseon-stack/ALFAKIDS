import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  mode: ThemeMode;
  toggle: () => void;
  colors: typeof darkColors;
}

const darkColors = {
  bg: '#0D0D14',
  bgSecondary: '#161622',
  card: 'rgba(22, 22, 34, 0.9)',
  cardBorder: 'rgba(1, 207, 201, 0.2)',
  primary: '#01CFC9',
  secondary: '#0984E3',
  accent: '#FFD700',
  accentPurple: '#7C3AED',
  text: '#FFFFFF',
  textSecondary: '#8E8EA0',
  textGold: '#FFD700',
  surface: 'rgba(22, 22, 34, 0.8)',
  locked: 'rgba(255,255,255,0.08)',
  gradientStart: '#01CFC9',
  gradientEnd: '#0984E3',
};

const lightColors = {
  bg: '#F5F6FA',
  bgSecondary: '#EEEEF5',
  card: 'rgba(255, 255, 255, 0.95)',
  cardBorder: 'rgba(9, 132, 227, 0.2)',
  primary: '#01CFC9',
  secondary: '#0984E3',
  accent: '#FFD700',
  accentPurple: '#7C3AED',
  text: '#1A1A2E',
  textSecondary: '#555570',
  textGold: '#D4A800',
  surface: 'rgba(255, 255, 255, 0.9)',
  locked: 'rgba(0,0,0,0.06)',
  gradientStart: '#01CFC9',
  gradientEnd: '#0984E3',
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
