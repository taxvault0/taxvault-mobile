import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AppDrawerNavigator from './AppDrawerNavigator';
import CameraScreen from '@/features/common/screens/CameraScreen';

const Stack = createStackNavigator();

const UserStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AppDrawer" component={AppDrawerNavigator} />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
};

export default UserStackNavigator;