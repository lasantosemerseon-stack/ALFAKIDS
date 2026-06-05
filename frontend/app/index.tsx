import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const LOGO_SEM_FUNDO = 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/cz5cen1e_logo%20fundo.png';

export default function Index() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Animated.View entering={FadeInUp.duration(700)} style={styles.heroSection}>
        <Image source={{ uri: LOGO_SEM_FUNDO }} style={styles.logo} resizeMode="contain" />
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
          testID="login-btn"
          style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/login')}
          activeOpacity={0.8}
        >
          <Ionicons name="log-in" size={20} color="#fff" />
          <Text style={styles.primaryBtnText}>ENTRAR</Text>
        </TouchableOpacity>
      </Animated.View>

      <Text style={[styles.footer, { color: colors.textSecondary }]}>© 2026 alfakids - Diversão e Aprendizado</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  heroSection: { alignItems: 'center', marginBottom: 16 },
  logo: { width: 220, height: 100 },
  titleSection: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 24, fontWeight: '900', letterSpacing: 4, textAlign: 'center' },
  lineRow: { flexDirection: 'row', gap: 4, marginVertical: 12 },
  line: { width: 40, height: 2.5, borderRadius: 2 },
  tagline: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
  buttonsContainer: { width: '100%', maxWidth: 320, gap: 14 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18, borderRadius: 16 },
  primaryBtnText: { color: '#fff', fontSize: 17, fontWeight: '900', letterSpacing: 2 },
  outlineBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 16, borderWidth: 1.5 },
  outlineBtnText: { fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  footer: { position: 'absolute', bottom: 20, fontSize: 11 },
});
