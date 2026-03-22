import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/styles/theme';
import { colors } from '@/styles/theme';
import { spacing } from '@/styles/theme';

const Card = ({
  children,
  variant = 'default',
  gradient = false,
  gradientColors,
  style,
  onPress,
  ...props
}) => {
  const getCardStyles = () => {
    switch (variant) {
      case 'elevated':
        return theme.components.card.elevated;
      case 'outline':
        return theme.components.card.outline;
      default:
        return theme.components.card.default;
    }
  };

  const cardStyles = getCardStyles();

  if (gradient) {
    return (
      <LinearGradient
        colors={gradientColors || colors.gradients.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[cardStyles, style]}
        {...props}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[cardStyles, style]} {...props}>
      {children}
    </View>
  );
};

const CardHeader = ({ children, style, ...props }) => (
  <View
    style={[
      {
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
        marginBottom: spacing.md,
      },
      style,
    ]}
    {...props}
  >
    {children}
  </View>
);

const CardBody = ({ children, style, ...props }) => (
  <View style={style} {...props}>
    {children}
  </View>
);

const CardFooter = ({ children, style, ...props }) => (
  <View
    style={[
      {
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border.light,
        marginTop: spacing.md,
      },
      style,
    ]}
    {...props}
  >
    {children}
  </View>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;

