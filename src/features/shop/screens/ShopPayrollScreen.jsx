import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '@/components/layout/AppHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';
import { useSingleDocumentPicker } from '@/hooks/useDocumentPicker';

const ShopPayrollScreen = () => {
  const [employees, setEmployees] = useState([
    {
      id: '1',
      name: 'Sarah Johnson',
      position: 'Cashier',
      startDate: '2023-06-15',
      sin: '***-***-1234',
      status: 'active',
    },
    {
      id: '2',
      name: 'Mike Chen',
      position: 'Stock Clerk',
      startDate: '2023-08-01',
      sin: '***-***-5678',
      status: 'active',
    },
    {
      id: '3',
      name: 'Lisa Patel',
      position: 'Part-time Cashier',
      startDate: '2024-01-10',
      sin: '***-***-9012',
      status: 'active',
    },
  ]);

  const [payrollDocuments, setPayrollDocuments] = useState({
    payrollSummaries: {
      'Q1-2024': 'uploaded',
      'Q2-2024': 'pending',
      'Q3-2024': 'missing',
      'Q4-2024': 'missing',
    },
    sourceDeductions: {
      'January-2024': 'uploaded',
      'February-2024': 'uploaded',
      'March-2024': 'pending',
      'April-2024': 'missing',
    },
    pd7aStatements: {
      'January-2024': 'uploaded',
      'February-2024': 'uploaded',
      'March-2024': 'pending',
      'April-2024': 'missing',
    },
    t4Slips: {
      '2023': 'uploaded',
      '2024': 'missing',
    },
  });

  const { pickDocument } = useSingleDocumentPicker({
    onSuccess: (file) => {
      console.log('Selected file:', file.name);
      Alert.alert('Success', 'Document uploaded successfully');
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to pick document');
    }
  });

  const uploadDocument = (category, period) => {
    pickDocument();
    // Update the document status after successful upload
    setPayrollDocuments(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [period]: 'uploaded',
      },
    }));
  };

  const DocumentSection = ({ title, icon, data, category }) => (
    <Card style={styles.sectionCard}>
      <Card.Header>
        <View style={styles.sectionHeader}>
          <Icon name={icon} size={20} color={colors.primary[500]} />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
      </Card.Header>
      <Card.Body>
        {Object.entries(data).map(([period, status]) => (
          <View key={period} style={styles.documentRow}>
            <View>
              <Text style={styles.periodText}>{period}</Text>
            </View>
            <View style={styles.documentStatus}>
              <Icon
                name={status === 'uploaded' ? 'check-circle' : 'alert-circle'}
                size={20}
                color={status === 'uploaded' ? colors.success : colors.warning}
              />
              {status !== 'uploaded' && (
                <TouchableOpacity onPress={() => uploadDocument(category, period)}>
                  <Text style={styles.uploadText}>Upload</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </Card.Body>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Payroll & Employees" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Employees List */}
        <Card style={styles.employeesCard}>
          <Card.Header>
            <View style={styles.employeesHeader}>
              <Text style={styles.employeesTitle}>Active Employees</Text>
              <TouchableOpacity>
                <Icon name="plus" size={20} color={colors.primary[500]} />
              </TouchableOpacity>
            </View>
          </Card.Header>
          <Card.Body>
            {employees.map(emp => (
              <TouchableOpacity key={emp.id} style={styles.employeeRow}>
                <View style={styles.employeeAvatar}>
                  <Text style={styles.avatarText}>
                    {emp.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View style={styles.employeeInfo}>
                  <Text style={styles.employeeName}>{emp.name}</Text>
                  <Text style={styles.employeeDetails}>
                    {emp.position} • SIN: {emp.sin}
                  </Text>
                </View>
                <Icon name="chevron-right" size={20} color={colors.gray[400]} />
              </TouchableOpacity>
            ))}
          </Card.Body>
        </Card>

        {/* Payroll Documents */}
        <DocumentSection
          title="Payroll Summaries"
          icon="file-document-multiple"
          data={payrollDocuments.payrollSummaries}
          category="payrollSummaries"
        />

        <DocumentSection
          title="Source Deductions (CPP, EI, Tax)"
          icon="bank"
          data={payrollDocuments.sourceDeductions}
          category="sourceDeductions"
        />

        <DocumentSection
          title="PD7A Statements"
          icon="file-check"
          data={payrollDocuments.pd7aStatements}
          category="pd7aStatements"
        />

        <DocumentSection
          title="T4 Slips"
          icon="file-document"
          data={payrollDocuments.t4Slips}
          category="t4Slips"
        />

        {/* CRA Info */}
        <Card style={styles.craCard}>
          <Card.Body>
            <View style={styles.craRow}>
              <Icon name="alert" size={20} color={colors.warning} />
              <View style={styles.craTextContainer}>
                <Text style={styles.craText}>
                  Payroll deadlines: Remit source deductions by the 15th of each month. T4 slips due by end of February.
                </Text>
              </View>
            </View>
          </Card.Body>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  employeesCard: {
    marginBottom: spacing.lg,
  },
  employeesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  employeesTitle: {
    ...typography.h6,
    color: colors.text.primary,
  },
  employeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  employeeAvatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.body1,
    color: colors.primary[500],
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    ...typography.body2,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  employeeDetails: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  sectionCard: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    ...typography.h6,
    marginLeft: spacing.sm,
    color: colors.text.primary,
  },
  documentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  periodText: {
    ...typography.body2,
    color: colors.text.primary,
  },
  documentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  uploadText: {
    ...typography.caption,
    color: colors.primary[500],
    marginLeft: spacing.sm,
  },
  craCard: {
    backgroundColor: colors.warning + '20',
    marginTop: spacing.md,
  },
  craRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  craTextContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  craText: {
    ...typography.caption,
    color: colors.warning,
  },
};

export default ShopPayrollScreen;


