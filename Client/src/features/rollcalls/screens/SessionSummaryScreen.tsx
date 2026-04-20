import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../../core/hooks/useRedux';
import { Palette, Colors, Spacing, Radius } from '@/src/core/constants/Theme';
import { saveRollcallSession } from '../store/rollcallSlice';
import { AttendanceStatus, RollcallEntryResponseDto, CreateRollcallRequest } from '../types/Rollcall';

const SessionSummaryScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { activeRollcall, isLoading } = useAppSelector((state) => state.rollcalls);

  // Bento Grid Statistics Calculation
  const stats = useMemo(() => {
    if (!activeRollcall) {
      return { total: 0, present: 0, late: 0, absent: 0 };
    }
    const entries = activeRollcall.entries;
    return {
      total: entries.length,
      present: entries.filter((e: RollcallEntryResponseDto) => e.status === AttendanceStatus.Present).length,
      late: entries.filter((e: RollcallEntryResponseDto) => e.status === AttendanceStatus.Late).length,
      absent: entries.filter((e: RollcallEntryResponseDto) => e.status === AttendanceStatus.Absent).length,
    };
  }, [activeRollcall]);

  const handleSave = async () => {

    if (!activeRollcall) {
      return;
    }

    const request: CreateRollcallRequest = {
      title: activeRollcall.title,
      description: activeRollcall.description,
      date: activeRollcall.date,
      startTime: activeRollcall.startTime,
      endTime: activeRollcall.endTime,
      groupId: activeRollcall.groupId,
      entries: activeRollcall.entries.map(e => ({
        memberId: e.memberId,
        status: e.status,
        note: e.note
      }))
    };

    const result = await dispatch(saveRollcallSession(request));

    if (saveRollcallSession.fulfilled.match(result)) {
      router.dismissAll();
    }
  };

  if (!activeRollcall) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      {/* TopAppBar */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={24} color={theme.subText} />
          </TouchableOpacity>
          <Text style={[styles.brandTitle, { color: theme.primary }]}>Burdaa</Text>
          <View style={styles.headerBadge}>
            <Text style={[styles.headerBadgeText, { color: theme.primary }]}>Rollcall Summary</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={[styles.heroLabel, { color: theme.subText }]}>SESSION OVERVIEW</Text>
          <View style={styles.heroTitleRow}>
            <Text style={[styles.heroTitle, { color: theme.primary }]}>Executive Summary</Text>
            <View style={[styles.sessionIdBadge, { backgroundColor: theme.primaryContainer }]}>
              <Text style={[styles.sessionIdText, { color: theme.onPrimary }]}>Session ID: #ACTIVE</Text>
            </View>
          </View>
        </View>

        {/* Bento Grid Stats */}
        <View style={styles.bentoGrid}>
          <StatCard icon="groups" label="Total Enrolled" value={stats.total} color={theme.tonalLayerLow} textColor={theme.primary} />
          <StatCard icon="check-circle" label="Present" value={stats.present} color={theme.present} textColor={theme.primary} fill />
          <StatCard icon="clock" label="Late Arrivals" value={stats.late} color={theme.late} textColor={theme.accent} fill />
          <StatCard icon="close-circle" label="Absent" value={stats.absent} color={theme.absent} textColor={Palette.onSurface} fill />
        </View>

        {/* Detailed Review List */}
        <View style={[styles.listContainer, { backgroundColor: theme.cardBase }]}>
          <View style={styles.listHeader}>
            <Text style={[styles.listTitle, { color: theme.primary }]}>Review Results</Text>
            <View style={styles.listActions}>
              <IconButton icon="filter-variant" theme={theme} />
              <IconButton icon="magnify" theme={theme} />
            </View>
          </View>

          {activeRollcall.entries.map((entry: RollcallEntryResponseDto) => (
            <ReviewItem key={entry.memberId} entry={entry} theme={theme} />
          ))}

          <TouchableOpacity style={styles.viewMoreButton}>
            <Text style={[styles.viewMoreText, { color: theme.primary }]}>Show all {stats.total} members</Text>
            <MaterialCommunityIcons name="chevron-down" size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View style={styles.footerContainer}>
        <View style={[styles.footerBlur, { backgroundColor: colorScheme === 'dark' ? 'rgba(4, 23, 44, 0.7)' : 'rgba(255, 255, 255, 0.7)' }]}>
          <View style={styles.footerActions}>
            <TouchableOpacity
              style={[
                styles.modifyButton,
                { backgroundColor: theme.surfaceContainerHigh || Palette.surfaceContainerHigh }
              ]}
              onPress={() => router.back()}
            >
              <MaterialCommunityIcons name="pencil" size={20} color={theme.primary} />
              <Text style={[styles.modifyButtonText, { color: theme.primary }]}>Modify Entries</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButtonContainer} onPress={handleSave} disabled={isLoading}>
              <LinearGradient colors={[theme.primary, theme.primaryContainer]} style={styles.saveButton}>
                <MaterialCommunityIcons name="content-save" size={20} color={theme.onPrimary} />
                <Text style={[styles.saveButtonText, { color: theme.onPrimary }]}>Save and Close</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <Text style={[styles.footerDisclaimer, { color: theme.subText }]}>
            FINALIZING THIS SESSION WILL UPDATE THE MASTER LEDGER
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const StatCard = ({ icon, label, value, color, textColor, fill }: any) => (
  <View style={[styles.statCard, { backgroundColor: color }]}>
    <MaterialCommunityIcons name={icon} size={32} color={textColor} />
    <View>
      <Text style={[styles.statValue, { color: textColor }]}>{value.toString().padStart(2, '0')}</Text>
      <Text style={[styles.statLabel, { color: textColor }]}>{label}</Text>
    </View>
  </View>
);

