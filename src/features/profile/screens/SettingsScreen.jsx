import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Header from '@/components/layout/AppHeader';
import Card from '@/components/ui/Card';

import { useAuth } from '@/features/auth/context/AuthContext';
import { useTheme } from '@/core/providers/ThemeContext';

import { typography, spacing, borderRadius } from '@/styles/theme';

const SettingsScreen = ({ navigation }) => {
  const { logout } = useAuth();
  const { colors, isDark, setTheme } = useTheme();

  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const SettingItem = ({ icon, label, value, onValueChange, type = 'switch' }) => (
    <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
      <View style={styles.settingLeft}>
        <Icon name={icon} size={24} color={colors.primary[500]} />
        <Text style={[styles.settingLabel, { color: colors.text.primary }]}>
          {label}
        </Text>
      </View>

      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.gray[300], true: colors.primary[500] }}
          thumbColor={colors.white}
        />
      ) : (
        <TouchableOpacity onPress={onValueChange}>
          <Icon name="chevron-right" size={24} color={colors.gray[400]} />
        </TouchableOpacity>
      )}
    </View>
  );

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.replace('Login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Settings" showBack />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Appearance */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Appearance
          </Text>
          <SettingItem
            icon="theme-light-dark"
            label="Dark Mode"
            value={isDark}
            onValueChange={toggleTheme}
          />
        </Card>

        {/* Notifications */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Notifications
          </Text>
          <SettingItem
            icon="bell"
            label="Push Notifications"
            value={notifications}
            onValueChange={setNotifications}
          />
          <SettingItem
            icon="email"
            label="Email Alerts"
            value={notifications}
            onValueChange={setNotifications}
          />
        </Card>

        {/* Security */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Security
          </Text>
          <SettingItem
            icon="fingerprint"
            label="Biometric Login"
            value={biometric}
            onValueChange={setBiometric}
          />
          <SettingItem
            icon="lock"
            label="Change Password"
            type="link"
            onValueChange={() =>
              Alert.alert('Coming Soon', 'Password change coming soon!')
            }
          />
        </Card>

        {/* About */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            About
          </Text>
          <SettingItem
            icon="information"
            label="App Version"
            type="link"
            onValueChange={() => Alert.alert('Version', 'TaxVault App v1.0.0')}
          />
          <SettingItem
            icon="file-document"
            label="Terms & Conditions"
            type="link"
            onValueChange={() =>
              Alert.alert('Terms', 'Terms and conditions coming soon!')
            }
          />
          <SettingItem
            icon="shield"
            label="Privacy Policy"
            type="link"
            onValueChange={() =>
              Alert.alert('Privacy', 'Privacy policy coming soon!')
            }
          />
        </Card>

        {/* Logout */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            { backgroundColor: colors.error + '10', borderColor: colors.error },
          ]}
          onPress={handleLogout}
        >
          <Icon name="logout" size={24} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>
            Log Out
          </Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: colors.text.secondary }]}>
          Version 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  sectionTitle: {
    ...typography.h6,
    marginBottom: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    ...typography.body,
    marginLeft: spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  logoutText: {
    ...typography.body,
    fontWeight: typography.weights.medium,
    marginLeft: spacing.sm,
  },
  version: {
    ...typography.caption,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});

export default SettingsScreen;

