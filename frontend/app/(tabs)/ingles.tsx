import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function InglesTab() {
  const { colors } = useTheme();
  const { accessMode } = useAuth();
  const router = useRouter();
  const [words, setWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/content/english`)
      .then(r => r.json()).then(setWords).catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  const isLocked = accessMode === 'free';
  const current = words[currentIdx];

  const next = () => {
    setShowTranslation(false);
    setCurrentIdx(prev => (prev + 1) % words.length);
  };

  const prev = () => {
    setShowTranslation(false);
    setCurrentIdx(prev => prev === 0 ? words.length - 1 : prev - 1);
  };

  if (loading) return (
    <View style={[styles.container, { backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  if (isLocked) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', padding: 24 }]}>
        <Ionicons name="lock-closed" size={48} color={colors.textSecondary} />
        <Text style={[styles.lockedText, { color: colors.textSecondary }]}>Conteúdo Premium</Text>
        <Text style={[styles.lockedSub, { color: colors.textSecondary }]}>Desbloqueie para aprender inglês de forma divertida!</Text>
        <TouchableOpacity testID="unlock-english-btn" style={[styles.unlockBtn, { backgroundColor: colors.secondary }]} onPress={() => router.push('/plans')}>
          <Text style={styles.unlockBtnText}>Ver Planos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Text style={[styles.progress, { color: colors.textSecondary }]}>
            {currentIdx + 1} / {words.length}
          </Text>
          <Text style={[styles.categoryLabel, { color: colors.accent }]}>
            {current?.category?.toUpperCase()}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={[styles.flashcard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={styles.emoji}>{current?.emoji}</Text>
          <Text style={[styles.wordEn, { color: colors.secondary }]}>{current?.word_en}</Text>

          {showTranslation ? (
            <Animated.View entering={FadeInDown.duration(300)}>
              <Text style={[styles.wordPt, { color: colors.primary }]}>{current?.word_pt}</Text>
            </Animated.View>
          ) : (
            <TouchableOpacity
              testID="show-translation-btn"
              style={[styles.revealBtn, { borderColor: colors.primary }]}
              onPress={() => setShowTranslation(true)}
            >
              <Text style={[styles.revealText, { color: colors.primary }]}>Toque para ver a tradução</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        <View style={styles.navRow}>
          <TouchableOpacity testID="prev-word-btn" style={[styles.navBtn, { backgroundColor: colors.card }]} onPress={prev}>
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
            <Text style={[styles.navText, { color: colors.text }]}>Anterior</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="next-word-btn" style={[styles.navBtn, { backgroundColor: colors.secondary }]} onPress={next}>
            <Text style={[styles.navText, { color: '#0D0D0D' }]}>Próxima</Text>
            <Ionicons name="chevron-forward" size={24} color="#0D0D0D" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 24, alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 24 },
  progress: { fontSize: 14, fontWeight: '600' },
  categoryLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 2, marginTop: 4 },
  flashcard: { width: '100%', maxWidth: 340, borderRadius: 24, padding: 32, alignItems: 'center', borderWidth: 1, minHeight: 280, justifyContent: 'center' },
  emoji: { fontSize: 64, marginBottom: 20 },
  wordEn: { fontSize: 32, fontWeight: '800', marginBottom: 16 },
  wordPt: { fontSize: 22, fontWeight: '600', marginTop: 8 },
  revealBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, borderWidth: 1 },
  revealText: { fontSize: 14, fontWeight: '500' },
  navRow: { flexDirection: 'row', gap: 12, marginTop: 24, width: '100%', maxWidth: 340 },
  navBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderRadius: 14 },
  navText: { fontSize: 14, fontWeight: '600' },
  lockedText: { fontSize: 20, fontWeight: '700', marginTop: 16 },
  lockedSub: { fontSize: 14, textAlign: 'center', marginTop: 8, marginBottom: 24 },
  unlockBtn: { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 14 },
  unlockBtnText: { color: '#0D0D0D', fontSize: 15, fontWeight: '700' },
});
