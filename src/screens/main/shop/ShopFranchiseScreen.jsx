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
import Header from '../../../components/layout/Header';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { colors, typography, spacing, borderRadius } from '../../../styles/theme';
import { useSingleDocumentPicker } from '../../../hooks/useDocumentPicker';

const ShopFranchiseScreen = () => {
  const [franchiseInfo, setFranchiseInfo] = useState({
    name: '7-Eleven',
    storeNumber: '#12345',
    franchiseeSince: '2020-01-15',
    agreementTerm: '10 years',
    renewalDate: '2030-01-14',
  });

  const [documents, setDocuments] = useState([
    {
      id: '1',
      name: 'Franchise Agreement',
      description: 'Master franchise contract',
      category: 'legal',
      status: 'uploaded',
      uploadedDate: '2024-01-15',
      expiryDate: '2030-01-14',
      required: true,
    },
    {
      id: '2',
      name: 'Franchise Disclosure Document',
      description: 'Pre-signing disclosure',
      category: 'legal',
      status: 'uploaded',
      uploadedDate: '2024-01-15',
      expiryDate: null,
      required: true,
    },
    {
      id: '3',
      name: 'Royalty Fee Statements',
      description: 'Monthly royalty fees',
      category: 'fees',
      status: 'partial',
      uploadedDate: null,
      expiryDate: null,
      required: true,
      monthly: {
        'January-2024': 'uploaded',
        'February-2024': 'uploaded',
        'March-2024': 'pending',
        'April-2024': 'missing',
      },
    },
    {
      id: '4',
      name: 'Marketing Fund Contributions',
      description: 'Monthly marketing fees',
      category: 'fees',
      status: 'partial',
      uploadedDate: null,
      expiryDate: null,
      required: true,
      monthly: {
        'January-2024': 'uploaded',
        'February-2024': 'uploaded',
        'March-2024': 'pending',
        'April-2024': 'missing',
      },
    },
    {
      id: '5',
      name: 'Franchise Renewal Notice',
      description: 'Renewal terms and conditions',
      category: 'legal',
      status: 'missing',
      uploadedDate: null,
      expiryDate: '2029-01-14',
      required: false,
    },
    {
      id: '6',
      name: 'Operations Manual',
      description: 'Franchise standards and procedures',
      category: 'operations',
      status: 'uploaded',
      uploadedDate: '2024-02-10',
      expiryDate: null,
      required: true,
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

  const uploadDocument = (docId) => {
    pickDocument();
    // Update document status after successful upload
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === docId
          ? {
              ...doc,
              status: 'uploaded',
              uploadedDate: new Date().toISOString().split('T')[0],
            }
          : doc
      )
    );
  };

  const uploadMonthlyFee = (docId, month) => {
    pickDocument();
    // Update monthly fee status after successful upload
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === docId
          ? {
              ...doc,
              monthly: {
                ...doc.monthly,
                [month]: 'uploaded',
              },
              status: checkMonthlyStatus({ ...doc, monthly: { ...doc.monthly, [month]: 'uploaded' } }),
            }
          : doc
      )
    );
  };

  const checkMonthlyStatus = (doc) => {
    const months = Object.values(doc.monthly || {});
    if (months.every(m => m === 'uploaded')) return 'verified';
    if (months.some(m => m === 'uploaded')) return 'partial';
    return 'missing';
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Franchise Documents" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Franchise Info Card */}
        <Card style={styles.infoCard}>
          <Card.Body>
            <View style={styles.franchiseHeader}>
              <Icon name="store" size={32} color={colors.primary[500]} />
              <View style={styles.franchiseTitle}>
                <Text style={styles.franchiseName}>{franchiseInfo.name}</Text>
                <Text style={styles.franchiseStore}>Store {franchiseInfo.storeNumber}</Text>
              </View>
            </View>
            <View style={styles.franchiseDetails}>
              <View>
                <Text style={styles.detailLabel}>Since</Text>
                <Text style={styles.detailValue}>{franchiseInfo.franchiseeSince}</Text>
              </View>
              <View>
                <Text style={styles.detailLabel}>Term</Text>
                <Text style={styles.detailValue}>{franchiseInfo.agreementTerm}</Text>
              </View>
              <View>
                <Text style={styles.detailLabel}>Renewal</Text>
                <Text style={[styles.detailValue, styles.renewalDate]}>
                  {franchiseInfo.renewalDate}
                </Text>
              </View>
            </View>
          </Card.Body>
        </Card>

        {/* Tax Treatment Notice */}
        <Card style={styles.taxCard}>
          <Card.Body>
            <View style={styles.taxRow}>
              <Icon name="tax" size={20} color={colors.info} />
              <View style={styles.taxContent}>
                <Text style={styles.taxTitle}>Franchise Fee Tax Treatment</Text>
                <Text style={styles.taxText}>
                  Initial franchise fee may be amortized over the life of the agreement. Ongoing royalties and marketing fees are fully deductible each year.
                </Text>
              </View>
            </View>
          </Card.Body>
        </Card>

        {/* Documents List */}
        {documents.map(doc => (
          <Card key={doc.id} style={styles.documentCard}>
            <Card.Body>
              <View style={styles.documentHeader}>
                <View style={styles.documentInfo}>
                  <View style={styles.documentTitleRow}>
                    <Icon 
                      name={doc.category === 'legal' ? 'file-sign' : doc.category === 'fees' ? 'cash' : 'book-open'} 
                      size={20} 
                      color={colors.primary[500]} 
                    />
                    <Text style={styles.documentTitle}>{doc.name}</Text>
                  </View>
                  
                  <Text style={styles.documentDescription}>{doc.description}</Text>

                  {doc.uploadedDate && (
                    <Text style={styles.uploadedDate}>Uploaded: {doc.uploadedDate}</Text>
                  )}

                  {doc.expiryDate && (
                    <Text style={styles.expiryDate}>Expires: {doc.expiryDate}</Text>
                  )}
                </View>

                <View style={styles.documentActions}>
                  <Badge status={doc.status} />
                  
                  {doc.status === 'uploaded' ? (
                    <TouchableOpacity style={styles.viewButton}>
                      <Icon name="eye" size={24} color={colors.primary[500]} />
                    </TouchableOpacity>
                  ) : doc.monthly ? (
                    <Text style={styles.monthlyProgress}>
                      {Object.values(doc.monthly).filter(s => s === 'uploaded').length}/{Object.keys(doc.monthly).length}
                    </Text>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onPress={() => uploadDocument(doc.id)}
                      style={styles.uploadButton}
                    >
                      Upload
                    </Button>
                  )}
                </View>
              </View>

              {/* Monthly breakdown for fee documents */}
              {doc.monthly && (
                <View style={styles.monthlySection}>
                  <Text style={styles.monthlyTitle}>Monthly Statements:</Text>
                  {Object.entries(doc.monthly).map(([month, status]) => (
                    <View key={month} style={styles.monthlyRow}>
                      <Text style={styles.monthName}>{month}</Text>
                      <View style={styles.monthlyStatus}>
                        <Icon
                          name={status === 'uploaded' ? 'check-circle' : 'alert-circle'}
                          size={16}
                          color={status === 'uploaded' ? colors.success : colors.warning}
                        />
                        {status !== 'uploaded' && (
                          <TouchableOpacity onPress={() => uploadMonthlyFee(doc.id, month)}>
                            <Text style={styles.uploadText}>Upload</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </Card.Body>
          </Card>
        ))}
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
  infoCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.primary[50],
  },
  franchiseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  franchiseTitle: {
    marginLeft: spacing.md,
  },
  franchiseName: {
    ...typography.h5,
    color: colors.text.primary,
  },
  franchiseStore: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  franchiseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  detailLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  detailValue: {
    ...typography.body2,
    color: colors.text.primary,
  },
  renewalDate: {
    color: colors.warning,
  },
  taxCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.info + '10',
  },
  taxRow: {
    flexDirection: 'row',
  },
  taxContent: {
    marginLeft: spacing.md,
    flex: 1,
  },
  taxTitle: {
    ...typography.body2,
    fontWeight: typography.weights.semibold,
    color: colors.info,
  },
  taxText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  documentCard: {
    marginBottom: spacing.md,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  documentInfo: {
    flex: 1,
  },
  documentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentTitle: {
    ...typography.body2,
    fontWeight: typography.weights.semibold,
    marginLeft: spacing.sm,
    color: colors.text.primary,
  },
  documentDescription: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  uploadedDate: {
    ...typography.caption,
    color: colors.success,
    marginTop: spacing.xs,
  },
  expiryDate: {
    ...typography.caption,
    color: colors.warning,
    marginTop: spacing.xs,
  },
  documentActions: {
    alignItems: 'flex-end',
    marginLeft: spacing.md,
  },
  viewButton: {
    marginTop: spacing.sm,
  },
  monthlyProgress: {
    ...typography.caption,
    color: colors.primary[500],
    marginTop: spacing.sm,
  },
  uploadButton: {
    marginTop: spacing.sm,
  },
  monthlySection: {
    marginTop: spacing.md,
  },
  monthlyTitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  monthlyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  monthName: {
    ...typography.caption,
    color: colors.text.primary,
  },
  monthlyStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  uploadText: {
    ...typography.caption,
    color: colors.primary[500],
    marginLeft: spacing.sm,
  },
};

export default ShopFranchiseScreen;

