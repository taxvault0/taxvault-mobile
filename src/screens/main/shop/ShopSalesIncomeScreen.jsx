import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../../components/layout/Header';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { colors, typography, spacing, borderRadius } from '../../../styles/theme';
import { useSingleDocumentPicker } from '../../../hooks/useDocumentPicker';

const ShopSalesIncomeScreen = () => {
  const [selectedMonth, setSelectedMonth] = useState('March');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSale, setNewSale] = useState({
    month: '',
    year: '2024',
    totalSales: '',
    posSystem: '',
    paymentProcessor: '',
  });

  const [monthlySales, setMonthlySales] = useState([
    {
      id: '1',
      month: 'January',
      year: '2024',
      totalSales: 45230.50,
      posSystem: 'Square',
      documents: {
        posSummary: 'uploaded',
        invoices: 'partial',
        processorStatements: 'uploaded',
      },
      status: 'verified',
    },
    {
      id: '2',
      month: 'February',
      year: '2024',
      totalSales: 48750.75,
      posSystem: 'Square',
      documents: {
        posSummary: 'uploaded',
        invoices: 'uploaded',
        processorStatements: 'pending',
      },
      status: 'pending',
    },
    {
      id: '3',
      month: 'March',
      year: '2024',
      totalSales: 0,
      posSystem: 'Square',
      documents: {
        posSummary: 'missing',
        invoices: 'missing',
        processorStatements: 'missing',
      },
      status: 'missing',
    },
  ]);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];

  const { pickDocument } = useSingleDocumentPicker({
    onSuccess: (file) => {
      console.log('Selected file:', file.name);
      Alert.alert('Success', 'Document uploaded successfully');
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to pick document');
    }
  });

  const uploadDocument = (monthId, docType) => {
    pickDocument();
    // In a real app, you'd handle the file upload here
    // For now, we'll just update the state
    setMonthlySales(prev =>
      prev.map(month =>
        month.id === monthId
          ? {
              ...month,
              documents: { ...month.documents, [docType]: 'uploaded' },
              status: Object.values({ ...month.documents, [docType]: 'uploaded' }).every(v => v === 'uploaded') 
                ? 'verified' 
                : 'pending'
            }
          : month
      )
    );
  };

  const addMonthlySales = () => {
    if (!newSale.month || !newSale.totalSales) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    const sale = {
      id: Date.now().toString(),
      month: newSale.month,
      year: newSale.year,
      totalSales: parseFloat(newSale.totalSales),
      posSystem: newSale.posSystem || 'Not specified',
      documents: {
        posSummary: 'missing',
        invoices: 'missing',
        processorStatements: 'missing',
      },
      status: 'missing',
    };

    setMonthlySales([sale, ...monthlySales]);
    setShowAddModal(false);
    setNewSale({
      month: '',
      year: '2024',
      totalSales: '',
      posSystem: '',
      paymentProcessor: '',
    });

    Alert.alert('Success', 'Monthly sales record added');
  };

  const getDocumentIcon = (status) => {
    switch (status) {
      case 'uploaded': return 'check-circle';
      case 'pending': return 'clock-outline';
      case 'partial': return 'progress-clock';
      default: return 'close-circle';
    }
  };

  const getDocumentColor = (status) => {
    switch (status) {
      case 'uploaded': return colors.success;
      case 'pending': return colors.warning;
      case 'partial': return colors.gold;
      default: return colors.gray[400];
    }
  };

  const AddSaleModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowAddModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Monthly Sales</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Icon name="close" size={24} color={colors.gray[400]} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <Text style={styles.inputLabel}>
              Month <Text style={{ color: colors.warning }}>*</Text>
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthScroll}>
              {months.map(month => (
                <TouchableOpacity
                  key={month}
                  style={[
                    styles.monthChip,
                    newSale.month === month && styles.monthChipSelected
                  ]}
                  onPress={() => setNewSale({ ...newSale, month })}
                >
                  <Text style={[
                    styles.monthText,
                    newSale.month === month && styles.monthTextSelected
                  ]}>
                    {month}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.inputLabel}>
              Total Sales ($) <Text style={{ color: colors.warning }}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={newSale.totalSales}
              onChangeText={(text) => setNewSale({ ...newSale, totalSales: text })}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={colors.gray[400]}
            />

            <Text style={styles.inputLabel}>POS System</Text>
            <TextInput
              style={styles.input}
              value={newSale.posSystem}
              onChangeText={(text) => setNewSale({ ...newSale, posSystem: text })}
              placeholder="e.g., Square, Lightspeed"
              placeholderTextColor={colors.gray[400]}
            />

            <View style={styles.modalActions}>
              <Button
                variant="outline"
                onPress={() => setShowAddModal(false)}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onPress={addMonthlySales}
                style={styles.modalButton}
              >
                Add
              </Button>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Sales & Income" 
        showBack 
        rightIcon="plus"
        onRightPress={() => setShowAddModal(true)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Year Summary */}
        <Card style={styles.summaryCard}>
          <Card.Body>
            <Text style={styles.summaryTitle}>2024 Summary</Text>
            <View style={styles.summaryRow}>
              <View>
                <Text style={styles.summaryLabel}>YTD Sales</Text>
                <Text style={styles.summaryValue}>$93,981.25</Text>
              </View>
              <View>
                <Text style={styles.summaryLabel}>Months</Text>
                <Text style={[styles.summaryValue, { color: colors.success }]}>
                  2/12
                </Text>
              </View>
            </View>
          </Card.Body>
        </Card>

        {/* Document Requirements */}
        <Card style={styles.requirementsCard}>
          <Card.Body>
            <Text style={styles.requirementsTitle}>
              Required for each month:
            </Text>
            <View style={styles.requirementsList}>
              <View style={styles.requirementItem}>
                <Icon name="file-document" size={16} color={colors.primary[500]} />
                <Text style={styles.requirementText}>POS Summary</Text>
              </View>
              <View style={styles.requirementItem}>
                <Icon name="file-multiple" size={16} color={colors.primary[500]} />
                <Text style={styles.requirementText}>Invoices</Text>
              </View>
              <View style={styles.requirementItem}>
                <Icon name="credit-card" size={16} color={colors.primary[500]} />
                <Text style={styles.requirementText}>Processor Statements</Text>
              </View>
            </View>
          </Card.Body>
        </Card>

        {/* Monthly Sales List */}
        {monthlySales.map(month => (
          <Card key={month.id} style={styles.monthCard}>
            <Card.Header>
              <View style={styles.monthHeader}>
                <Text style={styles.monthTitle}>{month.month} {month.year}</Text>
                <Badge status={month.status} />
              </View>
            </Card.Header>
            <Card.Body>
              {month.totalSales > 0 && (
                <View style={styles.salesRow}>
                  <Text style={styles.salesLabel}>Total Sales</Text>
                  <Text style={styles.salesAmount}>
                    ${month.totalSales.toFixed(2)}
                  </Text>
                </View>
              )}

              <Text style={styles.documentsLabel}>
                Required Documents:
              </Text>

              {/* POS Summary */}
              <View style={styles.documentRow}>
                <View style={styles.documentInfo}>
                  <Icon name="file-document" size={18} color={colors.gray[400]} />
                  <Text style={styles.documentName}>POS Summary</Text>
                </View>
                <View style={styles.documentStatus}>
                  <Icon 
                    name={getDocumentIcon(month.documents.posSummary)} 
                    size={20} 
                    color={getDocumentColor(month.documents.posSummary)} 
                  />
                  {month.documents.posSummary !== 'uploaded' && (
                    <TouchableOpacity onPress={() => uploadDocument(month.id, 'posSummary')}>
                      <Text style={styles.uploadText}>Upload</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Invoices */}
              <View style={styles.documentRow}>
                <View style={styles.documentInfo}>
                  <Icon name="file-multiple" size={18} color={colors.gray[400]} />
                  <Text style={styles.documentName}>Invoices</Text>
                </View>
                <View style={styles.documentStatus}>
                  <Icon 
                    name={getDocumentIcon(month.documents.invoices)} 
                    size={20} 
                    color={getDocumentColor(month.documents.invoices)} 
                  />
                  {month.documents.invoices !== 'uploaded' && (
                    <TouchableOpacity onPress={() => uploadDocument(month.id, 'invoices')}>
                      <Text style={styles.uploadText}>Upload</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Processor Statements */}
              <View style={styles.documentRow}>
                <View style={styles.documentInfo}>
                  <Icon name="credit-card" size={18} color={colors.gray[400]} />
                  <Text style={styles.documentName}>Processor Statements</Text>
                </View>
                <View style={styles.documentStatus}>
                  <Icon 
                    name={getDocumentIcon(month.documents.processorStatements)} 
                    size={20} 
                    color={getDocumentColor(month.documents.processorStatements)} 
                  />
                  {month.documents.processorStatements !== 'uploaded' && (
                    <TouchableOpacity onPress={() => uploadDocument(month.id, 'processorStatements')}>
                      <Text style={styles.uploadText}>Upload</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </Card.Body>
          </Card>
        ))}

        <AddSaleModal />
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
    justifyContent: 'space-between',
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  summaryValue: {
    ...typography.h3,
    color: colors.primary[500],
  },
  requirementsCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.primary[50],
  },
  requirementsTitle: {
    ...typography.body2,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.sm,
    color: colors.text.primary,
  },
  requirementsList: {
    marginTop: spacing.xs,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  requirementText: {
    ...typography.caption,
    marginLeft: spacing.xs,
    color: colors.text.secondary,
  },
  monthCard: {
    marginBottom: spacing.md,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthTitle: {
    ...typography.h6,
    color: colors.text.primary,
  },
  salesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  salesLabel: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  salesAmount: {
    ...typography.body1,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
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
    ...typography.body2,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...typography.h5,
    color: colors.text.primary,
  },
  inputLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  monthScroll: {
    marginBottom: spacing.md,
  },
  monthChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
    marginRight: spacing.sm,
  },
  monthChipSelected: {
    backgroundColor: colors.primary[500],
  },
  monthText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  monthTextSelected: {
    color: colors.white,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  modalButton: {
    flex: 1,
  },
};

export default ShopSalesIncomeScreen;

