// Theme constants with color shades
export const colors = {
  primary: {
    50: '#E6F0FF',
    100: '#B3D4FF',
    200: '#80B8FF',
    300: '#4D9CFF',
    400: '#1A80FF',
    500: '#007AFF',
    600: '#0062CC',
    700: '#004999',
    800: '#003166',
    900: '#001833',
  },
  secondary: '#5856D6',
  background: '#FFFFFF',
  surface: '#F2F2F7',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  text: {
    primary: '#000000',
    secondary: '#8E8E93',
  },
  border: '#C6C6C8',
  white: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Complete typography with all styles your components need
export const typography = {
  // Individual style objects
  h1: {
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 41,
  },
  h2: {
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 34,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 30,
  },
  h4: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
  },
  h5: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
  },
  h6: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 22,
  },
  body: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
  },
  body1: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
  },
  body2: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  button: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
  },
  
  // Styles object that components are using
  styles: {
    h1: {
      fontSize: 34,
      fontWeight: '700',
      lineHeight: 41,
    },
    h2: {
      fontSize: 28,
      fontWeight: '600',
      lineHeight: 34,
    },
    h3: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 30,
    },
    h4: {
      fontSize: 22,
      fontWeight: '600',
      lineHeight: 28,
    },
    h5: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 24,
    },
    h6: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 22,
    },
    body: {
      fontSize: 17,
      fontWeight: '400',
      lineHeight: 22,
    },
    body1: {
      fontSize: 17,
      fontWeight: '400',
      lineHeight: 22,
    },
    body2: {
      fontSize: 15,
      fontWeight: '400',
      lineHeight: 20,
    },
    caption: {
      fontSize: 13,
      fontWeight: '400',
      lineHeight: 18,
    },
    button: {
      fontSize: 17,
      fontWeight: '600',
      lineHeight: 22,
    },
  },
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
};

// Paper theme for React Native Paper
export const paperTheme = {
  colors: {
    primary: colors.primary[500],
    accent: colors.secondary,
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
    text: colors.text.primary,
    onSurface: colors.text.primary,
    disabled: colors.text.secondary,
    placeholder: colors.text.secondary,
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  roundness: borderRadius.md,
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
    },
  },
  animation: {
    scale: 1.0,
  },
};

console.log('✅ theme.js loaded', {
  hasColors: !!colors,
  hasTypography: !!typography,
  hasTypographyStyles: !!typography?.styles,
  hasSpacing: !!spacing,
  hasBorderRadius: !!borderRadius,
  hasPaperTheme: !!paperTheme
});

// ❌ REMOVE THIS ENTIRE EXPORT BLOCK - it's causing duplicate exports
// export {
//   colors,
//   typography,
//   spacing,
//   borderRadius,
//   paperTheme
// };