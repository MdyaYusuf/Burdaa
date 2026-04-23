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
import { Colors, Spacing, Radius } from '@/src/core/constants/Theme';
import { useAppDispatch, useAppSelector } from '@/src/core/hooks/useRedux';
import { fetchGroups } from '@/src/features/groups/store/groupSlice';
import { useFocusEffect, useRouter } from 'expo-router';
import { GroupResponseDto } from '@/src/features/groups/types/Group';
import { ProfileButton } from '@/src/core/components/ProfileButton';
import { ExecutiveBackButton } from '@/src/core/components/ExecutiveBackButton';
import { fetchRollcallPreviews } from '../../rollcalls/store/rollcallSlice';
import { RecentEntries } from '@/src/core/components/RecentEntries';

export function GroupScreenComponent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { selectedOrganization } = useAppSelector((state) => state.organizations);
  const { groups, isLoading } = useAppSelector((state) => state.groups);
  const [searchQuery, setSearchQuery] = useState('');
  const [isReady, setIsReady] = useState(false);

  const IMAGE_BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  useFocusEffect(
    useCallback(() => {
      setIsReady(false);
      const timer = setTimeout(() => {
        setIsReady(true);
        dispatch(fetchGroups());
        dispatch(fetchRollcallPreviews());
      }, 0);

      return () => clearTimeout(timer);
    }, [dispatch])
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
      {/* Branded Header */}
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

      {/* Search */}
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
              dispatch(fetchGroups());
              dispatch(fetchRollcallPreviews());
            }}
            tintColor={theme.primary}
          />
        }
      >
        <View style={styles.listContainer}>
          {isReady && filteredGroups.length === 0 && (
            <View style={styles.emptyStateBlock}>
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
              style={[
                styles.groupCard,
                { backgroundColor: theme.cardBase, shadowColor: theme.primary }
              ]}
              activeOpacity={0.8}
              onPress={() => router.push(`/groups/${group.id}` as any)}
            >
              <View style={styles.cardTopRow}>
                <View style={[styles.logoContainer, { backgroundColor: theme.tonalLayerLow }]}>
                  {selectedOrganization?.logoUrl ? (
                    <Image
                      source={{ uri: `${IMAGE_BASE_URL}${selectedOrganization.logoUrl}` }}
                      style={styles.logoImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <MaterialCommunityIcons name="shield-outline" size={24} color={theme.subText} />
                  )}
                </View>

                <View style={styles.rollcallInfo}>
                  <Text style={[styles.rollcallLabel, { color: theme.subText }]}>ROLLCALLS</Text>
                  <Text style={[
                    styles.rollcallValue,
                    { color: theme.tint },
                    group.totalRollcalls === 0 && { color: '#ba1a1a' }
                  ]}>
                    {group.totalRollcalls}
                  </Text>
                </View>
              </View>

              <View style={styles.nameSection}>
                <Text
                  style={[styles.groupName, { color: theme.primary }]}
                  numberOfLines={1}
                >
                  {group.name}
                </Text>
                <View style={styles.memberCountRow}>
                  <MaterialCommunityIcons name="account-multiple" size={16} color={theme.subText} />
                  <Text style={[styles.memberCountText, { color: theme.subText }]}>
                    {group.totalMembers} Members
                  </Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View style={[styles.statusBadge, { backgroundColor: theme.tonalLayerLow }]}>
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: group.isActive ? '#2e7d32' : theme.subText }
                  ]} />
                  <Text style={[styles.statusText, { color: theme.primary }]}>
                    {group.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color={theme.primary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <RecentEntries limit={3} />

      </ScrollView>

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
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 120,
  },
  listContainer: {
    gap: Spacing.md,
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
  groupCard: {
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    elevation: 2,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  rollcallInfo: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rollcallLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    letterSpacing: 1,
  },
  rollcallValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginTop: 2,
  },
  nameSection: {
    marginBottom: Spacing.xl,
  },
  nameBlock: {
    flex: 1,
    marginRight: 12,
  },
  groupName: {
    fontFamily: 'Manrope-Bold',
    fontSize: 22,
    lineHeight: 28,
  },
  memberCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  memberCountText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: 'Inter-Bold',
    fontSize: 11,
    textTransform: 'uppercase',
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
  emptyStateBlock: {
    marginTop: 60,
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
});