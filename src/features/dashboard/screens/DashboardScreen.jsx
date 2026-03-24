import React, { useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '@/features/auth/context/AuthContext';

const normalizeBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    return ['true', '1', 'yes', 'y'].includes(v);
  }
  if (typeof value === 'number') return value === 1;
  return false;
};

const buildPersonProfile = (raw = {}) => {
  const taxProfile = raw?.taxProfile || {};
  const incomeSources = Array.isArray(raw?.incomeSources) ? raw.incomeSources : [];
  const businessInfo = raw?.businessInfo || {};

  const incomeSet = new Set(incomeSources.map((item) => String(item).trim().toLowerCase()));
  const userType = String(raw?.userType || raw?.roleType || '').trim().toLowerCase();

  const employment =
    normalizeBoolean(taxProfile.employment) ||
    normalizeBoolean(raw?.employment) ||
    incomeSet.has('employment') ||
    incomeSet.has('employed') ||
    userType.includes('employee') ||
    userType.includes('employed');

  const gigWork =
    normalizeBoolean(taxProfile.gigWork) ||
    normalizeBoolean(taxProfile.selfEmployed) ||
    normalizeBoolean(raw?.gigWork) ||
    normalizeBoolean(raw?.selfEmployed) ||
    incomeSet.has('gig') ||
    incomeSet.has('gig work') ||
    incomeSet.has('self-employed') ||
    incomeSet.has('self employed') ||
    userType.includes('gig') ||
    userType.includes('self-employed') ||
    userType.includes('self employed');

  const business =
    normalizeBoolean(taxProfile.business) ||
    normalizeBoolean(raw?.business) ||
    normalizeBoolean(businessInfo?.hasBusiness) ||
    normalizeBoolean(businessInfo?.isBusinessOwner) ||
    incomeSet.has('business') ||
    userType.includes('business');

  const unemployed =
    normalizeBoolean(taxProfile.unemployed) ||
    normalizeBoolean(raw?.unemployed) ||
    (!employment && !gigWork && !business);

  return {
    employment,
    gigWork,
    business,
    unemployed,
    rrsp: normalizeBoolean(taxProfile.rrsp) || normalizeBoolean(raw?.rrsp),
    fhsa: normalizeBoolean(taxProfile.fhsa) || normalizeBoolean(raw?.fhsa),
    tfsa: normalizeBoolean(taxProfile.tfsa) || normalizeBoolean(raw?.tfsa),
    investments: normalizeBoolean(taxProfile.investments) || normalizeBoolean(raw?.investments),
    donations: normalizeBoolean(taxProfile.donations) || normalizeBoolean(raw?.donations),
    ccb: normalizeBoolean(taxProfile.ccb) || normalizeBoolean(raw?.ccb),
    workFromHome:
      normalizeBoolean(taxProfile.workFromHome) || normalizeBoolean(raw?.workFromHome),
    hasAnyIncome: employment || gigWork || business,
  };
};

