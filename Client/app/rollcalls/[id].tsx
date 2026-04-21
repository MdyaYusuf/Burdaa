import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Palette } from '@/src/core/constants/Theme';
import { rollcallService } from '@/src/features/rollcalls/services/rollcallService';
import { AttendanceStatus, RollcallResponseDto, RollcallEntryResponseDto } from '@/src/features/rollcalls/types/Rollcall';
import { ExecutiveBackButton } from '@/src/core/components/ExecutiveBackButton';
import { ProfileButton } from '@/src/core/components/ProfileButton';
import { router } from 'expo-router';

const IMAGE_BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export default function RollcallDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<RollcallResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    const fetchDetails = async () => {

      if (id) {
        setLoading(true);
        const response = await rollcallService.getById(id);

        if (response.success) {
          setData(response.data);
        }
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const stats = useMemo(() => {

    if (!data) {
      return { total: 0, present: 0, late: 0, absent: 0 };
    }
    const entries = data.entries;
    return {
      total: entries.length,
      present: entries.filter((e) => e.status === AttendanceStatus.Present).length,
      late: entries.filter((e) => e.status === AttendanceStatus.Late).length,
      absent: entries.filter((e) => e.status === AttendanceStatus.Absent).length,
    };
  }, [data]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.subText }]}>Retrieving Ledger Record...</Text>
      </View>
    );
  }

  const formatTime = (time?: string) => {

    if (!time) {
      return '--:--';
    }
    return time.length > 5 ? time.substring(0, 5) : time;
  };

  if (!data) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      {/* Header Row */}
      <View style={styles.header}>
        <View style={styles.headerLeadingRow}>
          <View style={styles.headerLeading}>
            <ExecutiveBackButton onPress={() => router.back()} />
            <View style={styles.headerTitles}>
              <Text style={[styles.ledgerLabel, { color: theme.subText }]}>LEDGER RECORD</Text>
              <Text style={[styles.ledgerTitle, { color: theme.primary }]} numberOfLines={1}>
                {new Date(data.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </Text>
            </View>
          </View>
          <ProfileButton />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Session Metadata */}
        <View style={styles.heroSection}>
          <Text style={[styles.heroTitle, { color: theme.primary }]}>{data.title || "Standard Session"}</Text>
          <Text style={[styles.groupSubtitle, { color: theme.subText }]}>
            {data.groupName || "General Roster"}
          </Text>
          <View style={styles.metaRow}>
            <View style={[styles.timeBadge, { backgroundColor: theme.tonalLayerLow }]}>
              <MaterialCommunityIcons name="clock-outline" size={14} color={theme.primary} />
              <Text style={[styles.timeText, { color: theme.primary }]}>
                {formatTime(data.startTime)} - {formatTime(data.endTime)}
              </Text>
            </View>
          </View>

          {data.description && (
            <View style={[styles.noteBox, { backgroundColor: theme.cardBase, borderColor: theme.outline }]}>
              <Text style={[styles.noteLabel, { color: theme.subText }]}>EXECUTIVE NOTE</Text>
              <Text style={[styles.noteText, { color: theme.text }]}>{data.description}</Text>
            </View>
          )}
        </View>

        {/* Bento Grid Stats */}
        <View style={styles.bentoRow}>
          <StatCard icon="account-group" label="Enrolled" value={stats.total} color={theme.tonalLayerLow} textColor={theme.primary} />
          <StatCard icon="check-circle" label="Present" value={stats.present} color={theme.present} textColor={theme.primary} />
          <StatCard icon="clock" label="Late" value={stats.late} color={theme.late} textColor={theme.accent} />
          <StatCard icon="close-circle" label="Absent" value={stats.absent} color={theme.absent} textColor={Palette.onSurface} />
        </View>

        <View style={[styles.listContainer, { backgroundColor: theme.cardBase }]}>
          <Text style={[styles.listTitle, { color: theme.primary }]}>Attendance List</Text>
          {data.entries.map((entry) => (
            <ReviewItem key={entry.memberId} entry={entry} theme={theme} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const StatCard = ({ icon, label, value, color, textColor }: any) => (
  <View style={[styles.statCard, { backgroundColor: color }]}>
    <MaterialCommunityIcons name={icon} size={24} color={textColor} />
    <View>
      <Text style={[styles.statValue, { color: textColor }]}>{value.toString().padStart(2, '0')}</Text>
      <Text style={[styles.statLabel, { color: textColor }]}>{label}</Text>
    </View>
  </View>
);

const ReviewItem = ({ entry, theme }: { entry: RollcallEntryResponseDto; theme: any }) => {
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
        <View style={[styles.avatar, { backgroundColor: theme.tonalLayerLow }]}>
          {entry.profileImageUrl ? (
            <Image source={{ uri: `${IMAGE_BASE_URL}${entry.profileImageUrl}` }} style={styles.avatarImage} />
          ) : (
            <Text style={[styles.avatarInitials, { color: theme.primary }]}>
              {entry.memberFirstName?.[0]}{entry.memberLastName?.[0]}
            </Text>
          )}
        </View>
        <View>
          <Text style={[styles.memberName, { color: theme.text }]}>{entry.memberFirstName} {entry.memberLastName}</Text>
          <Text style={[styles.memberId, { color: theme.accent }]}>{entry.externalId || "NO ID"}</Text>
        </View>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: config.color }]}>
        <Text style={[styles.statusBadgeText, { color: theme.text }]}>{config.label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 60,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerLeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
  },
  headerLeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  headerTitles: {
    flex: 1,
  },
  ledgerLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    letterSpacing: 1.5,
  },
  ledgerTitle: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 22,
    marginTop: -2,
  },
  heroSection: {
    marginBottom: Spacing.lg,
    marginTop: Spacing.md,
  },
  heroTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 28,
    letterSpacing: -1,
  },
  groupSubtitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    marginTop: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.md,
    gap: 6,
  },
  timeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
  },
  noteBox: {
    marginTop: 20,
    padding: 16,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  noteLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 9,
    letterSpacing: 1,
    marginBottom: 4,
  },
  noteText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    lineHeight: 20,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.xl,
    width: '100%',
  },
  statCard: {
    flex: 1,
    aspectRatio: 0.85,
    borderRadius: Radius.lg,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    fontFamily: 'Manrope',
  },
  statLabel: {
    fontSize: 8,
    fontWeight: '700',
    textTransform: 'uppercase',
    opacity: 0.7,
  },
  listContainer: {
    borderRadius: Radius.xl,
    padding: 24,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'Manrope',
    marginBottom: 16,
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    fontFamily: 'Manrope-Bold',
    fontSize: 14,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '800',
    fontFamily: 'Manrope',
  },
  memberId: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});