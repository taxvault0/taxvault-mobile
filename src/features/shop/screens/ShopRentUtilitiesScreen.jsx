import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '@/components/layout/AppHeader';
import Card from '@/components/ui/AppCard';
import Button from '@/components/ui/AppButton';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';

const ShopRentUtilitiesScreen = ({ navigation }) => {
  const [rentAmount, setRentAmount] = React.useState('');
  const [utilitiesAmount, setUtilitiesAmount] = React.useState('');
  const [insuranceAmount, setInsuranceAmount] = React.useState('');
  const [maintenanceAmount, setMaintenanceAmount] = React.useState('');

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Rent & Utilities" showBack />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Monthly Expenses</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Rent/Mortgage</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.input}
                value={rentAmount}
                onChangeText={setRentAmount}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor={colors.gray[400]}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Utilities (Hydro, Gas, Water)</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.input}
                value={utilitiesAmount}
                onChangeText={setUtilitiesAmount}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor={colors.gray[400]}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Insurance</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.input}
                value={insuranceAmount}
                onChangeText={setInsuranceAmount}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor={colors.gray[400]}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Maintenance/Repairs</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.input}
                value={maintenanceAmount}
                onChangeText={setMaintenanceAmount}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor={colors.gray[400]}
              />
            </View>
          </View>

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Monthly:</Text>
            <Text style={styles.totalAmount}>
              ${(parseFloat(rentAmount || 0) + 
                 parseFloat(utilitiesAmount || 0) + 
                 parseFloat(insuranceAmount || 0) + 
                 parseFloat(maintenanceAmount || 0)).toFixed(2)}
            </Text>
          </View>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title="Save & Continue"
            onPress={() => navigation.navigate('ShopPayroll')}
            style={styles.button}
          />
          <Button
            title="Skip for Now"
            variant="outline"
            onPress={() => navigation.navigate('ShopPayroll')}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  card: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.body,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
  },
  currencySymbol: {
    ...typography.body,
    color: colors.text.secondary,
    paddingHorizontal: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingRight: spacing.sm,
    ...typography.body,
    color: colors.text.primary,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    ...typography.h6,
    color: colors.text.primary,
  },
  totalAmount: {
    ...typography.h5,
    color: colors.primary[500],
  },
  buttonContainer: {
    gap: spacing.md,
  },
  button: {
    marginBottom: spacing.sm,
  },
});

export default ShopRentUtilitiesScreen;

