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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/layout/Header';
import BottomNav from '../../components/layout/BottomNav';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing } from '../../styles/spacing';

const ReceiptsScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortBy, setSortBy] = useState('date-desc');
  const [dateRange, setDateRange] = useState('all');

  // Sample data - replace with API data
  const [receipts, setReceipts] = useState([
    { 
      id: '1', 
      vendor: 'Shell', 
      amount: 45.23, 
      date: '2024-03-15', 
      category: 'fuel', 
      status: 'verified',
      gst: 2.26,
      paymentMethod: 'Credit Card',
      notes: 'Business meeting fuel'
    },
    { 
      id: '2', 
      vendor: 'Canadian Tire', 
      amount: 123.45, 
      date: '2024-03-14', 
      category: 'maintenance', 
      status: 'pending',
      gst: 6.17,
      paymentMethod: 'Debit',
      notes: 'Oil change'
    },
    { 
      id: '3', 
      vendor: 'Amazon', 
      amount: 89.99, 
      date: '2024-03-12', 
      category: 'office-supplies', 
      status: 'verified',
      gst: 4.50,
      paymentMethod: 'Credit Card',
      notes: 'Office supplies'
    },
    { 
      id: '4', 
      vendor: 'Tim Hortons', 
      amount: 4.50, 
      date: '2024-03-11', 
      category: 'meals', 
      status: 'verified',
      gst: 0.23,
      paymentMethod: 'Cash',
      notes: 'Client meeting coffee'
    },
    { 
      id: '5', 
      vendor: 'Staples', 
      amount: 67.89, 
      date: '2024-03-10', 
      category: 'office-supplies', 
      status: 'pending',
      gst: 3.39,
      paymentMethod: 'Credit Card',
      notes: 'Printer paper and pens'
    },
    { 
      id: '6', 
      vendor: 'Uber', 
      amount: 23.50, 
      date: '2024-03-09', 
      category: 'transportation', 
      status: 'verified',
      gst: 1.18,
      paymentMethod: 'App',
      notes: 'Airport pickup'
    },
  ]);

  const categories = [
    { id: 'all', label: 'All', icon: 'view-grid' },
    { id: 'fuel', label: 'Fuel', icon: 'gas-station' },
    { id: 'maintenance', label: 'Maintenance', icon: 'wrench' },
    { id: 'insurance', label: 'Insurance', icon: 'shield' },
    { id: 'office-supplies', label: 'Office', icon: 'briefcase' },
    { id: 'meals', label: 'Meals', icon: 'food' },
    { id: 'transportation', label: 'Transport', icon: 'car' },
    { id: 'other', label: 'Other', icon: 'dots-horizontal' },
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
    { id: 'custom', label: 'Custom Range' },
  ];

  const getCategoryIcon = (category) => {
    const icons = {
      fuel: 'gas-station',
      maintenance: 'wrench',
      insurance: 'shield',
      'office-supplies': 'briefcase',
      internet: 'wifi',
      rent: 'home',
      utilities: 'flash',
      meals: 'food',
      software: 'laptop',
      advertising: 'megaphone',
      transportation: 'car',
      other: 'receipt',
    };
    return icons[category] || 'receipt';
  };

  const getCategoryColor = (category) => {
    const colors_map = {
      fuel: '#FF6B35',
      maintenance: '#ED6A5E',
      insurance: '#005A9C',
      'office-supplies': '#2E7D32',
      meals: '#FFD700',
      transportation: '#9C27B0',
      other: '#6C757D',
    };
    return colors_map[category] || colors.primary[500];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-CA', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  const filterReceipts = () => {
    let filtered = [...receipts];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(r => 
        r.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.notes?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(r => r.category === selectedCategory);
    }

    // Date range filter
    if (dateRange !== 'all') {
      const today = new Date();
      const filterDate = new Date();
      
      switch(dateRange) {
        case 'today':
          filtered = filtered.filter(r => new Date(r.date).toDateString() === today.toDateString());
          break;
        case 'week':
          filterDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(r => new Date(r.date) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(r => new Date(r.date) >= filterDate);
          break;
        case 'year':
          filterDate.setFullYear(today.getFullYear() - 1);
          filtered = filtered.filter(r => new Date(r.date) >= filterDate);
          break;
      }
    }

    // Sort
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        case 'vendor-asc':
          return a.vendor.localeCompare(b.vendor);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredReceipts = filterReceipts();

  const totalAmount = filteredReceipts.reduce((sum, r) => sum + r.amount, 0);
  const totalGST = filteredReceipts.reduce((sum, r) => sum + (r.gst || 0), 0);
  const verifiedCount = filteredReceipts.filter(r => r.status === 'verified').length;
  const pendingCount = filteredReceipts.filter(r => r.status === 'pending').length;

  const handleDeleteReceipt = (id) => {
    Alert.alert(
      'Delete Receipt',
      'Are you sure you want to delete this receipt?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: () => {
            setReceipts(receipts.filter(r => r.id !== id));
          },
          style: 'destructive'
        },
      ]
    );
  };

  const FilterModal = () => (
    <Modal
      visible={showFilterModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
      }}>
        <View style={{
          backgroundColor: colors.white,
          borderTopLeftRadius: spacing.radius.xl,
          borderTopRightRadius: spacing.radius.xl,
          padding: spacing.lg,
          maxHeight: '80%',
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.lg,
          }}>
            <Text style={[typography.styles.h5]}>Filter & Sort</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Icon name="close" size={24} color={colors.gray[400]} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Sort By */}
            <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.sm }]}>
              SORT BY
            </Text>
            {sortOptions.map(option => (
              <TouchableOpacity
                key={option.id}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: spacing.md,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.gray[100],
                }}
                onPress={() => setSortBy(option.id)}
              >
                <Text style={typography.styles.body2}>{option.label}</Text>
                {sortBy === option.id && (
                  <Icon name="check" size={20} color={colors.primary[500]} />
                )}
              </TouchableOpacity>
            ))}

            {/* Date Range */}
            <Text style={[typography.styles.caption, { color: colors.text.secondary, marginTop: spacing.lg, marginBottom: spacing.sm }]}>
              DATE RANGE
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {dateRanges.map(range => (
                <TouchableOpacity
                  key={range.id}
                  style={{
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                    borderRadius: spacing.radius.full,
                    backgroundColor: dateRange === range.id ? colors.primary[500] : colors.gray[100],
                  }}
                  onPress={() => setDateRange(range.id)}
                >
                  <Text style={{
                    color: dateRange === range.id ? colors.white : colors.text.secondary,
                    fontSize: typography.sizes.sm,
                  }}>
                    {range.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Apply Button */}
            <Button
              variant="primary"
              onPress={() => setShowFilterModal(false)}
              style={{ marginTop: spacing.xl, marginBottom: spacing.lg }}
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
      onLongPress={() => handleDeleteReceipt(item.id)}
      style={{
        backgroundColor: colors.white,
        borderRadius: spacing.radius.lg,
        marginBottom: spacing.md,
        padding: spacing.md,
        ...spacing.shadows.sm,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{
          width: 48,
          height: 48,
          borderRadius: spacing.radius.md,
          backgroundColor: getCategoryColor(item.category) + '20',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: spacing.md,
        }}>
          <Icon name={getCategoryIcon(item.category)} size={24} color={getCategoryColor(item.category)} />
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[typography.styles.body1, { fontWeight: typography.weights.medium }]}>
              {item.vendor}
            </Text>
            <Badge status={item.status} />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs }}>
            <View>
              <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                {formatDate(item.date)}
              </Text>
              {item.notes && (
                <Text style={[typography.styles.caption, { color: colors.gray[400], marginTop: 2 }]} numberOfLines={1}>
                  {item.notes}
                </Text>
              )}
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[typography.styles.body1, { fontWeight: typography.weights.semiBold }]}>
                ${item.amount.toFixed(2)}
              </Text>
              {item.gst > 0 && (
                <Text style={[typography.styles.caption, { color: colors.gray[400] }]}>
                  GST: ${item.gst.toFixed(2)}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header 
        title="Receipts" 
        showBack 
        rightIcon="plus"
        onRightPress={() => navigation.navigate('Camera')}
      />

      {/* Search and Filter Bar */}
      <View style={{
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[100],
      }}>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.gray[50],
          borderRadius: spacing.radius.md,
          paddingHorizontal: spacing.md,
          marginRight: spacing.sm,
        }}>
          <Icon name="magnify" size={20} color={colors.gray[400]} />
          <TextInput
            style={{
              flex: 1,
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.sm,
              fontSize: typography.sizes.base,
            }}
            placeholder="Search receipts..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={16} color={colors.gray[400]} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={{
            width: 48,
            height: 48,
            backgroundColor: colors.primary[500],
            borderRadius: spacing.radius.md,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setShowFilterModal(true)}
        >
          <Icon name="tune" size={24} color={colors.white} />
          {(selectedCategory !== 'all' || dateRange !== 'all' || sortBy !== 'date-desc') && (
            <View style={{
              position: 'absolute',
              top: 5,
              right: 5,
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: colors.warning.main,
              borderWidth: 2,
              borderColor: colors.white,
            }} />
          )}
        </TouchableOpacity>
      </View>

      {/* Categories Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ backgroundColor: colors.white, paddingVertical: spacing.sm }}
        contentContainerStyle={{ paddingHorizontal: spacing.lg }}
      >
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              marginRight: spacing.sm,
              borderRadius: spacing.radius.full,
              backgroundColor: selectedCategory === cat.id ? colors.primary[500] : colors.gray[100],
            }}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Icon 
              name={cat.icon} 
              size={16} 
              color={selectedCategory === cat.id ? colors.white : colors.gray[600]} 
            />
            <Text style={{
              marginLeft: spacing.xs,
              color: selectedCategory === cat.id ? colors.white : colors.gray[600],
              fontSize: typography.sizes.sm,
            }}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Stats Summary */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: spacing.lg,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[100],
      }}>
        <View>
          <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>Total</Text>
          <Text style={[typography.styles.h5, { color: colors.primary[500] }]}>
            ${totalAmount.toFixed(2)}
          </Text>
        </View>
        <View>
          <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>GST/HST</Text>
          <Text style={[typography.styles.body1, { color: colors.success.main }]}>
            ${totalGST.toFixed(2)}
          </Text>
        </View>
        <View>
          <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>Verified</Text>
          <Text style={[typography.styles.body1, { color: colors.success.main }]}>
            {verifiedCount}
          </Text>
        </View>
        <View>
          <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>Pending</Text>
          <Text style={[typography.styles.body1, { color: colors.warning.main }]}>
            {pendingCount}
          </Text>
        </View>
      </View>

      {/* Receipts List */}
      {filteredReceipts.length > 0 ? (
        <FlatList
          data={filteredReceipts}
          renderItem={renderReceiptItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{
            padding: spacing.lg,
            paddingBottom: spacing['3xl'],
          }}
          showsVerticalScrollIndicator={false}
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

export default ReceiptsScreen;
