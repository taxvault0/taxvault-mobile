import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '@/components/layout/AppHeader';
import Card from '@/components/ui/Card';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';

const DashboardScreenCA = ({ navigation }) => {
  const quickActions = [
    {
      id: 'clients',
      title: 'View Clients',
      icon: 'account-group',
      color: colors.primary[500],
      screen: 'Clients',
    },
    {
      id: 'documents',
      title: 'Documents',
      icon: 'file-document',
      color: colors.success,
      screen: 'Documents',
    },
    {
      id: 'profile',
      title: 'Profile',
      icon: 'account',
      color: colors.secondary,
      screen: 'Profile',
    },
  ];

  const recentClients = [
    { id: '1', name: 'John Doe', status: 'active' },
    { id: '2', name: 'Jane Smith', status: 'pending' },
    { id: '3', name: 'Bob Johnson', status: 'active' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="CA Dashboard" />
      
      <ScrollView contentContainerStyle={styles.content}>
        {/* Welcome Card */}
        <Card style={styles.welcomeCard}>
          <Text style={styles.title}>Welcome, CA!</Text>
          <Text style={styles.subtitle}>Client management dashboard</Text>
        </Card>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          {quickActions.map(action => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={() => navigation.navigate(action.screen)}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                <Icon name={action.icon} size={32} color={action.color} />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Clients */}
        <Card style={styles.recentCard}>
          <View style={styles.recentHeader}>
            <Text style={styles.sectionTitle}>Recent Clients</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Clients')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {recentClients.map(client => (
            <TouchableOpacity
              key={client.id}
              style={styles.clientItem}
              onPress={() => navigation.navigate('ClientDetail', { id: client.id, name: client.name })}
            >
              <View style={styles.clientAvatar}>
                <Text style={styles.avatarText}>
                  {client.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <View style={styles.clientInfo}>
                <Text style={styles.clientName}>{client.name}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: client.status === 'active' ? colors.success + '20' : colors.warning + '20' }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: client.status === 'active' ? colors.success : colors.warning }
                  ]}>
                    {client.status}
                  </Text>
                </View>
              </View>
              <Icon name="chevron-right" size={24} color={colors.gray[400]} />
            </TouchableOpacity>
          ))}
        </Card>

        {/* Stats Card */}
        <Card style={styles.statsCard}>
          <Text style={styles.sectionTitle}>This Month</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Active Clients</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Documents</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  welcomeCard: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  actionTitle: {
    ...typography.caption,
    color: colors.text.primary,
    textAlign: 'center',
  },
  recentCard: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  viewAllText: {
    ...typography.caption,
    color: colors.primary[500],
  },
  clientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  clientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.h4,
    color: colors.primary[500],
  },
  clientInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clientName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: typography.weights.medium,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  statusText: {
    ...typography.caption,
    fontWeight: typography.weights.medium,
  },
  statsCard: {
    padding: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.h3,
    color: colors.primary[500],
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});

export default DashboardScreenCA;

