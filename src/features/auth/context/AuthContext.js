import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { authAPI } from '@/services/api';

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
  const spouseTaxProfile = raw.spouseTaxProfile || {};

  return {
    employment: !!raw.employment,
    gigWork: !!raw.gigWork,
    selfEmployment: !!raw.selfEmployment,
    incorporatedBusiness: !!raw.incorporatedBusiness,
    spouse: !!raw.spouse,
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
    incomeSources: Array.isArray(rawUser.incomeSources) ? rawUser.incomeSources : [],
    profile: rawUser.profile || {},

    firmName: rawUser.firmName || '',
    caNumber: rawUser.caNumber || '',
    specialization: rawUser.specialization || '',
    yearsOfExperience: rawUser.yearsOfExperience || '',

    clientId: rawUser.clientId || `TV-${Date.now()}`,
    memberSince: rawUser.memberSince || new Date().getFullYear().toString(),
  };
};

/* ---------------- DEMO USERS ---------------- */

const INCOME_STATES = [
  {
    key: 'unemployed',
    label: 'Unemployed',
    taxProfile: {
      employment: false,
      gigWork: false,
      selfEmployment: false,
      incorporatedBusiness: false,
    },
    incomeSources: [],
  },
  {
    key: 'self-employed',
    label: 'Self-employed / Gig Worker',
    taxProfile: {
      employment: false,
      gigWork: true,
      selfEmployment: true,
      incorporatedBusiness: false,
    },
    incomeSources: ['gig-work'],
  },
  {
    key: 'employed',
    label: 'Employed',
    taxProfile: {
      employment: true,
      gigWork: false,
      selfEmployment: false,
      incorporatedBusiness: false,
    },
    incomeSources: ['employment'],
  },
  {
    key: 'business',
    label: 'Business',
    taxProfile: {
      employment: false,
      gigWork: false,
      selfEmployment: false,
      incorporatedBusiness: true,
    },
    incomeSources: ['business'],
  },
  {
    key: 'self-employed-employed',
    label: 'Self-employed + Employed',
    taxProfile: {
      employment: true,
      gigWork: true,
      selfEmployment: true,
      incorporatedBusiness: false,
    },
    incomeSources: ['gig-work', 'employment'],
  },
  {
    key: 'self-employed-business',
    label: 'Self-employed + Business',
    taxProfile: {
      employment: false,
      gigWork: true,
      selfEmployment: true,
      incorporatedBusiness: true,
    },
    incomeSources: ['gig-work', 'business'],
  },
  {
    key: 'employed-business',
    label: 'Employed + Business',
    taxProfile: {
      employment: true,
      gigWork: false,
      selfEmployment: false,
      incorporatedBusiness: true,
    },
    incomeSources: ['employment', 'business'],
  },
  {
    key: 'self-employed-employed-business',
    label: 'Self-employed + Employed + Business',
    taxProfile: {
      employment: true,
      gigWork: true,
      selfEmployment: true,
      incorporatedBusiness: true,
    },
    incomeSources: ['gig-work', 'employment', 'business'],
  },
];

const DEFAULT_OPTIONAL_PROFILE = {
  tfsa: false,
  rrsp: false,
  fhsa: false,
  ccb: false,
  investments: false,
  donations: false,
};

const buildSingleDemoUsers = () => {
  const users = {};

  INCOME_STATES.forEach((state, index) => {
    const email = `user${index + 1}@demo.com`;

    users[email] = {
      id: `demo-user-${state.key}`,
      name: `Demo User - ${state.label}`,
      email,
      role: 'user',
      password: 'demo1234',
      incomeSources: state.incomeSources,
      taxProfile: {
        ...state.taxProfile,
        spouse: false,
        ...DEFAULT_OPTIONAL_PROFILE,
        spouseIncomeSources: [],
        spouseTaxProfile: {
          employment: false,
          gigWork: false,
          selfEmployment: false,
          incorporatedBusiness: false,
        },
      },
    };
  });

  return users;
};

const buildSpouseDemoUsers = () => {
  const users = {};
  let count = 1;

  INCOME_STATES.forEach((userState) => {
    INCOME_STATES.forEach((spouseState) => {
      const email = `household${count}@demo.com`;

      users[email] = {
        id: `demo-household-${count}`,
        name: `Demo Household - ${userState.label} + Spouse ${spouseState.label}`,
        email,
        role: 'user',
        password: 'demo1234',
        incomeSources: userState.incomeSources,
        taxProfile: {
          ...userState.taxProfile,
          spouse: true,
          ...DEFAULT_OPTIONAL_PROFILE,
          spouseIncomeSources: spouseState.incomeSources,
          spouseTaxProfile: {
            ...spouseState.taxProfile,
          },
        },
      };

      count += 1;
    });
  });

  return users;
};

const DEMO_USERS = {
  ...buildSingleDemoUsers(),
  ...buildSpouseDemoUsers(),
  'ca@demo.com': {
    id: 'demo-ca',
    name: 'Jane Smith, CA',
    email: 'ca@demo.com',
    role: 'ca',
    password: 'demo1234',
    caNumber: 'CA-123456',
    firmName: 'Smith & Associates',
  },
};

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
      await AsyncStorage.removeItem(STORAGE_KEY);
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setUser(null);
      setToken(null);
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

  /* ---------------- LOGIN ---------------- */

  const login = async (email, password, role = 'user') => {
    try {
      const normalizedEmail = email.toLowerCase().trim();

      const demoUser = DEMO_USERS[normalizedEmail];
      if (demoUser && demoUser.password === password) {
        if (role === 'ca' && demoUser.role !== 'ca') {
          Alert.alert('Invalid account type');
          return { success: false };
        }

        if (role === 'user' && demoUser.role !== 'user') {
          Alert.alert('Invalid account type');
          return { success: false };
        }

        await persistAuth(demoUser);

        Toast.show({
          type: 'success',
          text1: 'Demo Login',
          text2: `Logged in as ${demoUser.name}`,
        });

        return { success: true };
      }

      const payload =
        role === 'ca'
          ? { email: normalizedEmail, password, role: 'ca' }
          : { email: normalizedEmail, password };

      const res = await authAPI.login(payload);
      const { user: authUser, token: authToken } = res.data;

      await persistAuth(authUser, authToken);

      Toast.show({
        type: 'success',
        text1: 'Welcome back',
        text2: authUser?.name || 'Logged in successfully',
      });

      return { success: true };
    } catch (err) {
      Alert.alert('Login failed', 'Invalid credentials');
      return { success: false };
    }
  };

  /* ---------------- REGISTER ---------------- */

  const register = async (data, role = 'user') => {
    try {
      const res = await authAPI.register({
        ...data,
        role,
      });

      const { user: authUser, token: authToken } = res.data;

      await persistAuth(authUser, authToken);

      Alert.alert('Success', 'Account created');

      return { success: true };
    } catch (err) {
      Alert.alert('Registration failed');
      return { success: false };
    }
  };

  /* ---------------- LOGOUT ---------------- */

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
      incomeStates: INCOME_STATES,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};