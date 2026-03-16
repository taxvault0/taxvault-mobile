import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../constants/AuthContext';
import { colors } from '../styles/theme';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import MfaScreen from '../screens/auth/MfaScreen';

// Main Screens - Organized by folder
import DashboardScreen from '../screens/main/dashboard/DashboardScreen';

// Common Screens
import CameraScreen from '../screens/main/common/CameraScreen';
import SettingsScreen from '../screens/main/common/SettingsScreen';
import TripDetailScreen from '../screens/main/common/TripDetailScreen';

// Receipts Screens
import ReceiptsScreen from '../screens/main/receipts/ReceiptsScreen';
import ReceiptDetailScreen from '../screens/main/receipts/ReceiptDetailScreen';

// Mileage Screens
import MileageScreen from '../screens/main/mileage/MileageScreen';
import MileageTrackerScreen from '../screens/main/mileage/MileageTrackerScreen';

// Documents Screens
import DocumentsScreen from '../screens/main/documents/DocumentsScreen';
import IncomeDocumentsScreen from '../screens/main/documents/IncomeDocumentsScreen';
import MileageLogScreen from '../screens/main/documents/MileageLogScreen';
import VehicleExpensesScreen from '../screens/main/documents/VehicleExpensesScreen';

// Profile Screens
import ProfileScreen from '../screens/main/profile/ProfileScreen';

// Find CA Screens
import FindCAScreen from '../screens/main/find-ca/FindCAScreen';
import CADetailScreen from '../screens/main/find-ca/CADetailScreen';
import CAFiltersScreen from '../screens/main/find-ca/CAFiltersScreen';
import CAReviewsScreen from '../screens/main/find-ca/CAReviewsScreen';
import CAScheduleScreen from '../screens/main/find-ca/CAScheduleScreen';

// Gig Worker Screens
import GSTDashboardScreen from '../screens/main/gig/GSTDashboardScreen';
import BusinessUseCalculatorScreen from '../screens/main/gig/BusinessUseCalculatorScreen';
import T2125FormScreen from '../screens/main/gig/T2125FormScreen';

// Shop Owner Screens
import ShopOwnerDashboardScreen from '../screens/main/shop/ShopOwnerDashboardScreen';
import ShopBusinessInfoScreen from '../screens/main/shop/ShopBusinessInfoScreen';
import ShopSalesIncomeScreen from '../screens/main/shop/ShopSalesIncomeScreen';
import ShopRentUtilitiesScreen from '../screens/main/shop/ShopRentUtilitiesScreen';
import ShopPayrollScreen from '../screens/main/shop/ShopPayrollScreen';
import ShopFranchiseScreen from '../screens/main/shop/ShopFranchiseScreen';
import ShopInventoryScreen from '../screens/main/shop/ShopInventoryScreen';
import ShopGSTRecordsScreen from '../screens/main/shop/ShopGSTRecordsScreen';

// CA Screens
import CADashboardScreen from '../screens/ca/CADashboardScreen';
import ClientsScreen from '../screens/ca/ClientsScreen';
import ClientDetailScreen from '../screens/ca/ClientDetailScreen';
import ClientSearchScreen from '../screens/ca/ClientSearchScreen';
import QRScannerScreen from '../screens/ca/QRScannerScreen';

// 🔧 Development Mode Configuration
import { DEV_MODE, DEV_USER_ROLE } from '../config/development';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator for User
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Dashboard') {
            iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
          } else if (route.name === 'Receipts') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Mileage') {
            iconName = focused ? 'map-marker-distance' : 'map-marker-distance';
          } else if (route.name === 'Documents') {
            iconName = focused ? 'file-document' : 'file-document-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          } else if (route.name === 'FindCA') {
            iconName = focused ? 'account-tie' : 'account-tie';
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

// Main Stack Navigator for User (includes all screens)
const UserStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        presentation: 'card'
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      
      {/* Common Screens */}
      <Stack.Screen 
        name="Camera" 
        component={CameraScreen} 
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="TripDetail" component={TripDetailScreen} />
      
      {/* Receipts Screens */}
      <Stack.Screen name="ReceiptDetail" component={ReceiptDetailScreen} />
      
      {/* Mileage Screens */}
      <Stack.Screen name="MileageTracker" component={MileageTrackerScreen} />
      
      {/* Document Screens */}
      <Stack.Screen name="IncomeDocuments" component={IncomeDocumentsScreen} />
      <Stack.Screen name="MileageLog" component={MileageLogScreen} />
      <Stack.Screen name="VehicleExpenses" component={VehicleExpensesScreen} />
      
      {/* Find CA Screens */}
      <Stack.Screen name="CADetail" component={CADetailScreen} />
      <Stack.Screen name="CAFilters" component={CAFiltersScreen} />
      <Stack.Screen name="CAReviews" component={CAReviewsScreen} />
      <Stack.Screen name="CASchedule" component={CAScheduleScreen} />
      
      {/* Gig Worker Screens */}
      <Stack.Screen name="GSTDashboard" component={GSTDashboardScreen} />
      <Stack.Screen name="BusinessUseCalculator" component={BusinessUseCalculatorScreen} />
      <Stack.Screen name="T2125Form" component={T2125FormScreen} />
      
      {/* Shop Owner Screens */}
      <Stack.Screen name="ShopOwnerDashboard" component={ShopOwnerDashboardScreen} />
      <Stack.Screen name="ShopBusinessInfo" component={ShopBusinessInfoScreen} />
      <Stack.Screen name="ShopSalesIncome" component={ShopSalesIncomeScreen} />
      <Stack.Screen name="ShopRentUtilities" component={ShopRentUtilitiesScreen} />
      <Stack.Screen name="ShopPayroll" component={ShopPayrollScreen} />
      <Stack.Screen name="ShopFranchise" component={ShopFranchiseScreen} />
      <Stack.Screen name="ShopInventory" component={ShopInventoryScreen} />
      <Stack.Screen name="ShopGSTRecords" component={ShopGSTRecordsScreen} />
    </Stack.Navigator>
  );
};

// CA Stack Navigator
const CAStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CADashboard" component={CADashboardScreen} />
      <Stack.Screen name="Clients" component={ClientsScreen} />
      <Stack.Screen name="ClientDetail" component={ClientDetailScreen} />
      <Stack.Screen name="ClientSearch" component={ClientSearchScreen} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      
      {/* Also include common screens for CA */}
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

// App Stack - decides which stack to show based on user role or DEV MODE
const AppStack = () => {
  const { user } = useAuth();
  
  // 🚀 DEVELOPMENT MODE - Override user role
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
  
  // Production mode - use real user role
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

// Auth Stack (not logged in)
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

// Main App Navigator
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  // 🚀 DEVELOPMENT MODE - Bypass authentication
  if (DEV_MODE) {
    return <AppStack />;
  }

  // Production mode - check authentication
  return isAuthenticated ? <AppStack /> : <AuthStack />;
};

export default AppNavigator;