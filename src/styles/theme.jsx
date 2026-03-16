import { colors } from './colors';
import { typography } from './typography';
import { spacing as baseSpacing } from './spacing';

// Flatten the spacing object for easier access in components
export const spacing = {
  // Direct spacing values
  xs: baseSpacing.xs,
  sm: baseSpacing.sm,
  md: baseSpacing.md,
  lg: baseSpacing.lg,
  xl: baseSpacing.xl,
  xxl: baseSpacing.xxl,
  
  // Keep radius accessible both ways
  radius: {
    sm: baseSpacing.radius.sm,
    md: baseSpacing.radius.md,
    lg: baseSpacing.radius.lg,
    xl: baseSpacing.radius.xl,
    full: baseSpacing.radius.full,
  },
  
  // Keep layout for component-specific needs
  layout: baseSpacing.layout,
  
  // Keep shadows
  shadows: baseSpacing.shadows,
};

// Export borderRadius as a separate constant for components that expect it
export const borderRadius = {
  sm: baseSpacing.radius.sm,
  md: baseSpacing.radius.md,
  lg: baseSpacing.radius.lg,
  xl: baseSpacing.radius.xl,
  full: baseSpacing.radius.full,
};

// Export individual constants for direct access
export { colors, typography };

// Keep the theme object for component-specific styles
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius, // Add borderRadius to theme object

  // Component-specific styles
  components: {
    // Button styles
    button: {
      primary: {
        container: {
          backgroundColor: colors.primary[500],
          borderRadius: borderRadius.md, // Now using borderRadius.md
          height: spacing.layout.buttonHeight,
          paddingHorizontal: spacing.lg,
        },
        text: {
          color: colors.white,
          fontSize: typography.sizes.base,
          fontWeight: typography.weights.semiBold,
        },
        disabled: {
          backgroundColor: colors.gray[300],
        },
      },
      secondary: {
        container: {
          backgroundColor: colors.secondary?.[500] || colors.secondary,
          borderRadius: borderRadius.md, // Now using borderRadius.md
          height: spacing.layout.buttonHeight,
          paddingHorizontal: spacing.lg,
        },
        text: {
          color: colors.white,
          fontSize: typography.sizes.base,
          fontWeight: typography.weights.semiBold,
        },
      },
      outline: {
        container: {
          backgroundColor: 'transparent',
          borderRadius: borderRadius.md, // Now using borderRadius.md
          height: spacing.layout.buttonHeight,
          paddingHorizontal: spacing.lg,
          borderWidth: 2,
          borderColor: colors.primary[500],
        },
        text: {
          color: colors.primary[500],
          fontSize: typography.sizes.base,
          fontWeight: typography.weights.semiBold,
        },
      },
      ghost: {
        container: {
          backgroundColor: 'transparent',
          borderRadius: borderRadius.md, // Now using borderRadius.md
          height: spacing.layout.buttonHeight,
          paddingHorizontal: spacing.lg,
        },
        text: {
          color: colors.primary[500],
          fontSize: typography.sizes.base,
          fontWeight: typography.weights.medium,
        },
      },
    },

    // Card styles
    card: {
      default: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg, // Now using borderRadius.lg
        padding: spacing.lg,
        ...spacing.shadows?.sm || {},
      },
      elevated: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg, // Now using borderRadius.lg
        padding: spacing.lg,
        ...spacing.shadows?.md || {},
      },
      outline: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg, // Now using borderRadius.lg
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border?.light || colors.gray[300],
      },
    },

    // Input styles
    input: {
      container: {
        marginBottom: spacing.md,
      },
      field: {
        height: spacing.layout?.inputHeight || 48,
        borderWidth: 1,
        borderColor: colors.border?.light || colors.gray[300],
        borderRadius: borderRadius.md, // Now using borderRadius.md
        paddingHorizontal: spacing.md,
        fontSize: typography.sizes.base,
        color: colors.text.primary,
        backgroundColor: colors.white,
      },
      fieldFocused: {
        borderColor: colors.primary[500],
        borderWidth: 2,
      },
      fieldError: {
        borderColor: colors.warning?.main || colors.warning,
      },
      label: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
        color: colors.text.secondary,
        marginBottom: spacing.xs,
      },
      error: {
        fontSize: typography.sizes.xs,
        color: colors.warning?.main || colors.warning,
        marginTop: spacing.xs,
      },
    },

    // Badge styles
    badge: {
      success: {
        backgroundColor: colors.success?.light || colors.success + '20',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full, // Now using borderRadius.full
      },
      successText: {
        color: colors.success?.main || colors.success,
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.medium,
      },
      warning: {
        backgroundColor: colors.warning?.light || colors.warning + '20',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full, // Now using borderRadius.full
      },
      warningText: {
        color: colors.warning?.main || colors.warning,
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.medium,
      },
      info: {
        backgroundColor: colors.info?.light || colors.info + '20',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full, // Now using borderRadius.full
      },
      infoText: {
        color: colors.info?.main || colors.info,
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.medium,
      },
      gold: {
        backgroundColor: colors.gold?.light || colors.gold + '20',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full, // Now using borderRadius.full
      },
      goldText: {
        color: colors.gold?.dark || colors.gold,
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.medium,
      },
    },
  },
};

// Log theme loaded
console.log('✅ theme.jsx loaded', {
  hasColors: !!colors,
  hasTypography: !!typography,
  hasSpacing: !!spacing,
  hasBorderRadius: !!borderRadius,
  spacingKeys: Object.keys(spacing),
  borderRadiusKeys: Object.keys(borderRadius),
});

export default theme;