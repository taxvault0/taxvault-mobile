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
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ClientIDCard from '../../components/ui/ClientIDCard';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing } from '../../styles/spacing';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const menuItems = [
    {
      icon: 'account',
      label: 'Personal Information',
      onPress: () => navigation.navigate('PersonalInfo'),
    },
    {
      icon: 'bell',
      label: 'Notifications',
      badge: 3,
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      icon: 'shield',
      label: 'Privacy & Security',
      onPress: () => navigation.navigate('Security'),
    },
    {
      icon: 'file-document',
      label: 'Tax Documents',
      onPress: () => navigation.navigate('Documents'),
    },
    {
      icon: 'account-tie',
      label: 'My CA',
      onPress: () => navigation.navigate('MyCA'),
    },
    {
      icon: 'cog',
      label: 'Settings',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      icon: 'help-circle',
      label: 'Help & Support',
      onPress: () => navigation.navigate('Help'),
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header title="Profile" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={{ alignItems: 'center', padding: spacing.xl }}>
          <View style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: colors.primary[100],
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: spacing.md,
          }}>
            <Text style={[typography.styles.h2, { color: colors.primary[500] }]}>
              {user?.name?.charAt(0)}
            </Text>
          </View>
          <Text style={[typography.styles.h4, { color: colors.text.primary }]}>
            {user?.name}
          </Text>
          <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
            {user?.email}
          </Text>
          <View style={{
            flexDirection: 'row',
            marginTop: spacing.md,
            backgroundColor: colors.gray[100],
            borderRadius: spacing.radius.full,
            padding: 4,
          }}>
            <TouchableOpacity
              style={{
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.sm,
                borderRadius: spacing.radius.full,
                backgroundColor: activeTab === 'profile' ? colors.primary[500] : 'transparent',
              }}
              onPress={() => setActiveTab('profile')}
            >
              <Text style={{
                color: activeTab === 'profile' ? colors.white : colors.text.secondary,
                fontWeight: typography.weights.medium,
              }}>
                Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.sm,
                borderRadius: spacing.radius.full,
                backgroundColor: activeTab === 'activity' ? colors.primary[500] : 'transparent',
              }}
              onPress={() => setActiveTab('activity')}
            >
              <Text style={{
                color: activeTab === 'activity' ? colors.white : colors.text.secondary,
                fontWeight: typography.weights.medium,
              }}>
                Activity
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Client ID Card */}
        <View style={{ paddingHorizontal: spacing.lg }}>
          <ClientIDCard
            clientId={user?.clientId || 'TV-2024-ABC123'}
            userName={user?.name}
          />
        </View>

        {/* Stats Cards */}
        <View style={{
          flexDirection: 'row',
          paddingHorizontal: spacing.lg,
          marginTop: spacing.md,
        }}>
          <Card style={{ flex: 1, marginRight: spacing.sm }}>
            <Card.Body>
              <Icon name="file-document" size={24} color={colors.primary[500]} />
              <Text style={[typography.styles.h5, { marginTop: spacing.xs }]}>24</Text>
              <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                Documents
              </Text>
            </Card.Body>
          </Card>
          <Card style={{ flex: 1, marginHorizontal: spacing.sm }}>
            <Card.Body>
              <Icon name="receipt" size={24} color={colors.success} />
              <Text style={[typography.styles.h5, { marginTop: spacing.xs }]}>156</Text>
              <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                Receipts
              </Text>
            </Card.Body>
          </Card>
          <Card style={{ flex: 1, marginLeft: spacing.sm }}>
            <Card.Body>
              <Icon name="map-marker-distance" size={24} color={colors.warning} />
              <Text style={[typography.styles.h5, { marginTop: spacing.xs }]}>2,345</Text>
              <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                KM
              </Text>
            </Card.Body>
          </Card>
        </View>

        {/* Menu Items */}
        <View style={{ padding: spacing.lg }}>
          <Text style={[typography.styles.h6, { marginBottom: spacing.md }]}>
            Account Settings
          </Text>
          <Card>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                onPress={item.onPress}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: spacing.md,
                  borderBottomWidth: index < menuItems.length - 1 ? 1 : 0,
                  borderBottomColor: colors.gray[200],
                }}
              >
                <Icon name={item.icon} size={22} color={colors.primary[500]} />
                <Text style={[typography.styles.body2, { flex: 1, marginLeft: spacing.md }]}>
                  {item.label}
                </Text>
                {item.badge && (
                  <View style={{
                    backgroundColor: colors.warning,
                    borderRadius: spacing.radius.full,
                    paddingHorizontal: spacing.sm,
                    paddingVertical: 2,
                    marginRight: spacing.sm,
                  }}>
                    <Text style={{ color: colors.white, fontSize: typography.sizes.xs }}>
                      {item.badge}
                    </Text>
                  </View>
                )}
                <Icon name="chevron-right" size={20} color={colors.gray[400]} />
              </TouchableOpacity>
            ))}
          </Card>
        </View>

        {/* Logout Button */}
        <View style={{ padding: spacing.lg, paddingTop: 0 }}>
          <Button
            variant="warning"
            onPress={handleLogout}
            icon={<Icon name="logout" size={20} color={colors.white} />}
          >
            Logout
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;