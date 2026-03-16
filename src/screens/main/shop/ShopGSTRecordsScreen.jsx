import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../../components/layout/Header';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { colors, typography, spacing, borderRadius } from '../../../styles/theme';
import { useSingleDocumentPicker } from '../../../hooks/useDocumentPicker';

// Provincial tax requirements
const getFilingRequirements = (province = 'ON') => {
  const requirements = {
    'QC': {
      separateReturn: true,
      agency: 'Revenu Québec',
      name: 'QST',
      rate: 0.09975,
      filingFrequency: 'monthly',
      description: 'Quebec has its own provincial sales tax separate from GST',
    },
    'BC': {
      separateReturn: true,
      agency: 'BC Ministry of Finance',
      name: 'PST',
      rate: 0.07,
      threshold: 10000,
      description: 'British Columbia requires separate PST registration',
    },
    'SK': {
      separateReturn: true,
      agency: 'Saskatchewan Finance',
      name: 'PST',
      rate: 0.06,
      threshold: 30000,
      description: 'Saskatchewan PST applies after $30,000 in sales',
    },
    'MB': {
      separateReturn: true,
      agency: 'Manitoba Finance',
      name: 'RST',
      rate: 0.07,
      threshold: 10000,
      description: 'Manitoba requires RST registration',
    },
    'ON': {
      separateReturn: false,
      agency: 'CRA',
      name: 'HST',
      rate: 0.13,
      description: 'Ontario uses HST - filed with CRA',
    },
    'NB': {
      separateReturn: false,
      agency: 'CRA',
      name: 'HST',
      rate: 0.15,
      description: 'New Brunswick uses HST - filed with CRA',
    },
    'NL': {
      separateReturn: false,
      agency: 'CRA',
      name: 'HST',
      rate: 0.15,
      description: 'Newfoundland and Labrador uses HST - filed with CRA',
    },
    'NS': {
      separateReturn: false,
      agency: 'CRA',
      name: 'HST',
      rate: 0.15,
      description: 'Nova Scotia uses HST - filed with CRA',
    },
    'PE': {
      separateReturn: false,
      agency: 'CRA',
      name: 'HST',
      rate: 0.15,
      description: 'Prince Edward Island uses HST - filed with CRA',
    },
    'AB': {
      separateReturn: false,
      agency: 'CRA',
      name: 'GST',
      rate: 0.05,
      description: 'Alberta uses GST only - filed with CRA',
    },
    'NT': {
      separateReturn: false,
      agency: 'CRA',
      name: 'GST',
      rate: 0.05,
      description: 'Northwest Territories uses GST only - filed with CRA',
    },
    'NU': {
      separateReturn: false,
      agency: 'CRA',
      name: 'GST',
      rate: 0.05,
      description: 'Nunavut uses GST only - filed with CRA',
    },
    'YT': {
      separateReturn: false,
      agency: 'CRA',
      name: 'GST',
      rate: 0.05,
      description: 'Yukon uses GST only - filed with CRA',
    },
  };
  
  return requirements[province] || {
    separateReturn: false,
    agency: 'CRA',
    name: 'GST',
    rate: 0.05,
    description: 'Standard GST/HST filing with CRA',
  };
};

