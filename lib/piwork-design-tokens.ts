// Piwork Design Tokens - Complete color and typography system
export const PIWORK_THEME = {
  // Color Palette
  colors: {
    // Primary
    primary: '#8B5CF6', // violet-500 (Pi Network brand)
    primaryDark: '#7C3AED', // violet-600
    primaryLight: '#A78BFA', // violet-400

    // Background
    bgPrimary: '#0F0F0F', // Pure black for OLED
    bgSecondary: '#1A1A1A', // Dark gray cards
    bgTertiary: '#2D2D2D', // Slightly lighter for layers

    // Text
    textPrimary: '#FFFFFF', // White
    textSecondary: '#A3A3A3', // Gray
    textTertiary: '#737373', // Darker gray for hints

    // Status
    success: '#22C55E', // Green
    error: '#EF4444', // Red
    warning: '#F59E0B', // Amber
    info: '#3B82F6', // Blue

    // Semantic
    border: '#404040', // Subtle borders
    disabled: '#525252', // Disabled state
    overlay: 'rgba(0, 0, 0, 0.8)', // Semi-transparent overlay
  },

  // Typography
  typography: {
    h1: {
      fontSize: 24,
      fontWeight: '700',
      lineHeight: 1.4,
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    h2: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 1.4,
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    body: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 1.4,
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    small: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 1.4,
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
  },

  // Spacing Scale
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Border Radius
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },

  // Shadow Elevation
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.5)',
    md: '0 4px 6px rgba(0, 0, 0, 0.7)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.8)',
  },

  // Responsive Breakpoints
  breakpoints: {
    xs: 320,
    sm: 640,
    md: 768,
    lg: 1024,
  },
};

export const SCREEN_STRUCTURE = {
  // 7 Main Screens
  screens: [
    { id: 'splash', label: 'Splash/Loading', depth: 0 },
    { id: 'login', label: 'Login/Auth', depth: 0 },
    { id: 'feed', label: 'Feed (Task List)', depth: 1, nav: 'Лента' },
    { id: 'create', label: 'Create Task', depth: 1, nav: 'Создать' },
    { id: 'chats', label: 'Chats', depth: 1, nav: 'Чаты' },
    { id: 'profile', label: 'Profile', depth: 1, nav: 'Профиль' },
    { id: 'task-detail', label: 'Task Detail', depth: 2 },
  ],

  // Bottom Navigation Tabs (max 3 taps to action from any screen)
  bottomNav: [
    { id: 'feed', label: 'Лента', icon: 'list' },
    { id: 'create', label: 'Создать', icon: 'plus' },
    { id: 'chats', label: 'Чаты', icon: 'message' },
    { id: 'profile', label: 'Профиль', icon: 'user' },
  ],

  // Navigation Rules
  rules: {
    maxDepth: 3,
    noSideMenu: true,
    bottomNavPersistent: true,
    hidesOnScroll: false,
  },
};

// Utility function to get responsive spacing
export const getResponsiveSpacing = (viewport: 'xs' | 'sm' | 'md' | 'lg') => {
  const baseSpacing = PIWORK_THEME.spacing;
  const multipliers = {
    xs: 1,
    sm: 1,
    md: 1.1,
    lg: 1.2,
  };
  return Object.entries(baseSpacing).reduce((acc, [key, value]) => {
    acc[key] = Math.round(value * multipliers[viewport]);
    return acc;
  }, {} as Record<string, number>);
};
