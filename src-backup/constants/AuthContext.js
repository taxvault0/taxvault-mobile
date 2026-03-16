import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { authAPI } from '../services/api';
import Toast from 'react-native-toast-message';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('token');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.data.requiresMfa) {
        return { requiresMfa: true, userId: response.data.userId };
      }

      const { token, user } = response.data;
      
      await SecureStore.setItemAsync('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      
      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
        text2: `Logged in as ${user.name}`,
      });
      
      return { success: true };
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.response?.data?.message || 'Please check your credentials',
      });
      return { success: false, error: error.response?.data?.message };
    }
  };

  const verifyMfa = async (userId, token) => {
    try {
      const response = await authAPI.verifyMfa({ userId, token });
      
      const { token: jwtToken, user } = response.data;
      
      await SecureStore.setItemAsync('token', jwtToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      setToken(jwtToken);
      setUser(user);
      setIsAuthenticated(true);
      
      Toast.show({
        type: 'success',
        text1: 'Verified!',
        text2: 'MFA verification successful',
      });
      
      return { success: true };
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: error.response?.data?.message || 'Invalid MFA code',
      });
      return { success: false };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      const { token, user } = response.data;
      
      await SecureStore.setItemAsync('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      
      Toast.show({
        type: 'success',
        text1: 'Welcome to TaxVault!',
        text2: 'Your account has been created',
      });
      
      return { success: true };
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: error.response?.data?.message || 'Please try again',
      });
      return { success: false };
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      await AsyncStorage.removeItem('user');
      
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      
      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'See you soon!',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = async (updatedData) => {
    try {
      const updatedUser = { ...user, ...updatedData };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    token,
    login,
    verifyMfa,
    register,
    logout,
    updateUser,
    isCA: user?.role === 'ca',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
