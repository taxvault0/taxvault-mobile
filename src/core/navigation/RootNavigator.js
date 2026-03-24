import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { useAuth } from '@/features/auth/context/AuthContext';
import { DEV_MODE } from '@/config/development';

import AuthNavigator from './AuthNavigator';
import UserStackNavigator from './UserStackNavigator';
import CAStackNavigator from './CAStackNavigator';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const { isAuthenticated, loading, user } = useAuth();

  console.log('RootNavigator state:', { loading, isAuthenticated, user });

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
        }}
      >
        <Text style={{ fontSize: 16, color: '#0F172A', fontWeight: '600' }}>
          Loading...
        </Text>
      </View>
    );
  }

  const isCA =
    user?.role === 'ca' ||
    user?.roleType === 'ca' ||
    user?.userType === 'ca';

  const shouldEnterApp = DEV_MODE || isAuthenticated;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!shouldEnterApp ? (
        <Stack.Screen name="AuthApp" component={AuthNavigator} />
      ) : isCA ? (
        <Stack.Screen name="CAApp" component={CAStackNavigator} />
      ) : (
        <Stack.Screen name="UserApp" component={UserStackNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;