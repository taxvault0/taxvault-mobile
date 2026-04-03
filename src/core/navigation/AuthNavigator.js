import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import RoleSelectionScreen from '@/features/auth/screens/RoleSelectionScreen';
import LoginScreen from '@/features/auth/screens/LoginScreen';
import RegisterScreen from '@/features/auth/screens/register/RegisterScreen';
import LoginScreenCA from '@/features/auth/screens/LoginScreenCA';
import RegisterScreenCA from '@/features/auth/screens/RegisterScreenCA';
import ForgotPasswordScreen from '@/features/auth/screens/ForgotPasswordScreen';
import MfaScreen from '@/features/auth/screens/MfaScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="RoleSelection"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="LoginScreenCA" component={LoginScreenCA} />
      <Stack.Screen name="RegisterScreenCA" component={RegisterScreenCA} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Mfa" component={MfaScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;


