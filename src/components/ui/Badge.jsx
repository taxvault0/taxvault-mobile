import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

const Badge = ({ status, text }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'verified':
      case 'success':
      case 'business':
        return theme.components.badge.success;
      case 'pending':
      case 'warning':
      case 'commute':
        return theme.components.badge.warning;
      case 'active':
      case 'info':
        return theme.components.badge.info;
      case 'gold':
      case 'premium':
        return theme.components.badge.gold;
      default:
        return theme.components.badge.info;
    }
  };

  const getStatusText = () => {
    if (text) return text;
    
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'pending':
        return 'Pending';
      case 'business':
        return 'Business';
      case 'commute':
        return 'Commute';
      case 'personal':
        return 'Personal';
      case 'active':
        return 'Active';
      case 'gold':
        return 'Premium';
      default:
        return status;
    }
  };

  const getTextStyles = () => {
    switch (status) {
      case 'verified':
      case 'success':
      case 'business':
        return theme.components.badge.successText;
      case 'pending':
      case 'warning':
      case 'commute':
        return theme.components.badge.warningText;
      case 'active':
      case 'info':
        return theme.components.badge.infoText;
      case 'gold':
      case 'premium':
        return theme.components.badge.goldText;
      default:
        return theme.components.badge.infoText;
    }
  };

  const statusStyles = getStatusStyles();
  const textStyles = getTextStyles();

  return (
    <View style={statusStyles}>
      <Text style={textStyles}>{getStatusText()}</Text>
    </View>
  );
};

export default Badge;

