// src/services/config.js
import Constants from 'expo-constants';

// Get environment variables or use defaults
const ENV = {
  dev: {
    API_URL: 'http://192.168.1.89:5000/api', // Your backend IP
  },
  staging: {
    API_URL: 'https://staging-api.taxvault.com/api',
  },
  prod: {
    API_URL: 'https://api.taxvault.com/api',
  },
};

// Get current environment
const getEnvVars = () => {
  if (__DEV__) {
    return ENV.dev;
  }
  // You can add staging/prod logic here based on release channel
  return ENV.dev; // Default to dev for now
};

export const { API_URL } = getEnvVars();