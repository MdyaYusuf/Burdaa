import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius } from '../../../core/constants/Theme';
import { ExecutiveButton } from '../../../core/components/ExecutiveButton';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../../core/hooks/useRedux';
import { registerUser } from '../store/authSlice';
import { RegisterUserRequest } from '../types/Authentication';
import { ExecutiveBackButton } from '@/src/core/components/ExecutiveBackButton';

const theme = Colors.light;

export const RegisterScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleRegister = async () => {
    // Basic UI Validation
    if (!formData.username || !formData.email || !formData.password) {
      return;
    }

    const request: RegisterUserRequest = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    // Dispatch the thunk
    const result = await dispatch(registerUser(request));

    // Handle Success
    if (registerUser.fulfilled.match(result)) {
      setFormData({
        username: '',
        email: '',
        password: '',
      });

      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButtonContainer}>
        <ExecutiveBackButton />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Header Section: Editorial Voice */}
          <View style={styles.header}>
            <Text style={styles.heroTitle}>Create Account</Text>
            <Text style={styles.subText}>
              Join the next generation of attendance tracking.
            </Text>
          </View>

          <View style={styles.form}>

            {/* Username Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="account-outline" size={22} color={theme.subText} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Choose a unique username"
                  placeholderTextColor={theme.subText}
                  autoCorrect={false}
                  onChangeText={(val) => setFormData({ ...formData, username: val })}
                />
              </View>
            </View>

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="email-outline" size={22} color={theme.subText} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="name@company.com"
                  placeholderTextColor={theme.subText}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={(val) => setFormData({ ...formData, email: val })}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="lock-outline" size={22} color={theme.subText} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Min. 8 characters"
                  placeholderTextColor={theme.subText}
                  secureTextEntry={!showPassword}
                  onChangeText={(val) => setFormData({ ...formData, password: val })}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <MaterialCommunityIcons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color={theme.subText}
                  />
                </Pressable>
              </View>
            </View>

            {/* Call to Action Section */}
            <View style={styles.ctaContainer}>
              <ExecutiveButton
                title={isLoading ? "" : "Register"}
                onPress={handleRegister}
                disabled={isLoading}
              >
                {isLoading && <ActivityIndicator color="#FFFFFF" />}
              </ExecutiveButton>
            </View>

            <Pressable onPress={() => router.push('/(auth)/login')} style={styles.footerLink}>
              <Text style={styles.footerText}>
                Already have an account? <Text style={styles.footerAction}>Login</Text>
              </Text>
            </Pressable>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background
  },
  backButtonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: 0,
  },
  header: {
    marginBottom: Spacing.xl
  },
  heroTitle: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 40,
    color: theme.primary,
    lineHeight: 48,
    marginBottom: Spacing.xl,
    marginTop: Spacing.xl,
  },
  subText: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: theme.subText,
    lineHeight: 26,
    maxWidth: '85%',
  },
  form: { marginTop: Spacing.md },
  inputGroup: { marginBottom: Spacing.lg },
  label: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: theme.primary,
    opacity: 0.8,
    marginBottom: Spacing.sm,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.cardBase,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    height: 60,
    borderWidth: 1,
    borderColor: theme.outline,
  },
  inputIcon: { marginRight: Spacing.sm },
  input: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: theme.text,
  },
  eyeIcon: { padding: 4 },
  ctaContainer: { marginTop: Spacing.lg },
  footerLink: { marginTop: Spacing.xl, alignItems: 'center' },
  footerText: { fontFamily: 'Inter-Medium', fontSize: 16, color: theme.subText },
  footerAction: { color: theme.primary, fontFamily: 'Inter-Bold' },
});