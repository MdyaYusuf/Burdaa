import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius } from '../../../core/constants/Theme';
import { ExecutiveButton } from '../../../core/components/ExecutiveButton';
import { useRouter } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const theme = Colors.light;

export const LandingScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.decorationCircle} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Header */}
        <View style={styles.brandHeader}>
          <View style={styles.logoBox}>
            <MaterialIcons name="fact-check" size={32} color={theme.cardBase} />
          </View>
          <Text style={styles.brandText}>Burdaa</Text>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>ENTERPRISE GRADE</Text>
          </View>
          <Text style={styles.heroTitle}>Rollcall,{"\n"}redefined.</Text>
          <Text style={styles.subText}>
            Precision attendance tracking built for modern organizations. Android-first, executive-grade.
          </Text>
        </View>

        {/* Action Stack */}
        <View style={styles.ctaStack}>
          <ExecutiveButton
            title="Register"
            onPress={() => router.push('/(auth)/register')}
          />
          <View style={{ height: Spacing.sm }} />
          <ExecutiveButton
            title="Login"
            variant="secondary"
            onPress={() => router.push('/(auth)/login')}
          />
        </View>

        {/* Bento Section */}
        <View style={styles.bentoSection}>
          <Text style={styles.featureLabel}>CORE CAPABILITY</Text>

          <View style={styles.mainFeatureCard}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="flash"
                  size={28}
                  color={theme.tint}
                />
              </View>
              <View style={styles.highSpeedBadge}>
                <Text style={styles.highSpeedText}>HIGH SPEED</Text>
              </View>
            </View>
            <Text style={styles.cardTitle}>Fast Attendance</Text>
            <Text style={styles.cardDesc}>
              Swift-action marking system designed for large groups. Three taps for Present, Absent, or Late.
            </Text>

            <View style={styles.toggleRow}>
              <View style={[styles.statusBox, { backgroundColor: theme.present }]}>
                <MaterialCommunityIcons name="check-circle" size={20} color={theme.primary} />
                <Text style={styles.statusText}>Present</Text>
              </View>

              <View style={[styles.statusBox, { backgroundColor: theme.late }]}>
                <MaterialCommunityIcons name="clock-outline" size={20} color={theme.primary} />
                <Text style={styles.statusText}>Late</Text>
              </View>

              <View style={[styles.statusBox, { backgroundColor: theme.absent }]}>
                <MaterialCommunityIcons name="cancel" size={20} color={theme.primary} />
                <Text style={styles.statusText}>Absent</Text>
              </View>
            </View>
          </View>

          <View style={styles.splitGrid}>
            <View style={[styles.gridCard, { backgroundColor: theme.tonalLayerLow }]}>
              <MaterialCommunityIcons name="domain" size={32} color={theme.primary} />
              <View>
                <Text style={styles.gridTitle}>Org Management</Text>
                <Text style={styles.gridDesc}>Scale your hierarchy effortlessly.</Text>
              </View>
            </View>

            <View style={[styles.gridCard, { backgroundColor: theme.surfaceContainerHigh }]}>
              <MaterialCommunityIcons name="chart-timeline-variant" size={32} color={theme.primary} />
              <View>
                <Text style={styles.gridTitle}>Live Insights</Text>
                <Text style={styles.gridDesc}>Real-time stats on your dashboard.</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Metrics Section */}
        <View style={styles.metricsSection}>
          <Text style={styles.hugeMetric}>99.9%</Text>
          <Text style={styles.metricLabel}>UPTIME RELIABILITY</Text>

          <View style={styles.metricGrid}>
            <View style={styles.metricBox}>
              <Text style={styles.metricValue}>1k+</Text>
              <Text style={styles.metricSub}>Active Users</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricValue}>12ms</Text>
              <Text style={styles.metricSub}>Sync Latency</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background
  },
  decorationCircle: {
    position: 'absolute',
    top: -100,
    left: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(4, 23, 44, 0.03)',
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl * 2
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    marginBottom: Spacing.xl
  },
  logoBox: {
    backgroundColor: theme.primary,
    padding: Spacing.sm,
    borderRadius: Radius.lg
  },
  brandText: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 20,
    color: theme.primary,
    letterSpacing: -0.5
  },
  heroSection: {
    marginTop: Spacing.md
  },
  badge: {
    backgroundColor: 'rgba(4, 23, 44, 0.05)',
    paddingHorizontal: Spacing.md - 4,
    paddingVertical: Spacing.xs + 2,
    borderRadius: 999,
    alignSelf: 'flex-start',
    marginBottom: Spacing.md
  },
  badgeText: {
    color: theme.primary,
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    letterSpacing: 1
  },
  heroTitle: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 48,
    color: theme.primary,
    lineHeight: 56,
    letterSpacing: -1.5
  },
  subText: {
    fontFamily: 'Inter-Regular',
    fontSize: 17,
    color: theme.subText,
    marginTop: Spacing.md,
    lineHeight: 26
  },
  ctaStack: {
    marginTop: Spacing.xl,
    width: '100%'
  },
  bentoSection: {
    marginTop: Spacing.xl
  },
  featureLabel: {
    color: theme.subText,
    fontFamily: 'Inter-Bold',
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: Spacing.md
  },
  mainFeatureCard: {
    backgroundColor: theme.cardBase,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md
  },
  iconContainer: {
    backgroundColor: 'rgba(4, 23, 44, 0.05)',
    padding: Spacing.sm + 2,
    borderRadius: Radius.lg
  },
  highSpeedBadge: {
    backgroundColor: 'rgba(4, 23, 44, 0.08)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 6
  },
  highSpeedText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: theme.primary
  },
  cardTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 24,
    color: theme.primary
  },
  cardDesc: {
    fontFamily: 'Inter-Regular',
    color: theme.subText,
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20
  },
  toggleRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg
  },
  statusBox: {
    flex: 1,
    height: 70,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4
  },
  statusText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: theme.primary
  },
  splitGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md
  },
  gridCard: {
    flex: 1,
    height: 180,
    borderRadius: Radius.xl,
    padding: Spacing.lg - 4,
    justifyContent: 'space-between'
  },
  gridTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 16,
    color: theme.primary,
    lineHeight: 20
  },
  gridDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: theme.subText,
    marginTop: 4
  },
  metricsSection: {
    marginTop: Spacing.xl,
    backgroundColor: theme.primaryContainer,
    borderRadius: Radius.xl * 2,
    paddingVertical: Spacing.xl + 16,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center'
  },
  hugeMetric: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 72,
    color: theme.onPrimary,
    letterSpacing: -4
  },
  metricLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: theme.onPrimary,
    letterSpacing: 2,
    opacity: 0.8,
    marginBottom: Spacing.xl
  },
  metricGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%'
  },
  metricBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: Radius.xl,
    padding: Spacing.lg
  },
  metricValue: {
    fontFamily: 'Manrope-Bold',
    fontSize: 32,
    color: theme.onPrimary
  },
  metricSub: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: theme.onPrimary,
    opacity: 0.6,
    marginTop: 4
  }
});