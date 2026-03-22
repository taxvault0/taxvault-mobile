import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/styles/theme';
import { colors } from '@/styles/theme';
import { typography } from '@/styles/theme';
import { spacing } from '@/styles/theme';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  onPress,
  style,
  textStyle,
  gradient = false,
  ...props
}) => {
  const getButtonStyles = () => {
    const baseStyles = {
      container: {
        height: spacing.layout[`${size}ButtonHeight`] || spacing.layout.buttonHeight,
        paddingHorizontal: size === 'sm' ? spacing.md : spacing.lg,
        borderRadius: spacing.radius.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.6 : 1,
      },
      text: {
        fontSize: size === 'sm' ? typography.sizes.sm : typography.sizes.base,
        fontWeight: typography.weights.semiBold,
      },
    };

    switch (variant) {
      case 'primary':
        return {
          container: {
            ...baseStyles.container,
            backgroundColor: colors.primary[500],
          },
          text: {
            ...baseStyles.text,
            color: colors.white,
          },
        };
      case 'secondary':
        return {
          container: {
            ...baseStyles.container,
            backgroundColor: colors.secondary[500],
          },
          text: {
            ...baseStyles.text,
            color: colors.white,
          },
        };
      case 'outline':
        return {
          container: {
            ...baseStyles.container,
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: colors.primary[500],
          },
          text: {
            ...baseStyles.text,
            color: colors.primary[500],
          },
        };
      case 'success':
        return {
          container: {
            ...baseStyles.container,
            backgroundColor: colors.success.main,
          },
          text: {
            ...baseStyles.text,
            color: colors.white,
          },
        };
      case 'warning':
        return {
          container: {
            ...baseStyles.container,
            backgroundColor: colors.warning.main,
          },
          text: {
            ...baseStyles.text,
            color: colors.white,
          },
        };
      case 'ghost':
        return {
          container: {
            ...baseStyles.container,
            backgroundColor: 'transparent',
          },
          text: {
            ...baseStyles.text,
            color: colors.primary[500],
          },
        };
      default:
        return theme.components.button.primary;
    }
  };

  const buttonStyles = getButtonStyles();

  const ButtonContent = () => (
    <>
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? colors.primary[500] : colors.white}
          style={{ marginRight: spacing.sm }}
        />
      )}
      {icon && iconPosition === 'left' && !loading && (
        <View style={{ marginRight: spacing.sm }}>{icon}</View>
      )}
      <Text style={[buttonStyles.text, textStyle]}>{children}</Text>
      {icon && iconPosition === 'right' && !loading && (
        <View style={{ marginLeft: spacing.sm }}>{icon}</View>
      )}
    </>
  );

  if (gradient) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[fullWidth && { width: '100%' }, style]}
        {...props}
      >
        <LinearGradient
          colors={colors.gradients[variant] || colors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[buttonStyles.container, fullWidth && { width: '100%' }]}
        >
          <ButtonContent />
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        buttonStyles.container,
        fullWidth && { width: '100%' },
        style,
      ]}
      {...props}
    >
      <ButtonContent />
    </TouchableOpacity>
  );
};

export default Button;

