import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { Colors, Spacing, Radius } from '@/src/core/constants/Theme';
import { useAppSelector, useAppDispatch } from '@/src/core/hooks/useRedux';
import { ProfileButton } from '@/src/core/components/ProfileButton';
import { ExecutiveBackButton } from '@/src/core/components/ExecutiveBackButton';
import { fetchGroups } from '@/src/features/groups/store/groupSlice';
import { fetchRollcallPreviews } from '@/src/features/rollcalls/store/rollcallSlice';
import { RecentEntries } from '@/src/core/components/RecentEntries';
import { getProfileImageUri } from '@/src/core/utils/imageUtils';

export default function DashboardScreen() {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { selectedOrganization } = useAppSelector((state) => state.organizations);
  const { groups, isLoading: groupsLoading } = useAppSelector((state) => state.groups);
  const { previews, isLoading: rollcallsLoading } = useAppSelector((state) => state.rollcalls);

  const loadDashboardData = useCallback(() => {

    if (selectedOrganization?.id) {
      dispatch(fetchGroups(selectedOrganization.id));

      dispatch(fetchRollcallPreviews({
        organizationId: selectedOrganization.id,
        count: 5
      }));
    }
  }, [dispatch, selectedOrganization?.id]);

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [loadDashboardData])
  );

  const isLoading = groupsLoading || rollcallsLoading;
  const activeGroups = groups.filter(g => g.organizationId === selectedOrganization?.id);

  const totalStats = useMemo(() => {

    return previews.reduce(
      (acc, curr) => ({
        present: acc.present + (curr.totalPresent || 0),
        absent: acc.absent + (curr.totalAbsent || 0),
        late: acc.late + (curr.totalLate || 0),
      }),
      { present: 0, absent: 0, late: 0 }
    );
  }, [previews]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Executive Header */}
      <View style={styles.header}>
        <View style={styles.headerLeading}>
          <ExecutiveBackButton onPress={() => router.push('/organizations' as any)} />
          <View style={styles.headerTitles}>
            <Text style={[styles.label, { color: theme.subText }]}>
              {selectedOrganization?.name.toUpperCase() || "TODAY'S LEDGER"}
            </Text>
            <Text style={[styles.heroTitle, { color: theme.primary }]}>Overview</Text>
          </View>
        </View>
        <ProfileButton />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadDashboardData}
            tintColor={theme.primary}
          />
        }
      >
        {/* Statistics Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.featuredCard, { backgroundColor: theme.primary }]}>
            <View style={styles.statHeader}>
              <View style={styles.iconBoxBlur}>
                <MaterialCommunityIcons name="check-circle" size={20} color={theme.onPrimary} />
              </View>
              <Text style={styles.statLabelLight}>PRESENT</Text>
            </View>

            {/* 🟦 Fixed: Explicitly passing theme.onPrimary here */}
            <Text style={[styles.statNumberLight, { color: theme.onPrimary }]}>
              {totalStats.present}
            </Text>

            <Text style={styles.statSubtextLight}>Lifetime attendance records</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.secondaryCard, { backgroundColor: theme.cardBase }]}>
              <View style={styles.statHeader}>
                <View style={[styles.iconBox, { backgroundColor: theme.absent }]}>
                  <MaterialCommunityIcons name="close-circle" size={20} color="#ba1a1a" />
                </View>
                <Text style={[styles.statLabel, { color: theme.subText }]}>ABSENT</Text>
              </View>
              <Text style={[styles.statNumber, { color: theme.primary }]}>{totalStats.absent}</Text>
              <Text style={[styles.statSubtext, { color: '#ba1a1a' }]}>Overall missing</Text>
            </View>

            <View style={[styles.statCard, styles.secondaryCard, { backgroundColor: theme.cardBase }]}>
              <View style={styles.statHeader}>
                <View style={[styles.iconBox, { backgroundColor: theme.late }]}>
                  <MaterialCommunityIcons name="clock-outline" size={20} color="#ac8d64" />
                </View>
                <Text style={[styles.statLabel, { color: theme.subText }]}>LATE</Text>
              </View>
              <Text style={[styles.statNumber, { color: theme.primary }]}>{totalStats.late}</Text>
              <Text style={[styles.statSubtext, { color: '#ac8d64' }]}>Total delayed</Text>
            </View>
          </View>
        </View>

        {/* Dynamic Active Groups Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>Active Groups</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/groups')}>
            <Text style={[styles.seeAll, { color: theme.primary }]}>See All →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dynamicListContainer}>
          {activeGroups.length > 0 ? (
            activeGroups.slice(0, 2).map((group) => (
              <TouchableOpacity
                key={group.id}
                style={[styles.groupCard, { backgroundColor: theme.tonalLayerLow }]}
                onPress={() => router.push(`/groups/${group.id}` as any)}
              >
                <View style={styles.groupImageWrapper}>
                  {selectedOrganization?.logoUrl ? (
                    <Image
                      source={{ uri: getProfileImageUri(selectedOrganization.logoUrl) || '' }}
                      style={styles.groupImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.groupImagePlaceholder, { backgroundColor: theme.cardBase, borderColor: theme.outline }]}>
                      <MaterialCommunityIcons
                        name={selectedOrganization?.name.toLowerCase().includes("academy") ? "school" : "office-building"}
                        size={40}
                        color={theme.subText}
                      />
                    </View>
                  )}
                  <View style={styles.groupBadge}>
                    <Text style={styles.badgeText}>{group.isActive ? 'ACTIVE' : 'INACTIVE'}</Text>
                  </View>
                </View>

                <View style={styles.groupInfo}>
                  <Text style={[styles.groupName, { color: theme.primary }]} numberOfLines={1}>{group.name}</Text>
                  <Text style={[styles.groupDesc, { color: theme.subText }]} numberOfLines={2}>
                    {group.description || "No description provided for this roster."}
                  </Text>
                  <View style={styles.groupMeta}>
                    <View style={[styles.metaPill, { backgroundColor: theme.cardBase }]}>
                      <MaterialCommunityIcons name="account-group" size={14} color={theme.primary} />
                      <Text style={[styles.metaText, { color: theme.primary }]}>{group.totalMembers} Members</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={[styles.emptyContainer, { borderColor: theme.outline }]}>
              {/* 🟦 Darker icon color for better visibility */}
              <MaterialCommunityIcons name="folder-open-outline" size={48} color={theme.subText} />

              <Text style={[styles.emptyText, { color: theme.subText }]}>
                No groups found for this organization.
              </Text>

              {/* 🟦 REPLACED: Underline link with a standard Executive Button */}
              <TouchableOpacity
                style={[styles.emptyButton, { backgroundColor: theme.primary }]}
                onPress={() => router.push('/create-group' as any)}
              >
                <Text style={[styles.emptyButtonText, { color: theme.onPrimary }]}>
                  Create Group
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <RecentEntries limit={5} />

      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
        onPress={() => router.push('/create-group' as any)}
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
    padding: Spacing.lg,
    paddingBottom: 120,
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
  },
  headerTitles: {
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    letterSpacing: 1.5,
  },
  heroTitle: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 32,
    marginTop: -2,
  },
  statsGrid: {
    marginBottom: Spacing.xl,
  },
  statCard: {
    padding: Spacing.lg,
    justifyContent: 'space-between',
    borderRadius: Radius.xl,
  },
  featuredCard: {
    marginBottom: Spacing.md,
    height: 160,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  secondaryCard: {
    flex: 1,
    height: 140,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconBoxBlur: {
    padding: 8,
    borderRadius: Radius.lg,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  iconBox: {
    padding: 8,
    borderRadius: Radius.lg,
  },
  statLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
  },
  statLabelLight: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
  },
  statNumber: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 36,
  },
  statNumberLight: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 48,
  },
  statSubtext: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
  },
  statSubtextLight: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 22,
  },
  seeAll: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
  },
  dynamicListContainer: {
    gap: Spacing.md,
  },
  groupCard: {
    borderRadius: Radius.xl,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  groupImage: {
    width: '100%',
    height: '100%',
  },
  groupImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  groupBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(4,23,44,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 8,
    fontFamily: 'Inter-Bold',
  },
  groupInfo: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  groupName: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 18,
  },
  groupDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    marginTop: 4,
  },
  groupMeta: {
    marginTop: Spacing.sm,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  metaText: {
    fontFamily: 'Inter-Bold',
    fontSize: 11,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    borderRadius: Radius.xl,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 99,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
  },
  linkText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    marginTop: Spacing.md,
    textDecorationLine: 'underline',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});