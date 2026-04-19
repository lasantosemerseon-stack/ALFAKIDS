import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const NEW_LOGO = 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/j41hwonf_Design%20sem%20nome%20%285%29.png';
const MASCOT_URL = 'https://static.prod-images.emergentagent.com/jobs/ac182c3c-c918-4b1d-b4ee-4df3aec12d34/images/958755e7930dbc405da4d1f7010f7927192346d880987c5e44402d5aad6ad5d5.png';

export default function Index() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Animated.View entering={FadeInUp.duration(700)} style={styles.heroSection}>
        <Image source={{ uri: MASCOT_URL }} style={styles.mascot} resizeMode="contain" />
        <Image source={{ uri: NEW_LOGO }} style={styles.logo} resizeMode="contain" />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300).duration(700)} style={styles.titleSection}>
        <Text style={[styles.title, { color: colors.primary }]}>DIVERSÃO E</Text>
        <Text style={[styles.title, { color: colors.secondary }]}>APRENDIZADO</Text>
        <View style={styles.lineRow}>
          <View style={[styles.line, { backgroundColor: colors.primary }]} />
          <View style={[styles.line, { backgroundColor: colors.accent }]} />
          <View style={[styles.line, { backgroundColor: colors.secondary }]} />
        </View>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>
          Música, Alfabetização e Inglês para seus filhos
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(600).duration(700)} style={styles.buttonsContainer}>
        <TouchableOpacity
          testID="explore-free-btn"
          style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/(tabs)/musica')}
          activeOpacity={0.8}
        >
          <Ionicons name="musical-notes" size={20} color="#fff" />
          <Text style={[styles.primaryBtnText, { color: '#fff' }]}>Explorar Grátis</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="login-premium-btn"
          style={[styles.outlineBtn, { borderColor: colors.secondary }]}
          onPress={() => router.push('/login?mode=premium')}
          activeOpacity={0.7}
        >
          <Ionicons name="diamond" size={18} color={colors.secondary} />
          <Text style={[styles.outlineBtnText, { color: colors.secondary }]}>Acesso Premium</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="login-alfa-btn"
          style={[styles.outlineBtn, { borderColor: colors.accentPurple }]}
          onPress={() => router.push('/login?mode=alfa')}
          activeOpacity={0.7}
        >
          <Ionicons name="book" size={18} color={colors.accentPurple} />
          <Text style={[styles.outlineBtnText, { color: colors.accentPurple }]}>Alfabetização Interativa</Text>
        </TouchableOpacity>

        <TouchableOpacity testID="view-plans-btn" onPress={() => router.push('/plans')}>
          <Text style={[styles.plansText, { color: colors.accent }]}>Ver Planos e Preços →</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.linksSection}>
        <Text style={[styles.linksTitle, { color: colors.textSecondary }]}>Links de Acesso:</Text>
        <Text style={[styles.linkItem, { color: colors.primary }]}>Free: /</Text>
        <Text style={[styles.linkItem, { color: colors.secondary }]}>Premium: /login?mode=premium</Text>
        <Text style={[styles.linkItem, { color: colors.accentPurple }]}>Alfa: /login?mode=alfa</Text>
      </View>

      <Text style={[styles.footer, { color: colors.textSecondary }]}>© 2026 alfakids - Diversão e Aprendizado</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  heroSection: { alignItems: 'center', marginBottom: 8 },
  mascot: { width: 110, height: 110, marginBottom: 4 },
  logo: { width: 180, height: 70 },
  titleSection: { alignItems: 'center', marginBottom: 28 },
  title: { fontSize: 24, fontWeight: '800', letterSpacing: 4, textAlign: 'center' },
  lineRow: { flexDirection: 'row', gap: 4, marginVertical: 10 },
  line: { width: 40, height: 2, borderRadius: 1 },
  tagline: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
  buttonsContainer: { width: '100%', maxWidth: 320, gap: 12 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 16 },
  primaryBtnText: { fontSize: 16, fontWeight: '800' },
  outlineBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 15, borderRadius: 16, borderWidth: 1.5 },
  outlineBtnText: { fontSize: 15, fontWeight: '600' },
  plansText: { fontSize: 13, textAlign: 'center', marginTop: 4, fontWeight: '600' },
  linksSection: { marginTop: 20, alignItems: 'center' },
  linksTitle: { fontSize: 11, marginBottom: 4 },
  linkItem: { fontSize: 10, fontWeight: '500' },
  footer: { position: 'absolute', bottom: 20, fontSize: 11 },
});
