import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius } from '@/src/core/constants/Theme';
import { useAppSelector, useAppDispatch } from '@/src/core/hooks/useRedux';
import { ProfileButton } from '@/src/core/components/ProfileButton';
import { ExecutiveBackButton } from '@/src/core/components/ExecutiveBackButton';
import { router, useFocusEffect } from 'expo-router';
import { fetchGroups } from '@/src/features/groups/store/groupSlice';
import { fetchRollcallPreviews } from '@/src/features/rollcalls/store/rollcallSlice';

const theme = Colors.light;
const IMAGE_BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export default function DashboardScreen() {
  const dispatch = useAppDispatch();
  const { selectedOrganization } = useAppSelector((state) => state.organizations);
  const { groups, isLoading: groupsLoading } = useAppSelector((state) => state.groups);
  const { previews, isLoading: rollcallsLoading } = useAppSelector((state) => state.rollcalls);

  // Sync both Groups and Rollcall History on focus
  useFocusEffect(
    useCallback(() => {
      dispatch(fetchGroups());
      dispatch(fetchRollcallPreviews());
    }, [dispatch])
  );

  const isLoading = groupsLoading || rollcallsLoading;

  // Filter groups for the current organization
  const activeGroups = groups.filter(g => g.organizationId === selectedOrganization?.id);

  // Calculate dynamic lifetime stats from previews
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

  const handleBackToOrganizations = () => {
    router.push('/organizations' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Executive Header Row */}
      <View style={styles.header}>
        <View style={styles.headerLeading}>
          <ExecutiveBackButton onPress={handleBackToOrganizations} />
          <View style={styles.headerTitles}>
            <Text style={styles.label}>
              {selectedOrganization?.name.toUpperCase() || "TODAY'S LEDGER"}
            </Text>
            <Text style={styles.heroTitle}>Overview</Text>
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
            onRefresh={() => {
              dispatch(fetchGroups());
              dispatch(fetchRollcallPreviews());
            }}
            tintColor={theme.primary}
          />
        }
      >
        {/* Statistics Ledger */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.featuredCard]}>
            <View style={styles.statHeader}>
              <View style={styles.iconBoxBlur}>
                <MaterialCommunityIcons name="check-circle" size={20} color={theme.onPrimary} />
              </View>
              <Text style={styles.statLabelLight}>PRESENT</Text>
            </View>
            <Text style={styles.statNumberLight}>{totalStats.present}</Text>
            <Text style={styles.statSubtextLight}>Lifetime attendance records</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.secondaryCard]}>
              <View style={styles.statHeader}>
                <View style={[styles.iconBox, { backgroundColor: theme.absent }]}>
                  <MaterialCommunityIcons name="close-circle" size={20} color="#ba1a1a" />
                </View>
                <Text style={styles.statLabel}>ABSENT</Text>
              </View>
              <Text style={styles.statNumber}>{totalStats.absent}</Text>
              <Text style={[styles.statSubtext, { color: '#ba1a1a' }]}>
                Overall missing
              </Text>
            </View>

            <View style={[styles.statCard, styles.secondaryCard]}>
              <View style={styles.statHeader}>
                <View style={[styles.iconBox, { backgroundColor: theme.late }]}>
                  <MaterialCommunityIcons name="clock-outline" size={20} color="#ac8d64" />
                </View>
                <Text style={styles.statLabel}>LATE</Text>
              </View>
              <Text style={styles.statNumber}>{totalStats.late}</Text>
              <Text style={[styles.statSubtext, { color: '#ac8d64' }]}>Total delayed</Text>
            </View>
          </View>
        </View>

        {/* Dynamic Active Groups Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Groups</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/groups')}>
            <Text style={styles.seeAll}>See All →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dynamicListContainer}>
          {activeGroups.length > 0 ? (
            activeGroups.slice(0, 2).map((group) => (
              <TouchableOpacity
                key={group.id}
                style={styles.groupCard}
                onPress={() => router.push(`/(tabs)/groups`)}
              >
                <View style={styles.groupImageWrapper}>
                  {selectedOrganization?.logoUrl ? (
                    <Image
                      source={{ uri: `${IMAGE_BASE_URL}${selectedOrganization.logoUrl}` }}
                      style={styles.groupImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.groupImagePlaceholder}>
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
                  <Text style={styles.groupName} numberOfLines={1}>{group.name}</Text>
                  <Text style={styles.groupDesc} numberOfLines={2}>
                    {group.description || "No description provided for this roster."}
                  </Text>
                  <View style={styles.groupMeta}>
                    <View style={styles.metaPill}>
                      <MaterialCommunityIcons name="account-group" size={14} color={theme.primary} />
                      <Text style={styles.metaText}>{group.totalMembers} Members</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyHintContainer}>
              <Text style={styles.emptyHintText}>No active groups found.</Text>
            </View>
          )}
        </View>

        {/* Recent Entries Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Entries</Text>
        </View>

        <View style={styles.dynamicListContainer}>
          {previews.length > 0 ? (
            previews.slice(0, 5).map((preview) => (
              <TouchableOpacity
                key={preview.id}
                style={styles.recentSessionCard}
                onPress={() =>
                  router.push({
                    pathname: '/rollcalls/[id]',
                    params: { id: preview.id }
                  })
                }
              >
                <View style={styles.sessionIcon}>
                  <MaterialCommunityIcons name="calendar-check" size={24} color={theme.primary} />
                </View>

                <View style={styles.sessionDetails}>
                  <Text style={styles.sessionTitleText} numberOfLines={1}>
                    {preview.title}
                  </Text>
                  <Text style={styles.sessionDateText}>
                    {preview.groupName || "General Session"}
                  </Text>
                </View>

                <View style={styles.sessionMetrics}>
                  <Text style={[styles.sessionMetricText, { color: '#2e7d32' }]}>P: {preview.totalPresent}</Text>
                  <Text style={[styles.sessionMetricText, { color: theme.accent }]}>L: {preview.totalLate}</Text>
                  <Text style={[styles.sessionMetricText, { color: '#ba1a1a' }]}>A: {preview.totalAbsent}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.ledgerCard}>
              <Text style={styles.comingSoonText}>
                Rollcall history will appear here once sessions begin.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Persistent Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
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
    backgroundColor: theme.background,
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
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 120,
  },
  label: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: theme.subText,
    letterSpacing: 1.5,
  },
  heroTitle: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 32,
    color: theme.primary,
    marginTop: -2,
  },
  statsGrid: {
    marginBottom: Spacing.xl,
  },
  featuredCard: {
    backgroundColor: theme.primary,
    marginBottom: Spacing.md,
    height: 160,
    borderRadius: Radius.xl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  secondaryCard: {
    flex: 1,
    backgroundColor: theme.cardBase,
    height: 140,
    borderRadius: Radius.xl,
  },
  statCard: {
    padding: Spacing.lg,
    justifyContent: 'space-between',
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
    color: theme.subText,
  },
  statLabelLight: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
  },
  statNumber: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 36,
    color: theme.primary,
  },
  statNumberLight: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 48,
    color: theme.onPrimary,
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
    color: theme.primary,
  },
  seeAll: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    color: theme.primary,
  },
  dynamicListContainer: {
    gap: Spacing.md,
  },
  groupCard: {
    backgroundColor: theme.tonalLayerLow,
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
    backgroundColor: theme.cardBase,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.outline,
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
    color: theme.onPrimary,
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
    color: theme.primary,
  },
  groupDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: theme.subText,
    marginTop: 4,
  },
  groupMeta: {
    marginTop: Spacing.sm,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.cardBase,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  metaText: {
    fontFamily: 'Inter-Bold',
    fontSize: 11,
    color: theme.primary,
  },
  ledgerCard: {
    backgroundColor: theme.cardBase,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  comingSoonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: theme.subText,
    textAlign: 'center',
  },
  emptyHintContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyHintText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.subText,
  },
  recentSessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.cardBase,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: theme.outline,
  },
  sessionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.tonalLayerLow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sessionDetails: {
    flex: 1,
  },
  sessionTitleText: {
    fontFamily: 'Manrope-Bold',
    fontSize: 16,
    color: theme.text,
  },
  sessionDateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: theme.subText,
  },
  sessionMetrics: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 1,
  },
  sessionMetricText: {
    fontFamily: 'Inter-Bold',
    fontSize: 11,
    lineHeight: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: Radius.lg,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});