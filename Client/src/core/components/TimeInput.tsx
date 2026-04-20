import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Radius } from '../constants/Theme';

interface TimeInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  theme: any;
}

export const TimeInput = ({ label, value, onChange, theme }: TimeInputProps) => {
  const handleTextChange = (text: string) => {
    let cleaned = text.replace(/\D/g, '');

    if (cleaned.length > 4) {
      cleaned = cleaned.slice(0, 4);
    }

    let formatted = cleaned;

    if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}:${cleaned.slice(2)}`;
    }

    onChange(formatted);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.subText }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          { color: theme.primary, backgroundColor: theme.tonalLayerLow }
        ]}
        value={value}
        onChangeText={handleTextChange}
        keyboardType="number-pad"
        maxLength={5}
        placeholder="00:00"
        placeholderTextColor={theme.subText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
  },
  label: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    letterSpacing: 1,
  },
  input: {
    height: 56,
    borderRadius: Radius.lg,
    paddingHorizontal: 16,
    fontSize: 20,
    fontFamily: 'Manrope-Bold',
    textAlign: 'center',
  },
});