const ReviewItem = ({ entry, theme }: any) => {
  const getStatusConfig = () => {
    switch (entry.status) {
      case AttendanceStatus.Present: return { label: 'PRESENT', color: theme.present };
      case AttendanceStatus.Late: return { label: 'LATE', color: theme.late };
      case AttendanceStatus.Absent: return { label: 'ABSENT', color: theme.absent };
      default: return { label: 'NONE', color: theme.tonalLayerLow };
    }
  };
  const config = getStatusConfig();

  return (
    <View style={styles.reviewItem}>
      <View style={styles.memberInfo}>
        <Image
          source={{ uri: `https://ui-avatars.com/api/?name=${entry.memberFirstName}+${entry.memberLastName}&background=random` }}
          style={styles.avatar}
        />
        <View>
          <Text style={[styles.memberName, { color: theme.text }]}>{entry.memberFirstName} {entry.memberLastName}</Text>
          <Text style={[styles.memberMeta, { color: theme.subText }]}>ID: {entry.memberId.substring(0, 8)}</Text>
        </View>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: config.color }]}>
        <Text style={[styles.statusBadgeText, { color: theme.text }]}>{config.label}</Text>
      </View>
    </View>
  );
};

const IconButton = ({ icon, theme }: any) => (
  <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.surfaceContainerHigh }]}>
    <MaterialCommunityIcons name={icon} size={20} color={theme.text} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  closeButton: {
    padding: 8
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5
  },
  headerBadge: {
    borderLeftWidth: 2,
    borderLeftColor: Palette.surfaceContainerHigh,
    paddingLeft: 12
  },
  headerBadgeText: {
    fontFamily: 'Manrope',
    fontWeight: '800',
    fontSize: 16
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 160
  },
  heroSection: {
    marginBottom: Spacing.xl
  },
  heroLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 4
  },
  heroTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    fontFamily: 'Manrope',
    letterSpacing: -1,
    flex: 1
  },
  sessionIdBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.lg
  },
  sessionIdText: {
    fontSize: 12,
    fontWeight: '600'
  },
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: Spacing.xl
  },
  statCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 32,
    padding: 24,
    justifyContent: 'space-between'
  },
  statValue: {
    fontSize: 56,
    fontWeight: '900',
    fontFamily: 'Manrope',
    letterSpacing: -2
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.8
  },
  listContainer: {
    borderRadius: 40,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  listTitle: {
    fontSize: 24,
    fontWeight: '800',
    fontFamily: 'Manrope'
  },
  listActions: {
    flexDirection: 'row',
    gap: 8
  },
  iconButton: {
    padding: 12,
    borderRadius: 16
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24
  },
  memberName: {
    fontSize: 18,
    fontWeight: '800'
  },
  memberMeta: {
    fontSize: 14,
    fontWeight: '500'
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 100
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1
  },
  viewMoreButton: {
    width: '100%',
    marginTop: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  viewMoreText: {
    fontWeight: '800',
    fontSize: 14
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg
  },
  footerBlur: {
    borderRadius: 40,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20
  },
  footerActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12
  },
  modifyButton: {
    flex: 1,
    height: 56,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  modifyButtonText: {
    fontWeight: '800',
    fontSize: 14
  },
  saveButtonContainer: {
    flex: 2
  },
  saveButton: {
    height: 56,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  saveButtonText: {
    fontWeight: '800',
    fontSize: 14
  },
  footerDisclaimer: {
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 2
  },
});

export default SessionSummaryScreen;