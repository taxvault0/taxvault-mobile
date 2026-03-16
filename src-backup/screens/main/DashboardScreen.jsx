import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { userAPI } from '../../services/api';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';
import { useAuth } from '../../constants/AuthContext';

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { data: dashboard, refetch } = useQuery(
    ['dashboard', selectedYear],
    () => userAPI.getDashboard(selectedYear).then(res => res.data),
    { enabled: !!user }
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const years = [2025, 2024, 2023, 2022];

  const QuickAction = ({ icon, label, onPress, color }) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color + '20' }]}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const StatCard = ({ title, value, icon, color, trend }) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
          <Icon name={icon} size={20} color={color} />
        </View>
        {trend && (
          <View style={styles.trend}>
            <Icon
              name={trend > 0 ? 'trending-up' : 'trending-down'}
              size={16}
              color={trend > 0 ? colors.success : colors.warning}
            />
            <Text style={[styles.trendText, { color: trend > 0 ? colors.success : colors.warning }]}>
              {Math.abs(trend)}%
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0)}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Tax Year Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.yearSelector}
      >
        {years.map(year => (
          <TouchableOpacity
            key={year}
            style={[
              styles.yearChip,
              year === selectedYear && styles.yearChipSelected,
            ]}
            onPress={() => setSelectedYear(year)}
          >
            <Text
              style={[
                styles.yearChipText,
                year === selectedYear && styles.yearChipTextSelected,
              ]}
            >
              {year}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <QuickAction
          icon="camera"
          label="Scan Receipt"
          onPress={() => navigation.navigate('Camera', { mode: 'receipt' })}
          color={colors.primary[500]}
        />
        <QuickAction
          icon="map-marker-distance"
          label="Track Mileage"
          onPress={() => navigation.navigate('Mileage')}
          color={colors.secondary[500]}
        />
        <QuickAction
          icon="file-upload"
          label="Upload Doc"
          onPress={() => navigation.navigate('Documents')}
          color={colors.success}
        />
        <QuickAction
          icon="account-plus"
          label="Invite CA"
          onPress={() => navigation.navigate('Profile', { tab: 'ca' })}
          color={colors.gold}
        />
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Income"
          value={`$${dashboard?.totalIncome?.toLocaleString() || '0'}`}
          icon="cash"
          color={colors.success}
          trend={12}
        />
        <StatCard
          title="Expenses"
          value={`$${dashboard?.totalExpenses?.toLocaleString() || '0'}`}
          icon="receipt"
          color={colors.warning}
          trend={-5}
        />
        <StatCard
          title="Net Income"
          value={`$${dashboard?.netIncome?.toLocaleString() || '0'}`}
          icon="chart-line"
          color={colors.primary[500]}
          trend={8}
        />
        <StatCard
          title="GST Owing"
          value={`$${dashboard?.gstOwing?.toLocaleString() || '0'}`}
          icon="tax"
          color={colors.gray[600]}
        />
      </View>

      {/* Recent Receipts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Receipts</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Receipts')}>
            <Text style={styles.sectionLink}>See All</Text>
          </TouchableOpacity>
        </View>

        {dashboard?.recentReceipts?.map((receipt, index) => (
          <TouchableOpacity
            key={index}
            style={styles.receiptItem}
            onPress={() => navigation.navigate('ReceiptDetail', { id: receipt.id })}
          >
            <View style={styles.receiptIcon}>
              <Icon name="receipt" size={24} color={colors.primary[500]} />
            </View>
            <View style={styles.receiptInfo}>
              <Text style={styles.receiptVendor}>{receipt.vendor}</Text>
              <Text style={styles.receiptDate}>{receipt.date}</Text>
            </View>
            <View style={styles.receiptAmount}>
              <Text style={styles.receiptAmountText}>${receipt.amount}</Text>
              <Icon name="chevron-right" size={20} color={colors.gray[400]} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Upcoming Deadlines */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>
        <View style={styles.deadlineCard}>
          <Icon name="calendar-clock" size={24} color={colors.warning} />
          <View style={styles.deadlineInfo}>
            <Text style={styles.deadlineTitle}>Tax Filing Deadline</Text>
            <Text style={styles.deadlineDate}>April 30, 2025</Text>
          </View>
          <View style={styles.deadlineBadge}>
            <Text style={styles.deadlineBadgeText}>45 days left</Text>
          </View>
        </View>
      </View>

      {/* CA Message Preview (if connected) */}
      {dashboard?.caConnected && (
        <View style={[styles.section, styles.caMessage]}>
          <View style={styles.caHeader}>
            <View style={styles.caIcon}>
              <Icon name="account-tie" size={24} color={colors.white} />
            </View>
            <View style={styles.caInfo}>
              <Text style={styles.caName}>{dashboard?.caName}</Text>
              <Text style={styles.caStatus}>Your CA • Active</Text>
            </View>
          </View>
          <Text style={styles.caMessageText}>
            "Hi! I've reviewed your Q1 receipts. Everything looks good!"
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.white,
  },
  greeting: {
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
  },
  userName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.gray[900],
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.primary[500],
  },
  yearSelector: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  yearChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  yearChipSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  yearChipText: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  yearChipTextSelected: {
    color: colors.white,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.lg,
    backgroundColor: colors.white,
    marginBottom: spacing.lg,
  },
  quickAction: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  quickActionLabel: {
    fontSize: typography.sizes.xs,
    color: colors.gray[600],
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    width: '50%',
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.sm,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: typography.sizes.xs,
    marginLeft: 2,
  },
  statValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.gray[900],
  },
  statTitle: {
    fontSize: typography.sizes.xs,
    color: colors.gray[500],
  },
  section: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  sectionLink: {
    color: colors.primary[500],
    fontSize: typography.sizes.sm,
  },
  receiptItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  receiptIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  receiptInfo: {
    flex: 1,
  },
  receiptVendor: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.gray[900],
  },
  receiptDate: {
    fontSize: typography.sizes.xs,
    color: colors.gray[500],
  },
  receiptAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  receiptAmountText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.gray[900],
    marginRight: spacing.xs,
  },
  deadlineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
  },
  deadlineInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  deadlineTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.gray[900],
  },
  deadlineDate: {
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
  },
  deadlineBadge: {
    backgroundColor: colors.warning + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  deadlineBadgeText: {
    color: colors.warning,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  caMessage: {
    backgroundColor: colors.primary[50],
  },
  caHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  caIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  caInfo: {
    flex: 1,
  },
  caName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.gray[900],
  },
  caStatus: {
    fontSize: typography.sizes.xs,
    color: colors.primary[500],
  },
  caMessageText: {
    fontSize: typography.sizes.base,
    color: colors.gray[700],
    fontStyle: 'italic',
  },
});

export default DashboardScreen;
