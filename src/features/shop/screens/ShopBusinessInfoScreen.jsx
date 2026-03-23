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
import Header from '@/components/layout/AppHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { colors } from '@/styles/theme';
import { typography } from '@/styles/theme';
import { spacing, borderRadius } from '@/styles/theme';
import { useSingleDocumentPicker } from '@/hooks/useDocumentPicker';
const ShopBusinessInfoScreen = () => {
  const [documents, setDocuments] = useState([
    {
      id: '1',
      name: 'Business Number (BN) Certificate',
      description: 'CRA issued business number',
      required: true,
      status: 'uploaded',
      uploadedDate: '2024-01-15',
      expiryDate: null,
    },
    {
      id: '2',
      name: 'Notice of Assessment (Prior Year)',
      description: 'Last year\'s tax assessment',
      required: true,
      status: 'uploaded',
      uploadedDate: '2024-02-20',
      expiryDate: null,
    },
    {
      id: '3',
      name: 'Business License',
      description: 'Municipal business license',
      required: true,
      status: 'pending',
      uploadedDate: null,
      expiryDate: '2024-12-31',
    },
    {
      id: '4',
      name: 'Franchise Agreement',
      description: 'If applicable - franchise contract',
      required: false,
      status: 'missing',
      uploadedDate: null,
      expiryDate: null,
    },
    {
      id: '5',
      name: 'Proof of Ownership/Lease',
      description: 'Property ownership or lease agreement',
      required: true,
      status: 'uploaded',
      uploadedDate: '2024-01-10',
      expiryDate: '2025-12-31',
    },
  ]);

  const { pickDocument } = useSingleDocumentPicker({
    onSuccess: (file) => {
      console.log('Selected file:', file.name);
      Alert.alert('Success', 'Document uploaded successfully');
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to pick document');
    }
  });

  const uploadDocument = (docId) => {
    pickDocument();
    // You can use docId to update the specific document
    console.log('Uploading for document:', docId);
  };

  const viewDocument = (doc) => {
    Alert.alert('View Document', `Opening ${doc.name}`);
  };

  const stats = {
    total: documents.length,
    uploaded: documents.filter(d => d.status === 'uploaded').length,
    pending: documents.filter(d => d.status === 'pending').length,
    missing: documents.filter(d => d.status === 'missing').length,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Business Information" showBack />

      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        {/* Stats Summary */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: spacing.lg }}>
          <Card style={{ flex: 1, marginRight: spacing.xs }}>
            <Card.Body style={{ alignItems: 'center' }}>
              <Text style={[typography.h4, { color: colors.primary[500] }]}>{stats.total}</Text>
              <Text style={[typography.caption, { color: colors.text.secondary }]}>Total</Text>
            </Card.Body>
          </Card>
          <Card style={{ flex: 1, marginHorizontal: spacing.xs }}>
            <Card.Body style={{ alignItems: 'center' }}>
              <Text style={[typography.h4, { color: colors.success }]}>{stats.uploaded}</Text>
              <Text style={[typography.caption, { color: colors.text.secondary }]}>Uploaded</Text>
            </Card.Body>
          </Card>
          <Card style={{ flex: 1, marginLeft: spacing.xs }}>
            <Card.Body style={{ alignItems: 'center' }}>
              <Text style={[typography.h4, { color: colors.warning }]}>{stats.pending + stats.missing}</Text>
              <Text style={[typography.caption, { color: colors.text.secondary }]}>Pending</Text>
            </Card.Body>
          </Card>
        </View>

        {/* CRA Requirement Notice */}
        <Card style={{ marginBottom: spacing.lg, backgroundColor: colors.warning + '20' }}>
          <Card.Body>
            <View style={{ flexDirection: 'row' }}>
              <Icon name="alert-circle" size={24} color={colors.warning} />
              <View style={{ marginLeft: spacing.md, flex: 1 }}>
                <Text style={[typography.body2, { fontWeight: typography.weights.semibold, color: colors.warning }]}>
                  Keep these documents updated
                </Text>
                <Text style={[typography.caption, { color: colors.text.secondary }]}>
                  Your Business Number (BN) and licenses must be current. Expired documents may affect your tax filings.
                </Text>
              </View>
            </View>
          </Card.Body>
        </Card>

        {/* Document List */}
        {documents.map(doc => (
          <Card key={doc.id} style={{ marginBottom: spacing.md }}>
            <Card.Body>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon 
                      name={doc.status === 'uploaded' ? 'file-check' : 'file-alert'} 
                      size={20} 
                      color={doc.status === 'uploaded' ? colors.success : colors.warning} 
                    />
                    <Text style={[typography.body2, { fontWeight: typography.weights.semibold, marginLeft: spacing.sm }]}>
                      {doc.name}
                    </Text>
                  </View>
                  
                  <Text style={[typography.caption, { color: colors.text.secondary, marginTop: spacing.xs }]}>
                    {doc.description}
                  </Text>

                  {doc.uploadedDate && (
                    <Text style={[typography.caption, { color: colors.success, marginTop: spacing.xs }]}>
                      Uploaded: {doc.uploadedDate}
                    </Text>
                  )}

                  {doc.expiryDate && (
                    <Text style={[typography.caption, { color: colors.warning, marginTop: spacing.xs }]}>
                      Expires: {doc.expiryDate}
                    </Text>
                  )}
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Badge status={doc.status} />
                  
                  {doc.status === 'uploaded' ? (
                    <TouchableOpacity 
                      onPress={() => viewDocument(doc)}
                      style={{ marginTop: spacing.sm }}
                    >
                      <Icon name="eye" size={24} color={colors.primary[500]} />
                    </TouchableOpacity>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onPress={() => uploadDocument(doc.id)}
                      style={{ marginTop: spacing.sm }}
                    >
                      Upload
                    </Button>
                  )}
                </View>
              </View>

              {doc.required && doc.status !== 'uploaded' && (
                <View style={{
                  marginTop: spacing.sm,
                  padding: spacing.xs,
                  backgroundColor: colors.warning + '20',
                  borderRadius: borderRadius.sm,
                }}>
                  <Text style={[typography.caption, { color: colors.warning }]}>
                    Required document - please upload
                  </Text>
                </View>
              )}
            </Card.Body>
          </Card>
        ))}

        {/* Info Note */}
        <Card style={{ marginTop: spacing.md, backgroundColor: colors.primary[50] }}>
          <Card.Body>
            <Text style={[typography.caption, { color: colors.text.secondary }]}>
              <Text style={{ fontWeight: typography.weights.semibold }}>Note:</Text> Keep these documents for at least 6 years as required by CRA. Update immediately if any information changes.
            </Text>
          </Card.Body>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShopBusinessInfoScreen;



