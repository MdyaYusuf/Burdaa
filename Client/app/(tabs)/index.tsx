import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius } from '@/src/core/constants/Theme';
import { useAppSelector, useAppDispatch } from '@/src/core/hooks/useRedux';
import { ProfileButton } from '@/src/core/components/ProfileButton';
import { ExecutiveBackButton } from '@/src/core/components/ExecutiveBackButton';
import { router, useFocusEffect } from 'expo-router';
import { fetchGroups } from '@/src/features/groups/store/groupSlice';

const theme = Colors.light;
const IMAGE_BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const EntryItem = ({ name, role, status, time, statusColor }: any) => (
  <View style={styles.entryItem}>
    <View style={styles.entryMain}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{name[0]}</Text>
      </View>
      <View>
        <Text style={styles.entryName}>{name}</Text>
        <Text style={styles.entryRole}>{role}</Text>
      </View>
    </View>
    <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
      <Text style={styles.statusText}>{status.toUpperCase()}</Text>
    </View>
    <Text style={styles.entryTime}>{time}</Text>
  </View>
);

export default function DashboardScreen() {
  const dispatch = useAppDispatch();
  const { selectedOrganization } = useAppSelector((state) => state.organizations);
  const { groups, isLoading } = useAppSelector((state) => state.groups);

  // Sync groups on focus
  useFocusEffect(
    useCallback(() => {
      dispatch(fetchGroups());
    }, [dispatch])
  );

  const handleBackToOrganizations = () => {
    router.push('/organizations' as any);
  };

  // Filter groups for the current organization
  const activeGroups = groups.filter(g => g.organizationId === selectedOrganization?.id);

  return (
    <SafeAreaView style={styles.container}>
      {/* Executive Header Row */}
      <View style={styles.header}>
        <View style={styles.headerLeading}>
          <ExecutiveBackButton onPress={handleBackToOrganizations} />
          <View style={styles.headerTitles}>
            <Text style={styles.label}>{selectedOrganization?.name.toUpperCase() || "TODAY'S LEDGER"}</Text>
            <Text style={styles.heroTitle}>Overview</Text>
          </View>
        </View>
        <ProfileButton />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={() => dispatch(fetchGroups())} tintColor={theme.primary} />
        }
      >
        {/* Statistics Ledger - Currently hardcoded, but UI is ready */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.featuredCard]}>
            <View style={styles.statHeader}>
              <View style={styles.iconBoxBlur}>
                <MaterialCommunityIcons name="check-circle" size={20} color={theme.onPrimary} />
              </View>
              <Text style={styles.statLabelLight}>PRESENT</Text>
            </View>
            <Text style={styles.statNumberLight}>0</Text>
            <Text style={styles.statSubtextLight}>Live attendance data</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.secondaryCard]}>
              <View style={styles.statHeader}>
                <View style={[styles.iconBox, { backgroundColor: theme.absent }]}>
                  <MaterialCommunityIcons name="close-circle" size={20} color="#ba1a1a" />
                </View>
                <Text style={styles.statLabel}>ABSENT</Text>
              </View>
              <Text style={styles.statNumber}>0</Text>
              <Text style={[styles.statSubtext, { color: '#ba1a1a' }]}>0% rate</Text>
            </View>

            <View style={[styles.statCard, styles.secondaryCard]}>
              <View style={styles.statHeader}>
                <View style={[styles.iconBox, { backgroundColor: theme.late }]}>
                  <MaterialCommunityIcons name="clock-outline" size={20} color="#ac8d64" />
                </View>
                <Text style={styles.statLabel}>LATE</Text>
              </View>
              <Text style={styles.statNumber}>0</Text>
              <Text style={[styles.statSubtext, { color: '#ac8d64' }]}>Tracking started</Text>
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

        <View style={styles.dynamicGroupList}>
          {activeGroups.length > 0 ? (
            activeGroups.slice(0, 2).map((group) => (
              <TouchableOpacity
                key={group.id}
                style={styles.groupCard}
                onPress={() => router.push(`/(tabs)/groups`)} // Update this when Detail Page is ready
              >
                <View style={styles.groupImageWrapper}>
                  {selectedOrganization?.logoUrl ? (
                    <Image
                      source={{ uri: `${IMAGE_BASE_URL}${selectedOrganization.logoUrl}` }}
                      style={styles.groupImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[
                      styles.groupImage,
                      {
                        backgroundColor: theme.cardBase,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: theme.outline
                      }
                    ]}>
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
            <View style={styles.emptyGroupHint}>
              <Text style={styles.emptyHintText}>No active groups found in this organization.</Text>
            </View>
          )}
        </View>

        {/* Recent Entries Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Entries</Text>
        </View>

        <View style={styles.ledgerCard}>
          <Text style={styles.comingSoonText}>Rollcall history will appear here once sessions begin.</Text>
        </View>

      </ScrollView>

      {/* Persistent FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/create-group' as any)}>
        <MaterialCommunityIcons name="plus" size={32} color={theme.onPrimary} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
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
  scrollContent: { padding: Spacing.lg, paddingBottom: 120 },
  label: { fontFamily: 'Inter-Bold', fontSize: 10, color: theme.subText, letterSpacing: 1.5 },
  heroTitle: { fontFamily: 'Manrope-ExtraBold', fontSize: 32, color: theme.primary, marginTop: -2 },
  statsGrid: { marginBottom: Spacing.xl },
  featuredCard: { backgroundColor: theme.primary, marginBottom: Spacing.md, height: 160, borderRadius: Radius.xl },
  statsRow: { flexDirection: 'row', gap: Spacing.md },
  secondaryCard: { flex: 1, backgroundColor: theme.cardBase, height: 140, borderRadius: Radius.xl },
  statCard: { padding: Spacing.lg, justifyContent: 'space-between' },
  statHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconBoxBlur: { padding: 8, borderRadius: Radius.lg, backgroundColor: 'rgba(255,255,255,0.1)' },
  iconBox: { padding: 8, borderRadius: Radius.lg },
  statLabel: { fontFamily: 'Inter-Bold', fontSize: 10, color: theme.subText },
  statLabelLight: { fontFamily: 'Inter-Bold', fontSize: 10, color: 'rgba(255,255,255,0.6)' },
  statNumber: { fontFamily: 'Manrope-ExtraBold', fontSize: 36, color: theme.primary },
  statNumberLight: { fontFamily: 'Manrope-ExtraBold', fontSize: 48, color: theme.onPrimary },
  statSubtext: { fontFamily: 'Inter-Medium', fontSize: 11 },
  statSubtextLight: { fontFamily: 'Inter-Medium', fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md, marginTop: Spacing.lg },
  sectionTitle: { fontFamily: 'Manrope-Bold', fontSize: 22, color: theme.primary },
  seeAll: { fontFamily: 'Inter-Bold', fontSize: 13, color: theme.primary },
  dynamicGroupList: { gap: Spacing.md },
  groupCard: { backgroundColor: theme.tonalLayerLow, borderRadius: Radius.xl, padding: 8, flexDirection: 'row', alignItems: 'center' },
  groupImageWrapper: { width: 100, height: 100, borderRadius: Radius.lg, overflow: 'hidden' },
  groupImage: { width: '100%', height: '100%' },
  groupBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(4,23,44,0.8)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { color: theme.onPrimary, fontSize: 8, fontFamily: 'Inter-Bold' },
  groupInfo: { flex: 1, paddingHorizontal: Spacing.md },
  groupName: { fontFamily: 'Manrope-ExtraBold', fontSize: 18, color: theme.primary },
  groupDesc: { fontFamily: 'Inter-Regular', fontSize: 13, color: theme.subText, marginTop: 4 },
  groupMeta: { marginTop: Spacing.sm },
  metaPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: theme.cardBase, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  metaText: { fontFamily: 'Inter-Bold', fontSize: 11, color: theme.primary },
  ledgerCard: { backgroundColor: theme.cardBase, borderRadius: Radius.xl, padding: Spacing.lg, alignItems: 'center' },
  comingSoonText: { fontFamily: 'Inter-Medium', fontSize: 13, color: theme.subText, textAlign: 'center' },
  emptyGroupHint: { padding: Spacing.xl, alignItems: 'center' },
  emptyHintText: { fontFamily: 'Inter-Medium', fontSize: 14, color: theme.subText },
  entryItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  entryMain: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 2 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.present, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontFamily: 'Inter-Bold', color: theme.primary },
  entryName: { fontFamily: 'Inter-Bold', fontSize: 15, color: theme.text },
  entryRole: { fontFamily: 'Inter-Regular', fontSize: 12, color: theme.subText },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 99 },
  statusText: { fontFamily: 'Inter-Bold', fontSize: 9, color: theme.primary },
  entryTime: { flex: 1, textAlign: 'right', fontFamily: 'Inter-Medium', fontSize: 12, color: theme.subText },
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
    shadowRadius: 8
  }
});