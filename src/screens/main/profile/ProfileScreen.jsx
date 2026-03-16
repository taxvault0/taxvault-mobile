import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import Header from '../../../components/layout/Header';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { colors, typography, spacing, borderRadius } from '../../../styles/theme';
import { useAuth } from '../../../constants/AuthContext';
import { useTheme } from '../../../constants/ThemeContext';
import { PROVINCES } from '../../../utils/taxUtils';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, updateUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    province: user?.province || 'ON',
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleSave = () => {
    updateUser(editedUser);
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      Alert.alert('Success', 'Profile picture updated');
    }
  };

  const MenuItem = ({ icon, label, onPress, value, color }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <Icon name={icon} size={24} color={color || colors.primary[500]} />
        <Text style={styles.menuItemLabel}>{label}</Text>
      </View>
      <View style={styles.menuItemRight}>
        {value && <Text style={styles.menuItemValue}>{value}</Text>}
        <Icon name="chevron-right" size={20} color={colors.gray[400]} />
      </View>
    </TouchableOpacity>
  );

  const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  const EditField = ({ label, value, onChange, keyboardType, secure }) => (
    <View style={styles.editField}>
      <Text style={styles.editLabel}>{label}</Text>
      <TextInput
        style={styles.editInput}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        secureTextEntry={secure}
        placeholderTextColor={colors.gray[400]}
      />
    </View>
  );

  // Get user's province name
  const userProvince = PROVINCES.find(p => p.code === user?.province)?.name || 'Not set';
  const provinceOptions = PROVINCES.map(p => ({
    label: p.name,
    value: p.code,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Profile" 
        showBack={navigation.canGoBack()}
        rightIcon={!isEditing ? 'pencil' : undefined}
        onRightPress={() => setIsEditing(true)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </Text>
            </View>
            <View style={styles.cameraIcon}>
              <Icon name="camera" size={16} color={colors.white} />
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
          <View style={styles.userBadge}>
            <Text style={styles.userBadgeText}>
              {user?.role === 'ca' ? 'Tax Professional' : 'Individual User'}
            </Text>
          </View>
        </View>

        {/* Edit Profile Section */}
        {isEditing ? (
          <Card style={styles.editCard}>
            <Card.Header>
              <Text style={styles.sectionTitle}>Edit Profile</Text>
            </Card.Header>
            <Card.Body>
              <EditField
                label="Full Name"
                value={editedUser.name}
                onChange={(text) => setEditedUser({ ...editedUser, name: text })}
              />
              <EditField
                label="Email"
                value={editedUser.email}
                onChange={(text) => setEditedUser({ ...editedUser, email: text })}
                keyboardType="email-address"
              />
              <EditField
                label="Phone Number"
                value={editedUser.phoneNumber}
                onChange={(text) => setEditedUser({ ...editedUser, phoneNumber: text })}
                keyboardType="phone-pad"
              />
              
              {/* Province Picker */}
              <View style={styles.editField}>
                <Text style={styles.editLabel}>Province</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={editedUser.province}
                    onValueChange={(value) => setEditedUser({ ...editedUser, province: value })}
                  >
                    {provinceOptions.map(option => (
                      <Picker.Item key={option.value} label={option.label} value={option.value} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.editActions}>
                <Button
                  title="Cancel"
                  variant="outline"
                  onPress={() => {
                    setIsEditing(false);
                    setEditedUser({
                      name: user?.name || '',
                      email: user?.email || '',
                      phoneNumber: user?.phoneNumber || '',
                      province: user?.province || 'ON',
                    });
                  }}
                  style={styles.editButton}
                />
                <Button
                  title="Save"
                  onPress={handleSave}
                  style={styles.editButton}
                />
              </View>
            </Card.Body>
          </Card>
        ) : (
          /* Profile Info */
          <Card style={styles.infoCard}>
            <Card.Header>
              <Text style={styles.sectionTitle}>Personal Information</Text>
            </Card.Header>
            <Card.Body>
              <InfoRow label="Full Name" value={user?.name || 'Not set'} />
              <InfoRow label="Email" value={user?.email || 'Not set'} />
              <InfoRow label="Phone" value={user?.phoneNumber || 'Not set'} />
              
              {/* Province Display */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Province</Text>
                <Text style={styles.infoValue}>{userProvince}</Text>
              </View>
              
              <InfoRow label="Member Since" value={user?.createdAt?.split('T')[0] || '2024'} />
            </Card.Body>
          </Card>
        )}

        {/* Account Settings */}
        <Card style={styles.settingsCard}>
          <Card.Header>
            <Text style={styles.sectionTitle}>Account Settings</Text>
          </Card.Header>
          <Card.Body>
            <MenuItem
              icon="theme-light-dark"
              label="Dark Mode"
              onPress={toggleTheme}
              value={isDark ? 'On' : 'Off'}
              color={colors.primary[500]}
            />
            <MenuItem
              icon="bell"
              label="Notifications"
              onPress={() => navigation.navigate('Settings')}
              color={colors.primary[500]}
            />
            <MenuItem
              icon="lock"
              label="Privacy & Security"
              onPress={() => navigation.navigate('Settings')}
              color={colors.primary[500]}
            />
            <MenuItem
              icon="help-circle"
              label="Help & Support"
              onPress={() => navigation.navigate('Settings')}
              color={colors.primary[500]}
            />
          </Card.Body>
        </Card>

        {/* Tax Information */}
        {user?.role === 'ca' ? (
          <Card style={styles.taxCard}>
            <Card.Header>
              <Text style={styles.sectionTitle}>Professional Information</Text>
            </Card.Header>
            <Card.Body>
              <InfoRow label="License Number" value={user?.licenseNumber || 'Not set'} />
              <InfoRow label="Firm Name" value={user?.firmName || 'Not set'} />
              <InfoRow label="Years of Experience" value={user?.experience || 'Not set'} />
              <MenuItem
                icon="file-certificate"
                label="View Credentials"
                onPress={() => navigation.navigate('Settings')}
              />
            </Card.Body>
          </Card>
        ) : (
          <Card style={styles.taxCard}>
            <Card.Header>
              <Text style={styles.sectionTitle}>Tax Information</Text>
            </Card.Header>
            <Card.Body>
              <InfoRow label="SIN" value="•••-•••-1234" />
              <InfoRow label="Filing Status" value={user?.filingStatus || 'Single'} />
              <MenuItem
                icon="file-document"
                label="Tax Documents"
                onPress={() => navigation.navigate('Documents')}
              />
            </Card.Body>
          </Card>
        )}

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setShowLogoutModal(true)}
        >
          <Icon name="logout" size={24} color={colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Icon name="logout" size={48} color={colors.error} />
            <Text style={styles.modalTitle}>Log Out</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to log out?
            </Text>
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setShowLogoutModal(false)}
                style={styles.modalButton}
              />
              <Button
                title="Log Out"
                onPress={handleLogout}
                style={[styles.modalButton, styles.logoutModalButton]}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: typography.weights.bold,
    color: colors.primary[500],
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary[500],
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  userName: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  userBadge: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  userBadgeText: {
    ...typography.caption,
    color: colors.primary[500],
    fontWeight: typography.weights.medium,
  },
  infoCard: {
    marginBottom: spacing.md,
  },
  editCard: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h6,
    color: colors.text.primary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },
  infoValue: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: typography.weights.medium,
  },
  editField: {
    marginBottom: spacing.md,
  },
  editLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  editInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    ...typography.body,
    color: colors.text.primary,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  editActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  editButton: {
    flex: 1,
  },
  settingsCard: {
    marginBottom: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemLabel: {
    ...typography.body,
    color: colors.text.primary,
    marginLeft: spacing.md,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemValue: {
    ...typography.body,
    color: colors.text.secondary,
    marginRight: spacing.sm,
  },
  taxCard: {
    marginBottom: spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.error + '10',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutText: {
    ...typography.body,
    color: colors.error,
    fontWeight: typography.weights.medium,
    marginLeft: spacing.sm,
  },
  version: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  modalMessage: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  modalButton: {
    flex: 1,
  },
  logoutModalButton: {
    backgroundColor: colors.error,
  },
});

export default ProfileScreen;