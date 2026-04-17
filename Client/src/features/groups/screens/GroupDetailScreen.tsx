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
import { Colors, Spacing, Radius } from '@/src/core/constants/Theme';
import { useAppDispatch, useAppSelector } from '@/src/core/hooks/useRedux';
import { fetchMembers } from '@/src/features/members/store/memberSlice';
import { ExecutiveBackButton } from '@/src/core/components/ExecutiveBackButton';
import { ProfileButton } from '@/src/core/components/ProfileButton';
import { calculateAge } from '@/src/core/utils/dateUtils';

interface Props {
  groupId: string;
}

const IMAGE_BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export function GroupDetailScreen({ groupId }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { members, isLoading } = useAppSelector((state) => state.members);
  const { groups } = useAppSelector((state) => state.groups);
  const [searchQuery, setSearchQuery] = useState('');
  const [isReady, setIsReady] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsReady(false);
      const timer = setTimeout(() => {
        setIsReady(true);
        dispatch(fetchMembers());
      }, 0);

      return () => clearTimeout(timer);
    }, [dispatch])
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
            onRefresh={() => dispatch(fetchMembers())}
            tintColor={theme.primary}
          />
        }
      >
        {/* Search Bar */}
        <View style={[styles.searchRow, { backgroundColor: theme.tonalLayerLow }]}>
          <MaterialCommunityIcons name="magnify" size={22} color={theme.subText} />
          <TextInput
            placeholder="Search members..."
            style={[styles.searchInput, { color: theme.primary }]}
            placeholderTextColor={theme.subText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterButton}>
            <MaterialCommunityIcons name="tune" size={20} color={theme.subText} />
          </TouchableOpacity>
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
              {filteredMembers.map((member) => {
                const ageDisplay = calculateAge(member.birthDate);

                return (
                  <TouchableOpacity
                    key={member.id}
                    style={styles.memberRow}
                    activeOpacity={0.7}
                  >
                    <View style={styles.memberInfo}>
                      <View style={[styles.avatar, { backgroundColor: theme.present }]}>
                        {member.profileImageUrl ? (
                          <Image
                            source={{ uri: `${IMAGE_BASE_URL}${member.profileImageUrl}` }}
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.xl,
    height: 56,
    marginVertical: Spacing.lg,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    marginLeft: Spacing.sm,
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
});