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

const ShopInventoryScreen = () => {
  const [inventoryCategories, setInventoryCategories] = useState([
    {
      id: '1',
      name: 'Grocery Items',
      purchaseReceipts: 'partial',
      supplierInvoices: 'uploaded',
      inventoryCounts: 'pending',
      totalSpent: 12500.50,
      items: [
        { name: 'Snacks', receipts: 'uploaded', count: 'pending' },
        { name: 'Beverages', receipts: 'uploaded', count: 'pending' },
        { name: 'Canned Goods', receipts: 'pending', count: 'missing' },
      ],
    },
    {
      id: '2',
      name: 'Fresh Food',
      purchaseReceipts: 'partial',
      supplierInvoices: 'uploaded',
      inventoryCounts: 'missing',
      totalSpent: 8750.25,
      items: [
        { name: 'Sandwiches', receipts: 'uploaded', count: 'missing' },
        { name: 'Salads', receipts: 'uploaded', count: 'missing' },
        { name: 'Fruit', receipts: 'pending', count: 'missing' },
      ],
    },
    {
      id: '3',
      name: 'Supplies',
      purchaseReceipts: 'uploaded',
      supplierInvoices: 'uploaded',
      inventoryCounts: 'uploaded',
      totalSpent: 3250.75,
      items: [
        { name: 'Packaging', receipts: 'uploaded', count: 'uploaded' },
        { name: 'Cleaning Supplies', receipts: 'uploaded', count: 'uploaded' },
      ],
    },
  ]);

  const [equipment, setEquipment] = useState([
    {
      id: '1',
      name: 'Refrigerator',
      purchaseDate: '2023-05-15',
      cost: 3500,
      receipt: 'uploaded',
      warranty: '2026-05-14',
    },
    {
      id: '2',
      name: 'Cash Register',
      purchaseDate: '2023-01-10',
      cost: 850,
      receipt: 'uploaded',
      warranty: '2025-01-09',
    },
    {
      id: '3',
      name: 'Shelving Units',
      purchaseDate: '2023-03-20',
      cost: 1200,
      receipt: 'uploaded',
      warranty: null,
    },
    {
      id: '4',
      name: 'New Freezer',
      purchaseDate: '2024-02-01',
      cost: 2800,
      receipt: 'pending',
      warranty: null,
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

  const uploadReceipt = (categoryId, itemName) => {
    pickDocument();
    // Simulate upload success
    setInventoryCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map(item =>
                item.name === itemName
                  ? { ...item, receipts: 'uploaded' }
                  : item
              ),
              purchaseReceipts: checkCategoryStatus({
                ...cat,
                items: cat.items.map(item =>
                  item.name === itemName
                    ? { ...item, receipts: 'uploaded' }
                    : item
                ),
              }),
            }
          : cat
      )
    );
  };

  const checkCategoryStatus = (category) => {
    const allReceipts = category.items.every(item => item.receipts === 'uploaded');
    const anyReceipts = category.items.some(item => item.receipts === 'uploaded');
    
    if (allReceipts) return 'uploaded';
    if (anyReceipts) return 'partial';
    return 'missing';
  };

  const uploadEquipmentReceipt = (equipmentId) => {
    pickDocument();
    // Simulate upload success
    setEquipment(prev =>
      prev.map(item =>
        item.id === equipmentId
          ? { ...item, receipt: 'uploaded' }
          : item
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Inventory & COGS" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* COGS Summary */}
        <Card style={styles.summaryCard}>
          <Card.Body>
            <Text style={styles.summaryTitle}>Cost of Goods Sold (YTD)</Text>
            <View style={styles.summaryRow}>
              <View>
                <Text style={styles.summaryLabel}>Total Purchases</Text>
                <Text style={styles.summaryValue}>$24,501.50</Text>
              </View>
              <View>
                <Text style={styles.summaryLabel}>Categories</Text>
                <Text style={[styles.summaryValue, { color: colors.success }]}>
                  {inventoryCategories.length}
                </Text>
              </View>
            </View>
          </Card.Body>
        </Card>

        {/* Inventory Categories */}
        <Text style={styles.sectionTitle}>Inventory Categories</Text>
        
        {inventoryCategories.map(cat => (
          <Card key={cat.id} style={styles.categoryCard}>
            <Card.Header>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryName}>{cat.name}</Text>
                <Badge status={cat.purchaseReceipts} />
              </View>
            </Card.Header>
            <Card.Body>
              <Text style={styles.categorySpent}>
                Total Spent: ${cat.totalSpent.toFixed(2)}
              </Text>

              {cat.items.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.itemRow,
                    index < cat.items.length - 1 && styles.itemRowBorder
                  ]}
                >
                  <Text style={styles.itemName}>{item.name}</Text>
                  <View style={styles.itemStatus}>
                    <Icon
                      name={item.receipts === 'uploaded' ? 'check-circle' : 'alert-circle'}
                      size={16}
                      color={item.receipts === 'uploaded' ? colors.success : colors.warning}
                    />
                    {item.receipts !== 'uploaded' && (
                      <TouchableOpacity onPress={() => uploadReceipt(cat.id, item.name)}>
                        <Text style={styles.uploadText}>Add Receipt</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </Card.Body>
          </Card>
        ))}

        {/* Equipment & Leasehold Improvements */}
        <Text style={[styles.sectionTitle, styles.equipmentTitle]}>
          Equipment & Improvements
        </Text>

        {equipment.map(item => (
          <Card key={item.id} style={styles.equipmentCard}>
            <Card.Body>
              <View style={styles.equipmentRow}>
                <View style={styles.equipmentInfo}>
                  <Text style={styles.equipmentName}>{item.name}</Text>
                  <View style={styles.equipmentDetails}>
                    <Text style={styles.equipmentDetailText}>
                      Purchased: {item.purchaseDate}
                    </Text>
                    <Text style={styles.equipmentDetailText}>
                      Cost: ${item.cost}
                    </Text>
                  </View>
                  {item.warranty && (
                    <Text style={styles.warrantyText}>
                      Warranty until: {item.warranty}
                    </Text>
                  )}
                </View>
                
                {item.receipt === 'uploaded' ? (
                  <TouchableOpacity>
                    <Icon name="eye" size={24} color={colors.primary[500]} />
                  </TouchableOpacity>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() => uploadEquipmentReceipt(item.id)}
                  >
                    Add Receipt
                  </Button>
                )}
              </View>
            </Card.Body>
          </Card>
        ))}

        {/* CRA Info */}
        <Card style={styles.infoCard}>
          <Card.Body>
            <View style={styles.infoRow}>
              <Icon name="information" size={20} color={colors.primary[500]} />
              <Text style={styles.infoText}>
                Capital assets (equipment) over $500 may need to be depreciated (CCA). Regular inventory purchases are fully deductible as COGS.
              </Text>
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
  sectionTitle: {
    ...typography.h6,
    marginBottom: spacing.md,
    color: colors.text.primary,
  },
  equipmentTitle: {
    marginTop: spacing.lg,
  },
  categoryCard: {
    marginBottom: spacing.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    ...typography.body1,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  categorySpent: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  itemRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemName: {
    ...typography.body2,
    color: colors.text.primary,
  },
  itemStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  uploadText: {
    ...typography.caption,
    color: colors.primary[500],
    marginLeft: spacing.sm,
  },
  equipmentCard: {
    marginBottom: spacing.sm,
  },
  equipmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  equipmentInfo: {
    flex: 1,
  },
  equipmentName: {
    ...typography.body2,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  equipmentDetails: {
    flexDirection: 'row',
    marginTop: spacing.xs,
    gap: spacing.md,
  },
  equipmentDetailText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  warrantyText: {
    ...typography.caption,
    color: colors.info,
    marginTop: spacing.xs,
  },
  infoCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary[50],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    ...typography.caption,
    marginLeft: spacing.sm,
    flex: 1,
    color: colors.text.secondary,
  },
};

export default ShopInventoryScreen;


