import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAuth } from '@/features/auth/context/AuthContext';
import { colors } from '@/styles/theme';

// Auth Screens
import RoleSelectionScreen from '@/features/auth/screens/RoleSelectionScreen';
import LoginScreen from '@/features/auth/screens/LoginScreen';
import RegisterScreen from '@/features/auth/screens/RegisterScreen';
import LoginScreenCA from '@/features/auth/screens/LoginScreenCA';
import RegisterScreenCA from '@/features/auth/screens/RegisterScreenCA';
import ForgotPasswordScreen from '@/features/auth/screens/ForgotPasswordScreen';
import MfaScreen from '@/features/auth/screens/MfaScreen';

// Main Screens
import DashboardScreen from '@/features/dashboard/screens/DashboardScreen';

// Common Screens
import CameraScreen from '@/features/common/screens/CameraScreen';
import SettingsScreen from '@/features/profile/screens/SettingsScreen';
import TripDetailScreen from '@/features/common/screens/TripDetailScreen';
import FindCAScreen from '@/features/common/screens/FindCAScreen';

// Receipts Screens
import ReceiptsScreen from '@/features/receipts/screens/ReceiptsScreen';
import ReceiptDetailScreen from '@/features/receipts/screens/ReceiptDetailScreen';

// Mileage Screens
import MileageScreen from '@/features/mileage/screens/MileageScreen';
import MileageTrackerScreen from '@/features/mileage/screens/MileageTrackerScreen';

// Documents Screens
import DocumentsScreen from '@/features/documents/screens/DocumentsScreen';
import IncomeDocumentsScreen from '@/features/documents/screens/IncomeDocumentsScreen';
import MileageLogScreen from '@/features/documents/screens/MileageLogScreen';
import VehicleExpensesScreen from '@/features/documents/screens/VehicleExpensesScreen';

// Profile Screens
import ProfileScreen from '@/features/profile/screens/ProfileScreen';
import ProfileScreenCA from '@/features/ca/screens/ProfileScreenCA';

// CA Screens
import CADashboardScreen from '@/features/ca/screens/CADashboardScreen';
import ClientsScreen from '@/features/ca/screens/ClientsScreen';
import ClientDetailScreen from '@/features/ca/screens/ClientDetailScreen';
import ClientSearchScreen from '@/features/ca/screens/ClientSearchScreen';
import QRScannerScreen from '@/features/ca/screens/QRScannerScreen';

// Dev Mode
import { DEV_MODE } from '@/config/development';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'circle';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
          } else if (route.name === 'Receipts') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Mileage') {
            iconName = 'map-marker-distance';
          } else if (route.name === 'Documents') {
            iconName = focused ? 'file-document' : 'file-document-outline';
          } else if (route.name === 'FindCA') {
            iconName = 'account-tie';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.gray[400],
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Receipts" component={ReceiptsScreen} />
      <Tab.Screen name="Mileage" component={MileageScreen} />
      <Tab.Screen name="Documents" component={DocumentsScreen} />
      <Tab.Screen name="FindCA" component={FindCAScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const CAStack = () => {
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

const UserStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
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
    </Stack.Navigator>
  );
};

const AppStack = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user?.role === 'ca' ? (
        <Stack.Screen name="CAStack" component={CAStack} />
      ) : (
        <Stack.Screen name="UserStack" component={UserStack} />
      )}
    </Stack.Navigator>
  );
};

const AuthStack = () => {
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

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (DEV_MODE) return <AppStack />;

  return isAuthenticated ? <AppStack /> : <AuthStack />;
};

export default AppNavigator;