import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius } from '@/styles/theme';

const Card = ({
  children,
  variant = 'default',
  gradient = false,
  gradientColors,
  style,
  ...props
}) => {
  const getCardStyles = () => {
    const base = {
      backgroundColor: colors.white,
      borderRadius: borderRadius?.lg || 16,
      padding: spacing.lg,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...base,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
          elevation: 3,
        };

      case 'outline':
        return {
          ...base,
          borderWidth: 1,
          borderColor: colors.border?.light || colors.border || '#e5e7eb',
        };

      default:
        return base;
    }
  };

  const cardStyles = getCardStyles();

  if (gradient) {
    return (
      <LinearGradient
        colors={
          gradientColors ||
          colors.gradients?.card || [colors.white, colors.white]
        }
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
        borderBottomColor: colors.border?.light || colors.border || '#e5e7eb',
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
        borderTopColor: colors.border?.light || colors.border || '#e5e7eb',
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
