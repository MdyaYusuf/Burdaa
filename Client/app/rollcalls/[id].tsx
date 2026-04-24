import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  useColorScheme,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Palette } from '@/src/core/constants/Theme';
import { rollcallService } from '@/src/features/rollcalls/services/rollcallService';
import { RollcallResponseDto } from '@/src/features/rollcalls/types/Rollcall';
import { ExecutiveBackButton } from '@/src/core/components/ExecutiveBackButton';
import { ProfileButton } from '@/src/core/components/ProfileButton';
import { StatCard } from '@/src/features/rollcalls/components/StatCard';
import { ReviewItem } from '@/src/features/rollcalls/components/ReviewItem';

export default function RollcallDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [data, setData] = useState<RollcallResponseDto | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const formattedHeroDate = useMemo(() => {

    if (!data?.date) {
      return '-';
    }

    return new Date(data.date).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, [data?.date]);

  // Summary Stats
  const stats = useMemo(() => {

    if (!data) {
      return { total: 0, present: 0, late: 0, absent: 0 };
    }

    const entries = data.entries;

    return {
      total: entries.length,
      present: entries.filter((e) => e.status === 1).length,
      late: entries.filter((e) => e.status === 2).length,
      absent: entries.filter((e) => e.status === 3).length,
    };
  }, [data]);

  const formatTime = (time?: string) => {

    if (!time) {
      return '--:--';
    }
    return time.length > 5 ? time.substring(0, 5) : time;
  };

  if (loading && !data) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeadingRow}>
          <View style={styles.headerLeading}>
            <ExecutiveBackButton onPress={() => router.back()} />
            <View style={styles.headerTitles}>
              <Text style={[styles.ledgerLabel, { color: theme.subText }]}>LEDGER RECORD</Text>
              <Text style={[styles.ledgerTitle, { color: theme.primary }]} numberOfLines={1}>
                Daily Rollcall
              </Text>
            </View>
          </View>
          <ProfileButton />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchDetails} tintColor={theme.primary} />
        }
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={[styles.heroTitle, { color: theme.primary }]}>{formattedHeroDate}</Text>
          <Text style={[styles.groupSubtitle, { color: theme.subText }]}>{data.groupName || "General Roster"}</Text>

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

        {/* Metrics Grid */}
        <View style={styles.bentoRow}>
          <StatCard icon="account-group" label="Enrolled" value={stats.total} color={theme.tonalLayerLow} textColor={theme.primary} />
          <StatCard icon="check-circle" label="Present" value={stats.present} color={theme.present} textColor={theme.primary} />
          <StatCard icon="clock" label="Late" value={stats.late} color={theme.late} textColor={theme.accent} />
          <StatCard icon="close-circle" label="Absent" value={stats.absent} color={theme.absent} textColor="#191c1e" />
        </View>

        {/* Attendance List */}
        <View style={[styles.listContainer, { backgroundColor: theme.cardBase }]}>
          <Text style={[styles.listTitle, { color: theme.primary }]}>Attendance List</Text>
          {data.entries.map((entry, index) => (
            <ReviewItem
              key={entry.memberId}
              entry={entry}
              theme={theme}
              isLast={index === data.entries.length - 1}
              onPress={() => router.push(`/members/${entry.memberId}` as any)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    fontSize: 32,
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
  listContainer: {
    borderRadius: Radius.xl,
    padding: 24,
  },
  listTitle: {
    fontSize: 18,
    fontFamily: 'Manrope-ExtraBold',
    marginBottom: 16,
  },
});