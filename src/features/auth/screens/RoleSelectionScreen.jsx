import { StyleSheet } from 'react-native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';

const RoleSelectionScreen = ({ navigation }) => {
  const handleSelectRole = (role) => {
    navigation.navigate('Register', { userType: role });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Join TaxVault</Text>
        <Text style={styles.subtitle}>Choose your account type to get started</Text>
      </View>

      <View style={styles.optionsContainer}>
        {/* Individual User Option */}
        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => handleSelectRole('user')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.primary[50] }]}>
            <Icon name="account" size={40} color={colors.primary[500]} />
          </View>
          <View style={styles.roleInfo}>
            <Text style={styles.roleTitle}>Individual User</Text>
            <Text style={styles.roleDescription}>
              For gig workers, contractors, employees, and individuals managing personal taxes
            </Text>
          </View>
          <View style={styles.featuresList}>
            <Feature icon="receipt" text="Receipt scanning & tracking" />
            <Feature icon="map-marker-distance" text="Mileage tracking" />
            <Feature icon="file-document" text="Document storage" />
            <Feature icon="chart-line" text="Tax estimates & insights" />
          </View>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => handleSelectRole('user')}
          >
            <Text style={styles.selectButtonText}>Continue as Individual</Text>
            <Icon name="arrow-right" size={20} color={colors.white} />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* CA/Professional Option */}
        <TouchableOpacity
          style={[styles.roleCard, styles.caCard]}
          onPress={() => handleSelectRole('ca')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.secondary + '20' }]}>
            <Icon name="account-tie" size={40} color={colors.secondary} />
          </View>
          <View style={styles.roleInfo}>
            <Text style={styles.roleTitle}>Tax Professional (CA)</Text>
            <Text style={styles.roleDescription}>
              For accountants and tax professionals managing multiple clients
            </Text>
          </View>
          <View style={styles.featuresList}>
            <Feature icon="account-group" text="Client management" />
            <Feature icon="file-multiple" text="Bulk document processing" />
            <Feature icon="chart-box" text="Practice analytics" />
            <Feature icon="shield-account" text="Client access controls" />
          </View>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>Professional</Text>
          </View>
          <TouchableOpacity
            style={[styles.selectButton, styles.caButton]}
            onPress={() => handleSelectRole('ca')}
          >
            <Text style={styles.selectButtonText}>Continue as Professional</Text>
            <Icon name="arrow-right" size={20} color={colors.white} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Feature component for bullet points
const Feature = ({ icon, text }) => (
  <View style={styles.feature}>
    <Icon name={icon} size={16} color={colors.primary[500]} />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  optionsContainer: {
    padding: spacing.lg,
  },
  roleCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  caCard: {
    borderColor: colors.secondary,
    borderWidth: 2,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    alignSelf: 'center',
  },
  roleInfo: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  roleTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  roleDescription: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  featuresList: {
    marginBottom: spacing.lg,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  featureText: {
    ...typography.body,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  selectButton: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  caButton: {
    backgroundColor: colors.secondary,
  },
  selectButtonText: {
    ...typography.button,
    color: colors.white,
    marginRight: spacing.sm,
  },
  badgeContainer: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  footerText: {
    ...typography.body,
    color: colors.text.secondary,
    marginRight: spacing.xs,
  },
  footerLink: {
    ...typography.body,
    color: colors.primary[500],
    fontWeight: '600',
  },
});

export default RoleSelectionScreen;



