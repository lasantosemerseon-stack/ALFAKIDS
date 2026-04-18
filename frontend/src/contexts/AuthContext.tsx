import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface AuthContextType {
  user: { name: string; email: string; mode: string } | null;
  accessMode: 'free' | 'premium' | 'alfa';
  isLoading: boolean;
  login: (email: string, name: string, password: string, mode: string) => Promise<boolean>;
  logout: () => void;
  setAccessMode: (mode: 'free' | 'premium' | 'alfa') => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null, accessMode: 'free', isLoading: true,
  login: async () => false, logout: () => {},
  setAccessMode: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [accessMode, setAccessModeState] = useState<'free' | 'premium' | 'alfa'>('free');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const mode = await AsyncStorage.getItem('accessMode');
      if (mode) setAccessModeState(mode as any);
      if (token) {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setAccessModeState(data.mode);
        } else {
          await AsyncStorage.removeItem('token');
        }
      }
    } catch (e) {
      console.log('Auth check failed:', e);
    }
    setIsLoading(false);
  };

  const login = async (email: string, name: string, password: string, mode: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password, mode }),
      });
      if (res.ok) {
        const data = await res.json();
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('accessMode', data.mode);
        setUser({ name: data.name, email: data.email, mode: data.mode });
        setAccessModeState(data.mode);
        return true;
      }
      return false;
    } catch (e) {
      console.log('Login error:', e);
      return false;
    }
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['token', 'accessMode']);
    setUser(null);
    setAccessModeState('free');
  };

  const setAccessMode = (mode: 'free' | 'premium' | 'alfa') => {
    setAccessModeState(mode);
    AsyncStorage.setItem('accessMode', mode);
  };

  return (
    <AuthContext.Provider value={{ user, accessMode, isLoading, login, logout, setAccessMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
