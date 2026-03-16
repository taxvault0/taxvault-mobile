import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const spacing = {
  // Base spacing unit (4px)
  base: 4,

  // Named spacing values
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 80,
  '5xl': 96,

  // Screen dimensions
  screen: {
    width,
    height,
  },

  // Layout constants
  layout: {
    headerHeight: 56,
    bottomNavHeight: 64,
    tabBarHeight: 50,
    modalHeaderHeight: 60,
    inputHeight: 48,
    buttonHeight: 48,
    smallButtonHeight: 40,
    largeButtonHeight: 56,
  },

  // Border radius
  radius: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
    full: 9999,
  },

  // Icons
  icons: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
    '2xl': 48,
  },

  // Shadows
  shadows: {
    none: {},
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, width: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 12,
    },
  },
};

// Spacing utility functions
export const getSpacing = (multiplier) => spacing.base * multiplier;
export const getRadius = (size) => spacing.radius[size] || size;
export const getIconSize = (size) => spacing.icons[size] || size;
