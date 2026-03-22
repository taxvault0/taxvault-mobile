import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Alert,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Header from '@/components/layout/AppHeader';
import BottomNav from '@/components/layout/BottomTabBar';
import Card from '@/components/ui/AppCard';
import Button from '@/components/ui/AppButton';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';
import { getReceipts, deleteReceipt } from '@/services/receiptAPI';

const ReceiptsScreen = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortBy, setSortBy] = useState('date-desc');
  const [dateRange, setDateRange] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch receipts from API
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['receipts', selectedCategory, sortBy, dateRange, searchQuery],
    queryFn: () => getReceipts({
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      sort: sortBy,
      dateRange: dateRange !== 'all' ? dateRange : undefined,
      search: searchQuery || undefined,
    }),
  });

  const receipts = data?.receipts || [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteReceipt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      Alert.alert('Success', 'Receipt deleted successfully');
    },
    onError: (error) => {
      Alert.alert('Error', error.message || 'Failed to delete receipt');
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const categories = [
    { id: 'all', label: 'All', icon: 'view-grid', color: colors.gray[500] },
    { id: 'fuel', label: 'Fuel', icon: 'gas-station', color: '#FF6B35' },
    { id: 'maintenance', label: 'Maintenance', icon: 'wrench', color: '#ED6A5E' },
    { id: 'insurance', label: 'Insurance', icon: 'shield', color: '#005A9C' },
    { id: 'office-supplies', label: 'Office', icon: 'briefcase', color: '#2E7D32' },
    { id: 'meals', label: 'Meals', icon: 'food', color: '#FFD700' },
    { id: 'transportation', label: 'Transport', icon: 'car', color: '#9C27B0' },
    { id: 'software', label: 'Software', icon: 'laptop', color: colors.primary[500] },
    { id: 'utilities', label: 'Utilities', icon: 'flash', color: '#FFA500' },
    { id: 'rent', label: 'Rent', icon: 'home', color: '#8B4513' },
    { id: 'other', label: 'Other', icon: 'dots-horizontal', color: colors.gray[600] },
  ];

  const sortOptions = [
    { id: 'date-desc', label: 'Newest First' },
    { id: 'date-asc', label: 'Oldest First' },
    { id: 'amount-desc', label: 'Highest Amount' },
    { id: 'amount-asc', label: 'Lowest Amount' },
    { id: 'vendor-asc', label: 'Vendor (A-Z)' },
  ];

  const dateRanges = [
    { id: 'all', label: 'All Time' },
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'year', label: 'This Year' },
  ];

  const getCategoryColor = (category) => {
    const found = categories.find(c => c.id === category);
    return found?.color || colors.primary[500];
  };

  const getCategoryIcon = (category) => {
    const found = categories.find(c => c.id === category);
    return found?.icon || 'receipt';
  };

  const totalAmount = receipts.reduce((sum, r) => sum + (r.amount || 0), 0);
  const totalGST = receipts.reduce((sum, r) => sum + (r.gst || 0), 0);
  const verifiedCount = receipts.filter(r => r.status === 'verified').length;
  const pendingCount = receipts.filter(r => r.status === 'pending').length;

  const FilterModal = () => (
    <Modal
      visible={showFilterModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter & Sort</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Icon name="close" size={24} color={colors.gray[400]} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Sort By */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>SORT BY</Text>
              {sortOptions.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.sortOption}
                  onPress={() => setSortBy(option.id)}
                >
                  <Text style={styles.sortOptionText}>{option.label}</Text>
                  {sortBy === option.id && (
                    <Icon name="check" size={20} color={colors.primary[500]} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Date Range */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>DATE RANGE</Text>
              <View style={styles.dateRangeContainer}>
                {dateRanges.map(range => (
                  <TouchableOpacity
                    key={range.id}
                    style={[
                      styles.dateRangeChip,
                      dateRange === range.id ? styles.dateRangeChipSelected : styles.dateRangeChipUnselected
                    ]}
                    onPress={() => setDateRange(range.id)}
                  >
                    <Text style={[
                      styles.dateRangeText,
                      dateRange === range.id ? styles.dateRangeTextSelected : styles.dateRangeTextUnselected
                    ]}>
                      {range.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Apply Button */}
            <Button
              variant="primary"
              onPress={() => setShowFilterModal(false)}
              style={styles.applyButton}
            >
              Apply Filters
            </Button>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderReceiptItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ReceiptDetail', { id: item.id })}
      onLongPress={() => {
        Alert.alert(
          'Delete Receipt',
          'Are you sure you want to delete this receipt?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => deleteMutation.mutate(item.id),
            },
          ]
        );
      }}
      style={styles.receiptCard}
    >
      <View style={styles.receiptCardContent}>
        <View style={[styles.iconContainer, { backgroundColor: getCategoryColor(item.category) + '20' }]}>
          <Icon name={getCategoryIcon(item.category)} size={24} color={getCategoryColor(item.category)} />
        </View>

        <View style={styles.receiptInfo}>
          <View style={styles.receiptHeader}>
            <Text style={styles.vendorName}>{item.vendor || 'Unknown'}</Text>
            <Badge status={item.status || 'pending'} />
          </View>

          <View style={styles.receiptDetails}>
            <Text style={styles.receiptDate}>
              {item.date ? new Date(item.date).toLocaleDateString() : 'No date'}
            </Text>
            <View style={styles.amountContainer}>
              <Text style={styles.amount}>${(item.amount || 0).toFixed(2)}</Text>
              {item.gst > 0 && (
                <Text style={styles.gstText}>GST: ${item.gst.toFixed(2)}</Text>
              )}
            </View>
          </View>

          {item.notes && (
            <Text style={styles.notes} numberOfLines={1}>{item.notes}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading && !receipts.length) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Receipts" showBack />
        <View style={styles.loadingContainer}>
          <Text>Loading receipts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Receipts" 
        showBack 
        rightIcon="plus"
        onRightPress={() => navigation.navigate('Camera')}
      />

      {/* Search and Filter Bar */}
      <View style={styles.searchFilterBar}>
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color={colors.gray[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search receipts..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.gray[400]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={16} color={colors.gray[400]} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Icon name="tune" size={24} color={colors.white} />
          {(selectedCategory !== 'all' || dateRange !== 'all' || sortBy !== 'date-desc') && (
            <View style={styles.filterBadge} />
          )}
        </TouchableOpacity>
      </View>

      {/* Categories Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryChip,
              selectedCategory === cat.id ? styles.categoryChipSelected : styles.categoryChipUnselected
            ]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Icon 
              name={cat.icon} 
              size={16} 
              color={selectedCategory === cat.id ? colors.white : colors.gray[600]} 
            />
            <Text style={[
              styles.categoryChipText,
              selectedCategory === cat.id ? styles.categoryChipTextSelected : styles.categoryChipTextUnselected
            ]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Stats Summary */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total</Text>
          <Text style={[styles.statValue, styles.totalValue]}>
            ${totalAmount.toFixed(2)}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>GST/HST</Text>
          <Text style={[styles.statValue, styles.gstValue]}>
            ${totalGST.toFixed(2)}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Verified</Text>
          <Text style={[styles.statValue, styles.verifiedValue]}>
            {verifiedCount}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Pending</Text>
          <Text style={[styles.statValue, styles.pendingValue]}>
            {pendingCount}
          </Text>
        </View>
      </View>

      {/* Receipts List */}
      {receipts.length > 0 ? (
        <FlatList
          data={receipts}
          renderItem={renderReceiptItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <EmptyState
          icon="receipt"
          title="No receipts found"
          message={searchQuery || selectedCategory !== 'all' 
            ? "Try adjusting your filters" 
            : "Start by scanning your first receipt"}
          buttonText="Scan Receipt"
          onButtonPress={() => navigation.navigate('Camera')}
        />
      )}

      <FilterModal />
      <BottomNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchFilterBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    ...typography.body,
    color: colors.text.primary,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.warning,
    borderWidth: 2,
    borderColor: colors.white,
  },
  categoriesScroll: {
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
  },
  categoriesContent: {
    paddingHorizontal: spacing.lg,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: borderRadius.full,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary[500],
  },
  categoryChipUnselected: {
    backgroundColor: colors.gray[100],
  },
  categoryChipText: {
    marginLeft: spacing.xs,
    fontSize: typography.sizes.sm,
  },
  categoryChipTextSelected: {
    color: colors.white,
  },
  categoryChipTextUnselected: {
    color: colors.gray[600],
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.h5,
  },
  totalValue: {
    color: colors.primary[500],
  },
  gstValue: {
    color: colors.success,
  },
  verifiedValue: {
    color: colors.success,
  },
  pendingValue: {
    color: colors.warning,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  receiptCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  receiptCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  receiptInfo: {
    flex: 1,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  vendorName: {
    ...typography.body,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    flex: 1,
  },
  receiptDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  receiptDate: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    ...typography.body,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  gstText: {
    ...typography.caption,
    color: colors.gray[400],
    marginTop: 2,
  },
  notes: {
    ...typography.caption,
    color: colors.gray[400],
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
  filterSection: {
    marginBottom: spacing.lg,
  },
  filterSectionTitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sortOptionText: {
    ...typography.body,
    color: colors.text.primary,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  dateRangeChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  dateRangeChipSelected: {
    backgroundColor: colors.primary[500],
  },
  dateRangeChipUnselected: {
    backgroundColor: colors.gray[100],
  },
  dateRangeText: {
    fontSize: typography.sizes.sm,
  },
  dateRangeTextSelected: {
    color: colors.white,
  },
  dateRangeTextUnselected: {
    color: colors.text.secondary,
  },
  applyButton: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
});

export default ReceiptsScreen;







