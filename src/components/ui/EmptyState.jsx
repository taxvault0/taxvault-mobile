import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from './Button';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing } from '../../styles/spacing';

const EmptyState = ({
  icon,
  title,
  message,
  buttonText,
  onButtonPress,
}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
      }}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: spacing.radius.xl,
          backgroundColor: colors.gray[100],
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: spacing.lg,
        }}
      >
        <Icon name={icon || 'file-document-outline'} size={40} color={colors.gray[400]} />
      </View>

      <Text
        style={[
          typography.styles.h5,
          {
            textAlign: 'center',
            marginBottom: spacing.sm,
          },
        ]}
      >
        {title || 'Nothing here yet'}
      </Text>

      <Text
        style={[
          typography.styles.body2,
          {
            color: colors.text.secondary,
            textAlign: 'center',
            marginBottom: spacing.lg,
          },
        ]}
      >
        {message || 'Get started by adding your first item'}
      </Text>

      {buttonText && onButtonPress && (
        <Button onPress={onButtonPress} icon={<Icon name="plus" size={20} color={colors.white} />}>
          {buttonText}
        </Button>
      )}
    </View>
  );
};

export default EmptyState;
