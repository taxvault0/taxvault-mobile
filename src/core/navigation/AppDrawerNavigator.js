import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import MainTabNavigator from './MainTabNavigator';
import TaxProfileScreen from '@/features/taxProfile/screens/TaxProfileScreen';
import DocumentsScreen from '@/features/documents/screens/DocumentsScreen';
import ChecklistScreen from '@/features/checklist/screens/ChecklistScreen';
import TaxSummaryScreen from '@/features/summary/screens/TaxSummaryScreen';
import HelpSupportScreen from '@/features/support/screens/HelpSupportScreen';
import { useAuth } from '@/features/auth/context/AuthContext';

const Drawer = createDrawerNavigator();

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

const getDrawerItems = (profile) => {
  const items = [
    { label: 'Dashboard', icon: 'view-dashboard-outline', route: 'MainTabs' },
    { label: 'Tax Profile', icon: 'account-details-outline', route: 'TaxProfile' },
    { label: 'Documents', icon: 'file-document-outline', route: 'DrawerDocuments' },
    { label: 'Checklist', icon: 'format-list-checks', route: 'DrawerChecklist' },
    { label: 'Tax Summary', icon: 'chart-box-outline', route: 'DrawerSummary' },
  ];

  if (profile.user.gigWork || profile.user.business || profile.hasSpouse) {
    items.splice(3, 0, {
      label: 'Receipts & Expenses',
      icon: 'receipt-outline',
      route: 'DrawerDocuments',
    });
  }

  items.push({
    label: 'Help & Support',
    icon: 'help-circle-outline',
    route: 'HelpSupport',
  });

  return items;
};

const CustomDrawerContent = (props) => {
  const { user, logout } = useAuth();
  const activeRoute = props.state.routeNames[props.state.index];
  const profile = useMemo(() => buildHouseholdProfile(user || {}), [user]);
  const drawerItems = useMemo(() => getDrawerItems(profile), [profile]);

  const firstName =
    user?.firstName ||
    user?.name?.split?.(' ')?.[0] ||
    user?.fullName?.split?.(' ')?.[0] ||
    'User';

  const profileSummary = [
    profile.user.employment && 'Employed',
    profile.user.gigWork && 'Self-Employed',
    profile.user.business && 'Business',
    profile.user.unemployed &&
      !profile.user.employment &&
      !profile.user.gigWork &&
      !profile.user.business &&
      'Unemployed',
    profile.hasSpouse && 'With Spouse',
  ]
    .filter(Boolean)
    .join(' • ');

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>TaxVault</Text>
        <Text style={styles.subText}>
          {user?.name || user?.email || `Welcome back, ${firstName}`}
        </Text>
        {!!profileSummary && <Text style={styles.profileSummary}>{profileSummary}</Text>}
      </View>

      <View style={styles.menuContent}>
        {drawerItems.map((item) => {
          const isFocused = activeRoute === item.route;

          return (
            <TouchableOpacity
              key={`${item.route}-${item.label}`}
              activeOpacity={0.8}
              style={[styles.drawerItem, isFocused && styles.drawerItemActive]}
              onPress={() => props.navigation.navigate(item.route)}
            >
              <Icon
                name={item.icon}
                size={22}
                color={isFocused ? '#2563EB' : '#475569'}
              />
              <Text
                style={[
                  styles.drawerLabel,
                  isFocused && styles.drawerLabelActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.logoutButton}
        onPress={logout}
      >
        <Icon name="logout" size={20} color="#DC2626" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const AppDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        overlayColor: 'rgba(15, 23, 42, 0.22)',
        drawerStyle: {
          width: 290,
          backgroundColor: '#FFFFFF',
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="MainTabs" component={MainTabNavigator} />
      <Drawer.Screen name="TaxProfile" component={TaxProfileScreen} />
      <Drawer.Screen name="DrawerDocuments" component={DocumentsScreen} />
      <Drawer.Screen name="DrawerChecklist" component={ChecklistScreen} />
      <Drawer.Screen name="DrawerSummary" component={TaxSummaryScreen} />
      <Drawer.Screen name="HelpSupport" component={HelpSupportScreen} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 12,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  subText: {
    marginTop: 6,
    fontSize: 13,
    color: '#64748B',
  },
  profileSummary: {
    marginTop: 8,
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '700',
  },
  menuContent: {
    flex: 1,
    paddingBottom: 8,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 6,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 16,
  },
  drawerItemActive: {
    backgroundColor: '#EFF6FF',
  },
  drawerLabel: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  drawerLabelActive: {
    color: '#2563EB',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
  },
});

export default AppDrawerNavigator;