import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '@/components/layout/AppHeader';
import Button from '@/components/ui/AppButton';
import Card from '@/components/ui/AppCard';
import { colors } from '@/styles/theme';
import { typography } from '@/styles/theme';
import { spacing, borderRadius } from '@/styles/theme';
import { PROVINCES, TAX_RATES, getTaxAgency } from '@/utils/taxUtils';

const RegisterScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Account Info
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    
    // Location
    province: 'ON',
    city: '',
    postalCode: '',
    
    // Business Info
    userType: 'individual', // individual, gig-worker, shop-owner, ca
    businessName: '',
    businessNumber: '',
    
    // Tax Info
    gstRegistered: false,
    hasBusinessNumber: false,
  });

  const [selectedProvinceInfo, setSelectedProvinceInfo] = useState(
    PROVINCES.find(p => p.code === 'ON')
  );

  const handleProvinceChange = (provinceCode) => {
    setFormData({ ...formData, province: provinceCode });
    const provinceInfo = PROVINCES.find(p => p.code === provinceCode);
    setSelectedProvinceInfo(provinceInfo);
    
    // Update business number format based on province
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header title="Create Account" showBack />

      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        {/* Progress Indicator */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: spacing.lg }}>
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: step >= s ? colors.primary[500] : colors.gray[300],
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: spacing.xs,
              }}
            >
              <Text style={{ color: colors.white, fontWeight: 'bold' }}>{s}</Text>
            </View>
          ))}
        </View>

        {step === 1 && (
          <Card>
            <Card.Body>
              <Text style={[typography.styles.h5, { marginBottom: spacing.lg }]}>
                Personal Information
              </Text>

              {/* Name Fields */}
              <View style={{ flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md }}>
                <View style={{ flex: 1 }}>
                  <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                    First Name
                  </Text>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: colors.gray[300],
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                      marginTop: spacing.xs,
                    }}
                    value={formData.firstName}
                    onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                    placeholder="John"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                    Last Name
                  </Text>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: colors.gray[300],
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                      marginTop: spacing.xs,
                    }}
                    value={formData.lastName}
                    onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                    placeholder="Doe"
                  />
                </View>
              </View>

              {/* Email */}
              <View style={{ marginBottom: spacing.md }}>
                <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                  Email Address
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: colors.gray[300],
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    marginTop: spacing.xs,
                  }}
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  keyboardType="email-address"
                  placeholder="john@example.com"
                />
              </View>

              {/* Phone */}
              <View style={{ marginBottom: spacing.md }}>
                <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                  Phone Number
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: colors.gray[300],
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    marginTop: spacing.xs,
                  }}
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  keyboardType="phone-pad"
                  placeholder="(416) 555-0123"
                />
              </View>

              {/* Password */}
              <View style={{ marginBottom: spacing.md }}>
                <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                  Password
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: colors.gray[300],
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    marginTop: spacing.xs,
                  }}
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  secureTextEntry
                  placeholder="********"
                />
              </View>

              {/* Confirm Password */}
              <View style={{ marginBottom: spacing.md }}>
                <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                  Confirm Password
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: colors.gray[300],
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    marginTop: spacing.xs,
                  }}
                  value={formData.confirmPassword}
                  onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
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
              <Text style={[typography.styles.h5, { marginBottom: spacing.lg }]}>
                Location & Tax Information
              </Text>

              {/* Province Selection - CRITICAL */}
              <View style={{ marginBottom: spacing.md }}>
                <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                  Province/Territory <Text style={{ color: colors.warning }}>*</Text>
                </Text>
                <View style={{
                  borderWidth: 1,
                  borderColor: colors.gray[300],
                  borderRadius: borderRadius.md,
                  marginTop: spacing.xs,
                }}>
                  <Picker
                    selectedValue={formData.province}
                    onValueChange={handleProvinceChange}
                    style={{ height: 50 }}
                  >
                    {PROVINCES.map(prov => (
                      <Picker.Item key={prov.code} label={prov.name} value={prov.code} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Province Tax Information Card */}
              <Card style={{ 
                backgroundColor: colors.primary[50], 
                marginBottom: spacing.md,
                borderWidth: 1,
                borderColor: colors.primary[200],
              }}>
                <Card.Body>
                  <Text style={[typography.styles.body2, { fontWeight: 'bold', marginBottom: spacing.xs }]}>
                    Tax Information for {selectedProvinceInfo?.name}
                  </Text>
                  <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                    Tax Type: {selectedProvinceInfo?.type}
                  </Text>
                  <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                    Rate: {getProvinceTaxInfo(formData.province)}
                  </Text>
                  <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                    Tax Agency: {selectedProvinceInfo?.taxAgency}
                  </Text>
                  {formData.province === 'QC' && (
                    <View style={{ 
                      marginTop: spacing.sm, 
                      padding: spacing.xs, 
                      backgroundColor: colors.info + '20',
                      borderRadius: borderRadius.sm,
                    }}>
                      <Text style={[typography.styles.caption, { color: colors.info }]}>
                        ⚠️ Quebec residents must file with both CRA and Revenu Québec
                      </Text>
                    </View>
                  )}
                </Card.Body>
              </Card>

              {/* City */}
              <View style={{ marginBottom: spacing.md }}>
                <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                  City
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: colors.gray[300],
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    marginTop: spacing.xs,
                  }}
                  value={formData.city}
                  onChangeText={(text) => setFormData({ ...formData, city: text })}
                  placeholder="Toronto"
                />
              </View>

              {/* Postal Code */}
              <View style={{ marginBottom: spacing.md }}>
                <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                  Postal Code
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: colors.gray[300],
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    marginTop: spacing.xs,
                  }}
                  value={formData.postalCode}
                  onChangeText={(text) => setFormData({ ...formData, postalCode: text })}
                  placeholder="M5V 2H1"
                />
              </View>

              {/* User Type */}
              <View style={{ marginBottom: spacing.md }}>
                <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                  I am a...
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs }}>
                  {['individual', 'gig-worker', 'shop-owner', 'ca'].map(type => (
                    <TouchableOpacity
                      key={type}
                      style={{
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.sm,
                        borderRadius: borderRadius.full,
                        backgroundColor: formData.userType === type ? colors.primary[500] : colors.gray[100],
                      }}
                      onPress={() => setFormData({ ...formData, userType: type })}
                    >
                      <Text style={{
                        color: formData.userType === type ? colors.white : colors.text.secondary,
                        textTransform: 'capitalize',
                      }}>
                        {type.replace('-', ' ')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Business Number (for businesses) */}
              {['shop-owner', 'ca'].includes(formData.userType) && (
                <>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}
                    onPress={() => setFormData({ ...formData, hasBusinessNumber: !formData.hasBusinessNumber })}
                  >
                    <Icon
                      name={formData.hasBusinessNumber ? 'checkbox-marked' : 'checkbox-blank-outline'}
                      size={24}
                      color={colors.primary[500]}
                    />
                    <Text style={[typography.styles.body2, { marginLeft: spacing.sm }]}>
                      I have a Business Number (BN)
                    </Text>
                  </TouchableOpacity>

                  {formData.hasBusinessNumber && (
                    <View style={{ marginBottom: spacing.md }}>
                      <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                        Business Number
                      </Text>
                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderColor: colors.gray[300],
                          borderRadius: borderRadius.md,
                            padding: spacing.md,
                          marginTop: spacing.xs,
                        }}
                        value={formData.businessNumber}
                        onChangeText={(text) => setFormData({ ...formData, businessNumber: text })}
                        placeholder={formData.province === 'QC' ? '123456789RQ0001' : '123456789RT0001'}
                      />
                      <Text style={[typography.styles.caption, { color: colors.gray[400], marginTop: 4 }]}>
                        Format: {formData.province === 'QC' ? '9 digits + RQ + 4 digits' : '9 digits + RT + 4 digits'}
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
              <Text style={[typography.styles.h5, { marginBottom: spacing.lg }]}>
                Review & Confirm
              </Text>

              <Card style={{ backgroundColor: colors.primary[50], marginBottom: spacing.md }}>
                <Card.Body>
                  <Text style={[typography.styles.body2, { fontWeight: 'bold' }]}>Account Summary</Text>
                  <Text>{formData.firstName} {formData.lastName}</Text>
                  <Text>{formData.email}</Text>
                  <Text>{formData.phone}</Text>
                </Card.Body>
              </Card>

              <Card style={{ backgroundColor: colors.primary[50], marginBottom: spacing.md }}>
                <Card.Body>
                  <Text style={[typography.styles.body2, { fontWeight: 'bold' }]}>Location & Tax</Text>
                  <Text>Province: {PROVINCES.find(p => p.code === formData.province)?.name}</Text>
                  <Text>Tax System: {getProvinceTaxInfo(formData.province)}</Text>
                  <Text>Agency: {PROVINCES.find(p => p.code === formData.province)?.taxAgency}</Text>
                  {formData.businessNumber && <Text>BN: {formData.businessNumber}</Text>}
                </Card.Body>
              </Card>

              {/* Quebec-specific warning */}
              {formData.province === 'QC' && (
                <Card style={{ backgroundColor: colors.warning.light, marginBottom: spacing.md }}>
                  <Card.Body>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Icon name="alert" size={24} color={colors.warning} />
                      <Text style={[typography.styles.body2, { color: colors.warning, marginLeft: spacing.sm, flex: 1 }]}>
                        As a Quebec resident, you'll need to file with both CRA and Revenu Québec. Your business number will start with RQ.
                      </Text>
                    </View>
                  </Card.Body>
                </Card>
              )}
            </Card.Body>
          </Card>
        )}

        {/* Navigation Buttons */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.lg }}>
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
              style={{ flex: step > 1 ? 1 : 1 }}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              onPress={() => {
                // Submit registration
                Alert.alert('Success', 'Account created successfully');
                navigation.navigate('Login');
              }}
              style={{ flex: 1 }}
            >
              Create Account
            </Button>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

