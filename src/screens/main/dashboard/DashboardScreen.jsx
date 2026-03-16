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
import { userAPI } from '../../../services/api';
import { colors, spacing, typography } from '../../../styles/theme';
import { useAuth } from '../../../constants/AuthContext';

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const { data: dashboard, refetch } = useQuery({
    queryKey: ['dashboard', selectedYear],
    queryFn: () => userAPI.getDashboard(selectedYear).then(res => res.data),
    enabled: !!user
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const years = [2025, 2024, 2023, 2022];

  // Mock data for nearby CAs
  const nearbyCAs = [
    { id: 1, initials: 'DC', name: 'David C.', distance: '2.3', rating: 4.8, specialty: 'Retail Expert' },
    { id: 2, initials: 'ST', name: 'Sarah T.', distance: '3.7', rating: 4.9, specialty: 'Gig Economy' },
    { id: 3, initials: 'MP', name: 'Michael P.', distance: '5.1', rating: 4.7, specialty: 'Small Business' },
    { id: 4, initials: 'JW', name: 'Jennifer W.', distance: '1.8', rating: 4.9, specialty: 'Tax Specialist' },
  ];

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
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
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

      {/* Find a CA Section - Enhanced for All Users */}
      <TouchableOpacity
        onPress={() => navigation.navigate('FindCA')}
        style={styles.findCASection}
        activeOpacity={0.7}
      >
        <View style={styles.findCAHeader}>
          <View style={styles.findCAIconContainer}>
            <Icon name="account-tie" size={24} color={colors.white} />
          </View>
          
          <View style={styles.findCATextContainer}>
            <Text style={styles.findCATitle}>
              Find a Chartered Accountant
            </Text>
            <Text style={styles.findCASubtitle}>
              {user?.userType === 'gig-worker' 
                ? 'Specializing in gig economy & self-employment taxes'
                : user?.userType === 'shop-owner'
                ? 'Experts in retail, inventory & franchise accounting'
                : 'Verified CAs near you'}
            </Text>
          </View>
          
          <Icon name="chevron-right" size={24} color={colors.primary[500]} />
        </View>

        {/* Preview of nearby CAs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.caPreviewScroll}
        >
          {nearbyCAs.map((ca) => (
            <View key={ca.id} style={styles.caPreviewCard}>
              <View style={styles.caPreviewHeader}>
                <View style={styles.caPreviewAvatar}>
                  <Text style={styles.caPreviewInitials}>{ca.initials}</Text>
                </View>
                <View style={styles.caPreviewInfo}>
                  <Text style={styles.caPreviewName}>{ca.name}</Text>
                  <View style={styles.caPreviewDetails}>
                    <Icon name="map-marker" size={10} color={colors.gray[400]} />
                    <Text style={styles.caPreviewDistance}>{ca.distance}km</Text>
                    <Icon name="star" size={10} color={colors.gold} style={styles.caPreviewStar} />
                    <Text style={styles.caPreviewRating}>{ca.rating}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.caPreviewBadge}>
                <Text style={styles.caPreviewBadgeText}>{ca.specialty}</Text>
              </View>
            </View>
          ))}
          
          {/* View All Indicator */}
          <View style={styles.viewAllCard}>
            <Text style={styles.viewAllText}>View All</Text>
            <Icon name="arrow-right" size={16} color={colors.primary[500]} />
          </View>
        </ScrollView>

        {/* Match indicator */}
        <View style={styles.matchIndicator}>
          <Icon name="check-circle" size={14} color={colors.success} />
          <Text style={styles.matchIndicatorText}>
            {nearbyCAs.length} CAs match your industry
          </Text>
        </View>
      </TouchableOpacity>

      {/* Gig Worker Specific Tools */}
      {user?.userType === 'gig-worker' && (
        <View style={styles.gigWorkerSection}>
          <Text style={styles.sectionTitle}>Gig Worker Tools</Text>
          <View style={styles.gigWorkerActions}>
            <TouchableOpacity
              style={styles.gigWorkerAction}
              onPress={() => navigation.navigate('GSTDashboard')}
            >
              <View style={[styles.gigWorkerIcon, { backgroundColor: colors.info + '20' }]}>
                <Icon name="percent" size={28} color={colors.info} />
              </View>
              <Text style={styles.gigWorkerLabel}>GST/HST</Text>
              <Text style={styles.gigWorkerBadge}>Required</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gigWorkerAction}
              onPress={() => navigation.navigate('BusinessUseCalculator')}
            >
              <View style={[styles.gigWorkerIcon, { backgroundColor: colors.success + '20' }]}>
                <Icon name="calculator" size={28} color={colors.success} />
              </View>
              <Text style={styles.gigWorkerLabel}>Business Use</Text>
              <Text style={styles.gigWorkerBadge}>CRA Requirement</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gigWorkerAction}
              onPress={() => navigation.navigate('T2125Form')}
            >
              <View style={[styles.gigWorkerIcon, { backgroundColor: colors.warning + '20' }]}>
                <Icon name="file-document" size={28} color={colors.warning} />
              </View>
              <Text style={styles.gigWorkerLabel}>T2125 Form</Text>
              <Text style={styles.gigWorkerBadge}>Tax Form</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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
              <Icon name="account-tie" size={24} color={colors.primary[50]} />
            </View>
            <View style={styles.caInfo}>
              <Text style={styles.caName}>{dashboard?.caName || 'Your CA'}</Text>
              <Text style={styles.caStatus}>Your CA • Active</Text>
            </View>
          </View>
          <Text style={styles.caMessageText}>
            "Hi! I've reviewed your Q1 receipts. Everything looks good!"
          </Text>
        </View>
      )}

      {/* Bottom padding */}
      <View style={styles.bottomPadding} />
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
    backgroundColor: colors.primary[50],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  greeting: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  userName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.gray[900],
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    marginVertical: spacing.md,
  },
  yearChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.primary[50],
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
    color: colors.gray[700],
    fontWeight: typography.weights.medium,
  },
  yearChipTextSelected: {
    color: colors.primary[50],
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.lg,
    backgroundColor: colors.primary[50],
    marginHorizontal: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  quickAction: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  quickActionLabel: {
    fontSize: typography.sizes.xs,
    color: colors.gray[600],
    fontWeight: typography.weights.medium,
  },
  // Find CA Section Styles
  findCASection: {
    backgroundColor: colors.primary[50],
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  findCAHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  findCAIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  findCATextContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  findCATitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.primary[700],
  },
  findCASubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.primary[600],
    marginTop: 2,
  },
  caPreviewScroll: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  caPreviewCard: {
    backgroundColor: colors.white,
    padding: spacing.sm,
    borderRadius: 8,
    marginRight: spacing.sm,
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  caPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  caPreviewAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  caPreviewInitials: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primary[500],
  },
  caPreviewInfo: {
    marginLeft: spacing.xs,
    flex: 1,
  },
  caPreviewName: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.gray[800],
  },
  caPreviewDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  caPreviewDistance: {
    fontSize: typography.sizes.xs - 1,
    color: colors.gray[500],
    marginLeft: 2,
  },
  caPreviewStar: {
    marginLeft: 4,
  },
  caPreviewRating: {
    fontSize: typography.sizes.xs - 1,
    color: colors.gray[500],
    marginLeft: 2,
  },
  caPreviewBadge: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  caPreviewBadgeText: {
    fontSize: typography.sizes.xs - 1,
    color: colors.primary[600],
  },
  viewAllCard: {
    backgroundColor: colors.white,
    padding: spacing.sm,
    borderRadius: 8,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary[200],
    borderStyle: 'dashed',
  },
  viewAllText: {
    fontSize: typography.sizes.xs,
    color: colors.primary[500],
    fontWeight: typography.weights.medium,
    marginBottom: 2,
  },
  matchIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  matchIndicatorText: {
    fontSize: typography.sizes.xs,
    color: colors.success,
    marginLeft: 4,
    fontWeight: typography.weights.medium,
  },
  // Gig Worker Section
  gigWorkerSection: {
    backgroundColor: colors.primary[50],
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  gigWorkerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
  },
  gigWorkerAction: {
    alignItems: 'center',
    flex: 1,
  },
  gigWorkerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  gigWorkerLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.gray[800],
    marginTop: spacing.xs,
  },
  gigWorkerBadge: {
    fontSize: typography.sizes.xs,
    color: colors.primary[500],
    backgroundColor: colors.primary[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 2,
    overflow: 'hidden',
  },
  // Stats Grid
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
    borderRadius: 8,
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
    fontWeight: typography.weights.medium,
  },
  statValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.gray[900],
  },
  statTitle: {
    fontSize: typography.sizes.xs,
    color: colors.gray[500],
    fontWeight: typography.weights.medium,
  },
  // Sections
  section: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    color: colors.gray[800],
  },
  sectionLink: {
    color: colors.primary[500],
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  // Receipt Items
  receiptItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  receiptIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.primary[100],
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
  // Deadline Card
  deadlineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.warning + '10',
    borderRadius: 12,
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
    color: colors.gray[600],
  },
  deadlineBadge: {
    backgroundColor: colors.warning + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  deadlineBadgeText: {
    color: colors.warning,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  // CA Message
  caMessage: {
    backgroundColor: colors.primary[100],
  },
  caHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  caIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    fontWeight: typography.weights.medium,
  },
  caMessageText: {
    fontSize: typography.sizes.base,
    color: colors.gray[700],
    fontStyle: 'italic',
  },
  bottomPadding: {
    height: spacing.xl,
  },
});

export default DashboardScreen;