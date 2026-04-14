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
import { ExecutiveBackButton } from '../../../core/components/ExecutiveBackButton'; // 🟦 Centralized Back Button
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../../core/hooks/useRedux';
import { loginUser } from '../store/authSlice';
import Toast from 'react-native-toast-message';

const theme = Colors.light;

export const LoginScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      return;
    }

    const result = await dispatch(loginUser({
      email: formData.email,
      password: formData.password
    }));

    if (loginUser.fulfilled.match(result)) {

      Toast.show({
        type: 'success',
        text1: 'Oturum Açıldı',
        text2: 'Oturumunuz başlatılıyor...',
        visibilityTime: 2000,
      });

      setFormData({
        email: '',
        password: '',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Floating Back Button Container */}
      <View style={styles.backButtonContainer}>
        <ExecutiveBackButton />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.header}>
            <Text style={styles.heroTitle}>Welcome Back</Text>
            <Text style={styles.subText}>
              Please enter your credentials to continue your executive session.
            </Text>
          </View>

          <View style={styles.form}>
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

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Password</Text>
                <Pressable>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </Pressable>
              </View>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="lock-outline" size={22} color={theme.subText} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
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

            <View style={styles.ctaContainer}>
              <ExecutiveButton
                title={isLoading ? "" : "Login"}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading && <ActivityIndicator color="#FFFFFF" />}
              </ExecutiveButton>
            </View>

            <Pressable onPress={() => router.push('/(auth)/register')} style={styles.footerLink}>
              <Text style={styles.footerText}>
                Don't have an account? <Text style={styles.footerAction}>Create Account</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },

  backButtonContainer: {
    position: 'absolute',
    top: 60,
    left: Spacing.lg,
    zIndex: 10,
  },

  scrollContent: {
    padding: Spacing.lg,
    paddingTop: 120 + Spacing.xl,
  },
  header: { marginBottom: Spacing.xl },
  heroTitle: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 40,
    color: theme.primary,
    lineHeight: 48,
    marginBottom: Spacing.xs,
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
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  label: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: theme.primary,
    opacity: 0.8,
    marginLeft: 4,
  },
  forgotText: {
    fontSize: 13,
    fontFamily: 'Inter-Bold',
    color: theme.primary,
    marginRight: 4
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