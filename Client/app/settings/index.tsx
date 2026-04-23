import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useAppDispatch, useAppSelector } from '@/src/core/hooks/useRedux';
import { Spacing, Radius, Palette } from '@/src/core/constants/Theme';
import { ExecutiveBackButton } from '@/src/core/components/ExecutiveBackButton';
import { updateProfileInfo, changeUserPassword } from '@/src/features/users/store/userSlice';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { getProfileImageUri } from '@/src/core/utils/imageUtils';

export default function SettingsScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [username, setUsername] = useState(user?.username || '');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSaveProfile = async () => {
    const formData = new FormData();
    formData.append('Username', username);
    formData.append('Email', user?.email || '');

    if (selectedImage) {
      const uriParts = selectedImage.split('.');
      const fileType = uriParts[uriParts.length - 1];

      formData.append('ImageFile', {
        uri: selectedImage,
        name: `profile.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }

    await dispatch(updateProfileInfo({
      formData,
      username,
      profileImageUrl: selectedImage || user?.profileImageUrl
    }));
  };

  const handleUpdatePassword = async () => {

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Hata',
        text2: 'Şifreler uyuşmuyor.',
      });
      return;
    }

    const result = await dispatch(changeUserPassword({
      currentPassword,
      newPassword,
      confirmNewPassword: confirmPassword
    }));

    if (changeUserPassword.fulfilled.match(result) && result.payload.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const hasImage = !!selectedImage || !!user?.profileImageUrl;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <ExecutiveBackButton onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Profile Section */}
        <Text style={styles.sectionTitle}>Profile Settings</Text>
        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity
              onPress={pickImage}
              activeOpacity={0.8}
            >
              <View style={styles.imageWrapper}>
                {(selectedImage || user?.profileImageUrl) ? (
                  <Image
                    source={{ uri: getProfileImageUri(selectedImage || user?.profileImageUrl) as string }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <MaterialCommunityIcons name="account" size={64} color={Palette.onSurfaceVariant} />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={pickImage}>
              <Text style={styles.changeAvatarText}>
                {hasImage ? "Change Avatar" : "Set Avatar"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your name"
            />
          </View>

          <TouchableOpacity style={styles.saveBtnWrapper} onPress={handleSaveProfile}>
            <LinearGradient
              colors={[Palette.primary, Palette.primaryContainer]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryBtn}
            >
              <Text style={styles.primaryBtnText}>Save Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Account Security Section */}
        <Text style={styles.sectionTitle}>Account Security</Text>
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>New Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm New Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
          <TouchableOpacity
            style={[styles.secondaryBtn, { backgroundColor: Palette.surfaceContainerHigh }]}
            onPress={handleUpdatePassword}
          >
            <Text style={styles.secondaryBtnText}>Update Password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.surface
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  headerTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 18,
    color: Palette.primary
  },
  sectionTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 20,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
    color: Palette.onSurface
  },
  card: {
    backgroundColor: Palette.surfaceContainerLowest,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.lg
  },
  avatarContainer: {
    alignItems: 'center',
    gap: Spacing.sm
  },
  imageWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Palette.surfaceContainerLow,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: Palette.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%'
  },
  changeAvatarText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Palette.primary
  },
  inputGroup: {
    gap: 4
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: Palette.onSurfaceVariant
  },
  input: {
    backgroundColor: Palette.surfaceContainerLow,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    height: 48,
    fontFamily: 'Inter-Medium',
    color: Palette.onSurface
  },
  saveBtnWrapper: {
    alignSelf: 'flex-end',
    marginTop: 8
  },
  primaryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: Radius.xl
  },
  primaryBtnText: {
    color: Palette.onPrimary,
    fontFamily: 'Inter-Bold',
    fontSize: 14
  },
  secondaryBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: Radius.xl,
    marginTop: 8
  },
  secondaryBtnText: {
    color: Palette.onSurface,
    fontFamily: 'Inter-Bold',
    fontSize: 14
  }
});