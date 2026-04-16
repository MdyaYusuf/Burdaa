import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '@/src/core/constants/Theme';
import { useAppDispatch, useAppSelector } from '@/src/core/hooks/useRedux';
import { createGroup } from '../store/groupSlice';

const theme = Colors.light;

export default function CreateGroupModal() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedOrganization } = useAppSelector((state) => state.organizations);

  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {

    if (!groupName || !selectedOrganization?.id) {

      return;
    }

    setIsSubmitting(true);
    const requestData = {
      name: groupName,
      description: description || null,
      organizationId: selectedOrganization.id,
    };

    const result = await dispatch(createGroup(requestData));

    if (createGroup.fulfilled.match(result)) {
      router.back();
    }
    setIsSubmitting(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <MaterialCommunityIcons name="close" size={24} color={theme.primary} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.label}>NEW ROSTER</Text>
          <Text style={styles.title}>Register</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.formSection}>
          <View>
            <Text style={styles.inputLabel}>Group Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="e.g. Morning Shift A"
                value={groupName}
                onChangeText={setGroupName}
                placeholderTextColor={theme.subText}
              />
            </View>
          </View>

          <View>
            <Text style={styles.inputLabel}>Purpose / Description (Optional)</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="e.g. Managing floor staff for the HQ lobby."
                value={description}
                onChangeText={setDescription}
                placeholderTextColor={theme.subText}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, !groupName && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={isSubmitting || !groupName}
        >
          {isSubmitting ? (
            <ActivityIndicator color={theme.onPrimary} />
          ) : (
            <>
              <MaterialCommunityIcons name="check-decagram" size={20} color={theme.onPrimary} />
              <Text style={styles.submitButtonText}>Create Group</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.md
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.tonalLayerLow,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: { justifyContent: 'center' },
  label: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: theme.subText,
    letterSpacing: 1.5
  },
  title: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 32,
    color: theme.primary,
    marginTop: -2
  },
  content: { padding: Spacing.lg, marginTop: Spacing.xl },
  formSection: { gap: Spacing.lg },
  inputLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: theme.primary,
    marginBottom: 8,
    marginLeft: 4
  },
  inputContainer: {
    backgroundColor: theme.tonalLayerLow,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.md,
    height: 56,
    justifyContent: 'center'
  },
  textAreaContainer: { height: 120, paddingVertical: Spacing.sm },
  input: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: theme.primary
  },
  textArea: { textAlignVertical: 'top' },
  submitButton: {
    backgroundColor: theme.primary,
    height: 56,
    borderRadius: 99,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 40
  },
  buttonDisabled: { opacity: 0.5 },
  submitButtonText: { fontFamily: 'Inter-Bold', fontSize: 15, color: theme.onPrimary }
});