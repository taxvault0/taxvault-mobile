import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/features/auth/context/AuthContext';
import { colors, spacing, typography, borderRadius } from '@/styles/theme';

const ProfileScreenCA = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <View style={styles.iconWrap}>
          <Icon name={icon} size={18} color={colors.primary[500]} />
        </View>
        <View style={styles.infoTextWrap}>
          <Text style={styles.infoLabel}>{label}</Text>
          <Text style={styles.infoValue}>{value || 'Not added'}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={22} color={colors.text.primary} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>CA Profile</Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Icon name="account-tie" size={42} color={colors.white} />
          </View>

          <Text style={styles.name}>{user?.name || 'CA User'}</Text>
          <Text style={styles.role}>Chartered Accountant</Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>Professional Account</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Details</Text>

          <InfoRow icon="email-outline" label="Email" value={user?.email} />
          <InfoRow icon="phone-outline" label="Phone" value={user?.phone} />
          <InfoRow icon="card-account-details-outline" label="CA Number" value={user?.caNumber} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Details</Text>

          <InfoRow icon="office-building-outline" label="Firm Name" value={user?.firmName} />
          <InfoRow icon="briefcase-outline" label="Specialization" value={user?.specialization} />
          <InfoRow
            icon="calendar-clock-outline"
            label="Years of Experience"
            value={user?.yearsOfExperience ? `${user.yearsOfExperience} years` : ''}
          />
          <InfoRow icon="identifier" label="Client ID" value={user?.clientId} />
          <InfoRow icon="calendar-star" label="Member Since" value={user?.memberSince} />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={20} color={colors.white} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...(typography.h3 || {}),
    color: colors.text.primary,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 40,
  },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  name: {
    ...(typography.h2 || {}),
    color: colors.text.primary,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  role: {
    ...(typography.body || {}),
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  badge: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: 999,
  },
  badgeText: {
    color: colors.primary[500],
    fontWeight: '700',
    fontSize: 13,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...(typography.h4 || {}),
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  infoRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  infoTextWrap: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#DC2626',
    borderRadius: borderRadius.lg,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  logoutText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ProfileScreenCA;
