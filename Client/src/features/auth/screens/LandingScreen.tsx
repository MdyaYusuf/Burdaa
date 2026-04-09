import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius } from '../../../core/constants/Theme';
import { ExecutiveButton } from '../../../core/components/ExecutiveButton';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const theme = Colors.light;

export const LandingScreen = () => {
  const router = useRouter(); 
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Background Decoration: Subtle Tonal Shifts */}
      <View style={styles.decorationCircle} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Brand Identity: Unifying with Login Design */}
        <View style={styles.brandHeader}>
          <View style={styles.logoBox}>
            <MaterialIcons name="fact-check" size={32} color="#fff" />
          </View>
          <Text style={styles.brandText}>Burdaa</Text>
        </View>

        {/* Editorial Hero: High-Contrast Sizing */}
        <View style={styles.heroSection}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>ENTERPRISE GRADE</Text>
          </View>
          <Text style={styles.heroTitle}>Rollcall,{"\n"}redefined.</Text>
          <Text style={styles.subText}>
            Precision attendance tracking built for modern organizations. Android-first, executive-grade.
          </Text>
        </View>

        {/* Action Stack: Clear Transactional Paths */}
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

        {/* Feature Card: Tonal Layering */}
        <View style={styles.featureCard}>
          <Text style={styles.featureLabel}>CORE CAPABILITY</Text>
          <View style={styles.cardContent}>
             <Text style={styles.cardTitle}>Fast Attendance</Text>
             <Text style={styles.cardDesc}>
               Swift-action marking system designed for large groups. Three taps for Present, Absent, or Late.
             </Text>
             
             {/* Status Toggle: Boundaries via Color Shifts */}
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
    backgroundColor: '#f8f9fc'
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
    padding: Spacing.lg 
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: Spacing.xl,
  },
  logoBox: {
    backgroundColor: '#04172c',
    padding: 8,
    borderRadius: Radius.lg,
  },
  brandText: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 20,
    color: '#04172c',
    letterSpacing: -0.5,
  },
  heroSection: {
    marginTop: Spacing.md,
  },
  badge: {
    backgroundColor: 'rgba(4, 23, 44, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999, 
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  badgeText: { 
    color: '#04172c', 
    fontFamily: 'Inter-Bold', 
    fontSize: 10,
    letterSpacing: 1,
  },
  heroTitle: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 48,
    color: '#04172c',
    lineHeight: 56,
    letterSpacing: -1.5,
  },
  subText: {
    fontFamily: 'Inter-Regular',
    fontSize: 17,
    color: '#44474d',
    marginTop: Spacing.md,
    lineHeight: 26,
  },
  ctaStack: { 
    marginTop: Spacing.xl, 
    width: '100%' 
  },
  featureCard: {
    marginTop: Spacing.xl,
    backgroundColor: '#ffffff',
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    shadowColor: '#04172c',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  featureLabel: { 
    color: '#74777d',
    fontFamily: 'Inter-Bold',
    fontSize: 11, 
    letterSpacing: 2, 
    marginBottom: Spacing.sm 
  },
  cardContent: {
    marginTop: Spacing.sm,
  },
  cardTitle: { 
    fontFamily: 'Manrope-Bold', 
    fontSize: 24, 
    color: '#04172c' 
  },
  cardDesc: { 
    fontFamily: 'Inter-Regular',
    color: '#44474d', 
    fontSize: 14, 
    marginTop: 4,
    lineHeight: 20,
  },
  toggleRow: { 
    flexDirection: 'row', 
    gap: 12, 
    marginTop: Spacing.lg 
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
    color: '#04172c' 
  },
});