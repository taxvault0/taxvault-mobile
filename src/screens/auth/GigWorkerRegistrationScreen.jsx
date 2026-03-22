import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '@/components/layout/AppHeader';
import Button from '@/components/ui/AppButton';
import Card from '@/components/ui/AppCard';
import { colors } from '@/styles/theme';
import { typography } from '@/styles/theme';
import { spacing } from '@/styles/theme';

const GigWorkerRegisterScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { platforms } = route.params || { platforms: [] };

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    sin: '',
    
    // Business Info
    businessName: '',
    gstNumber: '',
    hstNumber: '',
    gstRegistered: false,
    businessAddress: '',
    
    // Vehicle Info
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehiclePlate: '',
    vehicleType: 'car',
    leaseOrOwn: 'own',
    leaseStartDate: '',
    leaseEndDate: '',
    
    // Insurance
    insuranceProvider: '',
    policyNumber: '',
    coverageType: '',
    expiryDate: '',
    
    // Platform Specific
    platforms: platforms,
    uberId: '',
    lyftId: '',
    urideId: '',
    doordashId: '',
    
    // Banking
    bankName: '',
    accountNumber: '',
    transitNumber: '',
    institutionNumber: '',
    
    // Preferences
    taxReminders: true,
    gstReminders: true,
    mileageAutoTrack: true,
  });

  const [errors, setErrors] = useState({});

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name required';
      if (!formData.lastName) newErrors.lastName = 'Last name required';
      if (!formData.email) newErrors.email = 'Email required';
      if (!formData.phone) newErrors.phone = 'Phone required';
      if (!formData.sin) newErrors.sin = 'SIN required';
      else if (!/^\d{9}$/.test(formData.sin)) newErrors.sin = 'SIN must be 9 digits';
    }

    if (step === 2) {
      if (!formData.vehicleMake) newErrors.vehicleMake = 'Vehicle make required';
      if (!formData.vehicleModel) newErrors.vehicleModel = 'Vehicle model required';
      if (!formData.vehicleYear) newErrors.vehicleYear = 'Vehicle year required';
      if (!formData.vehiclePlate) newErrors.vehiclePlate = 'License plate required';
    }

    if (step === 3) {
      if (!formData.insuranceProvider) newErrors.insuranceProvider = 'Insurance provider required';
      if (!formData.policyNumber) newErrors.policyNumber = 'Policy number required';
      if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date required';
    }

    if (step === 5) {
      if (formData.gstRegistered) {
        if (!formData.gstNumber) newErrors.gstNumber = 'GST number required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    Alert.alert(
      'Registration Complete',
      'Your gig worker profile has been created. Remember to upload your income summaries and start tracking mileage!',
      [
        {
          text: 'Go to Dashboard',
          onPress: () => navigation.navigate('DriverDashboard'),
        },
      ]
    );
  };

  const renderStepIndicator = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: spacing.lg }}>
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <View
          key={num}
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: step >= num ? colors.primary[500] : colors.gray[200],
            marginHorizontal: 4,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: step >= num ? colors.white : colors.gray[600] }}>
            {num}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header title="Driver Registration" showBack onBackPress={step > 1 ? handleBack : null} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing.lg }}>
        {renderStepIndicator()}

        {/* Step 1: Personal Information */}
        {step === 1 && (
          <View>
            <Text style={[typography.styles.h5, { marginBottom: spacing.lg }]}>Personal Information</Text>
            
            <View style={{ marginBottom: spacing.md }}>
              <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.xs }]}>
                First Name <Text style={{ color: colors.warning.main }}>*</Text>
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: errors.firstName ? colors.warning.main : colors.gray[300],
                  borderRadius: spacing.radius.md,
                  padding: spacing.md,
                  backgroundColor: colors.white,
                }}
                value={formData.firstName}
                onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                placeholder="John"
              />
              {errors.firstName && (
                <Text style={{ color: colors.warning.main, fontSize: typography.sizes.xs, marginTop: 4 }}>
                  {errors.firstName}
                </Text>
              )}
            </View>

            <View style={{ marginBottom: spacing.md }}>
              <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.xs }]}>
                Last Name <Text style={{ color: colors.warning.main }}>*</Text>
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: errors.lastName ? colors.warning.main : colors.gray[300],
                  borderRadius: spacing.radius.md,
                  padding: spacing.md,
                  backgroundColor: colors.white,
                }}
                value={formData.lastName}
                onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                placeholder="Doe"
              />
              {errors.lastName && (
                <Text style={{ color: colors.warning.main, fontSize: typography.sizes.xs, marginTop: 4 }}>
                  {errors.lastName}
                </Text>
              )}
            </View>

            <View style={{ marginBottom: spacing.md }}>
              <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.xs }]}>
                Email <Text style={{ color: colors.warning.main }}>*</Text>
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: errors.email ? colors.warning.main : colors.gray[300],
                  borderRadius: spacing.radius.md,
                  padding: spacing.md,
                  backgroundColor: colors.white,
                }}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="driver@email.com"
                keyboardType="email-address"
              />
              {errors.email && (
                <Text style={{ color: colors.warning.main, fontSize: typography.sizes.xs, marginTop: 4 }}>
                  {errors.email}
                </Text>
              )}
            </View>

            <View style={{ marginBottom: spacing.md }}>
              <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.xs }]}>
                Phone Number <Text style={{ color: colors.warning.main }}>*</Text>
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: errors.phone ? colors.warning.main : colors.gray[300],
                  borderRadius: spacing.radius.md,
                  padding: spacing.md,
                  backgroundColor: colors.white,
                }}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="(416) 555-0123"
                keyboardType="phone-pad"
              />
              {errors.phone && (
                <Text style={{ color: colors.warning.main, fontSize: typography.sizes.xs, marginTop: 4 }}>
                  {errors.phone}
                </Text>
              )}
            </View>

            <View style={{ marginBottom: spacing.md }}>
              <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.xs }]}>
                Date of Birth
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: colors.gray[300],
                  borderRadius: spacing.radius.md,
                  padding: spacing.md,
                  backgroundColor: colors.white,
                }}
                value={formData.dateOfBirth}
                onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={{ marginBottom: spacing.md }}>
              <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.xs }]}>
                Social Insurance Number (SIN) <Text style={{ color: colors.warning.main }}>*</Text>
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: errors.sin ? colors.warning.main : colors.gray[300],
                  borderRadius: spacing.radius.md,
                  padding: spacing.md,
                  backgroundColor: colors.white,
                }}
                value={formData.sin}
                onChangeText={(text) => setFormData({ ...formData, sin: text })}
                placeholder="123 456 789"
                keyboardType="numeric"
                secureTextEntry
              />
              {errors.sin && (
                <Text style={{ color: colors.warning.main, fontSize: typography.sizes.xs, marginTop: 4 }}>
                  {errors.sin}
                </Text>
              )}
            </View>

            <Button variant="primary" onPress={handleNext} style={{ marginTop: spacing.lg }}>
              Next: Vehicle Info
            </Button>
          </View>
        )}

        {/* Step 2: Vehicle Information */}
        {step === 2 && (
          <View>
            <Text style={[typography.styles.h5, { marginBottom: spacing.lg }]}>Vehicle Information</Text>
            
            <View style={{ marginBottom: spacing.md }}>
              <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.xs }]}>
                Vehicle Make <Text style={{ color: colors.warning.main }}>*</Text>
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: errors.vehicleMake ? colors.warning.main : colors.gray[300],
                  borderRadius: spacing.radius.md,
                  padding: spacing.md,
                  backgroundColor: colors.white,
                }}
                value={formData.vehicleMake}
                onChangeText={(text) => setFormData({ ...formData, vehicleMake: text })}
                placeholder="Toyota"
              />
            </View>

            <View style={{ marginBottom: spacing.md }}>
              <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.xs }]}>
                Vehicle Model <Text style={{ color: colors.warning.main }}>*</Text>
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: errors.vehicleModel ? colors.warning.main : colors.gray[300],
                  borderRadius: spacing.radius.md,
                  padding: spacing.md,
                  backgroundColor: colors.white,
                }}
                value={formData.vehicleModel}
                onChangeText={(text) => setFormData({ ...formData, vehicleModel: text })}
                placeholder="Corolla"
              />
            </View>

            <View style={{ marginBottom: spacing.md }}>
              <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.xs }]}>
                Vehicle Year <Text style={{ color: colors.warning.main }}>*</Text>
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: errors.vehicleYear ? colors.warning.main : colors.gray[300],
                  borderRadius: spacing.radius.md,
                  padding: spacing.md,
                  backgroundColor: colors.white,
                }}
                value={formData.vehicleYear}
                onChangeText={(text) => setFormData({ ...formData, vehicleYear: text })}
                placeholder="2022"
                keyboardType="numeric"
              />
            </View>

            <View style={{ marginBottom: spacing.md }}>
              <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.xs }]}>
                License Plate <Text style={{ color: colors.warning.main }}>*</Text>
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: errors.vehiclePlate ? colors.warning.main : colors.gray[300],
                  borderRadius: spacing.radius.md,
                  padding: spacing.md,
                  backgroundColor: colors.white,
                }}
                value={formData.vehiclePlate}
                onChangeText={(text) => setFormData({ ...formData, vehiclePlate: text })}
                placeholder="ABC 123"
                autoCapitalize="characters"
              />
            </View>

            <View style={{ marginBottom: spacing.md }}>
              <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.xs }]}>
                Ownership
              </Text>
              <View style={{ flexDirection: 'row', gap: spacing.md }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    padding: spacing.md,
                    borderRadius: spacing.radius.md,
                    backgroundColor: formData.leaseOrOwn === 'own' ? colors.primary[500] : colors.gray[100],
                    alignItems: 'center',
                  }}
                  onPress={() => setFormData({ ...formData, leaseOrOwn: 'own' })}
                >
                  <Text style={{ color: formData.leaseOrOwn === 'own' ? colors.white : colors.text.primary }}>
                    Own
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    padding: spacing.md,
                    borderRadius: spacing.radius.md,
                    backgroundColor: formData.leaseOrOwn === 'lease' ? colors.primary[500] : colors.gray[100],
                    alignItems: 'center',
                  }}
                  onPress={() => setFormData({ ...formData, leaseOrOwn: 'lease' })}
                >
                  <Text style={{ color: formData.leaseOrOwn === 'lease' ? colors.white : colors.text.primary }}>
                    Lease
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {formData.leaseOrOwn === 'lease' && (
              <>
                <View style={{ marginBottom: spacing.md }}>
                  <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.xs }]}>
                    Lease Start Date
                  </Text>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: colors.gray[300],
                      borderRadius: spacing.radius.md,
                      padding: spacing.md,
                      backgroundColor: colors.white,
                    }}
                    value={formData.leaseStartDate}
                    onChangeText={(text) => setFormData({ ...formData, leaseStartDate: text })}
                    placeholder="YYYY-MM-DD"
                  />
                </View>

                <View style={{ marginBottom: spacing.md }}>
                  <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.xs }]}>
                    Lease End Date
                  </Text>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: colors.gray[300],
                      borderRadius: spacing.radius.md,
                      padding: spacing.md,
                      backgroundColor: colors.white,
                    }}
                    value={formData.leaseEndDate}
                    onChangeText={(text) => setFormData({ ...formData, leaseEndDate: text })}
                    placeholder="YYYY-MM-DD"
                  />
                </View>
              </>
            )}

            <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg }}>
              <Button variant="outline" onPress={handleBack} style={{ flex: 1 }}>
                Back
              </Button>
              <Button variant="primary" onPress={handleNext} style={{ flex: 1 }}>
                Next: Insurance
              </Button>
            </View>
          </View>
        )}

        {/* Step 3: Insurance Information */}
        {step === 3 && (
          <View>
            <Text style={[typography.styles.h5, { marginBottom: spacing.lg }]}>Insurance Information</Text>
            
            <Card style={{ marginBottom: spacing.lg, backgroundColor: colors.warning.light }}>
              <Card.Body>
                <Text style={[typography.styles.body2, { color: colors.warning.main }]}>
                  ⚠️ Commercial insurance is required for rideshare driving. Personal insurance does NOT cover commercial activities.
                </Text>
              </Card.Body>
            </Card>

            <View style={{ marginBottom: spacing.md }}>
              <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.xs }]}>
                Insurance Provider <Text style={{ color: colors.warning.main }}>*</Text>
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: errors.insuranceProvider ? colors.warning.main : colors.gray[300],
                  borderRadius: spacing.radius.md,
                  padding: spacing.md,
                  backgroundColor: colors.white,
                }}
                value={formData.insuranceProvider}
                onChangeText={(text) => setFormData({ ...formData, insuranceProvider: text })}
                placeholder="e.g., Intact, Belairdirect"
              />
            </View>

            <View style={{ marginBottom: spacing.md }}>
              <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.xs }]}>
                Policy Number <Text style={{ color: colors.warning.main }}>*</Text>
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: errors.policyNumber ? colors.warning.main : colors.gray[300],
                  borderRadius: spacing.radius.md,
                  padding: spacing.md,
                  backgroundColor: colors.white,
                }}
                value={formData.policyNumber}
                onChangeText={(text) => setFormData({ ...formData, policyNumber: text })}
                placeholder="POL-123456"
              />
            </View>

            <View style={{ marginBottom: spacing.md }}>
              <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.xs }]}>
                Coverage Type
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: colors.gray[300],
                  borderRadius: spacing.radius.md,
                  padding: spacing.md,
                  backgroundColor: colors.white,
                }}
                value={formData.coverageType}
                onChangeText={(text) => setFormData({ ...formData, coverageType: text })}
                placeholder="e.g., Comprehensive, Liability"
              />
            </View>

            <View style={{ marginBottom: spacing.md }}>
              <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.xs }]}>
                Policy Expiry Date <Text style={{ color: colors.warning.main }}>*</Text>
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: errors.expiryDate ? colors.warning.main : colors.gray[300],
                  borderRadius: spacing.radius.md,
                  padding: spacing.md,
                  backgroundColor: colors.white,
                }}
                value={formData.expiryDate}
                onChangeText={(text) => setFormData({ ...formData, expiryDate: text })}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg }}>
              <Button variant="outline" onPress={handleBack} style={{ flex: 1 }}>
                Back
              </Button>
              <Button variant="primary" onPress={handleNext} style={{ flex: 1 }}>
                Next: Platform IDs
              </Button>
            </View>
          </View>
        )}

        {/* Step 4: Platform IDs */}
        {step === 4 && (
          <View>
            <Text style={[typography.styles.h5, { marginBottom: spacing.lg }]}>Platform Account IDs</Text>
            
            <Text style={[typography.styles.body2, { color: colors.text.secondary, marginBottom: spacing.lg }]}>
              Enter your driver IDs from each platform to help import your income summaries automatically.
            </Text>

            {platforms.includes('uber') && (
              <View style={{ marginBottom: spacing.md }}>
                <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.xs }]}>
                  Uber Driver ID
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: colors.gray[300],
                    borderRadius: spacing.radius.md,
                    padding: spacing.md,
                    backgroundColor: colors.white,
                  }}
                  value={formData.uberId}
                  onChangeText={(text) => setFormData({ ...formData, uberId: text })}
                  placeholder="Enter your Uber ID"
                />
              </View>
            )}

            {platforms.includes('lyft') && (
              <View style={{ marginBottom: spacing.md }}>
                <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.xs }]}>
                  Lyft Driver ID
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: colors.gray[300],
                    borderRadius: spacing.radius.md,
                    padding: spacing.md,
                    backgroundColor: colors.white,
                  }}
                  value={formData.lyftId}
                  onChangeText={(text) => setFormData({ ...formData, lyftId: text })}
                  placeholder="Enter your Lyft ID"
                />
              </View>
            )}

            {platforms.includes('uride') && (
              <View style={{ marginBottom: spacing.md }}>
                <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.xs }]}>
                  Uride Driver ID
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: colors.gray[300],
                    borderRadius: spacing.radius.md,
                    padding: spacing.md,
                    backgroundColor: colors.white,
                  }}
                  value={formData.urideId}
                  onChangeText={(text) => setFormData({ ...formData, urideId: text })}
                  placeholder="Enter your Uride ID"
                />
              </View>
            )}

            {platforms.includes('doordash') && (
              <View style={{ marginBottom: spacing.md }}>
                <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.xs }]}>
                  DoorDash Driver ID
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: colors.gray[300],
                    borderRadius: spacing.radius.md,
                    padding: spacing.md,
                    backgroundColor: colors.white,
                  }}
                  value={formData.doordashId}
                  onChangeText={(text) => setFormData({ ...formData, doordashId: text })}
                  placeholder="Enter your DoorDash ID"
                />
              </View>
            )}

            <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg }}>
              <Button variant="outline" onPress={handleBack} style={{ flex: 1 }}>
                Back
              </Button>
              <Button variant="primary" onPress={handleNext} style={{ flex: 1 }}>
                Next: GST/HST
              </Button>
            </View>
          </View>
        )}

        {/* Step 5: GST/HST Registration */}
        {step === 5 && (
          <View>
            <Text style={[typography.styles.h5, { marginBottom: spacing.lg }]}>GST/HST Registration</Text>
            
            <Card style={{ marginBottom: spacing.lg, backgroundColor: colors.primary[50] }}>
              <Card.Body>
                <Text style={[typography.styles.body2, { color: colors.primary[700] }]}>
                  🍁 CRA Requirement: All rideshare drivers must register for GST/HST immediately, even if you earn less than $30,000.
                </Text>
              </Card.Body>
            </Card>

            <View style={{ marginBottom: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={[typography.styles.body1]}>I have registered for GST/HST</Text>
                <Switch
                  value={formData.gstRegistered}
                  onValueChange={(value) => setFormData({ ...formData, gstRegistered: value })}
                  trackColor={{ false: colors.gray[300], true: colors.primary[500] }}
                />
              </View>
            </View>

            {formData.gstRegistered && (
              <>
                <View style={{ marginBottom: spacing.md }}>
                  <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.xs }]}>
                    GST Number <Text style={{ color: colors.warning.main }}>*</Text>
                  </Text>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: errors.gstNumber ? colors.warning.main : colors.gray[300],
                      borderRadius: spacing.radius.md,
                      padding: spacing.md,
                      backgroundColor: colors.white,
                    }}
                    value={formData.gstNumber}
                    onChangeText={(text) => setFormData({ ...formData, gstNumber: text })}
                    placeholder="123456789RT0001"
                  />
                </View>

                <View style={{ marginBottom: spacing.md }}>
                  <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.xs }]}>
                    HST Number (if applicable)
                  </Text>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: colors.gray[300],
                      borderRadius: spacing.radius.md,
                      padding: spacing.md,
                      backgroundColor: colors.white,
                    }}
                    value={formData.hstNumber}
                    onChangeText={(text) => setFormData({ ...formData, hstNumber: text })}
                    placeholder="123456789RT0001"
                  />
                </View>
              </>
            )}

            <View style={{ marginBottom: spacing.md }}>
              <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.xs }]}>
                Business Name (Optional)
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: colors.gray[300],
                  borderRadius: spacing.radius.md,
                  padding: spacing.md,
                  backgroundColor: colors.white,
                }}
                value={formData.businessName}
                onChangeText={(text) => setFormData({ ...formData, businessName: text })}
                placeholder="Your driving business name"
              />
            </View>

            <View style={{ marginBottom: spacing.md }}>
              <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.xs }]}>
                Business Address
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: colors.gray[300],
                  borderRadius: spacing.radius.md,
                  padding: spacing.md,
                  backgroundColor: colors.white,
                }}
                value={formData.businessAddress}
                onChangeText={(text) => setFormData({ ...formData, businessAddress: text })}
                placeholder="Your business address"
                multiline
                numberOfLines={2}
              />
            </View>

            <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg }}>
              <Button variant="outline" onPress={handleBack} style={{ flex: 1 }}>
                Back
              </Button>
              <Button variant="primary" onPress={handleNext} style={{ flex: 1 }}>
                Next: Preferences
              </Button>
            </View>
          </View>
        )}

        {/* Step 6: Preferences & Review */}
        {step === 6 && (
          <View>
            <Text style={[typography.styles.h5, { marginBottom: spacing.lg }]}>Preferences & Review</Text>
            
            <Card style={{ marginBottom: spacing.md }}>
              <Card.Body>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
                  <Text style={[typography.styles.body1]}>Tax Reminders</Text>
                  <Switch
                    value={formData.taxReminders}
                    onValueChange={(value) => setFormData({ ...formData, taxReminders: value })}
                    trackColor={{ false: colors.gray[300], true: colors.primary[500] }}
                  />
                </View>
                <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                  Get reminders for quarterly tax installments and filing deadlines
                </Text>
              </Card.Body>
            </Card>

            <Card style={{ marginBottom: spacing.md }}>
              <Card.Body>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
                  <Text style={[typography.styles.body1]}>GST/HST Reminders</Text>
                  <Switch
                    value={formData.gstReminders}
                    onValueChange={(value) => setFormData({ ...formData, gstReminders: value })}
                    trackColor={{ false: colors.gray[300], true: colors.primary[500] }}
                  />
                </View>
                <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                  Get reminders for GST/HST filing deadlines (quarterly/annually)
                </Text>
              </Card.Body>
            </Card>

            <Card style={{ marginBottom: spacing.lg }}>
              <Card.Body>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
                  <Text style={[typography.styles.body1]}>Auto-Track Mileage</Text>
                  <Switch
                    value={formData.mileageAutoTrack}
                    onValueChange={(value) => setFormData({ ...formData, mileageAutoTrack: value })}
                    trackColor={{ false: colors.gray[300], true: colors.primary[500] }}
                  />
                </View>
                <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                  Automatically track your driving mileage for business vs personal use
                </Text>
              </Card.Body>
            </Card>

            {/* Summary */}
            <Card style={{ marginBottom: spacing.lg }}>
              <Card.Header>
                <Text style={[typography.styles.h6]}>Registration Summary</Text>
              </Card.Header>
              <Card.Body>
                <Text style={[typography.styles.body2, { marginBottom: spacing.xs }]}>
                  <Text style={{ fontWeight: typography.weights.bold }}>Name:</Text> {formData.firstName} {formData.lastName}
                </Text>
                <Text style={[typography.styles.body2, { marginBottom: spacing.xs }]}>
                  <Text style={{ fontWeight: typography.weights.bold }}>Vehicle:</Text> {formData.vehicleYear} {formData.vehicleMake} {formData.vehicleModel}
                </Text>
                <Text style={[typography.styles.body2, { marginBottom: spacing.xs }]}>
                  <Text style={{ fontWeight: typography.weights.bold }}>Platforms:</Text> {platforms.join(', ')}
                </Text>
                <Text style={[typography.styles.body2]}>
                  <Text style={{ fontWeight: typography.weights.bold }}>GST/HST Registered:</Text> {formData.gstRegistered ? 'Yes' : 'No'}
                </Text>
              </Card.Body>
            </Card>

            <Button variant="primary" onPress={handleSubmit}>
              Complete Registration
            </Button>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default GigWorkerRegisterScreen;

