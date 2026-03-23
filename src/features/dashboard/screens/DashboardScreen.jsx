import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DashboardScreen = ({ navigation }) => {
  const progress = 42;

  const quickActions = [
    {
      title: 'Upload T4',
      subtitle: 'Required to continue',
      icon: 'file-document-outline',
      primary: true,
    },
    {
      title: 'Add RRSP',
      subtitle: 'Reduce taxable income',
      icon: 'bank-outline',
    },
    {
      title: 'Add Donations',
      subtitle: 'Claim tax credits',
      icon: 'hand-heart-outline',
    },
    {
      title: 'Review Credits',
      subtitle: 'Find more savings',
      icon: 'calculator-variant-outline',
    },
  ];

  const requiredDocs = [
    {
      title: 'T4 Employment Income',
      status: 'Missing',
      statusType: 'danger',
      subtitle: 'Required',
      icon: 'briefcase-outline',
    },
    {
      title: 'Notice of Assessment',
      status: 'Recommended',
      statusType: 'warning',
      subtitle: 'Helpful for optimization',
      icon: 'file-check-outline',
    },
    {
      title: 'CRA Direct Deposit Info',
      status: 'Optional',
      statusType: 'info',
      subtitle: 'For faster refund',
      icon: 'bank-transfer-out',
    },
  ];

  const savingsCards = [
    {
      title: 'RRSP Contributions',
      subtitle: 'Can lower your taxable income',
      icon: 'cash-multiple',
      status: 'Not Added',
    },
    {
      title: 'FHSA Contributions',
      subtitle: 'Useful for first-home buyers',
      icon: 'home-plus-outline',
      status: 'Optional',
    },
    {
      title: 'Donations',
      subtitle: 'May increase your refund',
      icon: 'gift-outline',
      status: 'Pending',
    },
    {
      title: 'Medical Expenses',
      subtitle: 'Check if you are eligible',
      icon: 'medical-bag',
      status: 'Not Reviewed',
    },
  ];

  const checklist = [
    { label: 'Complete profile setup', done: true },
    { label: 'Upload T4', done: false },
    { label: 'Add RRSP slips', done: false },
    { label: 'Add donation receipts', done: false },
    { label: 'Review tax credits', done: false },
    { label: 'Confirm CRA details', done: true },
  ];

  const uploads = [
    {
      name: 'Profile Information',
      date: 'Completed',
      status: 'Done',
      icon: 'account-check-outline',
    },
    {
      name: 'CRA Details',
      date: 'Updated recently',
      status: 'Done',
      icon: 'shield-check-outline',
    },
    {
      name: 'T4 Slip',
      date: 'Not uploaded yet',
      status: 'Missing',
      icon: 'file-remove-outline',
    },
  ];

  const getStatusStyle = (type) => {
    switch (type) {
      case 'danger':
        return {
          bg: '#FEF2F2',
          text: '#DC2626',
        };
      case 'warning':
        return {
          bg: '#FFF7ED',
          text: '#EA580C',
        };
      case 'info':
      default:
        return {
          bg: '#EFF6FF',
          text: '#2563EB',
        };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Good evening, Gaurav</Text>
            <Text style={styles.profileTag}>Employed Tax Profile • 2025 Return</Text>
          </View>

          <TouchableOpacity style={styles.headerIconButton}>
            <Icon name="bell-outline" size={22} color="#0F172A" />
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroBadge}>
              <Icon name="chart-line" size={16} color="#2563EB" />
              <Text style={styles.heroBadgeText}>Filing Progress</Text>
            </View>
            <Text style={styles.heroPercent}>{progress}%</Text>
          </View>

          <Text style={styles.heroTitle}>You are making good progress</Text>
          <Text style={styles.heroSubtitle}>
            Upload your T4 and review deductions like RRSP, FHSA, and donations to
            move closer to filing.
          </Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatValue}>1</Text>
              <Text style={styles.heroStatLabel}>Required Missing</Text>
            </View>
            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatValue}>3</Text>
              <Text style={styles.heroStatLabel}>Savings Opportunities</Text>
            </View>
            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatValue}>2</Text>
              <Text style={styles.heroStatLabel}>Completed</Text>
            </View>
          </View>

          <View style={styles.heroButtonRow}>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Continue Setup</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>View Checklist</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.quickGrid}>
            {quickActions.map((item) => (
              <TouchableOpacity
                key={item.title}
                style={[
                  styles.quickCard,
                  item.primary && styles.quickCardPrimary,
                ]}
              >
                <View
                  style={[
                    styles.quickIconWrap,
                    item.primary && styles.quickIconWrapPrimary,
                  ]}
                >
                  <Icon
                    name={item.icon}
                    size={20}
                    color={item.primary ? '#2563EB' : '#475569'}
                  />
                </View>
                <Text
                  style={[
                    styles.quickCardTitle,
                    item.primary && styles.quickCardTitlePrimary,
                  ]}
                >
                  {item.title}
                </Text>
                <Text
                  style={[
                    styles.quickCardSubtitle,
                    item.primary && styles.quickCardSubtitlePrimary,
                  ]}
                >
                  {item.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Required Documents</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>Manage</Text>
            </TouchableOpacity>
          </View>

          {requiredDocs.map((doc) => {
            const statusStyle = getStatusStyle(doc.statusType);
            return (
              <TouchableOpacity key={doc.title} style={styles.listCard}>
                <View style={styles.listLeft}>
                  <View style={styles.listIconWrap}>
                    <Icon name={doc.icon} size={22} color="#2563EB" />
                  </View>
                  <View style={styles.listTextWrap}>
                    <Text style={styles.listTitle}>{doc.title}</Text>
                    <Text style={styles.listSubtitle}>{doc.subtitle}</Text>
                  </View>
                </View>

                <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
                  <Text style={[styles.statusPillText, { color: statusStyle.text }]}>
                    {doc.status}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ways to Save Tax</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>Explore</Text>
            </TouchableOpacity>
          </View>

          {savingsCards.map((item) => (
            <TouchableOpacity key={item.title} style={styles.savingsCard}>
              <View style={styles.savingsLeft}>
                <View style={styles.savingsIconWrap}>
                  <Icon name={item.icon} size={20} color="#0F172A" />
                </View>
                <View style={styles.savingsTextWrap}>
                  <Text style={styles.savingsTitle}>{item.title}</Text>
                  <Text style={styles.savingsSubtitle}>{item.subtitle}</Text>
                </View>
              </View>

              <Text style={styles.savingsStatus}>{item.status}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Tax Checklist</Text>
          </View>

          <View style={styles.checklistCard}>
            {checklist.map((item) => (
              <TouchableOpacity key={item.label} style={styles.checklistRow}>
                <View
                  style={[
                    styles.checkIcon,
                    item.done ? styles.checkIconDone : styles.checkIconPending,
                  ]}
                >
                  <Icon
                    name={item.done ? 'check' : 'clock-outline'}
                    size={16}
                    color={item.done ? '#16A34A' : '#F59E0B'}
                  />
                </View>
                <Text
                  style={[
                    styles.checklistText,
                    item.done && styles.checklistTextDone,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>Open Vault</Text>
            </TouchableOpacity>
          </View>

          {uploads.map((item) => (
            <TouchableOpacity key={item.name} style={styles.activityCard}>
              <View style={styles.activityLeft}>
                <View style={styles.activityIconWrap}>
                  <Icon name={item.icon} size={20} color="#2563EB" />
                </View>
                <View>
                  <Text style={styles.activityTitle}>{item.name}</Text>
                  <Text style={styles.activityDate}>{item.date}</Text>
                </View>
              </View>

              <Icon name="chevron-right" size={22} color="#94A3B8" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Estimated Tax Summary</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Employment income</Text>
            <Text style={styles.summaryValue}>Waiting for T4</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>RRSP deductions</Text>
            <Text style={styles.summaryValue}>Not added</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Donations</Text>
            <Text style={styles.summaryValue}>Pending</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryRefundLabel}>Estimated refund</Text>
            <Text style={styles.summaryRefundValue}>Not enough data yet</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.bottomCta}>
          <Text style={styles.bottomCtaText}>Continue to File Tax</Text>
          <Icon name="arrow-right" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scroll: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 36,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
  },
  profileTag: {
    marginTop: 4,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  headerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  heroBadgeText: {
    color: '#2563EB',
    fontWeight: '700',
    fontSize: 12,
  },
  heroPercent: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  heroTitle: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  heroSubtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 22,
    color: '#64748B',
  },
  progressTrack: {
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 999,
    marginTop: 18,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 999,
  },
  heroStatsRow: {
    flexDirection: 'row',
    marginTop: 18,
    gap: 10,
  },
  heroStatBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  heroStatValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  heroStatLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  heroButtonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '800',
  },
  section: {
    marginBottom: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionLink: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 132,
  },
  quickCardPrimary: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  quickIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  quickIconWrapPrimary: {
    backgroundColor: '#FFFFFF',
  },
  quickCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  quickCardTitlePrimary: {
    color: '#FFFFFF',
  },
  quickCardSubtitle: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: '#64748B',
  },
  quickCardSubtitlePrimary: {
    color: '#CBD5E1',
  },
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listTextWrap: {
    flex: 1,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  listSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748B',
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginLeft: 12,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  savingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  savingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  savingsIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  savingsTextWrap: {
    flex: 1,
  },
  savingsTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  savingsSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748B',
  },
  savingsStatus: {
    marginLeft: 12,
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  checklistCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
  },
  checkIcon: {
    width: 28,
    height: 28,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkIconDone: {
    backgroundColor: '#DCFCE7',
  },
  checkIconPending: {
    backgroundColor: '#FEF3C7',
  },
  checklistText: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
  },
  checklistTextDone: {
    color: '#64748B',
    textDecorationLine: 'line-through',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  activityDate: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748B',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 22,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    gap: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  summaryRefundLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  summaryRefundValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2563EB',
  },
  bottomCta: {
    backgroundColor: '#2563EB',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  bottomCtaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});