import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius } from '../../constants/Theme';
import { ExecutiveButton } from '../../components/ui/ExecutiveButton';

export const LandingScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>ENTERPRISE GRADE</Text>
        </View>

        {/* Hero Title */}
        <Text style={styles.heroTitle}>Rollcall,{"\n"}redefined.</Text>
        
        <Text style={styles.subText}>
          Precision attendance tracking built for modern organizations. Android-first, executive-grade.
        </Text>

        {/* CTA Stack */}
        <View style={styles.ctaStack}>
          <ExecutiveButton title="Get Started" onPress={() => {}} />
          <View style={{ height: Spacing.sm }} />
          <ExecutiveButton title="Watch Demo" variant="secondary" onPress={() => {}} />
        </View>

        {/* Feature Card: Fast Attendance */}
        <View style={styles.featureCard}>
          <Text style={styles.featureLabel}>CORE CAPABILITY</Text>
          <View style={styles.cardContent}>
             <Text style={styles.cardTitle}>Fast Attendance</Text>
             <Text style={styles.cardDesc}>
               Swift-action marking system designed for large groups. Three taps for Present, Absent, or Late.
             </Text>
             
             {/* Attendance Toggle Mockup the Tonal Layering */}
             <View style={styles.toggleRow}>
               <View style={[styles.statusBox, { backgroundColor: Colors.present }]}>
                 <Text style={styles.statusText}>Present</Text>
               </View>
               <View style={[styles.statusBox, { backgroundColor: Colors.late }]}>
                 <Text style={styles.statusText}>Late</Text>
               </View>
               <View style={[styles.statusBox, { backgroundColor: Colors.absent }]}>
                 <Text style={styles.statusText}>Absent</Text>
               </View>
             </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  scrollContent: { padding: Spacing.lg },
  badge: {
    backgroundColor: Colors.present,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.lg,
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  badgeText: { color: Colors.primary, fontFamily: 'Inter-Bold', fontSize: 12 },
  heroTitle: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 48,
    color: Colors.primary,
    lineHeight: 56,
  },
  subText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: Colors.onSurfaceVariant,
    marginTop: Spacing.sm,
    lineHeight: 28,
  },
  cardContent: {
    marginTop: Spacing.sm,
  },
  ctaStack: { marginTop: Spacing.xl, width: '100%' },
  featureCard: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
  },
  featureLabel: { color: Colors.onSurfaceVariant, fontSize: 12, letterSpacing: 2, marginBottom: Spacing.sm },
  cardTitle: { fontFamily: 'Manrope-Bold', fontSize: 24, color: Colors.primary },
  cardDesc: { color: Colors.onSurfaceVariant, fontSize: 14, marginTop: 4 },
  toggleRow: { flexDirection: 'row', gap: 8, marginTop: Spacing.md },
  statusBox: { flex: 1, height: 60, borderRadius: Radius.lg, justifyContent: 'center', alignItems: 'center' },
  statusText: { fontFamily: 'Inter-Bold', fontSize: 10, color: Colors.primary },
});