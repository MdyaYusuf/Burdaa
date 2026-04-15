import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Image,
  InteractionManager
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius } from '../../../core/constants/Theme';
import { ProfileButton } from '../../../core/components/ProfileButton';
import { selectOrganization, fetchOrganizations } from '../store/organizationSlice';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../../core/hooks/useRedux';

const theme = Colors.light;
const IMAGE_BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export default function OrganizationScreen() {
  const dispatch = useAppDispatch();
  const { organizations, selectedOrganization, isLoading } = useAppSelector((state) => state.organizations);

  // isReady ensures images only mount after navigation animations settle
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
      dispatch(fetchOrganizations());
    });

    return () => task.cancel();
  }, [dispatch]);

  const onRefresh = () => {
    dispatch(fetchOrganizations());
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={theme.primary} />
        }
      >
        {/* Search and Profile */}
        <View style={styles.commandRow}>
          <View style={styles.searchContainer}>
            <MaterialCommunityIcons name="magnify" size={20} color={theme.subText} style={styles.searchIcon} />
            <TextInput
              placeholder="Search for an organization..."
              style={styles.searchInput}
              placeholderTextColor={theme.subText}
            />
          </View>
          <ProfileButton />
        </View>

        <View style={styles.ledgerHeader}>
          <Text style={styles.ledgerLabel}>ACTIVE SESSION</Text>
          <Text style={styles.ledgerTitle}>Select Organization</Text>
        </View>

        {/* Empty State Handling */}
        {!isLoading && organizations.length === 0 && (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="office-building-marker-outline" size={48} color={theme.subText + '40'} />
            <Text style={styles.emptyText}>No organizations found under your account.</Text>
          </View>
        )}

        <View style={styles.listContainer}>
          {organizations.map((org) => {
            const isCurrent = String(org.id) === String(selectedOrganization?.id);
            const fullLogoUri = org.logoUrl ? `${IMAGE_BASE_URL}${org.logoUrl}` : undefined;

            return (
              <TouchableOpacity
                key={org.id}
                style={[
                  styles.orgCard,
                  isCurrent ? styles.activeCard : styles.inactiveCard
                ]}
                activeOpacity={0.9}
                onPress={() => {
                  dispatch(selectOrganization(org));
                  router.replace('/(tabs)');
                }}
              >
                <View style={styles.orgContent}>
                  <View style={[styles.iconBox, isCurrent ? styles.activeIconBox : styles.inactiveIconBox]}>
                    {/* Guard: Render Image only if interaction is complete and logo exists */}
                    {isReady && fullLogoUri ? (
                      <Image
                        key={fullLogoUri} // Forces fresh render if URI changes
                        source={{
                          uri: fullLogoUri,
                        }}
                        style={styles.orgLogo}
                        resizeMode="contain"
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name={org.name.toLowerCase().includes("academy") ? "school" : "office-building"}
                        size={32}
                        color={isCurrent ? theme.onPrimary : theme.subText}
                      />
                    )}
                  </View>
                  <View style={styles.orgInfo}>
                    <View style={styles.orgTitleRow}>
                      <Text style={styles.orgName} numberOfLines={1}>{org.name}</Text>
                      {isCurrent && (
                        <View style={styles.currentBadge}>
                          <Text style={styles.currentBadgeText}>CURRENT</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.orgDesc} numberOfLines={2}>
                      Managing administrative ledger and departmental infrastructure.
                    </Text>

                    <View style={styles.orgMeta}>
                      <View style={styles.metaItem}>
                        <MaterialCommunityIcons name="account-group" size={16} color={theme.subText} />
                        <Text style={styles.metaText}>{org.totalGroups} Groups</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <MaterialCommunityIcons name="map-marker" size={16} color={theme.subText} />
                        <Text style={styles.metaText} numberOfLines={1}>
                          {org.address || 'Location N/A'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.createSection}>
          <Text style={styles.createPrompt}>Managing a new department?</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push('/create-organization')}
          >
            <MaterialCommunityIcons name="office-building-plus" size={20} color={theme.onPrimary} />
            <Text style={styles.createButtonText}>Add New Organization</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <MaterialCommunityIcons name="face-agent" size={28} color={theme.onPrimary} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  scrollContent: { padding: Spacing.lg, paddingBottom: 100 },
  commandRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xl, marginTop: Spacing.sm },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: theme.tonalLayerLow, borderRadius: Radius.xl, paddingHorizontal: Spacing.md, height: 56 },
  searchIcon: { marginRight: Spacing.sm },
  searchInput: { flex: 1, fontFamily: 'Inter-Medium', fontSize: 15, color: theme.primary },
  ledgerHeader: { marginBottom: Spacing.lg },
  ledgerLabel: { fontFamily: 'Inter-Bold', fontSize: 10, color: theme.subText, letterSpacing: 1.5 },
  ledgerTitle: { fontFamily: 'Manrope-ExtraBold', fontSize: 32, color: theme.primary, marginTop: 4 },
  listContainer: { gap: Spacing.md },
  orgCard: { borderRadius: 24, padding: Spacing.lg },
  activeCard: { backgroundColor: theme.cardBase, borderWidth: 2, borderColor: theme.primary, elevation: 4, shadowColor: theme.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 24 },
  inactiveCard: { backgroundColor: theme.tonalLayerLow },
  orgContent: { flexDirection: 'row', gap: Spacing.md },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  orgLogo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  activeIconBox: { backgroundColor: theme.primary },
  inactiveIconBox: { backgroundColor: theme.cardBase, borderWidth: 1, borderColor: theme.outline },
  orgInfo: { flex: 1 },
  orgTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  orgName: { fontFamily: 'Manrope-Bold', fontSize: 20, color: theme.primary, flex: 1, marginRight: 8 },
  currentBadge: { backgroundColor: theme.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 99 },
  currentBadgeText: { fontFamily: 'Inter-Bold', fontSize: 9, color: theme.onPrimary },
  orgDesc: { fontFamily: 'Inter-Regular', fontSize: 14, color: theme.subText, lineHeight: 20 },
  orgMeta: { flexDirection: 'row', gap: 16, marginTop: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontFamily: 'Inter-Medium', fontSize: 12, color: theme.subText },
  createSection: { marginTop: 48, alignItems: 'center' },
  createPrompt: { fontFamily: 'Inter-Medium', fontSize: 14, color: theme.subText, marginBottom: 16 },
  createButton: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: theme.primary, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 99 },
  createButtonText: { fontFamily: 'Inter-Bold', fontSize: 14, color: theme.onPrimary },
  fab: { position: 'absolute', bottom: 30, right: 24, width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(4,23,44,0.9)', justifyContent: 'center', alignItems: 'center', elevation: 6 },
  emptyContainer: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { fontFamily: 'Inter-Medium', fontSize: 14, color: theme.subText, textAlign: 'center', paddingHorizontal: 40 }
});