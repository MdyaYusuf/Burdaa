import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Palette, Radius } from '@/src/core/constants/Theme';

interface StatBoxProps {
  label: string;
  value: string | number;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  theme: any;
  isFeatured?: boolean;
  backgroundColor?: string;
}

export const StatBox = ({
  label,
  value,
  icon,
  theme,
  isFeatured,
  backgroundColor
}: StatBoxProps) => (
  <View style={[
    styles.statBox,
    {
      backgroundColor: backgroundColor || (isFeatured ? Palette.surfaceContainerLowest : Palette.surfaceContainerLow)
    },
    isFeatured && styles.featuredStat
  ]}>
    <MaterialCommunityIcons name={icon} size={20} color={theme.primary} />
    <Text style={[styles.value, { color: theme.primary }]}>
      {value}
    </Text>
    <Text style={[styles.statSubLabel, { color: theme.subText }]}>{label.toUpperCase()}</Text>
  </View>
);

const styles = StyleSheet.create({
  statBox: {
    flex: 1,
    borderRadius: Radius.xl,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  featuredStat: {
    elevation: 4,
    shadowColor: Palette.primary,
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  value: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 20,
    marginTop: 4,
    textAlign: 'center',
  },
  statSubLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 9,
    marginTop: 2,
    textAlign: 'center',
  },
});