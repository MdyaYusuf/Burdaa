import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  useColorScheme,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius } from '@/src/core/constants/Theme';
import { useAppDispatch, useAppSelector } from '@/src/core/hooks/useRedux';
import { fetchMemberById, fetchMemberStats, clearMembers } from '@/src/features/members/store/memberSlice';
import { ExecutiveBackButton } from '@/src/core/components/ExecutiveBackButton';
import { ProfileButton } from '@/src/core/components/ProfileButton';
import { getProfileImageUri } from '@/src/core/utils/imageUtils';
import { StatBox } from '../components/StatBox';
import { formatDateTR, formatShortDateTR } from '@/src/core/utils/dateUtils';

export default function MemberDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { selectedMember: member, stats, isLoading } = useAppSelector((state) => state.members);

  const loadData = useCallback(() => {

    if (id) {
      dispatch(fetchMemberById(id));
      dispatch(fetchMemberStats(id));
    }
  }, [id, dispatch]);

  useFocusEffect(
    useCallback(() => {
      loadData();
      return () => {
        dispatch(clearMembers());
      };
    }, [loadData, dispatch])
  );

  if (isLoading && !member) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!member) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Header Row */}
      <View style={styles.header}>
        <View style={styles.headerLeading}>
          <ExecutiveBackButton onPress={() => router.back()} />
          <View style={styles.headerTitles}>
            <Text style={[styles.ledgerLabel, { color: theme.subText }]}>MEMBER PROFILE</Text>
            <Text style={[styles.ledgerTitle, { color: theme.primary }]}>Details</Text>
          </View>
        </View>
        <ProfileButton />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadData} tintColor={theme.primary} />
        }
      >
        {/* Profile Hero */}
        <View style={styles.profileHero}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: getProfileImageUri(member.profileImageUrl) || '' }}
              style={[styles.avatar, { borderColor: theme.cardBase }]}
            />
            {member.isActive && (
              <View style={[styles.verifiedBadge, { backgroundColor: '#2e7d32' }]}>
                <MaterialCommunityIcons name="check-decagram" size={16} color="white" />
              </View>
            )}
          </View>

          <Text style={[styles.memberName, { color: theme.primary }]}>
            {member.firstName} {member.lastName}
          </Text>

          <View style={styles.groupMeta}>
            <Text style={[styles.subGroupText, { color: theme.primary }]}>
              {member.groupName}
            </Text>
            <View style={styles.idBadge}>
              <MaterialCommunityIcons name="shield" size={14} color="#2e7d32" />
              <Text style={[styles.idText, { color: theme.accent }]}>
                {member.externalId || 'PENDING'}
              </Text>
            </View>
          </View>
        </View>

        {/* Personal Info Card */}
        <View style={[styles.infoCard, { backgroundColor: theme.cardBase }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardLabel, { color: theme.subText }]}>QUICK INFO</Text>
            <View style={[styles.headerUnderline, { backgroundColor: theme.accent }]} />
          </View>

          <View style={styles.infoGrid}>
            <InfoItem label="Registration" value={formatDateTR(member.createdDate)} />
            <InfoItem label="Birthdate" value={formatDateTR(member.birthDate)} />
            <InfoItem label="First Name" value={member.firstName} />
            <InfoItem label="Last Name" value={member.lastName} />
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsRow}>
          <StatBox
            label="Sessions"
            value={stats?.totalSessions || 0}
            icon="calendar-month"
            theme={theme}
            backgroundColor={theme.late}
          />
          <StatBox
            label="Rate"
            value={`${stats?.attendanceRate || 0}%`}
            icon="account-check"
            theme={theme}
            isFeatured
            backgroundColor={theme.present}
          />
          <StatBox
            label="Last Seen"
            value={formatShortDateTR(stats?.lastSeen)}
            icon="history"
            theme={theme}
            backgroundColor={theme.absent}
          />
        </View>

        {/* Attendance Breakdown */}
        <View style={[styles.breakdownCard, { backgroundColor: theme.cardBase }]}>
          <Text style={[styles.cardLabel, { color: theme.subText }]}>ATTENDANCE BREAKDOWN</Text>

          <View style={styles.chartWrapper}>
            <View style={[styles.donut, { borderColor: theme.present }]}>
              <Text style={[styles.donutValue, { color: theme.primary }]}>{stats?.attendanceRate || 0}%</Text>
              <Text style={[styles.donutLabel, { color: theme.subText }]}>PRESENT</Text>
            </View>
          </View>

          <View style={styles.breakdownList}>
            <BreakdownItem label="Present" value={stats?.presentCount || 0} color={theme.present} theme={theme} />
            <BreakdownItem label="Late Arrivals" value={stats?.lateCount || 0} color={theme.late} theme={theme} />
            <BreakdownItem label="Absences" value={stats?.absentCount || 0} color={theme.absent} theme={theme} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper Components
const InfoItem = ({ label, value }: { label: string, value: string }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label.toUpperCase()}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const BreakdownItem = ({ label, value, color, theme }: any) => (
  <View style={[styles.breakdownItem, { backgroundColor: theme.tonalLayerLow }]}>
    <View style={[styles.colorDot, { backgroundColor: color }]} />
    <Text style={[styles.breakdownLabel, { color: theme.primary }]}>{label}</Text>
    <Text style={[styles.breakdownValue, { color: theme.primary }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  profileHero: {
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 4,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  memberName: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 32,
    marginTop: Spacing.md,
    letterSpacing: -1,
  },
  groupMeta: {
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  idBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  idText: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  subGroupText: {
    fontFamily: 'Manrope-Bold',
    fontSize: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoCard: {
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  cardLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  headerUnderline: {
    height: 2,
    width: 24,
    marginTop: 4,
    borderRadius: 1,
    opacity: 0.6,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  infoItem: {
    width: '45%',
    alignItems: 'center',
  },
  infoLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    opacity: 0.6,
    textAlign: 'center',
  },
  infoValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    marginTop: 2,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  breakdownCard: {
    borderRadius: Radius.xl,
    padding: Spacing.lg,
  },
  chartWrapper: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  donut: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  donutValue: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 28,
  },
  donutLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    marginTop: -2,
  },
  breakdownList: {
    gap: Spacing.sm,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: Radius.lg,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  breakdownLabel: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  breakdownValue: {
    fontFamily: 'Manrope-Bold',
    fontSize: 14,
  },
});