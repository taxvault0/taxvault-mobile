import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '@/components/layout/AppHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';

const ClientDetailScreen = ({ navigation, route }) => {
  const { id } = route.params || {};
  const [activeTab, setActiveTab] = useState('overview'); // overview, documents, tax, notes

  // Mock client data - replace with API call
  const client = {
    id: id || '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(416) 555-0123',
    status: 'active',
    clientSince: '2023-01-15',
    businessType: 'Gig Worker',
    documents: {
      total: 24,
      pending: 3,
      verified: 21,
    },
    taxYears: ['2024', '2023', '2022'],
    recentActivity: [
      { id: '1', type: 'document', description: 'Uploaded T4 slip', date: '2024-03-15' },
      { id: '2', type: 'note', description: 'Discussed Q1 estimates', date: '2024-03-10' },
      { id: '3', type: 'document', description: 'Added mileage log', date: '2024-03-05' },
    ],
  };

  const StatCard = ({ label, value, icon, color }) => (
    <View style={[styles.statCard, { backgroundColor: color + '10' }]}>
      <Icon name={icon} size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const TabButton = ({ tab, label }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tab && styles.tabButtonActive,
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[
        styles.tabText,
        activeTab === tab && styles.tabTextActive,
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderOverview = () => (
    <View>
      {/* Client Info Card */}
      <Card style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {client.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <View style={styles.nameSection}>
            <Text style={styles.clientName}>{client.name}</Text>
            <Badge status={client.status} />
          </View>
        </View>

        <View style={styles.contactInfo}>
          <View style={styles.contactRow}>
            <Icon name="email" size={20} color={colors.gray[400]} />
            <Text style={styles.contactText}>{client.email}</Text>
          </View>
          <View style={styles.contactRow}>
            <Icon name="phone" size={20} color={colors.gray[400]} />
            <Text style={styles.contactText}>{client.phone}</Text>
          </View>
          <View style={styles.contactRow}>
            <Icon name="calendar" size={20} color={colors.gray[400]} />
            <Text style={styles.contactText}>Client since {client.clientSince}</Text>
          </View>
          <View style={styles.contactRow}>
            <Icon name="briefcase" size={20} color={colors.gray[400]} />
            <Text style={styles.contactText}>{client.businessType}</Text>
          </View>
        </View>
      </Card>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          label="Documents"
          value={client.documents.total}
          icon="file-document"
          color={colors.primary[500]}
        />
        <StatCard
          label="Verified"
          value={client.documents.verified}
          icon="check-circle"
          color={colors.success}
        />
        <StatCard
          label="Pending"
          value={client.documents.pending}
          icon="clock-outline"
          color={colors.warning}
        />
        <StatCard
          label="Tax Years"
          value={client.taxYears.length}
          icon="calendar-check"
          color={colors.secondary}
        />
      </View>

      {/* Tax Years */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Tax Years</Text>
        <View style={styles.yearList}>
          {client.taxYears.map(year => (
            <TouchableOpacity
              key={year}
              style={styles.yearChip}
              onPress={() => Alert.alert('Navigate', `View ${year} tax data`)}
            >
              <Text style={styles.yearText}>{year}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Recent Activity */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {client.recentActivity.map(activity => (
          <View key={activity.id} style={styles.activityItem}>
            <Icon
              name={activity.type === 'document' ? 'file-document' : 'note-text'}
              size={20}
              color={activity.type === 'document' ? colors.primary[500] : colors.info}
            />
            <View style={styles.activityContent}>
              <Text style={styles.activityDescription}>{activity.description}</Text>
              <Text style={styles.activityDate}>{activity.date}</Text>
            </View>
          </View>
        ))}
      </Card>
    </View>
  );

  const renderDocuments = () => (
    <View>
      <Button
        title="Upload Document"
        onPress={() => Alert.alert('Upload', 'Upload document for client')}
        style={styles.uploadButton}
      />
      
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Recent Documents</Text>
        {/* Document list would go here */}
        <Text style={styles.placeholder}>No documents uploaded yet</Text>
      </Card>
    </View>
  );

  const renderTax = () => (
    <Card style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Tax Information</Text>
      <View style={styles.taxSummary}>
        <View style={styles.taxRow}>
          <Text style={styles.taxLabel}>2023 Income</Text>
          <Text style={styles.taxValue}>$45,230.50</Text>
        </View>
        <View style={styles.taxRow}>
          <Text style={styles.taxLabel}>2023 Taxes Paid</Text>
          <Text style={styles.taxValue}>$8,124.30</Text>
        </View>
        <View style={styles.taxRow}>
          <Text style={styles.taxLabel}>Estimated Refund</Text>
          <Text style={[styles.taxValue, { color: colors.success }]}>$1,245.00</Text>
        </View>
      </View>
      
      <Button
        title="Generate Tax Summary"
        variant="outline"
        onPress={() => Alert.alert('Generate', 'Generate tax summary')}
        style={styles.taxButton}
      />
    </Card>
  );

  const renderNotes = () => (
    <View>
      <Button
        title="Add Note"
        onPress={() => Alert.alert('Add Note', 'Add new note')}
        style={styles.uploadButton}
      />
      
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Client Notes</Text>
        {/* Notes list would go here */}
        <Text style={styles.placeholder}>No notes added yet</Text>
      </Card>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Client Details" showBack />

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TabButton tab="overview" label="Overview" />
        <TabButton tab="documents" label="Documents" />
        <TabButton tab="tax" label="Tax" />
        <TabButton tab="notes" label="Notes" />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'documents' && renderDocuments()}
        {activeTab === 'tax' && renderTax()}
        {activeTab === 'notes' && renderNotes()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: colors.primary[500],
  },
  tabText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  tabTextActive: {
    color: colors.primary[500],
    fontWeight: typography.weights.semibold,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  infoCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.h2,
    color: colors.primary[500],
  },
  nameSection: {
    flex: 1,
  },
  clientName: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  contactInfo: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  contactText: {
    ...typography.body,
    color: colors.text.secondary,
    marginLeft: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    width: '48%',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h3,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  sectionCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  yearList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  yearChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  yearText: {
    ...typography.body,
    color: colors.primary[500],
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activityContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  activityDescription: {
    ...typography.body,
    color: colors.text.primary,
  },
  activityDate: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  uploadButton: {
    marginBottom: spacing.md,
  },
  taxSummary: {
    marginBottom: spacing.lg,
  },
  taxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  taxLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },
  taxValue: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: typography.weights.semibold,
  },
  taxButton: {
    marginTop: spacing.sm,
  },
  placeholder: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    padding: spacing.xl,
  },
});

export default ClientDetailScreen;



