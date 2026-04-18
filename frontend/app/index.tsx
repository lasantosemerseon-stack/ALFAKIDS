import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import { useAuth } from '../src/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/8lneoeq1_LOGO%20KIDS%20ALFA.jpeg';
const MASCOT_URL = 'https://static.prod-images.emergentagent.com/jobs/ac182c3c-c918-4b1d-b4ee-4df3aec12d34/images/958755e7930dbc405da4d1f7010f7927192346d880987c5e44402d5aad6ad5d5.png';

export default function Index() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, accessMode } = useAuth();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Decorative elements */}
      <View style={[styles.glowOrb, { backgroundColor: colors.secondary, top: -80, right: -80 }]} />
      <View style={[styles.glowOrb, { backgroundColor: colors.primary, bottom: -60, left: -60, opacity: 0.05 }]} />

      <Animated.View entering={FadeInUp.duration(700)} style={styles.heroSection}>
        <Image source={{ uri: MASCOT_URL }} style={styles.mascot} resizeMode="contain" />
        <Image source={{ uri: LOGO_URL }} style={styles.logo} resizeMode="contain" />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300).duration(700)} style={styles.titleSection}>
        <Text style={[styles.title, { color: colors.primary }]}>DIVERSÃO E</Text>
        <Text style={[styles.title, { color: colors.secondary }]}>APRENDIZADO</Text>
        <View style={[styles.goldenLine, { backgroundColor: colors.primary }]} />
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>
          Música, Alfabetização e Inglês para seus filhos
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(600).duration(700)} style={styles.buttonsContainer}>
        <TouchableOpacity
          testID="explore-free-btn"
          style={[styles.primaryBtn, { backgroundColor: colors.secondary }]}
          onPress={() => router.push('/(tabs)/musica')}
          activeOpacity={0.8}
        >
          <Ionicons name="musical-notes" size={20} color="#0D0D0D" />
          <Text style={styles.primaryBtnText}>Explorar Grátis</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="login-premium-btn"
          style={[styles.outlineBtn, { borderColor: colors.primary }]}
          onPress={() => router.push('/login?mode=premium')}
          activeOpacity={0.7}
        >
          <Ionicons name="diamond" size={18} color={colors.primary} />
          <Text style={[styles.outlineBtnText, { color: colors.primary }]}>Acesso Premium</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="login-alfa-btn"
          style={[styles.outlineBtn, { borderColor: '#7C3AED' }]}
          onPress={() => router.push('/login?mode=alfa')}
          activeOpacity={0.7}
        >
          <Ionicons name="book" size={18} color="#7C3AED" />
          <Text style={[styles.outlineBtnText, { color: '#7C3AED' }]}>Alfabetização Interativa</Text>
        </TouchableOpacity>

        <TouchableOpacity testID="view-plans-btn" onPress={() => router.push('/plans')}>
          <Text style={[styles.plansText, { color: colors.textSecondary }]}>Ver Planos e Preços →</Text>
        </TouchableOpacity>
      </Animated.View>

      <Text style={[styles.footer, { color: colors.textSecondary }]}>© 2026 alfakids - Diversão e Aprendizado</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  glowOrb: { position: 'absolute', width: 200, height: 200, borderRadius: 100, opacity: 0.03 },
  heroSection: { alignItems: 'center', marginBottom: 12 },
  mascot: { width: 120, height: 120, marginBottom: 4 },
  logo: { width: 160, height: 60 },
  titleSection: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: 4, textAlign: 'center' },
  goldenLine: { width: 160, height: 1.5, marginVertical: 12, borderRadius: 1, opacity: 0.5 },
  tagline: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
  buttonsContainer: { width: '100%', maxWidth: 320, gap: 12 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 16 },
  primaryBtnText: { color: '#0D0D0D', fontSize: 16, fontWeight: '800' },
  outlineBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 15, borderRadius: 16, borderWidth: 1.5 },
  outlineBtnText: { fontSize: 15, fontWeight: '600' },
  plansText: { fontSize: 13, textAlign: 'center', marginTop: 4, textDecorationLine: 'underline' },
  footer: { position: 'absolute', bottom: 20, fontSize: 11 },
});
