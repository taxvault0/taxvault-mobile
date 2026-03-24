import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import CADrawerNavigator from '@/core/navigation/CADrawerNavigator';

import CAClientDetailScreen from '@/features/ca/screens/CAClientDetailScreen';
import CAChatScreen from '@/features/ca/screens/CAChatScreen';
import CAMeetingsScreen from '@/features/ca/screens/CAMeetingsScreen';
import CARequestDetailsScreen from '@/features/ca/screens/CARequestDetailsScreen';
import ClientSearchScreen from '@/features/ca/screens/ClientSearchScreen';
import QRScannerScreen from '@/features/ca/screens/QRScannerScreen';
import ProfileScreenCA from '@/features/ca/screens/ProfileScreenCA';
import CAAnalyticsScreen from '@/features/ca/screens/CAAnalyticsScreen';

import CameraScreen from '@/features/common/screens/CameraScreen';
import SettingsScreen from '@/features/profile/screens/SettingsScreen';
import DocumentsScreen from '@/features/documents/screens/DocumentsScreen';
import IncomeDocumentsScreen from '@/features/documents/screens/IncomeDocumentsScreen';
import VehicleExpensesScreen from '@/features/documents/screens/VehicleExpensesScreen';

const Stack = createStackNavigator();

const CAStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="CAHome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CAHome" component={CADrawerNavigator} />

      <Stack.Screen name="ClientDetail" component={CAClientDetailScreen} />
      <Stack.Screen name="CAChat" component={CAChatScreen} />
      <Stack.Screen name="CAMeetings" component={CAMeetingsScreen} />
      <Stack.Screen name="CARequestDetails" component={CARequestDetailsScreen} />
      <Stack.Screen name="ClientSearch" component={ClientSearchScreen} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      <Stack.Screen name="ProfileScreenCA" component={ProfileScreenCA} />
      <Stack.Screen name="CAAnalytics" component={CAAnalyticsScreen} />

      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ presentation: 'modal' }} 
      />

      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Documents" component={DocumentsScreen} />
      <Stack.Screen name="IncomeDocuments" component={IncomeDocumentsScreen} />
      <Stack.Screen name="VehicleExpenses" component={VehicleExpensesScreen} />
    </Stack.Navigator>
  );
};

export default CAStackNavigator;