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
import UploadT4AScreen from '@/features/documents/screens/UploadT4AScreen';
import UploadRRSPReceiptScreen from '@/features/documents/screens/UploadRRSPReceiptScreen';
import UploadT5Screen from '@/features/documents/screens/UploadT5Screen';
import UploadFHSAScreen from '@/features/documents/screens/UploadFHSAScreen';
import IncomeSummaryScreen from '@/features/summary/screens/IncomeSummaryScreen';
import UploadChecklistScreen from '@/features/uploads/screens/UploadChecklistScreen';
import UploadSectionDetailScreen from '@/features/uploads/screens/UploadSectionDetailScreen';


import FindCAScreen from '@/features/common/screens/FindCAScreen';
import ReceiptsScreen from '@/features/receipts/screens/ReceiptsScreen';
import AddReceiptScreen from '@/features/receipts/screens/AddReceiptScreen';

import DeductionSummaryScreen from '@/features/summary/screens/DeductionSummaryScreen';
import RefundEstimateScreen from '@/features/summary/screens/RefundEstimateScreen';

import CAHubScreen from '@/features/ca/screens/CAHubScreen';
import CADirectoryScreen from '@/features/ca/screens/CADirectoryScreen';
import CADetailScreen from '@/features/ca/screens/CADetailScreen';
import BookAppointmentScreen from '@/features/ca/screens/BookAppointmentScreen';

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
      <Stack.Screen name="UploadT4A" component={UploadT4AScreen} />
      <Stack.Screen name="UploadT5" component={UploadT5Screen} />
      <Stack.Screen name="UploadRRSPReceipt" component={UploadRRSPReceiptScreen} />
      <Stack.Screen name="UploadFHSA" component={UploadFHSAScreen} />
      
      <Stack.Screen name="Deductions" component={DeductionsScreen} />
      <Stack.Screen name="FindCA" component={FindCAScreen} />

      <Stack.Screen name="Receipts" component={ReceiptsScreen} />
      <Stack.Screen name="AddReceipt" component={AddReceiptScreen} />
      <Stack.Screen name="UploadChecklist" component={UploadChecklistScreen} options={{ title: 'Tax Upload Checklist' }}/>
      <Stack.Screen name="UploadSectionDetail" component={UploadSectionDetailScreen} options={{ title: 'Upload Details' }}/>

      <Stack.Screen name="IncomeSummary" component={IncomeSummaryScreen} />
      <Stack.Screen name="DeductionSummary" component={DeductionSummaryScreen} />
      <Stack.Screen name="RefundEstimate" component={RefundEstimateScreen} />

      <Stack.Screen name="CAHub" component={CAHubScreen} />
      <Stack.Screen name="CADirectory" component={CADirectoryScreen} />
      <Stack.Screen name="CADetail" component={CADetailScreen} />
      <Stack.Screen name="BookCAAppointment" component={BookAppointmentScreen} />
      
    </Stack.Navigator>
  );
};

export default UserStackNavigator;