import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import Header from '@/components/layout/AppHeader';
import Button from '@/components/ui/AppButton';
import Card from '@/components/ui/AppCard';
import { colors } from '@/styles/theme';
import { typography } from '@/styles/theme';
import { spacing } from '@/styles/theme';

const DriverTypeScreen = () => {
  const navigation = useNavigation();
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  const platforms = [
    {
      id: 'uber',
      name: 'Uber',
      icon: 'car',
      color: '#000000',
      description: 'UberX, UberEats, Comfort',
    },
    {
      id: 'lyft',
      name: 'Lyft',
      icon: 'car-side',
      color: '#FF00BF',
      description: 'Lyft rides and deliveries',
    },
    {
      id: 'uride',
      name: 'Uride',
      icon: 'car-estate',
      color: '#00A3E0',
      description: 'Uride rideshare service',
    },
    {
      id: 'taxi',
      name: 'Taxi',
      icon: 'taxi',
      color: '#FFD700',
      description: 'Traditional taxi driver',
    },
    {
      id: 'doordash',
      name: 'DoorDash',
      icon: 'food',
      color: '#FF3008',
      description: 'Food delivery driver',
    },
    {
      id: 'skipthedishes',
      name: 'SkipTheDishes',
      icon: 'food-takeout-box',
      color: '#FF6B00',
      description: 'Food delivery',
    },
    {
      id: 'instacart',
      name: 'Instacart',
      icon: 'cart',
      color: '#43A02A',
      description: 'Grocery delivery',
    },
    {
      id: 'multiple',
      name: 'Multiple Platforms',
      icon: 'layers',
      color: colors.primary[500],
      description: 'Work with 2+ platforms',
    },
  ];

  const togglePlatform = (platformId) => {
    if (platformId === 'multiple') {
      setSelectedPlatforms(['multiple']);
    } else {
      setSelectedPlatforms(prev => {
        // Remove 'multiple' if selecting individual platforms
        const filtered = prev.filter(p => p !== 'multiple');
        if (filtered.includes(platformId)) {
          return filtered.filter(p => p !== platformId);
        } else {
          return [...filtered, platformId];
        }
      });
    }
  };

  const handleContinue = () => {
    if (selectedPlatforms.length === 0) {
      Alert.alert('Select Platform', 'Please select at least one platform you work with');
      return;
    }

    navigation.navigate('GigWorkerRegister', {
      platforms: selectedPlatforms,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header title="Select Your Platform" showBack />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing.lg }}>
        {/* Header Info */}
        <Card style={{ marginBottom: spacing.lg, backgroundColor: colors.primary[50] }}>
          <Card.Body>
            <Text style={[typography.styles.h6, { color: colors.primary[700], marginBottom: spacing.xs }]}>
              🚗 Gig Driver Tax Guide
            </Text>
            <Text style={[typography.styles.body2, { color: colors.primary[600] }]}>
              Select the platforms you drive for. This helps us customize your tax requirements and deductions.
            </Text>
          </Card.Body>
        </Card>

        {/* CRA Notice */}
        <View style={{
          backgroundColor: colors.warning.light,
          padding: spacing.md,
          borderRadius: spacing.radius.md,
          marginBottom: spacing.lg,
          borderWidth: 1,
          borderColor: colors.warning.main,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="alert-circle" size={24} color={colors.warning.main} />
            <Text style={[typography.styles.body2, { color: colors.warning.main, marginLeft: spacing.sm, flex: 1 }]}>
              CRA requires all gig drivers to register for GST/HST immediately, even before earning $30,000.
            </Text>
          </View>
        </View>

        {/* Platform Grid */}
        <Text style={[typography.styles.h6, { marginBottom: spacing.md }]}>
          Which platforms do you drive for?
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
          {platforms.map((platform) => (
            <TouchableOpacity
              key={platform.id}
              style={{
                width: '47%',
                backgroundColor: selectedPlatforms.includes(platform.id) ? platform.color + '20' : colors.white,
                borderRadius: spacing.radius.lg,
                padding: spacing.md,
                borderWidth: 2,
                borderColor: selectedPlatforms.includes(platform.id) ? platform.color : colors.gray[200],
                ...spacing.shadows.sm,
              }}
              onPress={() => togglePlatform(platform.id)}
            >
              <View style={{ alignItems: 'center' }}>
                <Icon name={platform.icon} size={32} color={platform.color} />
                <Text style={[typography.styles.body1, { fontWeight: typography.weights.semibold, marginTop: spacing.xs }]}>
                  {platform.name}
                </Text>
                <Text style={[typography.styles.caption, { color: colors.text.secondary, textAlign: 'center', marginTop: spacing.xs }]}>
                  {platform.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Selected Platforms Summary */}
        {selectedPlatforms.length > 0 && !selectedPlatforms.includes('multiple') && (
          <Card style={{ marginTop: spacing.lg }}>
            <Card.Body>
              <Text style={[typography.styles.body2, { fontWeight: typography.weights.semibold, marginBottom: spacing.sm }]}>
                Selected Platforms:
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                {selectedPlatforms.map(id => {
                  const platform = platforms.find(p => p.id === id);
                  return (
                    <View key={id} style={{
                      backgroundColor: platform.color + '20',
                      paddingHorizontal: spacing.md,
                      paddingVertical: spacing.xs,
                      borderRadius: spacing.radius.full,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                      <Icon name={platform.icon} size={14} color={platform.color} />
                      <Text style={[typography.styles.caption, { color: platform.color, marginLeft: 4 }]}>
                        {platform.name}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </Card.Body>
          </Card>
        )}

        {/* Continue Button */}
        <Button
          variant="primary"
          onPress={handleContinue}
          style={{ marginTop: spacing.xl, marginBottom: spacing.lg }}
        >
          Continue Registration
        </Button>

        {/* Info Note */}
        <Text style={[typography.styles.caption, { color: colors.text.secondary, textAlign: 'center' }]}>
          You can always add more platforms later in settings
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DriverTypeScreen;

