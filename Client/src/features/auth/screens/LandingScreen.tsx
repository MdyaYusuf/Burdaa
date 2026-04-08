import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius } from '../../../core/constants/Theme';
import { ExecutiveButton } from '../../../core/components/ExecutiveButton';
import { useRouter } from 'expo-router';

const theme = Colors.light;

export const LandingScreen = () => {
  const router = useRouter(); //
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>ENTERPRISE GRADE</Text>
        </View>

        {/* Hero Title */}
        <Text style={styles.heroTitle}>Rollcall,{"\n"}redefined.</Text>
        
        <Text style={styles.subText}>
          Precision attendance tracking built for modern organizations. Android-first, executive-grade.
        </Text>

        {/* Call to Action Stack */}
        <View style={styles.ctaStack}>
          <ExecutiveButton 
            title="Get Started" 
            onPress={() => router.push('/(auth)/register')} 
          />
          <View style={{ height: Spacing.sm }} />
          <ExecutiveButton 
            title="Watch Demo" 
            variant="secondary" 
            onPress={() => { /* Future demo logic */ }} 
          />
        </View>

        {/* Feature Card: Tonal Layering Stacked Paper Model */}
        <View style={styles.featureCard}>
          <Text style={styles.featureLabel}>CORE CAPABILITY</Text>
          <View style={styles.cardContent}>
             <Text style={styles.cardTitle}>Fast Attendance</Text>
             <Text style={styles.cardDesc}>
               Swift-action marking system designed for large groups. Three taps for Present, Absent, or Late.
             </Text>
             
             {/* Attendance Toggle: Fixed heights for touch friendly interaction */}
             <View style={styles.toggleRow}>
               <View style={[styles.statusBox, { backgroundColor: theme.present }]}>
                 <Text style={styles.statusText}>Present</Text>
               </View>
               <View style={[styles.statusBox, { backgroundColor: theme.late }]}>
                 <Text style={styles.statusText}>Late</Text>
               </View>
               <View style={[styles.statusBox, { backgroundColor: theme.absent }]}>
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
  container: { 
    flex: 1, 
    backgroundColor: theme.background
  },
  scrollContent: { 
    padding: Spacing.lg 
  },
  badge: {
    backgroundColor: theme.present,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.lg,
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  badgeText: { 
    color: theme.primary, 
    fontFamily: 'Inter-Bold', 
    fontSize: 12 
  },
  heroTitle: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 48,
    color: theme.primary,
    lineHeight: 56,
  },
  subText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: theme.subText,
    marginTop: Spacing.sm,
    lineHeight: 28,
  },
  cardContent: {
    marginTop: Spacing.sm,
  },
  ctaStack: { 
    marginTop: Spacing.xl, 
    width: '100%' 
  },
  featureCard: {
    marginTop: Spacing.xl,
    backgroundColor: theme.cardBase,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  featureLabel: { 
    color: theme.subText, 
    fontSize: 12, 
    letterSpacing: 2, 
    marginBottom: Spacing.sm 
  },
  cardTitle: { 
    fontFamily: 'Manrope-Bold', 
    fontSize: 24, 
    color: theme.primary 
  },
  cardDesc: { 
    color: theme.subText, 
    fontSize: 14, 
    marginTop: 4 
  },
  toggleRow: { 
    flexDirection: 'row', 
    gap: 8, 
    marginTop: Spacing.md 
  },
  statusBox: { 
    flex: 1, 
    height: 60, 
    borderRadius: Radius.lg, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  statusText: { 
    fontFamily: 'Inter-Bold', 
    fontSize: 10, 
    color: theme.primary 
  },
});