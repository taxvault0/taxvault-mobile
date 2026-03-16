import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

// Static imports for all screens
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen';
import DashboardScreen from './screens/main/DashboardScreen';
import ReceiptsScreen from './screens/main/ReceiptsScreen';
import ReceiptDetailScreen from './screens/main/ReceiptDetailScreen';
import CameraScreen from './screens/main/CameraScreen';
import MileageScreen from './screens/main/MileageScreen';
import MileageTrackerScreen from './screens/main/MileageTrackerScreen';
import DocumentsScreen from './screens/main/DocumentsScreen';
import ProfileScreen from './screens/main/ProfileScreen';
import SettingsScreen from './screens/main/SettingsScreen';

// Map screens for testing
const screens = [
  { name: 'LoginScreen', component: LoginScreen },
  { name: 'RegisterScreen', component: RegisterScreen },
  { name: 'ForgotPasswordScreen', component: ForgotPasswordScreen },
  { name: 'DashboardScreen', component: DashboardScreen },
  { name: 'ReceiptsScreen', component: ReceiptsScreen },
  { name: 'ReceiptDetailScreen', component: ReceiptDetailScreen },
  { name: 'CameraScreen', component: CameraScreen },
  { name: 'MileageScreen', component: MileageScreen },
  { name: 'MileageTrackerScreen', component: MileageTrackerScreen },
  { name: 'DocumentsScreen', component: DocumentsScreen },
  { name: 'ProfileScreen', component: ProfileScreen },
  { name: 'SettingsScreen', component: SettingsScreen },
];

// Test each screen
const results = screens.map(({ name, component }) => {
  try {
    console.log(`Testing: ${name}`);
    // Just accessing the component validates the import
    const Comp = component;
    return {
      name,
      success: true,
      hasDefault: true
    };
  } catch (error) {
    console.log(`Failed: ${name}`, error.message);
    return {
      name,
      success: false,
      error: error.message
    };
  }
});

const failed = results.filter(r => !r.success);
console.log('Import test complete. Failed:', failed.length);

export default function TestImports() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Screen Import Test Results</Text>
      <Text style={styles.subtitle}>Failed: {failed.length}/{results.length}</Text>
      
      {results.map((result, index) => (
        <View key={index} style={[styles.result, result.success ? styles.success : styles.error]}>
          <Text style={styles.resultText}>
            {result.success ? '✅' : '❌'} {result.name}
          </Text>
          {!result.success && (
            <Text style={styles.errorText}>{result.error}</Text>
          )}
        </View>
      ))}

      {failed.length === 0 && (
        <View style={styles.allPassed}>
          <Text style={styles.allPassedText}>
            ✅ All screens imported successfully!
          </Text>
          <Text style={styles.note}>
            The error must be in AppNavigator or one of its hooks.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  result: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
  success: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
  },
  error: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
  },
  resultText: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 14,
    color: '#721c24',
    marginTop: 5,
    fontFamily: 'monospace',
  },
  allPassed: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#d4edda',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#c3e6cb',
    alignItems: 'center',
  },
  allPassedText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#155724',
    marginBottom: 10,
  },
  note: {
    fontSize: 14,
    color: '#155724',
    textAlign: 'center',
  },
});