const buildHouseholdProfile = (rawUser = {}) => {
  const spouseRaw = rawUser?.spouse || {};
  const hasSpouse = !!(
    rawUser?.spouse &&
    typeof rawUser.spouse === 'object' &&
    Object.keys(rawUser.spouse).length > 0
  );

  return {
    user: buildPersonProfile(rawUser),
    spouse: buildPersonProfile(spouseRaw),
    hasSpouse,
  };
};

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();

  const profile = useMemo(() => buildHouseholdProfile(user || {}), [user]);

  const firstName =
    user?.firstName ||
    user?.name?.split?.(' ')?.[0] ||
    user?.fullName?.split?.(' ')?.[0] ||
    'Gaurav';

  const dashboardMeta = useMemo(() => {
    const requiredMissing = [];
    const savingsOpportunities = [];
    const completedItems = [];

    if (profile.user.employment) {
      requiredMissing.push({
        title: 'T4 Employment Income',
        subtitle: 'Required',
        icon: 'briefcase-outline',
        routeName: 'UploadT4',
      });
    }

    if (profile.user.gigWork) {
      requiredMissing.push({
        title: 'Gig Income Records',
        subtitle: 'T4A, annual summaries, invoices',
        icon: 'cash-multiple',
        routeName: 'Documents',
        params: { category: 'gig-income' },
      });
    }

    if (profile.user.business) {
      requiredMissing.push({
        title: 'Business Records',
        subtitle: 'Sales, expenses, payroll, rent',
        icon: 'office-building-outline',
        routeName: 'Documents',
        params: { category: 'business' },
      });
    }

    if (profile.user.rrsp) {
      savingsOpportunities.push({
        title: 'RRSP Contributions',
        subtitle: 'Contribution slips and deduction records',
        icon: 'bank-outline',
        routeName: 'Documents',
        params: { category: 'rrsp' },
        status: 'Enabled',
      });
    } else {
      savingsOpportunities.push({
        title: 'RRSP Contributions',
        subtitle: 'Can lower your taxable income',
        icon: 'bank-outline',
        routeName: 'Documents',
        params: { category: 'rrsp' },
        status: 'Optional',
      });
    }

    if (profile.user.fhsa || !profile.user.unemployed) {
      savingsOpportunities.push({
        title: 'FHSA Contributions',
        subtitle: 'Useful for first-home buyers',
        icon: 'home-plus-outline',
        routeName: 'Documents',
        params: { category: 'fhsa' },
        status: profile.user.fhsa ? 'Enabled' : 'Optional',
      });
    }

    if (profile.user.donations || !profile.user.unemployed) {
      savingsOpportunities.push({
        title: 'Donations',
        subtitle: 'May increase your refund',
        icon: 'gift-outline',
        routeName: 'Documents',
        params: { category: 'donations' },
        status: profile.user.donations ? 'Enabled' : 'Optional',
      });
    }

    if (profile.user.investments || profile.user.tfsa) {
      savingsOpportunities.push({
        title: 'Investments',
        subtitle: 'T5s and account statements',
        icon: 'chart-line',
        routeName: 'Documents',
        params: { category: 'investments' },
        status: 'Enabled',
      });
    }

    completedItems.push({
      name: 'Profile Information',
      date: 'Completed',
      icon: 'account-check-outline',
      routeName: 'Profile',
    });

    if (profile.hasSpouse) {
      completedItems.push({
        name: 'Household Setup',
        date: 'Spouse added',
        icon: 'account-heart-outline',
        routeName: 'Profile',
      });
    }

    if (profile.user.employment) {
      completedItems.push({
        name: 'Employment Profile',
        date: 'Income source selected',
        icon: 'briefcase-check-outline',
        routeName: 'Profile',
      });
    }

    const quickActions = [
      profile.user.employment && {
        title: 'Upload T4',
        subtitle: 'Required to continue',
        icon: 'file-document-outline',
        routeName: 'UploadT4',
        primary: true,
      },
      profile.user.gigWork && {
        title: 'Gig Income',
        subtitle: 'T4A and summaries',
        icon: 'cash-multiple',
        routeName: 'Documents',
        params: { category: 'gig-income' },
      },
      (profile.user.gigWork || profile.user.business) && {
        title: 'Add Receipts',
        subtitle: 'Track expense proofs',
        icon: 'receipt-outline',
        routeName: 'Documents',
        params: { category: 'receipts' },
      },
      profile.user.gigWork && {
        title: 'Mileage',
        subtitle: 'Track business driving',
        icon: 'map-marker-distance',
        routeName: 'MileageTracker',
      },
      {
        title: 'RRSP',
        subtitle: 'Add contribution slips',
        icon: 'bank-outline',
        routeName: 'Documents',
        params: { category: 'rrsp' },
      },
      {
        title: 'Donations',
        subtitle: 'Claim tax credits',
        icon: 'hand-heart-outline',
        routeName: 'Documents',
        params: { category: 'donations' },
      },
    ].filter(Boolean);

    const checklist = [
      { label: 'Complete profile setup', done: true, routeName: 'Profile' },
      {
        label: profile.user.employment ? 'Upload T4' : 'Review income profile',
        done: false,
        routeName: profile.user.employment ? 'UploadT4' : 'Profile',
      },
      {
        label: 'Add supporting tax documents',
        done: false,
        routeName: 'Documents',
      },
      {
        label: 'Upload receipts and expenses',
        done: !(profile.user.gigWork || profile.user.business),
        routeName: 'Documents',
        params: { category: 'receipts' },
      },
      {
        label: 'Review tax checklist',
        done: false,
        routeName: 'Checklist',
      },
    ];

    return {
      requiredMissing,
      savingsOpportunities,
      completedItems,
      quickActions,
      checklist,
    };
  }, [profile]);

  const progress = useMemo(() => {
    const total = dashboardMeta.checklist.length || 1;
    const done = dashboardMeta.checklist.filter((item) => item.done).length;
    return Math.max(20, Math.round((done / total) * 100));
  }, [dashboardMeta]);

  const openDrawer = () => {
    if (typeof navigation?.openDrawer === 'function') {
      navigation.openDrawer();
      return;
    }

    const parent = navigation?.getParent?.();
    if (parent && typeof parent.openDrawer === 'function') {
      parent.openDrawer();
      return;
    }

    const grandParent = parent?.getParent?.();
    if (grandParent && typeof grandParent.openDrawer === 'function') {
      grandParent.openDrawer();
    }
  };

  const navigateTo = (routeName, params = {}) => {
    if (!routeName) return;

    try {
      navigation.navigate(routeName, params);
    } catch (error) {
      console.log('Navigation error:', routeName, error);
    }
  };

  const profileLabel = useMemo(() => {
    const labels = [];

    if (profile.user.employment) labels.push('Employed');
    if (profile.user.gigWork) labels.push('Self-Employed');
    if (profile.user.business) labels.push('Business Owner');
    if (profile.user.unemployed && labels.length === 0) labels.push('Unemployed');

    if (profile.hasSpouse) labels.push('With Spouse');

    return `${labels.join(' • ')} Tax Profile`;
  }, [profile]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.menuButton} onPress={openDrawer}>
            <Icon name="menu" size={24} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.headerTextWrap}>
            <Text style={styles.greeting}>Good evening, {firstName}</Text>
            <Text style={styles.profileTag}>{profileLabel} • 2025 Return</Text>
          </View>

          <TouchableOpacity style={styles.bellButton}>
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

          <Text style={styles.heroTitle}>Your dashboard is now profile-driven</Text>
          <Text style={styles.heroSubtitle}>
            Actions change based on employment, self-employment, business, spouse,
            and optional tax categories like RRSP, FHSA, donations, and investments.
          </Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatValue}>{dashboardMeta.requiredMissing.length}</Text>
              <Text style={styles.heroStatLabel}>Required Items</Text>
            </View>
            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatValue}>{dashboardMeta.savingsOpportunities.length}</Text>
              <Text style={styles.heroStatLabel}>Tax Saving Areas</Text>
            </View>
            <View style={[styles.heroStatBox, styles.heroStatBoxLast]}>
              <Text style={styles.heroStatValue}>
                {dashboardMeta.checklist.filter((item) => item.done).length}
              </Text>
              <Text style={styles.heroStatLabel}>Completed</Text>
            </View>
          </View>

          <View style={styles.heroButtonRow}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() =>
                navigateTo(profile.user.employment ? 'UploadT4' : 'Checklist')
              }
            >
              <Text style={styles.primaryButtonText}>
                {profile.user.employment ? 'Upload T4' : 'Continue Setup'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigateTo('Checklist')}
            >
              <Text style={styles.secondaryButtonText}>View Checklist</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>

          <View style={styles.quickGrid}>
            {dashboardMeta.quickActions.map((item) => (
              <TouchableOpacity
                key={item.title}
                style={[
                  styles.quickCard,
                  item.primary && styles.quickCardPrimary,
                ]}
                onPress={() => navigateTo(item.routeName, item.params)}
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
          </View>

          {dashboardMeta.requiredMissing.map((doc) => (
            <TouchableOpacity
              key={doc.title}
              style={styles.listCard}
              onPress={() => navigateTo(doc.routeName, doc.params)}
            >
              <View style={styles.listLeft}>
                <View style={styles.listIconWrap}>
                  <Icon name={doc.icon} size={22} color="#2563EB" />
                </View>
                <View style={styles.listTextWrap}>
                  <Text style={styles.listTitle}>{doc.title}</Text>
                  <Text style={styles.listSubtitle}>{doc.subtitle}</Text>
                </View>
              </View>

              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>Open</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ways to Save Tax</Text>
          </View>

          {dashboardMeta.savingsOpportunities.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.savingsCard}
              onPress={() => navigateTo(item.routeName, item.params)}
            >
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
            {dashboardMeta.checklist.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.checklistRow}
                onPress={() => navigateTo(item.routeName, item.params)}
              >
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
          </View>

          {dashboardMeta.completedItems.map((item) => (
            <TouchableOpacity
              key={item.name}
              style={styles.activityCard}
              onPress={() => navigateTo(item.routeName)}
            >
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
            <Text style={styles.summaryValue}>
              {profile.user.employment ? 'T4 required' : 'Not selected'}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Self-employment</Text>
            <Text style={styles.summaryValue}>
              {profile.user.gigWork ? 'Active' : 'Not selected'}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Business owner</Text>
            <Text style={styles.summaryValue}>
              {profile.user.business ? 'Active' : 'Not selected'}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Optional deductions</Text>
            <Text style={styles.summaryValue}>
              {[
                profile.user.rrsp && 'RRSP',
                profile.user.fhsa && 'FHSA',
                profile.user.donations && 'Donations',
                profile.user.investments && 'Investments',
              ]
                .filter(Boolean)
                .join(', ') || 'Not added'}
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryRefundLabel}>Estimated refund</Text>
            <Text style={styles.summaryRefundValue}>Needs more data</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.bottomCta}
          onPress={() => navigateTo('Checklist')}
        >
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
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerTextWrap: {
    flex: 1,
    marginHorizontal: 14,
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
  bellButton: {
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
  },
  heroBadgeText: {
    color: '#2563EB',
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 6,
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
  },
  heroStatBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 10,
  },
  heroStatBoxLast: {
    marginRight: 0,
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
    marginTop: 18,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 6,
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
    marginLeft: 6,
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
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 132,
    marginBottom: 12,
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
    backgroundColor: '#EFF6FF',
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
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
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748B',
    flex: 1,
    marginRight: 12,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    textAlign: 'right',
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
  },
  bottomCtaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginRight: 10,
  },
});