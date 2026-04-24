import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  StatusBar,
  useColorScheme,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { TimeInput } from '@/src/core/components/TimeInput';
import { useAppDispatch, useAppSelector } from '../../../core/hooks/useRedux';
import { Palette, Colors, Spacing, Radius } from '@/src/core/constants/Theme';
import { updateActiveEntryStatus, updateSessionTimes } from '../store/rollcallSlice';
import { AttendanceStatus, RollcallEntryResponseDto } from '../types/Rollcall';
import { ProfileButton } from '@/src/core/components/ProfileButton';
import { ExecutiveBackButton } from '@/src/core/components/ExecutiveBackButton';
import { Modal } from 'react-native';
import { getProfileImageUri } from '@/src/core/utils/imageUtils';

const LiveRollcallScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [isTimeModalVisible, setTimeModalVisible] = useState(false);
  const { activeRollcall } = useAppSelector((state) => state.rollcalls);

  const [tempTimes, setTempTimes] = useState({
    start: activeRollcall?.startTime || '08:00',
    end: activeRollcall?.endTime || '09:30'
  });

  const metrics = useMemo(() => {

    if (!activeRollcall) {
      return { marked: 0, total: 0, remaining: 0 };
    }
    const total = activeRollcall.entries.length;
    const marked = activeRollcall.entries.filter((e: RollcallEntryResponseDto) => e.status !== AttendanceStatus.None).length;

    return { marked, total, remaining: total - marked };
  }, [activeRollcall]);

  const handleStatusUpdate = (memberId: string, status: AttendanceStatus) => {
    dispatch(updateActiveEntryStatus({ memberId, status }));
  };

  const handleTimeEdit = () => setTimeModalVisible(true);

  const handleSaveTimes = () => {
    dispatch(updateSessionTimes({ startTime: tempTimes.start, endTime: tempTimes.end }));
    setTimeModalVisible(false);
  };

  const renderMember = ({ item }: { item: RollcallEntryResponseDto }) => {
    const isMarked = item.status !== AttendanceStatus.None;
    const isAbsent = item.status === AttendanceStatus.Absent;
    const isPresent = item.status === AttendanceStatus.Present;
    const isLate = item.status === AttendanceStatus.Late;

    return (
      <View style={[
        styles.memberCard,
        { backgroundColor: isMarked ? `${theme.primary}0D` : theme.cardBase },
      ]}>

        {/* Information Block */}
        <View style={styles.memberInfo}>
          <View style={[styles.avatar, { backgroundColor: theme.tonalLayerLow }]}>
            {item.profileImageUrl ? (
              <Image
                source={{ uri: getProfileImageUri(item.profileImageUrl) || '' }}
                style={[styles.avatarImage, isAbsent && { opacity: 0.3 }]}
              />
            ) : (
              <Text style={[styles.avatarText, { color: theme.primary }]}>
                {item.memberFirstName?.[0]}{item.memberLastName?.[0]}
              </Text>
            )}
          </View>

          <View style={styles.textContainer}>
            <Text
              style={[styles.memberName, { color: theme.text }, isAbsent && styles.absentText]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.memberFirstName} {item.memberLastName}
            </Text>
            <Text style={[styles.memberIdText, { color: theme.accent }]} numberOfLines={1}>
              {item.externalId || "ID NOT ASSIGNED"}
            </Text>
          </View>
        </View>

        {/* Status Indicator: Only takes space when active */}
        {(isPresent || isLate) && (
          <View style={styles.statusIndicatorWrapper}>
            {isPresent && <MaterialCommunityIcons name="check-circle" size={28} color="#2e7d32" />}
            {isLate && <MaterialCommunityIcons name="clock-outline" size={28} color={theme.accent} />}
          </View>
        )}

        {/* Action Area */}
        {isMarked ? (
          <TouchableOpacity
            style={[styles.undoButton, { backgroundColor: theme.primaryContainer }]}
            onPress={() => handleStatusUpdate(item.memberId, AttendanceStatus.None)}
          >
            <Text style={styles.undoText}>UNDO</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.actionGroup}>
            <StatusButton
              label="P"
              color={theme.present}
              textColor={theme.primary}
              onPress={() => handleStatusUpdate(item.memberId, AttendanceStatus.Present)}
              theme={theme}
            />
            <StatusButton
              label="A"
              color={theme.absent}
              textColor={Palette.onSurface}
              onPress={() => handleStatusUpdate(item.memberId, AttendanceStatus.Absent)}
              theme={theme}
            />
            <StatusButton
              label="L"
              color={theme.late}
              textColor={theme.accent}
              onPress={() => handleStatusUpdate(item.memberId, AttendanceStatus.Late)}
              theme={theme}
            />
          </View>
        )}
      </View>
    );
  };

  if (!activeRollcall) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      <View style={styles.header}>
        <View style={styles.headerLeadingRow}>
          <View style={styles.headerLeading}>
            <ExecutiveBackButton onPress={() => router.back()} />
            <View style={styles.headerTitles}>
              <Text style={[styles.ledgerLabel, { color: theme.subText }]}>LIVE ROLLCALL</Text>
              <Text style={[styles.ledgerTitle, { color: theme.primary }]} numberOfLines={1}>
                Take A Rollcall
              </Text>
            </View>
          </View>
          <ProfileButton />
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Text style={[styles.metricLabel, { color: theme.subText }]}>REMAINING</Text>
            <Text style={[styles.metricValue, { color: theme.primary }]}>{metrics.remaining}</Text>
          </View>
          <View style={[styles.metricDivider, { backgroundColor: theme.outline }]} />
          <View style={styles.metricItem}>
            <Text style={[styles.metricLabel, { color: theme.subText }]}>MARKED</Text>
            <Text style={[styles.metricValue, { color: theme.primary }]}>{metrics.marked}/{metrics.total}</Text>
          </View>

          {/* Editable Session Timing */}
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={[styles.metricLabel, { color: theme.subText }]}>SESSION WINDOW</Text>
            <TouchableOpacity style={styles.timeSelector} onPress={handleTimeEdit}>
              <Text style={[styles.timeValue, { color: theme.primary }]}>
                {activeRollcall.startTime || '08:00'} - {activeRollcall.endTime || '09:30'}
              </Text>
              <MaterialCommunityIcons name="pencil" size={12} color={theme.subText} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        data={activeRollcall.entries}
        renderItem={renderMember}
        keyExtractor={(item) => item.memberId}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/rollcalls/summary')}>
          <LinearGradient
            colors={[theme.primary, theme.primaryContainer]}
            style={styles.completeButton}
          >
            <MaterialCommunityIcons name="check-circle" size={20} color={theme.onPrimary} />
            <Text style={[styles.completeButtonText, { color: theme.onPrimary }]}>COMPLETE ROLLCALL</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isTimeModalVisible}
        onRequestClose={() => setTimeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBase }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.primary }]}>Configure Session</Text>
              <TouchableOpacity onPress={() => setTimeModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={theme.subText} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalLabel, { color: theme.subText }]}>SESSION WINDOW</Text>

            <View style={styles.timeInputsRow}>
              <TimeInput
                label="START"
                value={tempTimes.start}
                onChange={(val: string) => setTempTimes(prev => ({ ...prev, start: val }))}
                theme={theme}
              />

              <View style={[styles.timeConnector, { backgroundColor: theme.outline }]} />

              <TimeInput
                label="END"
                value={tempTimes.end}
                onChange={(val: string) => setTempTimes(prev => ({ ...prev, end: val }))}
                theme={theme}
              />
            </View>

            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: theme.primary }]}
              onPress={handleSaveTimes}
            >
              <Text style={[styles.confirmButtonText, { color: theme.onPrimary }]}>Update Window</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const StatusButton = ({ label, color, textColor, onPress, theme }: any) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed, hovered }: any) => [
        styles.statusBtn,
        {
          backgroundColor: color,
          opacity: (pressed || hovered) ? 0.8 : 1,
          transform: [{ scale: (pressed || hovered) ? 0.96 : 1 }],
          cursor: 'pointer'
        } as any
      ]}
    >
      <Text style={[styles.statusBtnText, { color: textColor }]}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: 120,
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
    textTransform: 'uppercase',
  },
  ledgerTitle: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 24,
    marginTop: -2,
  },
  metricsRow: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  metricItem: {
    marginRight: Spacing.lg,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '900',
    marginTop: -2,
  },
  metricDivider: {
    width: 1,
    height: 32,
    marginRight: Spacing.lg,
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  memberCard: {
    padding: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 80,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarText: {
    fontFamily: 'Manrope-Bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  memberName: {
    fontFamily: 'Manrope-Bold',
    fontSize: 15,
    lineHeight: 20,
  },
  memberIdText: {
    fontFamily: 'Inter-Bold',
    fontSize: 11,
    marginTop: 1,
    opacity: 0.6,
  },
  absentText: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  statusIndicatorWrapper: {
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  statusBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusBtnText: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 18,
  },
  undoButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
  },
  undoText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: Spacing.lg,
    right: Spacing.lg,
  },
  completeButton: {
    height: 64,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  completeButtonText: {
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(4, 23, 44, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.xl,
    paddingBottom: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 20,
    letterSpacing: -0.5,
  },
  modalLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    letterSpacing: 1.5,
    marginBottom: Spacing.md,
  },
  timeInputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  timeConnector: {
    width: 20,
    height: 2,
    opacity: 0.3,
    marginTop: 20,
  },
  confirmButton: {
    height: 56,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontFamily: 'Manrope-Bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default LiveRollcallScreen;