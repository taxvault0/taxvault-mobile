import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

export const theme = {
  colors,
  typography,
  spacing,

  // Component-specific styles
  components: {
    // Button styles
    button: {
      primary: {
        container: {
          backgroundColor: colors.primary[500],
          borderRadius: spacing.radius.md,
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
          backgroundColor: colors.secondary[500],
          borderRadius: spacing.radius.md,
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
          borderRadius: spacing.radius.md,
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
          borderRadius: spacing.radius.md,
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
        borderRadius: spacing.radius.lg,
        padding: spacing.lg,
        ...spacing.shadows.sm,
      },
      elevated: {
        backgroundColor: colors.white,
        borderRadius: spacing.radius.lg,
        padding: spacing.lg,
        ...spacing.shadows.md,
      },
      outline: {
        backgroundColor: colors.white,
        borderRadius: spacing.radius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border.light,
      },
    },

    // Input styles
    input: {
      container: {
        marginBottom: spacing.md,
      },
      field: {
        height: spacing.layout.inputHeight,
        borderWidth: 1,
        borderColor: colors.border.light,
        borderRadius: spacing.radius.md,
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
        borderColor: colors.warning.main,
      },
      label: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
        color: colors.text.secondary,
        marginBottom: spacing.xs,
      },
      error: {
        fontSize: typography.sizes.xs,
        color: colors.warning.main,
        marginTop: spacing.xs,
      },
    },

    // Badge styles
    badge: {
      success: {
        backgroundColor: colors.success.light,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: spacing.radius.full,
      },
      successText: {
        color: colors.success.main,
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.medium,
      },
      warning: {
        backgroundColor: colors.warning.light,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: spacing.radius.full,
      },
      warningText: {
        color: colors.warning.main,
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.medium,
      },
      info: {
        backgroundColor: colors.info.light,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: spacing.radius.full,
      },
      infoText: {
        color: colors.info.main,
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.medium,
      },
      gold: {
        backgroundColor: colors.gold.light,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: spacing.radius.full,
      },
      goldText: {
        color: colors.gold.dark,
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.medium,
      },
    },
  },
};
