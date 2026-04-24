import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AttendanceStatus, RollcallEntryResponseDto } from '../types/Rollcall';
import { getProfileImageUri } from '@/src/core/utils/imageUtils';

interface ReviewItemProps {
  entry: RollcallEntryResponseDto;
  theme: any;
  isLast: boolean;
  onPress: () => void;
}

export const ReviewItem = ({ entry, theme, isLast, onPress }: ReviewItemProps) => {
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
    <TouchableOpacity
      style={[
        styles.reviewItem,
        isLast && { borderBottomWidth: 0 }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.memberInfo}>
        <View style={[styles.avatar, { backgroundColor: theme.tonalLayerLow }]}>
          {entry.profileImageUrl ? (
            <Image
              source={{ uri: getProfileImageUri(entry.profileImageUrl) || '' }}
              style={styles.avatarImage}
            />
          ) : (
            <Text style={[styles.avatarInitials, { color: theme.primary }]}>
              {entry.memberFirstName?.[0]}{entry.memberLastName?.[0]}
            </Text>
          )}
        </View>
        <View>
          <Text style={[styles.memberName, { color: theme.text }]}>
            {entry.memberFirstName} {entry.memberLastName}
          </Text>
          <Text style={[styles.memberId, { color: theme.accent }]}>
            {entry.externalId || "NO ID"}
          </Text>
        </View>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: config.color }]}>
        <Text style={[styles.statusBadgeText, { color: theme.text }]}>{config.label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(196, 198, 205, 0.15)',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    fontFamily: 'Manrope-Bold',
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
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.5,
  },
});