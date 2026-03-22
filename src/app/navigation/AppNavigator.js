import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAuth } from '@/features/auth/context/AuthContext';
import { colors } from '@/styles/theme';

// Auth Screens
import LoginScreen from '@/features/auth/screens/LoginScreen';
import RegisterScreen from '@/features/auth/screens/RegisterScreen';
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

// Gig Worker Screens
import GSTDashboardScreen from '@/features/gig/screens/GSTDashboardScreen';
import BusinessUseCalculatorScreen from '@/features/gig/screens/BusinessUseCalculatorScreen';
import T2125FormScreen from '@/features/gig/screens/T2125FormScreen';

// Shop Owner Screens
import ShopOwnerDashboardScreen from '@/features/shop/screens/ShopOwnerDashboardScreen';
import ShopBusinessInfoScreen from '@/features/shop/screens/ShopBusinessInfoScreen';
import ShopSalesIncomeScreen from '@/features/shop/screens/ShopSalesIncomeScreen';
import ShopRentUtilitiesScreen from '@/features/shop/screens/ShopRentUtilitiesScreen';
import ShopPayrollScreen from '@/features/shop/screens/ShopPayrollScreen';
import ShopFranchiseScreen from '@/features/shop/screens/ShopFranchiseScreen';
import ShopInventoryScreen from '@/features/shop/screens/ShopInventoryScreen';
import ShopGSTRecordsScreen from '@/features/shop/screens/ShopGSTRecordsScreen';

// CA Screens
import CADashboardScreen from '@/features/ca/screens/CADashboardScreen';
import ClientsScreen from '@/features/ca/screens/ClientsScreen';
import ClientDetailScreen from '@/features/ca/screens/ClientDetailScreen';
import ClientSearchScreen from '@/features/ca/screens/ClientSearchScreen';
import QRScannerScreen from '@/features/ca/screens/QRScannerScreen';

// Development Mode
import { DEV_MODE, DEV_USER_ROLE } from '@/config/development';

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
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
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

const UserStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'card',
      }}
    >
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

      <Stack.Screen name="GSTDashboard" component={GSTDashboardScreen} />
      <Stack.Screen
        name="BusinessUseCalculator"
        component={BusinessUseCalculatorScreen}
      />
      <Stack.Screen name="T2125Form" component={T2125FormScreen} />

      <Stack.Screen
        name="ShopOwnerDashboard"
        component={ShopOwnerDashboardScreen}
      />
      <Stack.Screen
        name="ShopBusinessInfo"
        component={ShopBusinessInfoScreen}
      />
      <Stack.Screen
        name="ShopSalesIncome"
        component={ShopSalesIncomeScreen}
      />
      <Stack.Screen
        name="ShopRentUtilities"
        component={ShopRentUtilitiesScreen}
      />
      <Stack.Screen name="ShopPayroll" component={ShopPayrollScreen} />
      <Stack.Screen name="ShopFranchise" component={ShopFranchiseScreen} />
      <Stack.Screen name="ShopInventory" component={ShopInventoryScreen} />
      <Stack.Screen
        name="ShopGSTRecords"
        component={ShopGSTRecordsScreen}
      />
    </Stack.Navigator>
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

const AppStack = () => {
  const { user } = useAuth();

  if (DEV_MODE) {
    console.log(`🔧 DEV MODE: Showing ${DEV_USER_ROLE} dashboard`);

    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {DEV_USER_ROLE === 'ca' ? (
          <Stack.Screen name="CAStack" component={CAStack} />
        ) : (
          <Stack.Screen name="UserStack" component={UserStack} />
        )}
      </Stack.Navigator>
    );
  }

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
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Mfa" component={MfaScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (DEV_MODE) {
    return <AppStack />;
  }

  return isAuthenticated ? <AppStack /> : <AuthStack />;
};

export default AppNavigator;
