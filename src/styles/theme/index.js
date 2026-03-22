import colors from './colors';
import spacing from './spacing';
import typography from './typography';
import borderRadius from './borderRadius';
import shadows from './shadows';

const paperTheme = {
  colors: {
    primary: colors.primary[500],
    background: colors.background,
    surface: colors.surface,
    text: colors.text.primary,
    placeholder: colors.text.secondary,
    error: colors.error,
  },
};

export { colors, spacing, typography, borderRadius, shadows, paperTheme };

export default {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  paperTheme,
};