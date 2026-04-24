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
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '@/src/core/constants/Theme';
import { useAppDispatch, useAppSelector } from '@/src/core/hooks/useRedux';
import { createGroup } from '../store/groupSlice';

export default function CreateGroupModal() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.closeButton, { backgroundColor: theme.tonalLayerLow }]}
        >
          <MaterialCommunityIcons name="close" size={24} color={theme.primary} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={[styles.label, { color: theme.subText }]}>NEW ROSTER</Text>
          <Text style={[styles.title, { color: theme.primary }]}>Register</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.formSection}>
          <View>
            <Text style={[styles.inputLabel, { color: theme.primary }]}>Group Name</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.tonalLayerLow }]}>
              <TextInput
                style={[styles.input, { color: theme.primary }]}
                placeholder="e.g. Morning Shift A"
                value={groupName}
                onChangeText={setGroupName}
                placeholderTextColor={theme.subText}
              />
            </View>
          </View>

          <View>
            <Text style={[styles.inputLabel, { color: theme.primary }]}>Purpose / Description (Optional)</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer, { backgroundColor: theme.tonalLayerLow }]}>
              <TextInput
                style={[styles.input, styles.textArea, { color: theme.primary }]}
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
          style={[styles.submitButton, { backgroundColor: theme.primary }, !groupName && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={isSubmitting || !groupName}
        >
          {isSubmitting ? (
            <ActivityIndicator color={theme.onPrimary} />
          ) : (
            <>
              <MaterialCommunityIcons name="check-decagram" size={20} color={theme.onPrimary} />
              <Text style={[styles.submitButtonText, { color: theme.onPrimary }]}>Create Group</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
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
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    justifyContent: 'center'
  },
  label: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    letterSpacing: 1.5
  },
  title: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 32,
    marginTop: -2
  },
  content: {
    padding: Spacing.lg,
    marginTop: Spacing.xl
  },
  formSection: {
    gap: Spacing.lg
  },
  inputLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4
  },
  inputContainer: {
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.md,
    height: 56,
    justifyContent: 'center'
  },
  textAreaContainer: {
    height: 120,
    paddingVertical: Spacing.sm
  },
  input: {
    fontFamily: 'Inter-Medium',
    fontSize: 15
  },
  textArea: {
    textAlignVertical: 'top'
  },
  submitButton: {
    height: 56,
    borderRadius: 99,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 40
  },
  buttonDisabled: {
    opacity: 0.5
  },
  submitButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 15
  }
});