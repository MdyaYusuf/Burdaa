import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Radius } from '@/src/core/constants/Theme';

interface StatCardProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string | number;
  color: string;
  textColor: string;
}

export const StatCard = ({ icon, label, value, color, textColor }: StatCardProps) => (
  <View style={[styles.statCard, { backgroundColor: color }]}>
    <MaterialCommunityIcons name={icon} size={24} color={textColor} />
    <View>
      <Text style={[styles.statValue, { color: textColor }]}>
        {value.toString().padStart(2, '0')}
      </Text>
      <Text style={[styles.statLabel, { color: textColor }]}>{label}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    aspectRatio: 0.85,
    borderRadius: Radius.lg,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    fontFamily: 'Manrope-Bold',
  },
  statLabel: {
    fontSize: 8,
    fontFamily: 'Inter-Bold',
    textTransform: 'uppercase',
    opacity: 0.7,
  },
});