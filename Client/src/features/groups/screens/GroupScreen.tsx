import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Image,
  useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Palette } from '@/src/core/constants/Theme';
import { useAppDispatch, useAppSelector } from '@/src/core/hooks/useRedux';
import { fetchGroups } from '@/src/features/groups/store/groupSlice';
import { useFocusEffect, useRouter } from 'expo-router';
import { GroupResponseDto } from '@/src/features/groups/types/Group';
import { ProfileButton } from '@/src/core/components/ProfileButton';
import { ExecutiveBackButton } from '@/src/core/components/ExecutiveBackButton';
import { fetchRollcallPreviews } from '../../rollcalls/store/rollcallSlice';
import { RecentEntries } from '@/src/core/components/RecentEntries';
import { getProfileImageUri } from '@/src/core/utils/imageUtils';

export function GroupScreenComponent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { selectedOrganization } = useAppSelector((state) => state.organizations);
  const { groups, isLoading } = useAppSelector((state) => state.groups);
  const [searchQuery, setSearchQuery] = useState('');
  const [isReady, setIsReady] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsReady(false);

      if (selectedOrganization?.id) {
        dispatch(fetchGroups(selectedOrganization.id));
        dispatch(fetchRollcallPreviews({
          organizationId: selectedOrganization.id,
          count: 5
        }));
      }

      const timer = setTimeout(() => setIsReady(true), 100);
      return () => clearTimeout(timer);
    }, [dispatch, selectedOrganization?.id])
  );

  const filteredGroups = groups.filter((g: GroupResponseDto) =>
    g.organizationId === selectedOrganization?.id &&
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreatePress = () => router.push('/create-group' as any);
  const handleBackPress = () => router.push('/(tabs)');

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={['top', 'left', 'right']}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeading}>
          <ExecutiveBackButton onPress={handleBackPress} />
          <View style={styles.headerTitles}>
            <Text style={[styles.ledgerLabel, { color: theme.subText }]}>
              {selectedOrganization?.name.toUpperCase() || 'ACTIVE ORGANIZATION'}
            </Text>
            <Text style={[styles.ledgerTitle, { color: theme.primary }]}>Groups</Text>
          </View>
        </View>
        <ProfileButton />
      </View>

      {/* Search Bar */}
      <View style={styles.searchRow}>
        <View style={[styles.searchContainer, { backgroundColor: theme.tonalLayerLow }]}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={theme.subText}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search groups..."
            style={[styles.searchInput, { color: theme.primary }]}
            placeholderTextColor={theme.subText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              if (selectedOrganization?.id) {
                dispatch(fetchGroups(selectedOrganization.id));
                dispatch(fetchRollcallPreviews({
                  organizationId: selectedOrganization.id,
                  count: 5
                }));
              }
            }}
            tintColor={theme.primary}
          />
        }
      >
        <View style={styles.listContainer}>
          {isReady && filteredGroups.length === 0 && (
            <View style={styles.emptyStateBlock}>
              <MaterialCommunityIcons
                name="account-group-outline"
                size={80}
                color={theme.subText}
                style={{ opacity: 0.5, marginBottom: 12 }}
              />
              <Text style={[styles.createPrompt, { color: theme.subText }]}>
                {searchQuery ? "No matches found." : "Forming a new roster?"}
              </Text>

              {!searchQuery && (
                <TouchableOpacity
                  style={[styles.createButton, { backgroundColor: theme.primary }]}
                  onPress={handleCreatePress}
                >
                  <MaterialCommunityIcons
                    name="account-multiple-plus"
                    size={20}
                    color={theme.onPrimary}
                  />
                  <Text style={[styles.createButtonText, { color: theme.onPrimary }]}>
                    Add New Group
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {isReady && filteredGroups.map((group: GroupResponseDto) => (
            <TouchableOpacity
              key={group.id}
              style={styles.groupCard}
              activeOpacity={0.9}
              onPress={() => router.push(`/groups/${group.id}` as any)}
            >
              {/* Background Watermark */}
              <View style={styles.cardWatermark}>
                <MaterialCommunityIcons name="shield-check-outline" size={120} color={theme.primary} />
              </View>

              <View style={styles.cardHeader}>
                <View style={styles.logoContainer}>
                  {selectedOrganization?.logoUrl ? (
                    <Image
                      source={{ uri: getProfileImageUri(selectedOrganization.logoUrl) || '' }}
                      style={styles.logoImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <MaterialCommunityIcons name="shield-star" size={28} color={theme.primary} />
                  )}
                </View>

                <View style={[
                  styles.statChip,
                  { backgroundColor: group.totalRollcalls === 0 ? theme.absent : theme.present }
                ]}>
                  <MaterialCommunityIcons name="history" size={14} color={theme.primary} />
                  <Text style={[styles.statValue, { color: theme.primary }]}>
                    {group.totalRollcalls} Rollcalls
                  </Text>
                </View>
              </View>

              <View style={styles.nameSection}>
                <Text style={[styles.groupName, { color: theme.primary }]}>
                  {group.name}
                </Text>

                <View style={styles.memberStackRow}>
                  <MaterialCommunityIcons name="account-group" size={20} color={theme.subText} />
                  <View style={styles.memberChip}>
                    <Text style={styles.memberChipText}>
                      {group.totalMembers} Members
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.statusBadge}>
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: group.isActive ? '#2e7d32' : theme.subText }
                  ]} />
                  <Text style={[styles.statusText, { color: theme.primary }]}>
                    {group.isActive ? 'Live Session' : 'Standby'}
                  </Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color={theme.subText} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Conditional History Section */}
        {isReady && filteredGroups.length > 0 && (
          <View style={styles.historySection}>
            <RecentEntries limit={3} />
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
        onPress={handleCreatePress}
      >
        <MaterialCommunityIcons name="plus" size={32} color={theme.onPrimary} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: 120,
    backgroundColor: Palette.surfaceContainerLow,
  },
  listContainer: {
    gap: Spacing.md
  },
  historySection: {
    marginTop: Spacing.xl
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
    flex: 1
  },
  headerTitles: {
    justifyContent: 'center',
    flex: 1
  },
  ledgerLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    letterSpacing: 1.5
  },
  ledgerTitle: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 32,
    marginTop: -2
  },
  searchRow: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    marginTop: Spacing.sm
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.md,
    height: 56,
  },
  searchIcon: {
    marginRight: Spacing.sm
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 15
  },
  groupCard: {
    backgroundColor: Palette.surfaceContainerLowest,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderLeftWidth: 6,
    borderLeftColor: Palette.primary,
    position: 'relative',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Palette.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoImage: {
    width: '100%',
    height: '100%'
  },
  nameSection: {
    marginVertical: Spacing.lg
  },
  groupName: {
    fontFamily: 'Manrope-Bold',
    fontSize: 22,
    lineHeight: 28
  },
  memberStackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
    marginTop: Spacing.sm
  },
  memberChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 99,
    backgroundColor: Palette.surface
  },
  memberChipText: {
    fontFamily: 'Manrope-Bold',
    fontSize: 12,
    color: Palette.primary
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    gap: 6,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: 'rgba(196, 198, 205, 0.15)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  statusText: {
    fontFamily: 'Inter-Bold',
    fontSize: 11,
    textTransform: 'uppercase'
  },
  statChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  statValue: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 14
  },
  cardWatermark: {
    position: 'absolute',
    right: -1,
    top: '35%',
    opacity: 0.04,
    transform: [{ rotate: '-15deg' }],
  },
  emptyStateBlock: {
    marginTop: 80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  createPrompt: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    marginBottom: 20
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 99,
    elevation: 4,
  },
  createButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14
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
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
  },
});