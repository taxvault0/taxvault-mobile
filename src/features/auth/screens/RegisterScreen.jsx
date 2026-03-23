import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';
import { PROVINCES, TAX_RATES } from '@/utils/taxUtils';
import { useAuth } from '@/features/auth/context/AuthContext';

const RegisterScreen = ({ navigation, route }) => {
  const selectedUserType = route?.params?.userType || 'user';
  const isCA = selectedUserType === 'ca';
  const { login } = useAuth();

  const defaultFormUserType = isCA ? 'ca' : 'individual';

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    province: 'ON',
    city: '',
    postalCode: '',
    userType: defaultFormUserType,
    businessName: '',
    businessNumber: '',
    gstRegistered: false,
    hasBusinessNumber: isCA,
  });

  const [selectedProvinceInfo, setSelectedProvinceInfo] = useState(
    PROVINCES.find((p) => p.code === 'ON')
  );

  const title = useMemo(
    () => (isCA ? 'Create CA Account' : 'Create Individual Account'),
    [isCA]
  );

  const subtitle = useMemo(
    () =>
      isCA
        ? 'Set up your tax professional account.'
        : 'Set up your individual TaxVault account.',
    [isCA]
  );

  const handleProvinceChange = (provinceCode) => {
    setFormData({ ...formData, province: provinceCode });
    const provinceInfo = PROVINCES.find((p) => p.code === provinceCode);
    setSelectedProvinceInfo(provinceInfo);

    if (formData.hasBusinessNumber) {
      const prefix = provinceCode === 'QC' ? 'RQ' : 'RT';
      Alert.alert(
        'Business Number Format',
        `Your business number should start with ${prefix} for ${provinceInfo.name}`
      );
    }
  };

  const getProvinceTaxInfo = (provinceCode) => {
    const rates = TAX_RATES.provincial[provinceCode];
    if (!rates) return 'GST only (5%)';

    switch (rates.type) {
      case 'HST':
        return `HST ${(rates.rate * 100).toFixed(0)}% (includes GST)`;
      case 'PST':
        return `GST 5% + PST ${(rates.rate * 100).toFixed(0)}%`;
      case 'QST':
        return `GST 5% + QST ${(rates.rate * 100).toFixed(0)}%`;
      default:
        return 'GST only (5%)';
    }
  };

  const handleCreateAccount = async () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }

    const authenticatedUser = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email.trim().toLowerCase(),
      role: selectedUserType,
      userType: selectedUserType,
      province: formData.province,
    };

    if (typeof login === 'function') {
      try {
        await login(authenticatedUser);
        return;
      } catch (error) {
        console.log('Register error', error);
      }
    }

    Alert.alert('Success', 'Account created successfully');
    navigation.navigate('Login', { userType: selectedUserType });
  };

  const renderUserTypeSummary = () => (
    <View style={styles.roleSummary}>
      <Icon
        name={isCA ? 'account-tie' : 'account'}
        size={18}
        color={colors.primary[500]}
      />
      <Text style={styles.roleSummaryText}>
        {isCA ? 'Registering as Tax Professional (CA)' : 'Registering as Individual User'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerBlock}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          {renderUserTypeSummary()}
        </View>

        <View style={styles.progressRow}>
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              style={[
                styles.progressDot,
                step >= s && styles.progressDotActive,
              ]}
            >
              <Text style={styles.progressText}>{s}</Text>
            </View>
          ))}
        </View>

        {step === 1 && (
          <Card>
            <Card.Body>
              <Text style={styles.sectionTitle}>Personal Information</Text>

              <View style={styles.twoCol}>
                <View style={styles.flexOne}>
                  <Text style={styles.label}>First Name</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.firstName}
                    onChangeText={(text) =>
                      setFormData({ ...formData, firstName: text })
                    }
                    placeholder="John"
                  />
                </View>

                <View style={styles.flexOne}>
                  <Text style={styles.label}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.lastName}
                    onChangeText={(text) =>
                      setFormData({ ...formData, lastName: text })
                    }
                    placeholder="Doe"
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(text) =>
                    setFormData({ ...formData, email: text })
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="john@example.com"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={formData.phone}
                  onChangeText={(text) =>
                    setFormData({ ...formData, phone: text })
                  }
                  keyboardType="phone-pad"
                  placeholder="(416) 555-0123"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={formData.password}
                  onChangeText={(text) =>
                    setFormData({ ...formData, password: text })
                  }
                  secureTextEntry
                  placeholder="********"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  value={formData.confirmPassword}
                  onChangeText={(text) =>
                    setFormData({ ...formData, confirmPassword: text })
                  }
                  secureTextEntry
                  placeholder="********"
                />
              </View>
            </Card.Body>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <Card.Body>
              <Text style={styles.sectionTitle}>Location & Tax Information</Text>

              <View style={styles.field}>
                <Text style={styles.label}>Province/Territory</Text>
                <View style={styles.pickerWrap}>
                  <Picker
                    selectedValue={formData.province}
                    onValueChange={handleProvinceChange}
                    style={{ height: 50 }}
                  >
                    {PROVINCES.map((prov) => (
                      <Picker.Item
                        key={prov.code}
                        label={prov.name}
                        value={prov.code}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <Card
                style={{
                  backgroundColor: colors.primary[50],
                  marginBottom: spacing.md,
                  borderWidth: 1,
                  borderColor: colors.primary[200],
                }}
              >
                <Card.Body>
                  <Text style={styles.infoTitle}>
                    Tax Information for {selectedProvinceInfo?.name}
                  </Text>
                  <Text style={styles.infoText}>
                    Tax Type: {selectedProvinceInfo?.type}
                  </Text>
                  <Text style={styles.infoText}>
                    Rate: {getProvinceTaxInfo(formData.province)}
                  </Text>
                  <Text style={styles.infoText}>
                    Tax Agency: {selectedProvinceInfo?.taxAgency}
                  </Text>
                  {formData.province === 'QC' && (
                    <View style={styles.qcNotice}>
                      <Text style={styles.qcNoticeText}>
                        Quebec residents must file with both CRA and Revenu Québec
                      </Text>
                    </View>
                  )}
                </Card.Body>
              </Card>

              <View style={styles.field}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  value={formData.city}
                  onChangeText={(text) =>
                    setFormData({ ...formData, city: text })
                  }
                  placeholder="Toronto"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Postal Code</Text>
                <TextInput
                  style={styles.input}
                  value={formData.postalCode}
                  onChangeText={(text) =>
                    setFormData({ ...formData, postalCode: text })
                  }
                  placeholder="M5V 2H1"
                />
              </View>

              {isCA && (
                <>
                  <View style={styles.field}>
                    <Text style={styles.label}>Business Name</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.businessName}
                      onChangeText={(text) =>
                        setFormData({ ...formData, businessName: text })
                      }
                      placeholder="Your firm or practice name"
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() =>
                      setFormData({
                        ...formData,
                        hasBusinessNumber: !formData.hasBusinessNumber,
                      })
                    }
                  >
                    <Icon
                      name={
                        formData.hasBusinessNumber
                          ? 'checkbox-marked'
                          : 'checkbox-blank-outline'
                      }
                      size={24}
                      color={colors.primary[500]}
                    />
                    <Text style={styles.checkboxText}>
                      I have a Business Number (BN)
                    </Text>
                  </TouchableOpacity>

                  {formData.hasBusinessNumber && (
                    <View style={styles.field}>
                      <Text style={styles.label}>Business Number</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.businessNumber}
                        onChangeText={(text) =>
                          setFormData({ ...formData, businessNumber: text })
                        }
                        placeholder={
                          formData.province === 'QC'
                            ? '123456789RQ0001'
                            : '123456789RT0001'
                        }
                      />
                      <Text style={styles.helperText}>
                        Format:{' '}
                        {formData.province === 'QC'
                          ? '9 digits + RQ + 4 digits'
                          : '9 digits + RT + 4 digits'}
                      </Text>
                    </View>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <Card.Body>
              <Text style={styles.sectionTitle}>Review & Confirm</Text>

              <Card
                style={{ backgroundColor: colors.primary[50], marginBottom: spacing.md }}
              >
                <Card.Body>
                  <Text style={styles.infoTitle}>Account Summary</Text>
                  <Text style={styles.infoText}>
                    {formData.firstName} {formData.lastName}
                  </Text>
                  <Text style={styles.infoText}>{formData.email}</Text>
                  <Text style={styles.infoText}>{formData.phone}</Text>
                  <Text style={styles.infoText}>
                    Account Type: {isCA ? 'Tax Professional (CA)' : 'Individual User'}
                  </Text>
                </Card.Body>
              </Card>

              <Card
                style={{ backgroundColor: colors.primary[50], marginBottom: spacing.md }}
              >
                <Card.Body>
                  <Text style={styles.infoTitle}>Location & Tax</Text>
                  <Text style={styles.infoText}>
                    Province: {PROVINCES.find((p) => p.code === formData.province)?.name}
                  </Text>
                  <Text style={styles.infoText}>
                    Tax System: {getProvinceTaxInfo(formData.province)}
                  </Text>
                  <Text style={styles.infoText}>
                    Agency: {PROVINCES.find((p) => p.code === formData.province)?.taxAgency}
                  </Text>
                  {!!formData.businessNumber && (
                    <Text style={styles.infoText}>BN: {formData.businessNumber}</Text>
                  )}
                </Card.Body>
              </Card>

              {formData.province === 'QC' && (
                <Card
                  style={{ backgroundColor: colors.warning.light, marginBottom: spacing.md }}
                >
                  <Card.Body>
                    <View style={styles.warningRow}>
                      <Icon name="alert" size={24} color={colors.warning} />
                      <Text style={styles.warningText}>
                        As a Quebec resident, you'll need to file with both CRA and
                        Revenu Québec.
                      </Text>
                    </View>
                  </Card.Body>
                </Card>
              )}
            </Card.Body>
          </Card>
        )}

        <View style={styles.navButtons}>
          {step > 1 && (
            <Button
              variant="outline"
              onPress={() => setStep(step - 1)}
              style={{ flex: 1, marginRight: spacing.sm }}
            >
              Back
            </Button>
          )}

          {step < 3 ? (
            <Button
              variant="primary"
              onPress={() => setStep(step + 1)}
              style={{ flex: 1 }}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              onPress={handleCreateAccount}
              style={{ flex: 1 }}
            >
              {isCA ? 'Create CA Account' : 'Create Individual Account'}
            </Button>
          )}
        </View>

        <TouchableOpacity
          style={styles.bottomLink}
          onPress={() => navigation.navigate('Login', { userType: selectedUserType })}
        >
          <Text style={styles.bottomLinkText}>
            Already have an account?{' '}
            <Text style={styles.bottomLinkAccent}>
              {isCA ? 'Sign in as CA' : 'Sign in as Individual'}
            </Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.changeRoleLink}
          onPress={() => navigation.navigate('RoleSelection')}
        >
          <Icon name="arrow-left" size={16} color={colors.primary[500]} />
          <Text style={styles.changeRoleText}>Change role</Text>
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
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  headerBlock: {
    marginBottom: spacing.lg,
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
    marginBottom: spacing.md,
  },
  roleSummary: {
    alignSelf: 'center',
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
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  progressDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.gray[300],
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  progressDotActive: {
    backgroundColor: colors.primary[500],
  },
  progressText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  sectionTitle: {
    ...(typography.h5 || {}),
    marginBottom: spacing.lg,
    color: colors.text.primary,
  },
  twoCol: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  flexOne: {
    flex: 1,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    ...(typography.caption || {}),
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    backgroundColor: colors.white,
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    marginTop: spacing.xs,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  infoTitle: {
    ...(typography.body2 || {}),
    fontWeight: 'bold',
    marginBottom: spacing.xs,
    color: colors.text.primary,
  },
  infoText: {
    ...(typography.caption || {}),
    color: colors.text.secondary,
    marginBottom: 4,
  },
  qcNotice: {
    marginTop: spacing.sm,
    padding: spacing.xs,
    backgroundColor: `${colors.info}20`,
    borderRadius: borderRadius.sm,
  },
  qcNoticeText: {
    ...(typography.caption || {}),
    color: colors.info,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  checkboxText: {
    ...(typography.body2 || {}),
    marginLeft: spacing.sm,
    color: colors.text.primary,
  },
  helperText: {
    ...(typography.caption || {}),
    color: colors.gray[400],
    marginTop: 4,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningText: {
    ...(typography.body2 || {}),
    color: colors.warning,
    marginLeft: spacing.sm,
    flex: 1,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  bottomLink: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  bottomLinkText: {
    color: colors.text.secondary,
    fontSize: 14,
    textAlign: 'center',
  },
  bottomLinkAccent: {
    color: colors.primary[500],
    fontWeight: '700',
  },
  changeRoleLink: {
    marginTop: spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeRoleText: {
    marginLeft: spacing.xs,
    color: colors.primary[500],
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RegisterScreen;
