import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '@/src/core/constants/Theme';
import { useAppDispatch } from '@/src/core/hooks/useRedux';
import { createOrganization } from '../store/organizationSlice';
import * as ImagePicker from 'expo-image-picker';

const theme = Colors.light;

export default function CreateOrganizationModal() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [orgName, setOrgName] = useState('');
  const [address, setAddress] = useState('');
  const [logo, setLogo] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Executive Protocol: We need gallery permissions to upload a logo.');

      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setLogo(result.assets[0]);
    }
  };

  const handleCreate = async () => {

    if (!orgName) {
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('Name', orgName);

    if (address) {
      formData.append('Address', address);
    }

    if (logo) {
      const uriParts = logo.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      // React Native FormData requires this specific object structure for files
      formData.append('LogoFile', {
        uri: logo.uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }

    const result = await dispatch(createOrganization(formData));

    if (createOrganization.fulfilled.match(result)) {
      router.back(); // apiClient handles the success toast globally
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
          <Text style={styles.label}>NEW DEPARTMENT</Text>
          <Text style={styles.title}>Register</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.logoSection}>
          <TouchableOpacity style={styles.logoBox} onPress={pickImage}>
            {logo ? (
              <Image source={{ uri: logo.uri }} style={styles.previewImage} />
            ) : (
              <>
                <MaterialCommunityIcons name="camera-plus" size={32} color={theme.subText} />
                <Text style={styles.logoBoxText}>Add Logo</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <View>
            <Text style={styles.inputLabel}>Organization Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="e.g. Global Tech Solutions"
                value={orgName}
                onChangeText={setOrgName}
                placeholderTextColor={theme.subText}
              />
            </View>
          </View>

          <View>
            <Text style={styles.inputLabel}>HQ Location</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="e.g. New York, US"
                value={address}
                onChangeText={setAddress}
                placeholderTextColor={theme.subText}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, !orgName && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={isSubmitting || !orgName}
        >
          {isSubmitting ? (
            <ActivityIndicator color={theme.onPrimary} />
          ) : (
            <>
              <MaterialCommunityIcons name="check-decagram" size={20} color={theme.onPrimary} />
              <Text style={styles.submitButtonText}>Create Organization</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, gap: Spacing.md },
  closeButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.tonalLayerLow, justifyContent: 'center', alignItems: 'center' },
  headerText: { justifyContent: 'center' },
  label: { fontFamily: 'Inter-Bold', fontSize: 10, color: theme.subText, letterSpacing: 1.5 },
  title: { fontFamily: 'Manrope-ExtraBold', fontSize: 32, color: theme.primary, marginTop: -2 },
  content: { padding: Spacing.lg },
  logoSection: { alignItems: 'center', marginVertical: Spacing.xl },
  logoBox: { width: 100, height: 100, borderRadius: Radius.lg, backgroundColor: theme.cardBase, borderWidth: 1, borderColor: theme.outline, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  previewImage: { width: '100%', height: '100%' },
  logoBoxText: { fontFamily: 'Inter-Bold', fontSize: 10, color: theme.subText },
  formSection: { gap: Spacing.lg },
  inputLabel: { fontFamily: 'Inter-Bold', fontSize: 12, color: theme.primary, marginBottom: 8, marginLeft: 4 },
  inputContainer: { backgroundColor: theme.tonalLayerLow, borderRadius: Radius.xl, paddingHorizontal: Spacing.md, height: 56, justifyContent: 'center' },
  input: { fontFamily: 'Inter-Medium', fontSize: 15, color: theme.primary },
  submitButton: { backgroundColor: theme.primary, height: 56, borderRadius: 99, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 40 },
  buttonDisabled: { opacity: 0.5 },
  submitButtonText: { fontFamily: 'Inter-Bold', fontSize: 15, color: theme.onPrimary }
});