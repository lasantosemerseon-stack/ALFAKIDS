import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import { useAuth } from '../src/contexts/AuthContext';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function Index() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, accessMode } = useAuth();

  useEffect(() => {
    if (user && (accessMode === 'premium' || accessMode === 'alfa')) {
      const timer = setTimeout(() => router.replace('/(tabs)/musica'), 1500);
      return () => clearTimeout(timer);
    }
  }, [user, accessMode]);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Animated.View entering={FadeInUp.duration(800)} style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/8lneoeq1_LOGO%20KIDS%20ALFA.jpeg' }}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(400).duration(800)} style={styles.titleContainer}>
        <Text style={[styles.title, { color: colors.primary }]}>DIVERSÃO E</Text>
        <Text style={[styles.title, { color: colors.secondary }]}>APRENDIZADO</Text>
        <View style={styles.goldenLine} />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(800).duration(800)} style={styles.buttonsContainer}>
        <TouchableOpacity
          testID="explore-free-btn"
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/(tabs)/musica')}
        >
          <Text style={styles.buttonText}>Explorar Grátis</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="login-premium-btn"
          style={[styles.buttonOutline, { borderColor: colors.primary }]}
          onPress={() => router.push('/login?mode=premium')}
        >
          <Text style={[styles.buttonOutlineText, { color: colors.primary }]}>Acesso Premium</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="login-alfa-btn"
          style={[styles.buttonOutline, { borderColor: colors.accent }]}
          onPress={() => router.push('/login?mode=alfa')}
        >
          <Text style={[styles.buttonOutlineText, { color: colors.accent }]}>Alfabetização Interativa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="view-plans-btn"
          style={[styles.plansLink]}
          onPress={() => router.push('/plans')}
        >
          <Text style={[styles.plansText, { color: colors.textSecondary }]}>Ver Planos e Preços</Text>
        </TouchableOpacity>
      </Animated.View>

      <Text style={[styles.footer, { color: colors.textSecondary }]}>© 2026 alfakids - Diversão e Aprendizado</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  logoContainer: { marginBottom: 16 },
  logo: { width: 180, height: 100 },
  titleContainer: { alignItems: 'center', marginBottom: 40 },
  title: { fontFamily: 'System', fontSize: 28, fontWeight: '700', letterSpacing: 3, textAlign: 'center' },
  goldenLine: { width: 200, height: 1, backgroundColor: '#BF9663', marginTop: 12, opacity: 0.6 },
  buttonsContainer: { width: '100%', maxWidth: 320, gap: 14 },
  button: { paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  buttonText: { color: '#0D0D0D', fontSize: 16, fontWeight: '700' },
  buttonOutline: { paddingVertical: 16, borderRadius: 14, alignItems: 'center', borderWidth: 1.5 },
  buttonOutlineText: { fontSize: 16, fontWeight: '600' },
  plansLink: { paddingVertical: 8, alignItems: 'center' },
  plansText: { fontSize: 14, textDecorationLine: 'underline' },
  footer: { position: 'absolute', bottom: 20, fontSize: 11 },
});
