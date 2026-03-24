import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import CADashboardScreen from '@/features/ca/screens/CADashboardScreen';
import ClientsScreen from '@/features/ca/screens/ClientsScreen';
import ClientDetailScreen from '@/features/ca/screens/ClientDetailScreen';
import ClientSearchScreen from '@/features/ca/screens/ClientSearchScreen';
import QRScannerScreen from '@/features/ca/screens/QRScannerScreen';
import ProfileScreenCA from '@/features/ca/screens/ProfileScreenCA';

import CameraScreen from '@/features/common/screens/CameraScreen';
import SettingsScreen from '@/features/profile/screens/SettingsScreen';
import DocumentsScreen from '@/features/documents/screens/DocumentsScreen';
import IncomeDocumentsScreen from '@/features/documents/screens/IncomeDocumentsScreen';
import VehicleExpensesScreen from '@/features/documents/screens/VehicleExpensesScreen';

const Stack = createStackNavigator();

const CAStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CADashboard" component={CADashboardScreen} />
      <Stack.Screen name="Clients" component={ClientsScreen} />
      <Stack.Screen name="ClientDetail" component={ClientDetailScreen} />
      <Stack.Screen name="ClientSearch" component={ClientSearchScreen} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      <Stack.Screen name="ProfileScreenCA" component={ProfileScreenCA} />
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
