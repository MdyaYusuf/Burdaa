const primaryNavy = '#04172c';
const primaryContainer = '#1a2c42';
const white = '#ffffff';
const black = '#000000';

const surface = '#f8f9fc';
const onSurface = '#191c1e';
const onSurfaceVariant = '#44474d';

export const Colors = {
  light: {
    text: onSurface,
    background: surface,
    subText: onSurfaceVariant,
    tint: primaryNavy,
    iconDefault: '#ccc',
    tabIconSelected: primaryNavy,
    cardBase: '#ffffff',
    tonalLayerLow: '#f2f4f6',
    primary: primaryNavy,
    primaryContainer: primaryContainer,
    onPrimary: white,
    present: '#d3e4ff',
    late: '#ffddb2',
    absent: '#ffdad6',
    onStatusText: primaryNavy,
  },
  dark: {
    text: white,
    background: black,
    subText: '#ccc',
    tint: white,
    iconDefault: '#999',
    tabIconSelected: white,
    cardBase: '#1a1c1e',
    tonalLayerLow: '#252a2e',
    primary: '#d0e4ff',
    primaryContainer: primaryContainer,
    onPrimary: black,
    present: '#d3e4ff',
    late: '#ffddb2',
    absent: '#ffdad6',
    onStatusText: primaryNavy,
  },
};