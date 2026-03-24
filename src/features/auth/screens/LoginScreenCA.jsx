import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/features/auth/context/AuthContext';

const LoginScreenCA = () => {
  const navigation = useNavigation();
  const { login, demoLogin } = useAuth();

  const [email, setEmail] = useState('ca@demo.com');
  const [password, setPassword] = useState('demo1234');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    setLoading(true);
    const result = await login(email, password, 'ca');
    setLoading(false);

    if (!result?.success) return;

    navigation.reset({
      index: 0,
      routes: [{ name: 'CAStack' }],
    });
  };

  const handleDemoCALogin = async () => {
    if (loading) return;

    setLoading(true);
    const result = await demoLogin('ca');
    setLoading(false);

    if (!result?.success) return;

    navigation.reset({
      index: 0,
      routes: [{ name: 'CAStack' }],
    });
  };

  const goToSignup = () => {
    navigation.navigate('RegisterScreenCA');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.heroSection}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>CA</Text>
          </View>

          <Text style={styles.brand}>TaxVault</Text>
          <Text style={styles.title}>Login as Chartered Accountant</Text>
          <Text style={styles.subtitle}>
            Access your CA dashboard, manage clients, and continue your tax
            workflow securely.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome back</Text>
          <Text style={styles.cardSubtitle}>
            Sign in with your CA account credentials
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.showHideButton}
                activeOpacity={0.8}
              >
                <Text style={styles.showHideText}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'Please wait...' : 'Login as CA'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, loading && styles.buttonDisabled]}
            onPress={handleDemoCALogin}
            disabled={loading}
            activeOpacity={0.9}
          >
            <Text style={styles.secondaryButtonText}>Use Demo CA Account</Text>
          </TouchableOpacity>

          <View style={styles.demoInfoBox}>
            <Text style={styles.demoInfoTitle}>Demo credentials</Text>
            <Text style={styles.demoInfoText}>Email: ca@demo.com</Text>
            <Text style={styles.demoInfoText}>Password: demo1234</Text>
          </View>
        </View>

        <View style={styles.footerSection}>
          <Text style={styles.footerText}>Don’t have a CA account?</Text>
          <TouchableOpacity onPress={goToSignup} activeOpacity={0.8}>
            <Text style={styles.footerLinkText}>Sign up as CA</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  backText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '700',
  },
  heroSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoBadgeText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  brand: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 34,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 23,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 21,
    marginBottom: 22,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    height: 54,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#0F172A',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#0F172A',
  },
  showHideButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  showHideText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
  },
  primaryButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  secondaryButtonText: {
    color: '#1D4ED8',
    fontSize: 15,
    fontWeight: '800',
  },
  demoInfoBox: {
    marginTop: 18,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  demoInfoTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  demoInfoText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  footerSection: {
    marginTop: 22,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 6,
  },
  footerLinkText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2563EB',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});

export default LoginScreenCA;
