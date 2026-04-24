import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Image,
  InteractionManager,
  useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Palette } from '@/src/core/constants/Theme';
import { ProfileButton } from '@/src/core/components/ProfileButton';
import { ExecutiveBackButton } from '@/src/core/components/ExecutiveBackButton';
import { selectOrganization, fetchOrganizations } from '../store/organizationSlice';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/src/core/hooks/useRedux';
import { getProfileImageUri } from '@/src/core/utils/imageUtils';
import { clearGroups } from '@/src/features/groups/store/groupSlice';
import { clearMembers } from '@/src/features/members/store/memberSlice';
import { clearActiveRollcall } from '@/src/features/rollcalls/store/rollcallSlice';

export function OrganizationScreenComponent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { organizations, selectedOrganization, isLoading } = useAppSelector(
    (state) => state.organizations
  );
  const [isReady, setIsReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      setIsReady(false);
      const task = InteractionManager.runAfterInteractions(() => {
        setIsReady(true);
        dispatch(fetchOrganizations());
      });
      return () => task.cancel();
    }, [dispatch])
  );

  const filteredOrgs = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreatePress = () => router.push('/create-organization' as any);

  const handleBackPress = () => router.push('/(tabs)');

  const handleSelectOrg = (org: any) => {
    dispatch(selectOrganization(org));

    dispatch(clearGroups());
    dispatch(clearMembers());
    dispatch(clearActiveRollcall());

    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={['top', 'left', 'right']}
    >
      {/* Branded Header */}
      <View style={styles.header}>
        <View style={styles.headerLeading}>
          <ExecutiveBackButton onPress={handleBackPress} />
          <View style={styles.headerTitles}>
            <Text style={[styles.ledgerLabel, { color: theme.subText }]}>
              ACTIVE SESSION
            </Text>
            <Text style={[styles.ledgerTitle, { color: theme.primary }]}>
              Select Organization
            </Text>
          </View>
        </View>
        <ProfileButton />
      </View>

      {/* Search Bar */}
      <View style={styles.searchRow}>
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: theme.tonalLayerLow },
          ]}
        >
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={theme.subText}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search organizations..."
            style={[styles.searchInput, { color: theme.primary }]}
            placeholderTextColor={theme.subText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => dispatch(fetchOrganizations())}
            tintColor={theme.primary}
          />
        }
      >
        <View style={styles.quoteCard}>
          {/* Top Right Thematic Icons */}
          <View style={styles.iconRow}>
            <MaterialCommunityIcons name="notebook-outline" size={18} color={Palette.primary} />
            <MaterialCommunityIcons name="pencil" size={18} color={Palette.primary} />
            <MaterialCommunityIcons name="whistle-outline" size={20} color={Palette.primary} />
          </View>

          {/* Triple Action Sentences */}
          <Text style={styles.quoteText}>
            <Text style={styles.quoteBold}>Lead</Text> with clarity{"\n"}
            <Text style={styles.quoteBold}>Master</Text> every detail{"\n"}
            <Text style={styles.quoteBold}>Organize</Text> your world
          </Text>
        </View>

        <View style={styles.listContainer}>
          {isReady && filteredOrgs.length === 0 && (
            <View style={styles.emptyStateBlock}>
              <Text style={[styles.createPrompt, { color: theme.subText }]}>
                {searchQuery
                  ? 'No matches found.'
                  : 'Managing a new department?'}
              </Text>
              {!searchQuery && (
                <TouchableOpacity
                  style={[
                    styles.createButton,
                    { backgroundColor: theme.primary },
                  ]}
                  onPress={handleCreatePress}
                >
                  <MaterialCommunityIcons
                    name="office-building-plus"
                    size={20}
                    color={theme.onPrimary}
                  />
                  <Text
                    style={[
                      styles.createButtonText,
                      { color: theme.onPrimary },
                    ]}
                  >
                    Add New Organization
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Organization Cards */}
          {isReady &&
            filteredOrgs.map((org) => {
              const isCurrent = String(org.id) === String(selectedOrganization?.id);
              const fullLogoUri = getProfileImageUri(org.logoUrl);

              return (
                <TouchableOpacity
                  key={org.id}
                  style={[
                    styles.orgCard,
                    { shadowColor: theme.primary },
                    isCurrent
                      ? [
                        styles.activeCard,
                        {
                          borderColor: theme.primary,
                          backgroundColor: theme.cardBase,
                        },
                      ]
                      : [
                        styles.inactiveCard,
                        { backgroundColor: theme.tonalLayerLow },
                      ],
                  ]}
                  activeOpacity={0.9}
                  onPress={() => handleSelectOrg(org)}
                >
                  <View style={styles.orgContent}>
                    <View
                      style={[
                        styles.iconBox,
                        isCurrent
                          ? { backgroundColor: theme.primary }
                          : {
                            backgroundColor: theme.cardBase,
                            borderColor: theme.outline,
                            borderWidth: 1,
                          },
                      ]}
                    >
                      {isReady && fullLogoUri ? (
                        <Image
                          key={fullLogoUri}
                          source={{ uri: fullLogoUri }}
                          style={styles.orgLogo}
                          resizeMode="cover"
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name={
                            org.name.toLowerCase().includes('academy')
                              ? 'school'
                              : 'office-building'
                          }
                          size={32}
                          color={isCurrent ? theme.onPrimary : theme.subText}
                        />
                      )}
                    </View>

                    <View style={styles.orgInfo}>
                      <View style={styles.orgTitleRow}>
                        <Text
                          style={[styles.orgName, { color: theme.primary }]}
                          numberOfLines={2}
                        >
                          {org.name}
                        </Text>
                        {isCurrent && (
                          <View
                            style={[
                              styles.currentBadge,
                              { backgroundColor: theme.primary },
                            ]}
                          >
                            <Text
                              style={[
                                styles.currentBadgeText,
                                { color: theme.onPrimary },
                              ]}
                            >
                              CURRENT
                            </Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.orgMeta}>
                        <View style={styles.metaItem}>
                          <MaterialCommunityIcons
                            name="account-group"
                            size={16}
                            color={theme.subText}
                          />
                          <Text style={[styles.metaText, { color: theme.subText }]}>
                            {org.totalGroups} Groups
                          </Text>
                        </View>
                        <View style={styles.metaItem}>
                          <MaterialCommunityIcons
                            name="map-marker"
                            size={16}
                            color={theme.subText}
                          />
                          <Text
                            style={[styles.metaText, { color: theme.subText }]}
                            numberOfLines={1}
                          >
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
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[
          styles.fab,
          { backgroundColor: theme.primary, shadowColor: theme.primary },
        ]}
        onPress={handleCreatePress}
      >
        <MaterialCommunityIcons name="plus" size={32} color={theme.onPrimary} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerLeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  headerTitles: {
    justifyContent: 'center',
    flex: 1,
  },
  searchRow: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    marginTop: Spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.md,
    height: 56,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 15,
  },
  ledgerLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    letterSpacing: 1.5,
  },
  ledgerTitle: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 32,
    marginTop: -2,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 0,
    paddingBottom: 120,
  },
  listContainer: {
    gap: Spacing.md,
  },
  orgCard: {
    borderRadius: 24,
    padding: Spacing.lg,
  },
  activeCard: {
    borderWidth: 2,
    elevation: 4,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 24,
  },
  inactiveCard: {
    elevation: 0,
  },
  orgContent: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
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
  orgInfo: {
    flex: 1,
  },
  orgTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  orgName: {
    fontFamily: 'Manrope-Bold',
    fontSize: 24,
    flex: 1,
    marginRight: 8,
    lineHeight: 30,
  },
  currentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
  },
  currentBadgeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 9,
  },
  orgMeta: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  emptyStateBlock: {
    marginTop: 80,
    alignItems: 'center',
  },
  createPrompt: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 16,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 99,
  },
  createButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.3,
    shadowRadius: 24,
  },
  quoteCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
    padding: Spacing.lg,
    paddingRight: 64,
    backgroundColor: Palette.surfaceContainerLow,
    borderRadius: Radius.xl,
    borderLeftWidth: 4,
    borderLeftColor: Palette.primary,
    position: 'relative',
    minHeight: 165,
    justifyContent: 'center',
  },
  quoteText: {
    fontFamily: 'Manrope-Medium',
    fontSize: 19,
    color: Palette.primary,
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  quoteBold: {
    fontFamily: 'Manrope-ExtraBold',
  },
  iconRow: {
    position: 'absolute',
    top: 18,
    right: 18,
    flexDirection: 'row',
    gap: 8,
    opacity: 0.4,
  },
});