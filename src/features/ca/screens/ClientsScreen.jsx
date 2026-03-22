import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '@/components/layout/AppHeader';
import Card from '@/components/ui/AppCard';
import Badge from '@/components/ui/Badge';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';

const ClientsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const clients = [
    { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active', documents: 12 },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'active', documents: 8 },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', status: 'pending', documents: 3 },
    { id: '4', name: 'Alice Brown', email: 'alice@example.com', status: 'active', documents: 15 },
    { id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', status: 'inactive', documents: 0 },
  ];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Clients" showBack />

      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color={colors.gray[400]} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search clients..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.gray[400]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {filteredClients.map(client => (
          <TouchableOpacity
            key={client.id}
            onPress={() => navigation.navigate('ClientDetail', { id: client.id })}
          >
            <Card style={styles.clientCard}>
              <View style={styles.clientHeader}>
                <View style={styles.clientInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {client.name.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </View>
                  <View style={styles.clientDetails}>
                    <Text style={styles.clientName}>{client.name}</Text>
                    <Text style={styles.clientEmail}>{client.email}</Text>
                  </View>
                </View>
                <Badge status={client.status} />
              </View>
              
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{client.documents}</Text>
                  <Text style={styles.statLabel}>Documents</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>2024</Text>
                  <Text style={styles.statLabel}>Tax Year</Text>
                </View>
                <Icon name="chevron-right" size={24} color={colors.gray[400]} />
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    margin: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    ...typography.body,
    color: colors.text.primary,
  },
  content: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  clientCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  clientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
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
  clientDetails: {
    flex: 1,
  },
  clientName: {
    ...typography.body1,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: 2,
  },
  clientEmail: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.h4,
    color: colors.primary[500],
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});

export default ClientsScreen;

