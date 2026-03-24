import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import DashboardScreen from '@/features/dashboard/screens/DashboardScreen';
import DocumentsScreen from '@/features/documents/screens/DocumentsScreen';
import ChecklistScreen from '@/features/checklist/screens/ChecklistScreen';
import TaxSummaryScreen from '@/features/summary/screens/TaxSummaryScreen';
import ProfileScreen from '@/features/profile/screens/ProfileScreen';
import { colors } from '@/styles/theme';

const Tab = createBottomTabNavigator();

const getPrimaryColor = () => {
  if (typeof colors?.primary === 'string') return colors.primary;
  if (colors?.primary?.[500]) return colors.primary[500];
  return '#2563EB';
};

const getInactiveColor = () => {
  if (typeof colors?.gray === 'string') return colors.gray;
  if (colors?.gray?.[400]) return colors.gray[400];
  return '#94A3B8';
};

const getTabIcon = (routeName, focused) => {
  switch (routeName) {
    case 'Home':
      return focused ? 'view-dashboard' : 'view-dashboard-outline';
    case 'Documents':
      return focused ? 'file-document' : 'file-document-outline';
    case 'Checklist':
      return 'format-list-checks';
    case 'Summary':
      return focused ? 'chart-box' : 'chart-box-outline';
    case 'Profile':
      return focused ? 'account' : 'account-outline';
    default:
      return 'circle-outline';
  }
};

const MainTabNavigator = () => {
  const activeColor = getPrimaryColor();
  const inactiveColor = getInactiveColor();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 68,
          paddingTop: 8,
          paddingBottom: 8,
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          backgroundColor: '#FFFFFF',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
        tabBarIcon: ({ focused, color, size }) => (
          <Icon
            name={getTabIcon(route.name, focused)}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Documents"
        component={DocumentsScreen}
        options={{
          tabBarLabel: 'Documents',
        }}
      />
      <Tab.Screen
        name="Checklist"
        component={ChecklistScreen}
        options={{
          tabBarLabel: 'Checklist',
        }}
      />
      <Tab.Screen
        name="Summary"
        component={TaxSummaryScreen}
        options={{
          tabBarLabel: 'Summary',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;