import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Radius } from '@/src/core/constants/Theme';
import { useAppDispatch } from '@/src/core/hooks/useRedux';
import { createMember } from '@/src/features/members/store/memberSlice';

export default function CreateMemberModal() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { groupId } = useLocalSearchParams<{ groupId: string }>();

  // Form Data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [externalId, setExternalId] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isValid = firstName.trim() && lastName.trim();

  const handleRegister = async () => {

    if (!isValid || !groupId) {

      return;
    }
    setIsSubmitting(true);

    const requestData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      externalId: externalId.trim() || undefined,
      groupId: groupId,
    };

    const result = await dispatch(createMember(requestData));

    if (createMember.fulfilled.match(result)) {
      router.back();
    }
    setIsSubmitting(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.closeButton, { backgroundColor: theme.tonalLayerLow }]}
        >
          <MaterialCommunityIcons name="close" size={24} color={theme.primary} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={[styles.label, { color: theme.subText }]}>NEW MEMBER</Text>
          <Text style={[styles.title, { color: theme.primary }]}>Register</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formSection}>
          <View>
            <Text style={[styles.inputLabel, { color: theme.primary }]}>First Name</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.tonalLayerLow }]}>
              <TextInput
                style={[styles.input, { color: theme.primary }]}
                placeholder="e.g. Arda"
                value={firstName}
                onChangeText={setFirstName}
                placeholderTextColor={theme.subText}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View>
            <Text style={[styles.inputLabel, { color: theme.primary }]}>Last Name</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.tonalLayerLow }]}>
              <TextInput
                style={[styles.input, { color: theme.primary }]}
                placeholder="e.g. Yılmaz"
                value={lastName}
                onChangeText={setLastName}
                placeholderTextColor={theme.subText}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View>
            <Text style={[styles.inputLabel, { color: theme.primary }]}>External ID (Optional)</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.tonalLayerLow }]}>
              <TextInput
                style={[styles.input, { color: theme.primary }]}
                placeholder="e.g. TS-YYYY-MM"
                value={externalId}
                onChangeText={setExternalId}
                placeholderTextColor={theme.subText}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: theme.primary },
            !isValid && styles.buttonDisabled
          ]}
          onPress={handleRegister}
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? (
            <ActivityIndicator color={theme.onPrimary} />
          ) : (
            <>
              <MaterialCommunityIcons name="account-check" size={22} color={theme.onPrimary} />
              <Text style={[styles.submitButtonText, { color: theme.onPrimary }]}>Register Member</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: { justifyContent: 'center' },
  label: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    letterSpacing: 1.5,
  },
  title: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 32,
    marginTop: -2,
  },
  content: {
    padding: Spacing.lg,
    marginTop: Spacing.xl,
  },
  formSection: { gap: Spacing.lg },
  inputLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.md,
    height: 56,
    justifyContent: 'center',
  },
  input: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
  },
  submitButton: {
    height: 56,
    borderRadius: 99,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: { opacity: 0.5 },
  submitButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
  },
});