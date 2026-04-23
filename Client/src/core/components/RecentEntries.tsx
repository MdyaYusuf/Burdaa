import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, Radius } from '@/src/core/constants/Theme';
import { useAppSelector } from '@/src/core/hooks/useRedux';

interface RecentEntriesProps {
  limit?: number;
  showTitle?: boolean;
  groupId?: string;
}

export const RecentEntries = ({ limit = 5, showTitle = true, groupId }: RecentEntriesProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { previews } = useAppSelector((state) => state.rollcalls);

  const filteredPreviews = useMemo(() => {
    const list = groupId
      ? previews.filter(p => p.groupId === groupId)
      : previews;
    return list.slice(0, limit);
  }, [previews, groupId, limit]);

  if (filteredPreviews.length === 0) {
    return (
      <View style={styles.container}>
        {showTitle && <Text style={[styles.sectionTitle, { color: theme.primary }]}>Recent History</Text>}
        <View style={[styles.ledgerCard, { backgroundColor: theme.cardBase }]}>
          <Text style={[styles.comingSoonText, { color: theme.subText }]}>
            {groupId ? "No sessions recorded for this team yet." : "No history found."}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showTitle && (
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>
          {groupId ? "Group History" : "Recent Entries"}
        </Text>
      )}
      <View style={styles.list}>
        {filteredPreviews.map((preview) => (
          <TouchableOpacity
            key={preview.id}
            style={[styles.card, { backgroundColor: theme.cardBase, borderColor: theme.outline }]}
            onPress={() =>
              router.push({
                pathname: '/rollcalls/[id]',
                params: { id: preview.id },
              })
            }
          >
            <View style={[styles.iconBox, { backgroundColor: theme.tonalLayerLow }]}>
              <MaterialCommunityIcons name="calendar-check" size={24} color={theme.primary} />
            </View>

            <View style={styles.details}>
              <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
                {preview.title}
              </Text>
              <Text style={[styles.subtitle, { color: theme.subText }]}>
                {preview.groupName || "General Session"}
              </Text>
            </View>

            <View style={styles.metrics}>
              <Text style={[styles.metricText, { color: '#2e7d32' }]}>P: {preview.totalPresent}</Text>
              <Text style={[styles.metricText, { color: theme.accent }]}>L: {preview.totalLate}</Text>
              <Text style={[styles.metricText, { color: '#ba1a1a' }]}>A: {preview.totalAbsent}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 22,
    marginBottom: Spacing.md,
  },
  list: {
    gap: Spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  title: {
    fontFamily: 'Manrope-Bold',
    fontSize: 16,
  },
  subtitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  metrics: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 1,
  },
  metricText: {
    fontFamily: 'Inter-Bold',
    fontSize: 11,
    lineHeight: 14,
  },
  ledgerCard: {
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  comingSoonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    textAlign: 'center',
  },
});