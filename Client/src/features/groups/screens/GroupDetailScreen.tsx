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
import { useRouter, useFocusEffect } from 'expo-router';
import { Colors, Spacing, Radius, Palette } from '@/src/core/constants/Theme';
import { useAppDispatch, useAppSelector } from '@/src/core/hooks/useRedux';
import { fetchMembers } from '@/src/features/members/store/memberSlice';
import { ExecutiveBackButton } from '@/src/core/components/ExecutiveBackButton';
import { ProfileButton } from '@/src/core/components/ProfileButton';
import { calculateAge } from '@/src/core/utils/dateUtils';
import { startNewRollcallSession } from '@/src/features/rollcalls/store/rollcallSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchRollcallPreviews } from '@/src/features/rollcalls/store/rollcallSlice';
import { RecentEntries } from '@/src/core/components/RecentEntries';
import { getProfileImageUri } from '@/src/core/utils/imageUtils';

interface Props {
  groupId: string;
}

export function GroupDetailScreen({ groupId }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  // Selectors
  const { members, isLoading } = useAppSelector((state) => state.members);
  const { groups } = useAppSelector((state) => state.groups);
  const { selectedOrganization } = useAppSelector((state) => state.organizations);

  const [searchQuery, setSearchQuery] = useState('');
  const [isReady, setIsReady] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // 🏛️ Logic: Do not proceed if context is missing
      if (!selectedOrganization?.id || !groupId) return;

      setIsReady(false);
      const timer = setTimeout(() => {
        setIsReady(true);

        // 🟦 Fix: Pass the mandatory Group ID to isolate members
        dispatch(fetchMembers(groupId));

        // 🟦 Fix: Pass the mandatory Object to isolate previews
        dispatch(fetchRollcallPreviews({
          organizationId: selectedOrganization.id,
          count: 10
        }));
      }, 0);

      return () => clearTimeout(timer);
    }, [dispatch, selectedOrganization?.id, groupId])
  );

  const currentGroup = groups.find(g => g.id === groupId);

  const filteredMembers = members.filter(m =>
    m.groupId === groupId &&
    `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const growthCount = filteredMembers.filter(m =>
    m.createdDate && new Date(m.createdDate) >= oneWeekAgo
  ).length;

  const handleAddMemberPress = () => {
    router.push({ pathname: '/create-member', params: { groupId } } as any);
  };

  const handleTakeRollcall = async () => {
    const result = await dispatch(startNewRollcallSession(groupId));

    if (startNewRollcallSession.fulfilled.match(result)) {
      router.push('/rollcalls/live');
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={['top', 'left', 'right']}
    >
      {/* Header Ledger */}
      <View style={styles.header}>
        <View style={styles.headerLeading}>
          <ExecutiveBackButton onPress={() => router.back()} />
          <View style={styles.headerTitles}>
            <Text style={[styles.ledgerLabel, { color: theme.subText }]}>ROSTER VIEW</Text>
            <Text style={[styles.ledgerTitle, { color: theme.primary }]} numberOfLines={1}>
              {currentGroup?.name || 'Loading...'}
            </Text>
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

              if (selectedOrganization?.id && groupId) {
                dispatch(fetchMembers(groupId));
                dispatch(fetchRollcallPreviews({
                  organizationId: selectedOrganization.id,
                  count: 10
                }));
              }
            }}
            tintColor={theme.primary}
          />
        }
      >
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
              placeholder="Search members..."
              style={[styles.searchInput, { color: theme.primary }]}
              placeholderTextColor={theme.subText}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Bento Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.featuredStat, { backgroundColor: theme.primaryContainer }]}>
            <Text style={styles.statLabelLight}>TOTAL MEMBERS</Text>
            <View style={styles.statNumberRow}>
              <Text style={styles.displayNumber}>{filteredMembers.length}</Text>
              <Text style={styles.statGrowth}>+{growthCount} this week</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.secondaryStat, { backgroundColor: theme.cardBase, borderLeftColor: theme.primary }]}>
              <Text style={[styles.statLabel, { color: theme.subText }]}>Active Now</Text>
              <Text style={[styles.statNumber, { color: theme.primary }]}>
                {filteredMembers.filter(m => m.isActive).length}
              </Text>
            </View>
            <View style={[styles.secondaryStat, { backgroundColor: theme.cardBase, borderLeftColor: theme.late }]}>
              <Text style={[styles.statLabel, { color: theme.subText }]}>On Leave</Text>
              <Text style={[styles.statNumber, { color: theme.primary }]}>0</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleTakeRollcall}
          activeOpacity={0.9}
          style={styles.rollcallActionContainer}
        >
          <LinearGradient
            colors={['#36485f', theme.primaryContainer]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.rollcallGradient}
          >
            <View style={styles.internalGlow} />

            <View style={styles.buttonContent}>
              <View style={styles.iconPulseContainer}>
                <MaterialCommunityIcons name="remote-tv" size={24} color={theme.onPrimary} />
                <View style={[styles.pulseDot, { backgroundColor: theme.accent }]} />
              </View>

              <View style={styles.textContainer}>
                <Text style={[styles.rollcallText, { color: theme.onPrimary }]}>
                  TAKE A ROLLCALL
                </Text>
                <Text style={[styles.rollcallSubtext, { color: 'rgba(255,255,255,0.6)' }]}>
                  INITIALIZE LIVE SESSION
                </Text>
              </View>

              <MaterialCommunityIcons name="chevron-right" size={24} color={theme.onPrimary} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <RecentEntries groupId={groupId} limit={3} />

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>Members</Text>
        </View>

        {/* Dynamic Roster Ledger */}
        <View style={[styles.listWrapper, { backgroundColor: theme.tonalLayerLow }]}>
          {isReady && filteredMembers.length === 0 ? (
            <View style={styles.emptyStateBlock}>
              <Text style={[styles.emptyPrompt, { color: theme.subText }]}>
                {searchQuery ? "No matches found in this roster." : "Ready to add members to this team?"}
              </Text>
              {!searchQuery && (
                <TouchableOpacity
                  style={[styles.createButton, { backgroundColor: theme.primary }]}
                  onPress={handleAddMemberPress}
                >
                  <MaterialCommunityIcons name="account-plus" size={20} color={theme.onPrimary} />
                  <Text style={[styles.createButtonText, { color: theme.onPrimary }]}>
                    Add New Member
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={[styles.listCard, { backgroundColor: theme.cardBase }]}>
              {filteredMembers.map((member, index) => {
                const ageDisplay = calculateAge(member.birthDate);
                const isLast = index === filteredMembers.length - 1;

                return (
                  <TouchableOpacity
                    key={member.id}
                    style={[
                      styles.memberRow,
                      isLast && { borderBottomWidth: 0 }
                    ]}
                    activeOpacity={0.8}
                    onPress={() => router.push(`/members/${member.id}` as any)}
                  >
                    <View style={styles.memberInfo}>
                      <View style={[styles.avatar, { backgroundColor: theme.present }]}>
                        {member.profileImageUrl ? (
                          <Image
                            source={{ uri: getProfileImageUri(member.profileImageUrl) || '' }}
                            style={styles.avatarImage}
                          />
                        ) : (
                          <Text style={[styles.avatarText, { color: theme.primary }]}>
                            {member.firstName?.[0] || ''}{member.lastName?.[0] || ''}
                          </Text>
                        )}
                      </View>

                      <View>
                        <Text style={[styles.memberName, { color: theme.primary }]}>
                          {member.firstName} {member.lastName}
                        </Text>

                        <Text style={[styles.memberRole, { color: theme.accent }]}>
                          {member.externalId || 'ID Pending'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rightLedger}>
                      {ageDisplay && (
                        <View
                          style={[
                            styles.ageBadge,
                            {
                              backgroundColor: '#e8f5e9',
                              borderColor: '#c8e6c9',
                              borderWidth: 1
                            }
                          ]}
                        >
                          <Text style={[styles.ageText, { color: '#2e7d32' }]}>
                            {ageDisplay}
                          </Text>
                        </View>
                      )}
                      <MaterialCommunityIcons name="chevron-right" size={24} color={theme.outline} />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={handleAddMemberPress}
      >
        <MaterialCommunityIcons name="account-plus" size={28} color={theme.onPrimary} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
    fontSize: 24,
    marginTop: -2,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 120,
  },
  filterButton: {
    padding: Spacing.xs
  },
  statsGrid: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  featuredStat: {
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    height: 140,
    justifyContent: 'space-between',
  },
  statLabelLight: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1.5,
  },
  statNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  displayNumber: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 48,
    color: '#FFFFFF',
  },
  statGrowth: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  secondaryStat: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    height: 120,
    justifyContent: 'space-between',
    borderLeftWidth: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
  },
  statNumber: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 32,
  },
  listWrapper: {
    borderRadius: 32,
    padding: 8,
    marginTop: Spacing.md,
  },
  emptyStateBlock: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyPrompt: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: Spacing.md,
    textAlign: 'center',
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
  listCard: {
    borderRadius: 28,
    paddingVertical: Spacing.sm,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(196, 198, 205, 0.15)',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  rightLedger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ageBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ageText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontFamily: 'Manrope-Bold',
    fontSize: 18,
  },
  memberName: {
    fontFamily: 'Manrope-Bold',
    fontSize: 17,
  },
  memberRole: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    marginTop: 2,
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
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  rollcallActionContainer: {
    marginVertical: Spacing.md,
    borderRadius: Radius.xl,
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  rollcallGradient: {
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    height: 88,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  internalGlow: {
    position: 'absolute',
    top: -30,
    right: -60,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconPulseContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#1a2c42',
  },
  textContainer: {
    flex: 1,
  },
  rollcallText: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 17,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  rollcallSubtext: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    letterSpacing: 1.2,
    marginTop: 2,
  },
  sectionHeader: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 22,
  },
  searchRow: {
    paddingHorizontal: 0,
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
});