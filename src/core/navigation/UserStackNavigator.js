import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AppDrawerNavigator from './AppDrawerNavigator';

import CameraScreen from '@/features/common/screens/CameraScreen';
import SettingsScreen from '@/features/profile/screens/SettingsScreen';
import TripDetailScreen from '@/features/common/screens/TripDetailScreen';
import ReceiptDetailScreen from '@/features/receipts/screens/ReceiptDetailScreen';
import MileageTrackerScreen from '@/features/mileage/screens/MileageTrackerScreen';

import IncomeDocumentsScreen from '@/features/documents/screens/IncomeDocumentsScreen';
import MileageLogScreen from '@/features/documents/screens/MileageLogScreen';
import VehicleExpensesScreen from '@/features/documents/screens/VehicleExpensesScreen';
import UploadT4Screen from '@/features/documents/screens/UploadT4Screen';
import DeductionsScreen from '@/features/documents/screens/DeductionsScreen';
import FindCAScreen from '@/features/common/screens/FindCAScreen';

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
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="TripDetail" component={TripDetailScreen} />
      <Stack.Screen name="ReceiptDetail" component={ReceiptDetailScreen} />
      <Stack.Screen name="MileageTracker" component={MileageTrackerScreen} />

      <Stack.Screen name="IncomeDocuments" component={IncomeDocumentsScreen} />
      <Stack.Screen name="MileageLog" component={MileageLogScreen} />
      <Stack.Screen name="VehicleExpenses" component={VehicleExpensesScreen} />
      <Stack.Screen name="UploadT4" component={UploadT4Screen} />
      <Stack.Screen name="Deductions" component={DeductionsScreen} />
      <Stack.Screen name="FindCA" component={FindCAScreen} />
    </Stack.Navigator>
  );
};

export default UserStackNavigator;