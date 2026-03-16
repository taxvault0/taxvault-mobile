import { Animated, Easing } from 'react-native';

export const animations = {
  // Fade animations
  fadeIn: (value, duration = 300) => {
    return Animated.timing(value, {
      toValue: 1,
      duration,
      useNativeDriver: true,
      easing: Easing.ease,
    });
  },

  fadeOut: (value, duration = 300) => {
    return Animated.timing(value, {
      toValue: 0,
      duration,
      useNativeDriver: true,
      easing: Easing.ease,
    });
  },

  // Slide animations
  slideInUp: (value, duration = 300) => {
    return Animated.timing(value, {
      toValue: 0,
      duration,
      useNativeDriver: true,
      easing: Easing.out(Easing.back(1.5)),
    });
  },

  slideOutDown: (value, duration = 300) => {
    return Animated.timing(value, {
      toValue: 100,
      duration,
      useNativeDriver: true,
      easing: Easing.in(Easing.ease),
    });
  },

  // Scale animations
  scaleIn: (value, duration = 200) => {
    return Animated.spring(value, {
      toValue: 1,
      useNativeDriver: true,
      damping: 15,
      mass: 1,
      stiffness: 150,
    });
  },

  scaleOut: (value, duration = 200) => {
    return Animated.timing(value, {
      toValue: 0.95,
      duration,
      useNativeDriver: true,
      easing: Easing.ease,
    });
  },

  // Shake animation (for errors)
  shake: (value) => {
    return Animated.sequence([
      Animated.timing(value, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: -5,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 5,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]);
  },

  // Pulse animation (for loading)
  pulse: (value) => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ])
    );
  },

  // Timing presets
  timing: {
    quick: 200,
    normal: 300,
    slow: 500,
    verySlow: 800,
  },

  // Easing presets
  easing: {
    standard: Easing.bezier(0.4, 0.0, 0.2, 1),
    decelerate: Easing.bezier(0.0, 0.0, 0.2, 1),
    accelerate: Easing.bezier(0.4, 0.0, 1, 1),
    sharp: Easing.bezier(0.4, 0.0, 0.6, 1),
  },
};
