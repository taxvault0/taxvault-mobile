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

import { theme } from '@/styles/theme';
import { useAuth } from '@/features/auth/context/AuthContext';
import { demoUsers, ENABLE_DEMO_LOGINS } from '@/features/auth/utils/loginScenarios';
import {
  validateLoginForm,
  getRememberedDemoPayload,
} from '@/features/auth/utils/loginHelpers';

const { colors, spacing, radius, typography, shadows } = theme;

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showDemoDropdown, setShowDemoDropdown] = useState(false);
  const [selectedDemoLabel, setSelectedDemoLabel] = useState('');
  const [errors, setErrors] = useState({});

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
    const validationErrors = validateLoginForm({ email, password }, 'user');
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    await handleLoginWithCredentials(email, password);
  };

  const handleSelectDemoUser = async (demoUser) => {
    const remembered = getRememberedDemoPayload(demoUser);

    setSelectedDemoLabel(demoUser.title);
    setEmail(remembered.email);
    setPassword(remembered.password);
    setErrors({});
    setShowDemoDropdown(false);

    await handleLoginWithCredentials(remembered.email, remembered.password);
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
                  color={colors.primary}
                />
                <Text style={styles.brandText}>TaxVault</Text>
              </View>

              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>

              <View style={styles.roleSummary}>
                <Icon name="account" size={18} color={colors.primary} />
                <Text style={styles.roleSummaryText}>Individual User</Text>
              </View>
            </View>

            <View style={styles.formCard}>
              {ENABLE_DEMO_LOGINS && (
                <>
                  <Text style={styles.sectionTitle}>Demo accounts</Text>

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
                        {demoUsers.map((item, index) => (
                          <TouchableOpacity
                            key={item.id}
                            style={[
                              styles.dropdownItem,
                              index === demoUsers.length - 1 && styles.dropdownItemLast,
                            ]}
                            onPress={() => handleSelectDemoUser(item)}
                            disabled={submitting}
                          >
                            <Text style={styles.dropdownItemText}>{item.title}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}

                  <View style={styles.divider} />
                </>
              )}

              <Text style={styles.sectionTitle}>Manual login</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
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
                    onChangeText={(value) => {
                      setEmail(value);
                      if (errors.email) {
                        setErrors((prev) => ({ ...prev, email: '' }));
                      }
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {!!errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
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
                    onChangeText={(value) => {
                      setPassword(value);
                      if (errors.password) {
                        setErrors((prev) => ({ ...prev, password: '' }));
                      }
                    }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
                    <Icon
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={colors.text.secondary}
                    />
                  </TouchableOpacity>
                </View>
                {!!errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
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
              <Icon name="arrow-left" size={16} color={colors.primary} />
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
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    ...shadows.soft,
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
    backgroundColor: colors.primarySoft,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  roleSummaryText: {
    marginLeft: spacing.xs,
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    ...shadows.medium,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  dropdownTrigger: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
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
    borderRadius: radius.md,
    backgroundColor: colors.surface,
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
  dropdownItemLast: {
    borderBottomWidth: 0,
  },
  dropdownItemText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
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
    borderRadius: radius.md,
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
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    marginTop: 6,
    color: colors.danger,
    fontSize: 12,
    fontWeight: '500',
  },
  forgotRow: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  loginButton: {
    minHeight: 52,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: colors.text.inverse,
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
    color: colors.primary,
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
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;




