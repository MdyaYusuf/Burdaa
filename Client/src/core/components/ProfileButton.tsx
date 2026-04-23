import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
  Image
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { useRouter } from 'expo-router';
import { logout, logoutUser } from '../../features/auth/store/authSlice';
import { clearOrganization } from '@/src/features/organizations/store/organizationSlice';
import { Colors, Spacing, Radius } from '../constants/Theme';
import { getProfileImageUri } from '../utils/imageUtils';

const theme = Colors.light;

export const ProfileButton = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const toggleMenu = () => setIsMenuVisible(!isMenuVisible);
  const imageUri = getProfileImageUri(user?.profileImageUrl);

  const handleLogout = () => {
    setIsMenuVisible(false);
    Alert.alert(
      "Oturumu Kapat",
      "Oturumunuzu sonlandırmak istediğinize emin misiniz?",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Çıkış Yap",
          style: "destructive",
          onPress: () => {
            setTimeout(() => {
              dispatch(logout());
              dispatch(clearOrganization());
              dispatch(logoutUser());
              router.replace('/(auth)' as any);
            }, 300);
          }
        }
      ]
    );
  };

  const handleSettings = () => {
    setIsMenuVisible(false);
    router.push('/settings' as any);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.profileCircle} onPress={toggleMenu}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.avatarImage}
          />
        ) : (
          <MaterialCommunityIcons name="account" size={24} color={theme.primary} />
        )}
      </TouchableOpacity>

      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleMenu}
      >
        <Pressable style={styles.modalOverlay} onPress={toggleMenu} />

        <View style={styles.menuAnchor}>
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
              <MaterialCommunityIcons name="cog-outline" size={22} color={theme.primary} />
              <Text style={styles.menuItemText}>Ayarlar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <MaterialCommunityIcons name="logout-variant" size={22} color="#ba1a1a" />
              <Text style={[styles.menuItemText, { color: '#ba1a1a' }]}>Oturumu Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'relative' },
  profileCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.tonalLayerLow,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  modalOverlay: { flex: 1 },
  menuAnchor: {
    position: 'absolute',
    top: 70,
    right: Spacing.lg,
    width: 200,
  },
  menuCard: {
    backgroundColor: theme.cardBase,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
  },
  menuItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: theme.primary
  },
});