const ShopGSTRecordsScreen = ({ route }) => {
  // Get user's province from route params or default to 'ON'
  const userProvince = route?.params?.province || 'ON';
  const taxRules = getFilingRequirements(userProvince);
  
  const [gstInfo, setGstInfo] = useState({
    registered: true,
    gstNumber: '123456789RT0001',
    filingFrequency: taxRules.filingFrequency || 'quarterly',
    reportingPeriod: taxRules.separateReturn ? `${taxRules.name} + GST` : taxRules.name,
  });

  const [quarters, setQuarters] = useState([
    {
      id: '1',
      period: 'Q1 2024 (Jan-Mar)',
      collected: 2125.50,
      paid: 890.25,
      netPayable: 1235.25,
      filingDue: '2024-04-30',
      documents: {
        gstReturn: 'uploaded',
        workingPaper: 'uploaded',
        assessment: 'pending',
      },
      status: 'filed',
    },
    {
      id: '2',
      period: 'Q4 2023 (Oct-Dec)',
      collected: 1980.75,
      paid: 765.50,
      netPayable: 1215.25,
      filingDue: '2024-01-31',
      documents: {
        gstReturn: 'uploaded',
        workingPaper: 'uploaded',
        assessment: 'uploaded',
      },
      status: 'filed',
    },
    {
      id: '3',
      period: 'Q3 2023 (Jul-Sep)',
      collected: 1850.25,
      paid: 720.30,
      netPayable: 1129.95,
      filingDue: '2023-10-31',
      documents: {
        gstReturn: 'uploaded',
        workingPaper: 'uploaded',
        assessment: 'uploaded',
      },
      status: 'filed',
    },
    {
      id: '4',
      period: 'Q2 2024 (Apr-Jun)',
      collected: 0,
      paid: 0,
      netPayable: 0,
      filingDue: '2024-07-31',
      documents: {
        gstReturn: 'missing',
        workingPaper: 'missing',
        assessment: 'missing',
      },
      status: 'upcoming',
    },
  ]);

  const { pickDocument } = useSingleDocumentPicker({
    onSuccess: (file) => {
      console.log('Selected file:', file.name);
      Alert.alert('Success', 'Document uploaded successfully');
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to pick document');
    }
  });

  const uploadDocument = (quarterId, docType) => {
    pickDocument();
    // Update the document status after successful upload
    setQuarters(prev =>
      prev.map(q =>
        q.id === quarterId
          ? {
              ...q,
              documents: { ...q.documents, [docType]: 'uploaded' },
              status: Object.values({ ...q.documents, [docType]: 'uploaded' }).every(v => v === 'uploaded') 
                ? 'filed' 
                : 'pending'
            }
          : q
      )
    );
  };

  const calculateITCs = () => {
    // Calculate Input Tax Credits from expense receipts
    Alert.alert('Coming Soon', 'ITC calculation from expenses will be available soon');
  };

  const fileGSTReturn = (quarter) => {
    Alert.alert(
      `File ${taxRules.name} Return`,
      `You can file ${taxRules.separateReturn ? 'with ' + taxRules.agency : 'directly with CRA'} or download the report.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Download Report', onPress: () => console.log('Download') },
        { text: `File with ${taxRules.agency}`, onPress: () => console.log('File') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="GST/HST Records" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Provincial Tax Notice */}
        {taxRules.separateReturn && (
          <Card style={styles.provincialCard}>
            <Card.Body>
              <View style={styles.provincialRow}>
                <Icon name="information" size={20} color={colors.info} />
                <View style={styles.provincialContent}>
                  <Text style={styles.provincialTitle}>
                    {taxRules.agency} Requirements
                  </Text>
                  <Text style={styles.provincialText}>
                    {taxRules.description}
                  </Text>
                  <Text style={styles.provincialRate}>
                    {taxRules.name} Rate: {(taxRules.rate * 100).toFixed(2)}%
                  </Text>
                </View>
              </View>
            </Card.Body>
          </Card>
        )}

        {/* GST Registration Card */}
        <Card style={styles.registrationCard}>
          <Card.Body>
            <View style={styles.registrationRow}>
              <View style={styles.registrationLeft}>
                <Icon name="percent" size={32} color={colors.primary[500]} />
                <View style={styles.registrationInfo}>
                  <Text style={styles.registrationLabel}>{taxRules.name} Number</Text>
                  <Text style={styles.registrationNumber}>{gstInfo.gstNumber}</Text>
                </View>
              </View>
              <Badge status="success" text="Active" />
            </View>
            <View style={styles.registrationDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Filing Frequency</Text>
                <Text style={styles.detailValue}>{gstInfo.filingFrequency}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Reporting</Text>
                <Text style={styles.detailValue}>{gstInfo.reportingPeriod}</Text>
              </View>
            </View>
          </Card.Body>
        </Card>

        {/* YTD Summary */}
        <Card style={styles.summaryCard}>
          <Card.Body>
            <Text style={styles.summaryTitle}>Year-to-Date Summary</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Collected</Text>
                <Text style={[styles.summaryAmount, { color: colors.success }]}>
                  $4,106.25
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>ITCs</Text>
                <Text style={[styles.summaryAmount, { color: colors.info }]}>
                  $1,655.75
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Net</Text>
                <Text style={[styles.summaryAmount, { color: colors.warning }]}>
                  $2,450.50
                </Text>
              </View>
            </View>
          </Card.Body>
        </Card>

        {/* Quarterly Breakdown */}
        <Text style={styles.sectionTitle}>Quarterly Returns</Text>

        {quarters.map(quarter => (
          <Card key={quarter.id} style={styles.quarterCard}>
            <Card.Header>
              <View style={styles.quarterHeader}>
                <Text style={styles.quarterPeriod}>{quarter.period}</Text>
                <Badge status={quarter.status} />
              </View>
            </Card.Header>
            <Card.Body>
              {/* Amounts */}
              <View style={styles.amountsRow}>
                <View>
                  <Text style={styles.amountLabel}>Collected</Text>
                  <Text style={styles.amountValue}>${quarter.collected.toFixed(2)}</Text>
                </View>
                <View>
                  <Text style={styles.amountLabel}>ITCs</Text>
                  <Text style={styles.amountValue}>${quarter.paid.toFixed(2)}</Text>
                </View>
                <View>
                  <Text style={styles.amountLabel}>Net Payable</Text>
                  <Text style={[styles.amountValue, styles.netPayable]}>
                    ${quarter.netPayable.toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* Due Date */}
              <View style={styles.dueDateRow}>
                <Icon name="calendar-clock" size={16} color={colors.gray[400]} />
                <Text style={styles.dueDateText}>Due: {quarter.filingDue}</Text>
              </View>

              {/* Documents */}
              <Text style={styles.documentsLabel}>Required Documents:</Text>

              {/* GST Return */}
              <View style={styles.documentRow}>
                <View style={styles.documentInfo}>
                  <Icon name="file-document" size={16} color={colors.gray[400]} />
                  <Text style={styles.documentName}>{taxRules.name} Return</Text>
                </View>
                <View style={styles.documentStatus}>
                  <Icon
                    name={quarter.documents.gstReturn === 'uploaded' ? 'check-circle' : 'alert-circle'}
                    size={16}
                    color={quarter.documents.gstReturn === 'uploaded' ? colors.success : colors.warning}
                  />
                  {quarter.documents.gstReturn !== 'uploaded' && (
                    <TouchableOpacity onPress={() => uploadDocument(quarter.id, 'gstReturn')}>
                      <Text style={styles.uploadText}>Upload</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Working Paper */}
              <View style={styles.documentRow}>
                <View style={styles.documentInfo}>
                  <Icon name="file-calc" size={16} color={colors.gray[400]} />
                  <Text style={styles.documentName}>Working Paper</Text>
                </View>
                <View style={styles.documentStatus}>
                  <Icon
                    name={quarter.documents.workingPaper === 'uploaded' ? 'check-circle' : 'alert-circle'}
                    size={16}
                    color={quarter.documents.workingPaper === 'uploaded' ? colors.success : colors.warning}
                  />
                  {quarter.documents.workingPaper !== 'uploaded' && (
                    <TouchableOpacity onPress={() => uploadDocument(quarter.id, 'workingPaper')}>
                      <Text style={styles.uploadText}>Upload</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Notice of Assessment */}
              <View style={styles.documentRow}>
                <View style={styles.documentInfo}>
                  <Icon name="file-check" size={16} color={colors.gray[400]} />
                  <Text style={styles.documentName}>Notice of Assessment</Text>
                </View>
                <View style={styles.documentStatus}>
                  <Icon
                    name={quarter.documents.assessment === 'uploaded' ? 'check-circle' : 'alert-circle'}
                    size={16}
                    color={quarter.documents.assessment === 'uploaded' ? colors.success : colors.warning}
                  />
                  {quarter.documents.assessment !== 'uploaded' && (
                    <TouchableOpacity onPress={() => uploadDocument(quarter.id, 'assessment')}>
                      <Text style={styles.uploadText}>Upload</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* File Button */}
              {quarter.status !== 'filed' && (
                <Button
                  variant="primary"
                  onPress={() => fileGSTReturn(quarter)}
                  style={styles.fileButton}
                >
                  File Return
                </Button>
              )}
            </Card.Body>
          </Card>
        ))}

        {/* ITC Calculator */}
        <Card style={styles.itcCard}>
          <Card.Header>
            <Text style={styles.itcTitle}>Input Tax Credits (ITCs)</Text>
          </Card.Header>
          <Card.Body>
            <Text style={styles.itcText}>
              Claim ITCs on business purchases that include GST/HST. Use your expense receipts to calculate.
            </Text>
            <Button
              variant="outline"
              onPress={calculateITCs}
              style={styles.itcButton}
            >
              Calculate ITCs from Expenses
            </Button>
          </Card.Body>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  provincialCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.info + '10',
    padding: spacing.md,
  },
  provincialRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  provincialContent: {
    marginLeft: spacing.md,
    flex: 1,
  },
  provincialTitle: {
    ...typography.body2,
    fontWeight: typography.weights.semibold,
    color: colors.info,
    marginBottom: spacing.xs,
  },
  provincialText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  provincialRate: {
    ...typography.caption,
    color: colors.primary[500],
    fontWeight: typography.weights.medium,
  },
  registrationCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.primary[50],
  },
  registrationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  registrationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  registrationInfo: {
    marginLeft: spacing.md,
  },
  registrationLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  registrationNumber: {
    ...typography.h4,
    color: colors.primary[500],
  },
  registrationDetails: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  detailValue: {
    ...typography.body2,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  summaryCard: {
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    ...typography.h6,
    marginBottom: spacing.md,
    color: colors.text.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  summaryAmount: {
    ...typography.h4,
  },
  sectionTitle: {
    ...typography.h6,
    marginBottom: spacing.md,
    color: colors.text.primary,
  },
  quarterCard: {
    marginBottom: spacing.md,
  },
  quarterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quarterPeriod: {
    ...typography.body1,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  amountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  amountLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  amountValue: {
    ...typography.body2,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  netPayable: {
    color: colors.warning,
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dueDateText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  documentsLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  documentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentName: {
    ...typography.caption,
    marginLeft: spacing.sm,
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
  fileButton: {
    marginTop: spacing.md,
  },
  itcCard: {
    marginTop: spacing.md,
    backgroundColor: colors.info + '10',
  },
  itcTitle: {
    ...typography.h6,
    color: colors.text.primary,
  },
  itcText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  itcButton: {
    marginTop: spacing.md,
  },
});

export default ShopGSTRecordsScreen;