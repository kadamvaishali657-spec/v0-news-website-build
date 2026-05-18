// Premium animation utilities for immersive experience

export const animationConfig = {
  // Timing functions for smooth, natural animations
  easing: {
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    anticipate: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
    overshoot: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  // Duration presets for consistent timing
  duration: {
    instant: '100ms',
    fast: '200ms',
    normal: '300ms',
    slow: '500ms',
    verySlow: '800ms',
  },

  // Stagger delays for sequential animations
  stagger: {
    xs: '40ms',
    sm: '60ms',
    md: '100ms',
    lg: '150ms',
  },
};

// Keyframe animation definitions for CSS
export const keyframes = {
  // Text reveal animations
  textReveal: {
    name: 'textReveal',
    animation: `
      @keyframes textReveal {
        from {
          opacity: 0;
          clip-path: inset(0 100% 0 0);
        }
        to {
          opacity: 1;
          clip-path: inset(0 0 0 0);
        }
      }
    `,
  },

  // Shimmer effect for images
  shimmer: {
    name: 'shimmer',
    animation: `
      @keyframes shimmer {
        0% {
          background-position: -1000px 0;
        }
        100% {
          background-position: 1000px 0;
        }
      }
    `,
  },

  // Scale pulse for attention
  scalePulse: {
    name: 'scalePulse',
    animation: `
      @keyframes scalePulse {
        0%, 100% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.05);
          opacity: 0.8;
        }
      }
    `,
  },

  // Floating animation
  floating: {
    name: 'floating',
    animation: `
      @keyframes floating {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-20px);
        }
      }
    `,
  },

  // Glow effect
  glowEffect: {
    name: 'glowEffect',
    animation: `
      @keyframes glowEffect {
        0%, 100% {
          box-shadow: 0 0 20px rgba(255, 127, 64, 0.3), 0 0 40px rgba(255, 127, 64, 0.1);
        }
        50% {
          box-shadow: 0 0 40px rgba(255, 127, 64, 0.6), 0 0 80px rgba(255, 127, 64, 0.3);
        }
      }
    `,
  },

  // Rotate animation for loaders
  rotate: {
    name: 'rotate',
    animation: `
      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `,
  },

  // Slide in from edges
  slideInBottom: {
    name: 'slideInBottom',
    animation: `
      @keyframes slideInBottom {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  },

  // Gradient animation
  gradientShift: {
    name: 'gradientShift',
    animation: `
      @keyframes gradientShift {
        0%, 100% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
      }
    `,
  },
};

// Utility function for creating staggered animations
export function getStaggerDelay(index: number, intensity: 'xs' | 'sm' | 'md' | 'lg' = 'md'): string {
  const delayMap = {
    xs: 40,
    sm: 60,
    md: 100,
    lg: 150,
  };
  return `${index * delayMap[intensity]}ms`;
}

// Spring animation config for smooth physics-based animations
export const springConfig = {
  gentle: {
    stiffness: 100,
    damping: 10,
    mass: 1,
  },
  normal: {
    stiffness: 120,
    damping: 14,
    mass: 1,
  },
  energetic: {
    stiffness: 200,
    damping: 20,
    mass: 1,
  },
};
