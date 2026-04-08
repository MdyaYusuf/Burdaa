import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Spacing } from '../constants/Theme';

interface ExecutiveButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary'; 
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
}

const theme = Colors.light;

export const ExecutiveButton: React.FC<ExecutiveButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  disabled, 
  style, 
  textStyle,
  children 
}) => {
  const isSecondary = variant === 'secondary';

  return (
    <Pressable 
      onPress={onPress} 
      disabled={disabled}
      style={({ pressed }) => [
        styles.buttonBase,
        isSecondary && { backgroundColor: theme.surfaceContainerHigh, elevation: 0 },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style
      ]}
    >
      {!isSecondary ? (
        <LinearGradient
          colors={disabled ? [theme.outline, theme.outline] : [theme.primary, theme.primaryContainer]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <ButtonContent title={title} textStyle={textStyle}>
            {children}
          </ButtonContent>
        </LinearGradient>
      ) : (
        <View style={styles.gradient}>
          <ButtonContent 
            title={title} 
            textStyle={[styles.secondaryText, textStyle]} 
          >
            {children}
          </ButtonContent>
        </View>
      )}
    </Pressable>
  );
};

// Helper Component to ensure title and loader are centered
const ButtonContent = ({ title, textStyle, children }: { title: string; textStyle?: any; children?: React.ReactNode }) => (
  <View style={styles.contentWrapper}>
    {title ? <Text style={[styles.text, textStyle]}>{title}</Text> : null}
    {children} 
  </View>
);

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    height: 60,
    elevation: 4,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  text: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  secondaryText: {
    color: theme.primary,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.6,
  },
});