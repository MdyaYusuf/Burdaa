// Raw Brand Colors
export const Palette = {
  primary: '#04172c',
  primaryContainer: '#1a2c42',
  onPrimary: '#ffffff',

  surface: '#f8f9fc',
  surfaceContainerLow: '#f2f4f6',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerHigh: '#e7e8eb',

  onSurface: '#191c1e',
  onSurfaceVariant: '#44474d',

  amberDark: '#8a5e00',

  present: '#d3e4ff', // Soft sky blue for successful attendance
  late: '#ffddb2',    // Warm amber for delayed attendance
  absent: '#ffdad6',  // Soft coral for missing members
};

// Light and Dark Mode Engine
export const Colors = {
  light: {
    text: Palette.onSurface,
    background: Palette.surface,
    subText: Palette.onSurfaceVariant,
    tint: Palette.primary,
    tabIconSelected: Palette.primary,
    cardBase: Palette.surfaceContainerLowest,
    tonalLayerLow: Palette.surfaceContainerLow,
    surfaceContainerHigh: '#e7e8eb',
    primary: Palette.primary,
    primaryContainer: Palette.primaryContainer,
    onPrimary: Palette.onPrimary,
    accent: Palette.amberDark,
    present: Palette.present,
    late: Palette.late,
    absent: Palette.absent,
    outline: 'rgba(196, 198, 205, 0.15)', // The Ghost Border
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    subText: '#ccc',
    tint: '#ffffff',
    tabIconSelected: '#ffffff',
    cardBase: '#1a1c1e',
    tonalLayerLow: '#252a2e',
    primary: '#d0e4ff',
    primaryContainer: Palette.primaryContainer,
    onPrimary: '#000000',
    accent: '#ffb951',
    present: Palette.present,
    late: Palette.late,
    absent: Palette.absent,
    outline: 'rgba(196, 198, 205, 0.15)',
  },
};

// Spacing and Radius
export const Spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32,
};

export const Radius = {
  lg: 16,
  xl: 24,
};