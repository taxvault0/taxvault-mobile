import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, borderRadius } from '@/styles/theme';
import { useAuth } from '@/features/auth/context/AuthContext';

const INCOME_STATES = [
  { key: 'unemployed', label: 'Unemployed' },
  { key: 'self-employed', label: 'Self-employed / Gig Worker' },
  { key: 'employed', label: 'Employed' },
  { key: 'business', label: 'Business' },
  { key: 'self-employed-employed', label: 'Self-employed + Employed' },
  { key: 'self-employed-business', label: 'Self-employed + Business' },
  { key: 'employed-business', label: 'Employed + Business' },
  {
    key: 'self-employed-employed-business',
    label: 'Self-employed + Employed + Business',
  },
];

const buildDemoOptions = () => {
  const options = [];

  INCOME_STATES.forEach((state, index) => {
    options.push({
      key: `single-${state.key}`,
      label: `Single User — ${state.label}`,
      email: `user${index + 1}@demo.com`,
      password: 'demo1234',
    });
  });

  let householdCount = 1;

  INCOME_STATES.forEach((userState) => {
    INCOME_STATES.forEach((spouseState) => {
      options.push({
        key: `household-${userState.key}-${spouseState.key}`,
        label: `User: ${userState.label} • Spouse: ${spouseState.label}`,
        email: `household${householdCount}@demo.com`,
        password: 'demo1234',
      });
      householdCount += 1;
    });
  });

  return options;
};

const DEMO_USER_OPTIONS = buildDemoOptions();

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showDemoDropdown, setShowDemoDropdown] = useState(false);
  const [selectedDemoLabel, setSelectedDemoLabel] = useState('');

  const title = useMemo(() => 'Sign in as Individual User', []);
  const subtitle = useMemo(
    () => 'Access receipts, mileage, documents, and tax tools.',
    []
  );

  const handleLoginWithCredentials = async (loginEmail, loginPassword) => {
    try {
      setSubmitting(true);
      await login(loginEmail.trim().toLowerCase(), loginPassword.trim(), 'user');
    } catch (error) {
      console.log('Login error', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;
    await handleLoginWithCredentials(email, password);
  };

  const handleSelectDemoUser = async (demoUser) => {
    setSelectedDemoLabel(demoUser.label);
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    setShowDemoDropdown(false);
    await handleLoginWithCredentials(demoUser.email, demoUser.password);
  };

  const handleGoToRegister = () => {
    navigation.navigate('RegisterScreen', { userType: 'user' });
  };

  const handleChangeRole = () => {
    navigation.navigate('RoleSelection');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.topSection}>
              <View style={styles.brandBadge}>
                <Icon
                  name="shield-check-outline"
                  size={22}
                  color={colors.primary[500]}
                />
                <Text style={styles.brandText}>TaxVault</Text>
              </View>

              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>

              <View style={styles.roleSummary}>
                <Icon name="account" size={18} color={colors.primary[500]} />
                <Text style={styles.roleSummaryText}>Individual User</Text>
              </View>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>Demo accounts</Text>
              <Text style={styles.sectionSubtitle}>
                8 single-user scenarios + 64 user/spouse scenarios
              </Text>

              <TouchableOpacity
                style={styles.dropdownTrigger}
                onPress={() => setShowDemoDropdown((prev) => !prev)}
                activeOpacity={0.85}
              >
                <View style={styles.dropdownTriggerLeft}>
                  <Icon
                    name="account-multiple-outline"
                    size={20}
                    color={colors.text.secondary}
                  />
                  <Text
                    style={[
                      styles.dropdownTriggerText,
                      !selectedDemoLabel && styles.dropdownPlaceholder,
                    ]}
                  >
                    {selectedDemoLabel || 'Select demo user scenario'}
                  </Text>
                </View>
                <Icon
                  name={showDemoDropdown ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.text.secondary}
                />
              </TouchableOpacity>

              {showDemoDropdown && (
                <View style={styles.dropdownMenu}>
                  <ScrollView
                    style={styles.dropdownScroll}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator
                  >
                    {DEMO_USER_OPTIONS.map((item) => (
                      <TouchableOpacity
                        key={item.key}
                        style={styles.dropdownItem}
                        onPress={() => handleSelectDemoUser(item)}
                        disabled={submitting}
                      >
                        <Text style={styles.dropdownItemText}>{item.label}</Text>
                        <Text style={styles.dropdownItemEmail}>{item.email}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>Manual login</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrapper}>
                  <Icon
                    name="email-outline"
                    size={20}
                    color={colors.text.secondary}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.text.secondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Icon
                    name="lock-outline"
                    size={20}
                    color={colors.text.secondary}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.text.secondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword((prev) => !prev)}
                  >
                    <Icon
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={colors.text.secondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.forgotRow}
                onPress={handleForgotPassword}
              >
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.loginButton, submitting && styles.loginButtonDisabled]}
                onPress={handleLogin}
                activeOpacity={0.85}
                disabled={submitting}
              >
                <Text style={styles.loginButtonText}>
                  {submitting ? 'Signing in...' : 'Sign in as Individual'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.registerRow}
                onPress={handleGoToRegister}
              >
                <Text style={styles.registerText}>
                  Don’t have an account?{' '}
                  <Text style={styles.registerLink}>Create individual account</Text>
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.backToRoles}
              onPress={handleChangeRole}
            >
              <Icon name="arrow-left" size={16} color={colors.primary[500]} />
              <Text style={styles.backToRolesText}>Change role</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  brandText: {
    marginLeft: spacing.xs,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  title: {
    ...(typography.h2 || {}),
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...(typography.body || {}),
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  roleSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  roleSummaryText: {
    marginLeft: spacing.xs,
    color: colors.primary[500],
    fontSize: 14,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl || 20,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  dropdownTrigger: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownTriggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dropdownTriggerText: {
    marginLeft: spacing.sm,
    color: colors.text.primary,
    fontSize: 15,
    flexShrink: 1,
  },
  dropdownPlaceholder: {
    color: colors.text.secondary,
  },
  dropdownMenu: {
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  dropdownScroll: {
    maxHeight: 280,
  },
  dropdownItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  dropdownItemEmail: {
    color: colors.text.secondary,
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    marginLeft: spacing.sm,
    color: colors.text.primary,
    fontSize: 15,
  },
  forgotRow: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotText: {
    color: colors.primary[500],
    fontSize: 13,
    fontWeight: '600',
  },
  loginButton: {
    minHeight: 52,
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  registerRow: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  registerText: {
    color: colors.text.secondary,
    fontSize: 14,
    textAlign: 'center',
  },
  registerLink: {
    color: colors.primary[500],
    fontWeight: '700',
  },
  backToRoles: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  backToRolesText: {
    marginLeft: spacing.xs,
    color: colors.primary[500],
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;