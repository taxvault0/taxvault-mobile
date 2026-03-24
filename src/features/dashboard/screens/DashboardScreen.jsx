import React, { useEffect, useMemo, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '@/features/auth/context/AuthContext';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

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
    normalizeBoolean(taxProfile.selfEmployment) ||
    normalizeBoolean(raw?.gigWork) ||
    normalizeBoolean(raw?.selfEmployed) ||
    normalizeBoolean(raw?.selfEmployment) ||
    incomeSet.has('gig') ||
    incomeSet.has('gig-work') ||
    incomeSet.has('gig work') ||
    incomeSet.has('self-employed') ||
    incomeSet.has('self employed') ||
    userType.includes('gig') ||
    userType.includes('self-employed') ||
    userType.includes('self employed');

  const business =
    normalizeBoolean(taxProfile.business) ||
    normalizeBoolean(taxProfile.incorporatedBusiness) ||
    normalizeBoolean(raw?.business) ||
    normalizeBoolean(raw?.incorporatedBusiness) ||
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
  const spouseRaw =
    rawUser?.spouse ||
    rawUser?.spouseInfo ||
    (rawUser?.taxProfile?.spouseTaxProfile
      ? {
          taxProfile: rawUser.taxProfile.spouseTaxProfile,
          incomeSources: rawUser.taxProfile.spouseIncomeSources || [],
        }
      : {});

  const hasSpouse =
    normalizeBoolean(rawUser?.taxProfile?.spouse) ||
    !!(
      spouseRaw &&
      typeof spouseRaw === 'object' &&
      Object.keys(spouseRaw).length > 0
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

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const heroTranslate = useRef(new Animated.Value(16)).current;
  const contentTranslate = useRef(new Animated.Value(24)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const caPressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 360,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(heroTranslate, {
        toValue: 0,
        duration: 420,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslate, {
        toValue: 0,
        duration: 500,
        delay: 50,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
      ])
    );

    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [contentTranslate, fadeAnim, heroTranslate, pulseAnim]);

  const navigateTo = (routeName, params = {}) => {
    if (!routeName) return;
    try {
      navigation.navigate(routeName, params);
    } catch (error) {
      console.log('Navigation error:', routeName, error);
    }
  };

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

  const handleCaPressIn = () => {
    Animated.spring(caPressAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  const handleCaPressOut = () => {
    Animated.spring(caPressAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  const profileLabel = useMemo(() => {
    const labels = [];

    if (profile.user.employment) labels.push('Employed');
    if (profile.user.gigWork) labels.push('Self-Employed');
    if (profile.user.business) labels.push('Business Owner');
    if (profile.user.unemployed && labels.length === 0) labels.push('Unemployed');
    if (profile.hasSpouse) labels.push('With Spouse');

    return `${labels.join(' • ')} • 2025 Return`;
  }, [profile]);

  const dashboardMeta = useMemo(() => {
    const missingItems = [];
    const summaryRows = [];
    const quickActions = [];
    const completionCountBase = [];

    if (profile.user.employment) {
      missingItems.push({
        title: 'Upload your T4 slip',
        subtitle: 'Employment income document is still needed',
        icon: 'briefcase-outline',
        routeName: 'UploadT4',
        tone: 'danger',
      });
    }

    if (profile.user.gigWork) {
      missingItems.push({
        title: 'Upload your T4A income',
        subtitle: 'Add self-employment or gig income',
        icon: 'cash-multiple',
        routeName: 'UploadT4A',
        tone: 'warning',
      });

      missingItems.push({
        title: 'Add mileage or expense support',
        subtitle: 'Needed for gig-work claims',
        icon: 'map-marker-distance',
        routeName: 'MileageTracker',
        tone: 'warning',
      });
    }

    if (profile.user.business) {
      missingItems.push({
        title: 'Add business income records',
        subtitle: 'Sales, expense, and tax support documents',
        icon: 'office-building-outline',
        routeName: 'IncomeDocuments',
        tone: 'danger',
      });
    }

    if (profile.hasSpouse && profile.spouse.employment) {
      missingItems.push({
        title: 'Upload spouse employment documents',
        subtitle: 'Spouse T4 and related records still needed',
        icon: 'account-heart-outline',
        routeName: 'UploadChecklist',
        params: { filter: 'spouse' },
        tone: 'danger',
      });
    }

    quickActions.push(
      {
        title: 'Uploads',
        icon: 'file-check-outline',
        routeName: 'UploadChecklist',
      },
      {
        title: 'Receipts',
        icon: 'receipt-outline',
        routeName: 'Receipts',
      },
      {
        title: 'Mileage',
        icon: 'map-marker-distance',
        routeName: 'MileageTracker',
      },
      {
        title: 'Documents',
        icon: 'folder-outline',
        routeName: 'Documents',
      }
    );

    if (profile.user.rrsp || !profile.user.unemployed) {
      summaryRows.push({
        label: 'RRSP',
        value: profile.user.rrsp ? 'Active' : 'Optional',
        icon: 'bank-outline',
        routeName: 'UploadRRSPReceipt',
      });
    }

    if (profile.user.fhsa || !profile.user.unemployed) {
      summaryRows.push({
        label: 'FHSA',
        value: profile.user.fhsa ? 'Active' : 'Optional',
        icon: 'home-plus-outline',
        routeName: 'UploadFHSA',
      });
    }

    if (profile.user.donations || !profile.user.unemployed) {
      summaryRows.push({
        label: 'Donations',
        value: profile.user.donations ? 'Active' : 'Optional',
        icon: 'hand-heart-outline',
        routeName: 'UploadDonation',
      });
    }

    if (profile.user.investments || profile.user.tfsa) {
      summaryRows.push({
        label: 'Investments',
        value: 'Active',
        icon: 'chart-line',
        routeName: 'UploadT5',
      });
    }

    completionCountBase.push('Profile');

    if (profile.hasSpouse) completionCountBase.push('Household');
    if (profile.user.rrsp) completionCountBase.push('RRSP');
    if (profile.user.fhsa) completionCountBase.push('FHSA');

    return {
      missingItems: missingItems.slice(0, 3),
      summaryRows: summaryRows.slice(0, 4),
      quickActions,
      readyCount: completionCountBase.length,
    };
  }, [profile]);

  const statusPercent = useMemo(() => {
    let total = 2;
    let done = 1;

    if (profile.user.employment) total += 1;
    if (profile.user.gigWork) total += 1;
    if (profile.user.business) total += 1;
    if (profile.hasSpouse) total += 1;
    if (profile.user.rrsp) total += 1;
    if (profile.user.fhsa) total += 1;
    if (profile.user.investments) total += 1;

    if (profile.user.rrsp) done += 1;
    if (profile.user.fhsa) done += 1;
    if (profile.user.investments) done += 1;

    return Math.max(18, Math.min(92, Math.round((done / total) * 100)));
  }, [profile]);

  const progressWidth = `${statusPercent}%`;
  const missingCount = dashboardMeta.missingItems.length;
  const hasAssignedCA = !!user?.assignedCA;
  const assignedCAName = user?.assignedCA?.name || 'Your CA';

  const caCardData = useMemo(() => {
    if (hasAssignedCA) {
      return {
        title: assignedCAName,
        subtitle: 'Chat, request review, or book an appointment',
        icon: 'account-tie-outline',
        routeName: 'CAHub',
        buttonLabel: 'Open CA Hub',
      };
    }

    return {
      title: 'Find a Chartered Accountant',
      subtitle: 'Compare pricing, specialties, and available consultation times',
      icon: 'account-search-outline',
      routeName: 'CAHub',
      buttonLabel: 'Browse CAs',
    };
  }, [assignedCAName, hasAssignedCA]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.headerRow,
            {
              opacity: fadeAnim,
              transform: [{ translateY: heroTranslate }],
            },
          ]}
        >
          <TouchableOpacity style={styles.menuButton} onPress={openDrawer} activeOpacity={0.85}>
            <Icon name="menu" size={24} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.headerTextWrap}>
            <Text style={styles.greeting}>Good evening, {firstName}</Text>
            <Text style={styles.profileTag}>{profileLabel}</Text>
          </View>

          <TouchableOpacity style={styles.bellButton} activeOpacity={0.85}>
            <Icon name="bell-outline" size={22} color="#0F172A" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={[
            styles.heroCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: heroTranslate }],
            },
          ]}
        >
          <View style={styles.heroAccent} />

          <View style={styles.heroTopRow}>
            <View style={styles.heroBadge}>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Icon name="star-four-points-circle-outline" size={16} color="#2563EB" />
              </Animated.View>
              <Text style={styles.heroBadgeText}>2025 return</Text>
            </View>

            <Text style={styles.heroPercent}>{statusPercent}%</Text>
          </View>

          <Text style={styles.heroTitle}>Your return is in progress</Text>
          <Text style={styles.heroSubtitle}>
            Complete the remaining uploads, review your tax summary, and move toward filing.
          </Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: progressWidth }]} />
          </View>

          <Text style={styles.progressHint}>
            {missingCount === 0
              ? 'Everything urgent is complete right now.'
              : `${missingCount} item${missingCount > 1 ? 's' : ''} still need attention.`}
          </Text>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatCard}>
              <Text style={styles.heroStatValue}>{missingCount}</Text>
              <Text style={styles.heroStatLabel}>missing items</Text>
            </View>

            <View style={styles.heroStatCard}>
              <Text style={styles.heroStatValue}>{dashboardMeta.readyCount}</Text>
              <Text style={styles.heroStatLabel}>ready sections</Text>
            </View>

            <View style={styles.heroStatCard}>
              <Text style={styles.heroStatValue}>{profile.hasSpouse ? 'Family' : 'Single'}</Text>
              <Text style={styles.heroStatLabel}>return type</Text>
            </View>
          </View>

          <View style={styles.heroButtonRow}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigateTo('UploadChecklist')}
              activeOpacity={0.9}
            >
              <Icon name="file-check-outline" size={18} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Continue Uploads</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigateTo('Checklist')}
              activeOpacity={0.9}
            >
              <Text style={styles.secondaryButtonText}>Checklist</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: contentTranslate }],
          }}
        >
          <Animated.View style={{ transform: [{ scale: caPressAnim }] }}>
            <TouchableOpacity
              style={styles.caCard}
              activeOpacity={0.95}
              onPressIn={handleCaPressIn}
              onPressOut={handleCaPressOut}
              onPress={() => navigateTo(caCardData.routeName)}
            >
              <View style={styles.caLeft}>
                <View style={styles.caIconWrap}>
                  <Icon name={caCardData.icon} size={22} color="#2563EB" />
                </View>

                <View style={styles.caTextWrap}>
                  <Text style={styles.caTitle}>{caCardData.title}</Text>
                  <Text style={styles.caSubtitle}>{caCardData.subtitle}</Text>
                </View>
              </View>

              <View style={styles.caRight}>
                <Text style={styles.caLink}>{caCardData.buttonLabel}</Text>
                <Icon name="chevron-right" size={20} color="#94A3B8" />
              </View>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Still Required</Text>
              <TouchableOpacity onPress={() => navigateTo('UploadChecklist')}>
                <Text style={styles.sectionLink}>View all</Text>
              </TouchableOpacity>
            </View>

            {dashboardMeta.missingItems.length === 0 ? (
              <View style={styles.emptyStateCard}>
                <View style={styles.emptyStateIconWrap}>
                  <Icon name="check-circle-outline" size={22} color="#16A34A" />
                </View>
                <View style={styles.emptyStateTextWrap}>
                  <Text style={styles.emptyStateTitle}>No urgent items right now</Text>
                  <Text style={styles.emptyStateText}>
                    Your dashboard will highlight missing documents here.
                  </Text>
                </View>
              </View>
            ) : (
              dashboardMeta.missingItems.map((item, index) => (
                <AnimatedTouchable
                  key={item.title}
                  activeOpacity={0.9}
                  style={[
                    styles.missingCard,
                    index === 0 && styles.missingCardPriority,
                  ]}
                  onPress={() => navigateTo(item.routeName, item.params)}
                >
                  <View style={styles.missingLeft}>
                    <View
                      style={[
                        styles.missingIconWrap,
                        item.tone === 'danger'
                          ? styles.missingIconWrapDanger
                          : styles.missingIconWrapWarning,
                      ]}
                    >
                      <Icon
                        name={item.icon}
                        size={20}
                        color={item.tone === 'danger' ? '#DC2626' : '#D97706'}
                      />
                    </View>

                    <View style={styles.missingTextWrap}>
                      <Text style={styles.missingTitle}>{item.title}</Text>
                      <Text style={styles.missingSubtitle}>{item.subtitle}</Text>
                    </View>
                  </View>

                  <Icon name="chevron-right" size={20} color="#94A3B8" />
                </AnimatedTouchable>
              ))
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
            </View>

            <View style={styles.quickActionsRow}>
              {dashboardMeta.quickActions.map((item) => (
                <TouchableOpacity
                  key={item.title}
                  style={styles.quickPill}
                  activeOpacity={0.88}
                  onPress={() => navigateTo(item.routeName, item.params)}
                >
                  <View style={styles.quickPillIconWrap}>
                    <Icon name={item.icon} size={18} color="#2563EB" />
                  </View>
                  <Text style={styles.quickPillText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tax Summary</Text>
            </View>

            <View style={styles.summaryCard}>
              <TouchableOpacity
                style={styles.summaryRow}
                onPress={() => navigateTo('IncomeSummary')}
              >
                <View style={styles.summaryLeft}>
                  <Icon name="chart-box-outline" size={18} color="#475569" />
                  <Text style={styles.summaryLabel}>Income summary</Text>
                </View>
                <Text style={styles.summaryValue}>Open</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.summaryRow}
                onPress={() => navigateTo('DeductionSummary')}
              >
                <View style={styles.summaryLeft}>
                  <Icon name="calculator-variant-outline" size={18} color="#475569" />
                  <Text style={styles.summaryLabel}>Deduction summary</Text>
                </View>
                <Text style={styles.summaryValue}>Open</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.summaryRow}
                onPress={() => navigateTo('RefundEstimate')}
              >
                <View style={styles.summaryLeft}>
                  <Icon name="cash-refund" size={18} color="#475569" />
                  <Text style={styles.summaryLabel}>Refund estimate</Text>
                </View>
                <Text style={styles.summaryValue}>Needs data</Text>
              </TouchableOpacity>

              {!!dashboardMeta.summaryRows.length && <View style={styles.summaryDivider} />}

              {dashboardMeta.summaryRows.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  style={styles.summaryRow}
                  onPress={() => navigateTo(item.routeName)}
                >
                  <View style={styles.summaryLeft}>
                    <Icon name={item.icon} size={18} color="#475569" />
                    <Text style={styles.summaryLabel}>{item.label}</Text>
                  </View>
                  <Text style={styles.summaryMutedValue}>{item.value}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.bottomCta}
            activeOpacity={0.9}
            onPress={() => navigateTo('UploadChecklist')}
          >
            <Icon name="arrow-top-right" size={18} color="#FFFFFF" />
            <Text style={styles.bottomCtaText}>Continue to File Tax</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FC',
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  menuButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6ECF8',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },

  bellButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6ECF8',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },

  headerTextWrap: {
    flex: 1,
    marginHorizontal: 14,
  },

  greeting: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.8,
  },

  profileTag: {
    marginTop: 4,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },

  heroCard: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E6ECF8',
    shadowColor: '#5B8DEF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
    overflow: 'hidden',
  },

  heroAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: '#5B8DEF',
    opacity: 0.18,
  },

  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF4FF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  heroBadgeText: {
    color: '#2563EB',
    fontWeight: '800',
    fontSize: 12,
    marginLeft: 7,
  },

  heroPercent: {
    fontSize: 30,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -1,
  },

  heroTitle: {
    marginTop: 18,
    fontSize: 26,
    lineHeight: 31,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.8,
  },

  heroSubtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 22,
    color: '#64748B',
    fontWeight: '500',
  },

  progressTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 18,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#5B8DEF',
    borderRadius: 999,
  },

  progressHint: {
    marginTop: 10,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },

  heroStatsRow: {
    flexDirection: 'row',
    marginTop: 18,
    gap: 10,
  },

  heroStatCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E6ECF8',
    alignItems: 'center',
  },

  heroStatValue: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0F172A',
  },

  heroStatLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
    textAlign: 'center',
  },

  heroButtonRow: {
    flexDirection: 'row',
    marginTop: 18,
  },

  primaryButton: {
    flex: 1,
    height: 52,
    backgroundColor: '#2563EB',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    flexDirection: 'row',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 4,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    marginLeft: 8,
  },

  secondaryButton: {
    width: 116,
    height: 52,
    backgroundColor: '#EEF4FF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
    borderWidth: 1,
    borderColor: '#DCE8FF',
  },

  secondaryButtonText: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '900',
  },

  caCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E6ECF8',
    marginBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 3,
  },

  caLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  caIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  caTextWrap: {
    flex: 1,
  },

  caTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },

  caSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748B',
    lineHeight: 19,
  },

  caRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },

  caLink: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '800',
    marginRight: 4,
  },

  section: {
    marginBottom: 20,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4,
  },

  sectionLink: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '800',
  },

  missingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E6ECF8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  missingCardPriority: {
    backgroundColor: '#F8FBFF',
    borderColor: '#DCE8FF',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3,
  },

  missingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  missingIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  missingIconWrapDanger: {
    backgroundColor: '#FEF2F2',
  },

  missingIconWrapWarning: {
    backgroundColor: '#FFF7ED',
  },

  missingTextWrap: {
    flex: 1,
  },

  missingTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },

  missingSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748B',
    lineHeight: 19,
  },

  quickActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  quickPill: {
    minWidth: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E6ECF8',
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },

  quickPillIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: '#EAF1FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  quickPillText: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '800',
  },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E6ECF8',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
  },

  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },

  summaryLabel: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '700',
    marginLeft: 10,
  },

  summaryValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },

  summaryMutedValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
  },

  summaryDivider: {
    height: 1,
    backgroundColor: '#E6ECF8',
    marginVertical: 6,
  },

  bottomCta: {
    backgroundColor: '#2563EB',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 5,
  },

  bottomCtaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    marginLeft: 8,
  },

  emptyStateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E6ECF8',
    flexDirection: 'row',
    alignItems: 'center',
  },

  emptyStateIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  emptyStateTextWrap: {
    flex: 1,
  },

  emptyStateTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },

  emptyStateText: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: '#64748B',
  },
});