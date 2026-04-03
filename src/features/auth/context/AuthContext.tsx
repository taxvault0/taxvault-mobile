import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { authAPI } from '@/services/api';
import { demoUsers } from '@/features/auth/utils/loginScenarios';

/* ================= TYPES ================= */

type AuthContextType = {
  user: any;
  token: string | null;
  loading: boolean;

  login: (email: string, password: string, role?: string) => Promise<any>;
  demoLogin: (role?: string) => Promise<any>;
  register: (data: any, role?: string) => Promise<any>;
  logout: () => Promise<void>;
  updateUser: (updates: any) => Promise<any>;

  isAuthenticated: boolean;
  isCA: boolean;
  isUser: boolean;
  demoUsers: any[];
};

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

/* ================= CONSTANTS ================= */

const STORAGE_KEY = 'taxvault_user';
const TOKEN_KEY = 'token';

/* ================= PROVIDER ================= */

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);

      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedToken) setToken(storedToken);
    } catch (e) {
      console.log('Auth init error:', e);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const persistAuth = async (authUser: any, authToken: string | null = null) => {
    setUser(authUser);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));

    if (authToken) {
      setToken(authToken);
      await SecureStore.setItemAsync(TOKEN_KEY, authToken);
    } else {
      setToken(null);
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  };

  const clearAuth = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setUser(null);
    setToken(null);
  };

  /* ================= ACTIONS ================= */

  const login = async (email: string, password: string, role = 'user') => {
    try {
      const res = await authAPI.login({ email, password, role });

      const authUser = res?.data?.user;
      const authToken = res?.data?.token;

      if (!authUser) {
        Alert.alert('Login failed', 'Invalid credentials');
        return { success: false };
      }

      await persistAuth(authUser, authToken);
      return { success: true, user: authUser };
    } catch {
      Alert.alert('Login failed', 'Invalid credentials');
      return { success: false };
    }
  };

  const demoLogin = async (role = 'user') => {
    try {
      const demoUser = demoUsers?.[0];

      if (!demoUser) {
        Alert.alert('Demo login failed');
        return { success: false };
      }

      await persistAuth(demoUser);
      return { success: true, user: demoUser };
    } catch {
      Alert.alert('Demo login failed');
      return { success: false };
    }
  };

  const register = async (data: any, role = 'user') => {
    try {
      const res = await authAPI.register({ ...data, role });

      const authUser = res?.data?.user;
      const authToken = res?.data?.token;

      if (!authUser) {
        Alert.alert('Registration failed', 'Unable to create account');
        return { success: false };
      }

      await persistAuth(authUser, authToken);

      return { success: true, user: authUser };
    } catch {
      Alert.alert('Registration failed');
      return { success: false };
    }
  };

  const updateUser = async (updates: any) => {
    try {
      const nextUser = { ...user, ...updates };
      setUser(nextUser);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));

      Toast.show({
        type: 'success',
        text1: 'Profile updated',
      });

      return { success: true, user: nextUser };
    } catch {
      Alert.alert('Update failed');
      return { success: false };
    }
  };

  const logout = async () => {
    await clearAuth();
    Toast.show({
      type: 'success',
      text1: 'Logged out',
    });
  };

  /* ================= VALUE ================= */

  const value: AuthContextType = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      demoLogin,
      register,
      logout,
      updateUser,
      isAuthenticated: !!user,
      isCA: user?.role === 'ca',
      isUser: user?.role === 'user',
      demoUsers: demoUsers || [],
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};