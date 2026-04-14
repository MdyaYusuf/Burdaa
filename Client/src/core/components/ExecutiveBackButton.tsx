import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Theme';

const theme = Colors.light;

interface ExecutiveBackButtonProps {
  onPress?: () => void;
}

export const ExecutiveBackButton = ({ onPress }: ExecutiveBackButtonProps) => {
  const router = useRouter();

  const handlePress = () => {

    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons name="arrow-left" size={24} color={theme.primary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.tonalLayerLow,
    justifyContent: 'center',
    alignItems: 'center',
  },
});