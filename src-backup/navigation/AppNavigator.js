import React, { useState } from 'react';
import { View, Text, ActivityIndicator, Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

// Static imports for all screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import DashboardScreen from '../screens/main/DashboardScreen';
import ReceiptsScreen from '../screens/main/ReceiptsScreen';
import ReceiptDetailScreen from '../screens/main/ReceiptDetailScreen';
import CameraScreen from '../screens/main/CameraScreen';
import MileageScreen from '../screens/main/MileageScreen';
import MileageTrackerScreen from '../screens/main/MileageTrackerScreen';
import DocumentsScreen from '../screens/main/DocumentsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import CADashboardScreen from '../screens/ca/CADashboardScreen';
import ClientsScreen from '../screens/ca/ClientsScreen';
import ClientDetailScreen from '../screens/ca/ClientDetailScreen';

const Stack = createStackNavigator();

// Map of screens for testing
const screenMap = {
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  DashboardScreen,
  ReceiptsScreen,
  ReceiptDetailScreen,
  CameraScreen,
  MileageScreen,
  MileageTrackerScreen,
  DocumentsScreen,
  ProfileScreen,
  SettingsScreen,
  CADashboardScreen,
  ClientsScreen,
  ClientDetailScreen,
};

const screenList = Object.keys(screenMap).map(name => ({
  name,
  component: screenMap[name]
}));

// Error Boundary Component
class ScreenErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.log(`❌ Error in ${this.props.screenName}:`, error);
    console.log('Component stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, color: 'red', fontWeight: 'bold', marginBottom: 10 }}>
            Error in {this.props.screenName}
          </Text>
          <Text style={{ fontSize: 14, marginBottom: 20 }}>
            {this.state.error?.toString()}
          </Text>
          <Button title="Go Back" onPress={this.props.onReset} />
        </View>
      );
    }
    return this.props.children;
  }
}

// Screen wrapper with error boundary
const ScreenWrapper = ({ screenName, ScreenComponent, onError }) => {
  console.log(`🔍 Rendering ${screenName}`);
  
  try {
    return (
      <ScreenErrorBoundary screenName={screenName} onReset={onError}>
        <ScreenComponent />
      </ScreenErrorBoundary>
    );
  } catch (e) {
    console.log(`❌ Immediate error in ${screenName}:`, e);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>Error loading {screenName}</Text>
      </View>
    );
  }
};

export default function AppNavigator() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorScreens, setErrorScreens] = useState([]);

  const currentScreen = screenList[currentIndex];

  const goToNext = () => {
    if (currentIndex < screenList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleError = (screenName) => {
    setErrorScreens(prev => [...new Set([...prev, screenName])]);
  };

  const resetError = () => {
    // Reset error boundary by forcing re-render
    setCurrentIndex(currentIndex);
  };

  if (errorScreens.length > 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: 'red' }}>
          Screens with Errors:
        </Text>
        {errorScreens.map(name => (
          <Text key={name} style={{ fontSize: 16, marginBottom: 5 }}>• {name}</Text>
        ))}
        <Button 
          title="Continue Testing" 
          onPress={() => setErrorScreens([])} 
        />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name={currentScreen.name}
        options={{
          headerLeft: currentIndex > 0 ? () => (
            <Button title="← Prev" onPress={goToPrev} />
          ) : null,
          headerRight: currentIndex < screenList.length - 1 ? () => (
            <Button title="Next →" onPress={goToNext} />
          ) : null,
          title: `${currentScreen.name} (${currentIndex + 1}/${screenList.length})`
        }}
      >
        {() => (
          <ScreenWrapper 
            screenName={currentScreen.name}
            ScreenComponent={currentScreen.component}
            onError={() => handleError(currentScreen.name)}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}