import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Platform,
  useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Spacing, Radius } from '@/src/core/constants/Theme';
import { useAppDispatch, useAppSelector } from '@/src/core/hooks/useRedux';
import { createMember } from '@/src/features/members/store/memberSlice';
import {
  CreateMemberRequest,
} from '@/src/features/members/types/Member';

export default function CreateMemberModal() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { groupId } = useLocalSearchParams<{ groupId: string }>();

  const { selectedOrganization } = useAppSelector((state) => state.organizations);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [externalId, setExternalId] = useState('');
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const isValid = firstName.trim() && lastName.trim();

  const orgPrefix = selectedOrganization?.name.substring(0, 3).toUpperCase() || 'ORG';
  const currentYear = new Date().getFullYear();
  const dynamicPlaceholder = `e.g. ${orgPrefix}-${currentYear}-001`;

  // Image Picker Logic
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');

    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  const handleRegister = async () => {

    if (!isValid || !groupId) {
      return;
    }
    setIsSubmitting(true);

    const request: CreateMemberRequest = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      groupId: groupId,
      externalId: externalId ? externalId.trim() : null,
      birthDate: birthDate ? birthDate.toISOString() : null,
      profileImage: profileImage ? {
        uri: profileImage,
        name: profileImage.split('/').pop() || 'profile.jpg',
        type: 'image/jpeg',
      } : null
    };

    const result = await dispatch(createMember(request));

    if (createMember.fulfilled.match(result)) {
      router.back();
    }

    setIsSubmitting(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header Ledger */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.closeButton, { backgroundColor: theme.tonalLayerLow }]}>
          <MaterialCommunityIcons name="close" size={24} color={theme.primary} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={[styles.label, { color: theme.subText }]}>NEW MEMBER</Text>
          <Text style={[styles.title, { color: theme.primary }]}>Register</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Avatar Selector */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickImage} style={[styles.avatarCircle, { backgroundColor: theme.tonalLayerLow }]}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatarImage} />
            ) : (
              <MaterialCommunityIcons name="camera-plus" size={32} color={theme.subText} />
            )}
          </TouchableOpacity>
          <Text style={[styles.avatarHint, { color: theme.subText }]}>Set Profile Photo</Text>
        </View>

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
              />
            </View>
          </View>

          {/* Date Picker Field */}
          <View>
            <Text style={[styles.inputLabel, { color: theme.primary }]}>Birth Date</Text>
            <TouchableOpacity
              style={[styles.inputContainer, { backgroundColor: theme.tonalLayerLow }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={[styles.input, { color: birthDate ? theme.primary : theme.subText }]}>
                {birthDate ? birthDate.toLocaleDateString('tr-TR') : 'Select Date'}
              </Text>
              <MaterialCommunityIcons name="calendar-edit" size={20} color={theme.subText} style={styles.inputIcon} />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={birthDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

          <View>
            <Text style={[styles.inputLabel, { color: theme.primary }]}>External ID (Optional)</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.tonalLayerLow }]}>
              <TextInput
                style={[styles.input, { color: theme.primary }]}
                placeholder={dynamicPlaceholder}
                value={externalId}
                onChangeText={setExternalId}
                placeholderTextColor={theme.subText}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: theme.primary }, !isValid && styles.buttonDisabled]}
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
  container: {
    flex: 1,
  },
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
  headerText: {
    justifyContent: 'center',
  },
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
    marginTop: Spacing.md,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarHint: {
    fontFamily: 'Inter-Bold',
    fontSize: 11,
    marginTop: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  formSection: {
    gap: Spacing.lg,
  },
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    flex: 1,
  },
  inputIcon: {
    marginLeft: 8,
  },
  submitButton: {
    height: 56,
    borderRadius: 99,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 40,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
  },
});