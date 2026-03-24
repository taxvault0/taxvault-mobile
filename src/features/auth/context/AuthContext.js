import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { authAPI } from '@/services/api';
import { demoUsers } from '@/features/auth/utils/loginScenarios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const STORAGE_KEY = 'taxvault_user';
const TOKEN_KEY = 'token';

/* ---------------- TAX PROFILE ---------------- */

const normalizeTaxProfile = (user = {}) => {
  const raw = user.taxProfile || {};
  const spouseTaxProfile =
    raw.spouseTaxProfile ||
    user.spouseInfo?.taxProfile ||
    {};

  return {
    employment: !!raw.employment,
    gigWork: !!raw.gigWork,
    selfEmployment: !!raw.selfEmployment,
    incorporatedBusiness: !!raw.incorporatedBusiness,
    spouse: !!raw.spouse || !!user.spouseInfo,
    tfsa: !!raw.tfsa,
    rrsp: !!raw.rrsp,
    fhsa: !!raw.fhsa,
    ccb: !!raw.ccb,
    investments: !!raw.investments,
    donations: !!raw.donations,

    spouseIncomeSources: Array.isArray(raw.spouseIncomeSources)
      ? raw.spouseIncomeSources
      : [],

    spouseTaxProfile: {
      employment: !!spouseTaxProfile.employment,
      gigWork: !!spouseTaxProfile.gigWork,
      selfEmployment: !!spouseTaxProfile.selfEmployment,
      incorporatedBusiness: !!spouseTaxProfile.incorporatedBusiness,
    },
  };
};

const getPrimaryUserType = (taxProfile = {}) => {
  if (taxProfile.incorporatedBusiness) return 'business_owner';
  if (taxProfile.gigWork) return 'gig-worker';
  if (taxProfile.selfEmployment) return 'self-employed';
  if (taxProfile.employment) return 'employee';
  return 'unemployed';
};

const getIncomeSourcesFromTaxProfile = (taxProfile = {}) => {
  const sources = [];
  if (taxProfile.employment) sources.push('employment');
  if (taxProfile.gigWork || taxProfile.selfEmployment) sources.push('gig-work');
  if (taxProfile.incorporatedBusiness) sources.push('business');
  return sources;
};

const buildUser = (rawUser = {}) => {
  const taxProfile = normalizeTaxProfile(rawUser);

  return {
    id: rawUser.id || `user-${Date.now()}`,
    name: rawUser.name || '',
    email: rawUser.email || '',
    role: rawUser.role || 'user',

    userType:
      rawUser.userType ||
      (rawUser.role === 'ca' ? 'professional' : getPrimaryUserType(taxProfile)),

    taxProfile,
    incomeSources: Array.isArray(rawUser.incomeSources)
      ? rawUser.incomeSources
      : getIncomeSourcesFromTaxProfile(taxProfile),

    maritalStatus: rawUser.maritalStatus || 'Single',
    spouseInfo: rawUser.spouseInfo || null,
    dependents: Array.isArray(rawUser.dependents) ? rawUser.dependents : [],

    businessName: rawUser.businessName || '',
    platforms: Array.isArray(rawUser.platforms) ? rawUser.platforms : [],

    firmName: rawUser.firmName || '',
    caNumber: rawUser.caNumber || '',
    specialization: rawUser.specialization || '',
    yearsOfExperience: rawUser.yearsOfExperience || '',
  };
};

const mapDemoUserToAuthShape = (demoUser) => {
  const profile = demoUser.profile || {};
  const taxProfile = profile.taxProfile || {};
  const spouseInfo = profile.spouseInfo || null;

  return {
    id: demoUser.id,
    name: profile.name || demoUser.title,
    email: demoUser.email,
    role: demoUser.role || 'user',
    password: demoUser.password,
    userType: profile.userType || getPrimaryUserType(taxProfile),
    taxProfile: {
      ...taxProfile,
      spouse: !!spouseInfo,
      spouseTaxProfile: spouseInfo?.taxProfile || {},
    },
    incomeSources: getIncomeSourcesFromTaxProfile(taxProfile),
    maritalStatus: profile.maritalStatus || 'Single',
    spouseInfo,
    dependents: Array.isArray(profile.dependents) ? profile.dependents : [],
  };
};

const DEMO_USERS = demoUsers.reduce((acc, item) => {
  acc[item.email.trim().toLowerCase()] = mapDemoUserToAuthShape(item);
  return acc;
}, {});

/* ---------------- PROVIDER ---------------- */

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      if (storedToken) {
        setToken(storedToken);
      }
    } catch (e) {
      console.log('Auth init error:', e);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const persistAuth = async (authUser, authToken = null) => {
    const built = buildUser(authUser);

    setUser(built);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(built));

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

  const login = async (email, password, role = 'user') => {
    try {
      const normalizedEmail = email.toLowerCase().trim();
      const normalizedPassword = password.trim();

      const demoUser = DEMO_USERS[normalizedEmail];

      if (demoUser && demoUser.password === normalizedPassword) {
        await persistAuth(demoUser);

        Toast.show({
          type: 'success',
          text1: 'Demo Login',
          text2: `Logged in as ${demoUser.name}`,
        });

        return { success: true };
      }

      const res = await authAPI.login({
        email: normalizedEmail,
        password: normalizedPassword,
        role,
      });

      const { user: authUser, token: authToken } = res.data;

      await persistAuth(authUser, authToken);

      return { success: true };
    } catch (err) {
      Alert.alert('Login failed', 'Invalid credentials');
      return { success: false };
    }
  };

  const register = async (data, role = 'user') => {
    try {
      const res = await authAPI.register({ ...data, role });

      const { user: authUser, token: authToken } = res.data;

      await persistAuth(authUser, authToken);

      Alert.alert('Success', 'Account created');

      return { success: true };
    } catch (err) {
      Alert.alert('Registration failed');
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

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isCA: user?.role === 'ca',
      isUser: user?.role === 'user',
      demoUsers: DEMO_USERS,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};