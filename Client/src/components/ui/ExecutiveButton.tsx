import { StyleSheet, Pressable, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Spacing } from '../../constants/Theme';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export const ExecutiveButton = ({ title, onPress, variant = 'primary' }: Props) => {
  if (variant === 'secondary') {
    return (
      <Pressable 
        onPress={onPress} 
        style={({ pressed }) => [
          styles.secondary, 
          pressed && { backgroundColor: Colors.surfaceContainerHigh }
        ]}
      >
        <Text style={styles.secondaryText}>{title}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && { transform: [{ scale: 0.98 }] }]}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }} // Approximate 135 degrees
        style={styles.primary}
      >
        <Text style={styles.primaryText}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  primary: {
    paddingVertical: Spacing.md,
    borderRadius: Radius.xl,
    alignItems: 'center',
    elevation: 4, // Subtle Android shadow
  },
  primaryText: {
    color: Colors.onPrimary,
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  secondary: {
    paddingVertical: Spacing.md,
    borderRadius: Radius.xl,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
  },
  secondaryText: {
    color: Colors.primary,
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
});