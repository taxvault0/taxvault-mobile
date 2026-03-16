import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Guideline sizes are based on standard iPhone 14 screen
const guidelineBaseWidth = 390;
const guidelineBaseHeight = 844;

const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export const typography = {
  // Font families
  fonts: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    light: 'Inter-Light',
  },

  // Font sizes (responsive)
  sizes: {
    xs: moderateScale(12),
    sm: moderateScale(14),
    base: moderateScale(16),
    lg: moderateScale(18),
    xl: moderateScale(20),
    '2xl': moderateScale(24),
    '3xl': moderateScale(30),
    '4xl': moderateScale(36),
    '5xl': moderateScale(48),
  },

  // Line heights
  lineHeights: {
    xs: moderateScale(16),
    sm: moderateScale(20),
    base: moderateScale(24),
    lg: moderateScale(28),
    xl: moderateScale(32),
    '2xl': moderateScale(36),
    '3xl': moderateScale(42),
    '4xl': moderateScale(48),
    '5xl': moderateScale(56),
  },

  // Font weights
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },

  // Letter spacing
  letterSpacing: {
    tighter: -0.8,
    tight: -0.4,
    normal: 0,
    wide: 0.4,
    wider: 0.8,
    widest: 1.6,
  },

  // Pre-defined text styles
  styles: {
    h1: {
      fontSize: moderateScale(48),
      lineHeight: moderateScale(56),
      fontWeight: '700',
      letterSpacing: -0.8,
    },
    h2: {
      fontSize: moderateScale(36),
      lineHeight: moderateScale(42),
      fontWeight: '700',
      letterSpacing: -0.4,
    },
    h3: {
      fontSize: moderateScale(30),
      lineHeight: moderateScale(36),
      fontWeight: '600',
      letterSpacing: -0.4,
    },
    h4: {
      fontSize: moderateScale(24),
      lineHeight: moderateScale(32),
      fontWeight: '600',
      letterSpacing: -0.2,
    },
    h5: {
      fontSize: moderateScale(20),
      lineHeight: moderateScale(28),
      fontWeight: '600',
      letterSpacing: -0.2,
    },
    h6: {
      fontSize: moderateScale(18),
      lineHeight: moderateScale(24),
      fontWeight: '600',
      letterSpacing: -0.1,
    },
    body1: {
      fontSize: moderateScale(16),
      lineHeight: moderateScale(24),
      fontWeight: '400',
    },
    body2: {
      fontSize: moderateScale(14),
      lineHeight: moderateScale(20),
      fontWeight: '400',
    },
    caption: {
      fontSize: moderateScale(12),
      lineHeight: moderateScale(16),
      fontWeight: '400',
    },
    overline: {
      fontSize: moderateScale(10),
      lineHeight: moderateScale(14),
      fontWeight: '500',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
    button: {
      fontSize: moderateScale(16),
      lineHeight: moderateScale(24),
      fontWeight: '600',
      letterSpacing: 0.4,
    },
  },
};
