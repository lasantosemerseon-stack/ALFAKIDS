import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

function speakWord(word: string) {
  if (Platform.OS !== 'web') return;
  try {
    const synth = (window as any).speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(word);
    utter.lang = 'en-US';
    utter.rate = 0.7;
    utter.volume = 1;
    synth.speak(utter);
  } catch (e) { /* ignore */ }
}

interface WordData {
  word_en: string;
  word_pt: string;
  emoji: string;
  category: string;
  order: number;
}

export default function InglesTab() {
  const { colors } = useTheme();
  const [words, setWords] = useState<WordData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/content/english`)
      .then(r => r.json())
      .then((data: WordData[]) => setWords(data))
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  const current = words[currentIdx];
  // ALWAYS show English word first
  const englishWord = current ? current.word_en : '';
  const portugueseWord = current ? current.word_pt : '';

  const handleReveal = useCallback(() => {
    setShowTranslation(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  }, []);

  const next = () => { setShowTranslation(false); setShowConfetti(false); setCurrentIdx(prev => (prev + 1) % words.length); };
  const prev = () => { setShowTranslation(false); setShowConfetti(false); setCurrentIdx(prev => prev === 0 ? words.length - 1 : prev - 1); };

  const handleSpeak = useCallback(() => {
    if (englishWord) speakWord(englishWord);
  }, [englishWord]);

  if (loading) return (
    <View style={[styles.container, { backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.titleSection}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Aprender em Inglês</Text>
          <View style={styles.titleUnderline}>
            <View style={[styles.underlinePart, { backgroundColor: colors.primary }]} />
            <View style={[styles.underlinePart, { backgroundColor: colors.accent }]} />
            <View style={[styles.underlinePart, { backgroundColor: colors.secondary }]} />
          </View>
        </Animated.View>

        <View style={styles.progressRow}>
          <Text style={[styles.progress, { color: colors.textSecondary }]}>{currentIdx + 1} / {words.length}</Text>
          <Text style={[styles.categoryLabel, { color: colors.primary }]}>{current?.category?.toUpperCase()}</Text>
        </View>

        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={[styles.flashcard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={styles.emoji}>{current?.emoji}</Text>
          {/* ENGLISH word displayed big */}
          <Text style={[styles.wordMain, { color: colors.primary }]}>{englishWord}</Text>

          <TouchableOpacity testID="speak-btn" style={[styles.audioBtn, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]} onPress={handleSpeak}>
            <Ionicons name="volume-high" size={22} color={colors.primary} />
            <Text style={[styles.audioBtnText, { color: colors.primary }]}>Ouvir em Inglês</Text>
          </TouchableOpacity>

          {showTranslation ? (
            <Animated.View entering={ZoomIn.duration(300)} style={styles.translationBox}>
              <Text style={[styles.translationLabel, { color: colors.textSecondary }]}>Em Português:</Text>
              <Text style={[styles.wordTranslation, { color: colors.accent }]}>{portugueseWord}</Text>
              {showConfetti && (
                <Animated.View entering={ZoomIn.duration(400)}>
                  <Text style={styles.confetti}>🎉🎊✨🎉🎊</Text>
                </Animated.View>
              )}
            </Animated.View>
          ) : (
            <TouchableOpacity testID="show-translation-btn" style={[styles.revealBtn, { borderColor: colors.accent, backgroundColor: colors.accent + '10' }]} onPress={handleReveal}>
              <Ionicons name="eye" size={18} color={colors.accent} />
              <Text style={[styles.revealText, { color: colors.accent }]}>Ver Tradução</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        <View style={styles.navRow}>
          <TouchableOpacity testID="prev-word-btn" style={[styles.navBtn, { backgroundColor: colors.card, borderColor: colors.cardBorder, borderWidth: 1 }]} onPress={prev}>
            <Ionicons name="chevron-back" size={22} color={colors.primary} />
            <Text style={[styles.navText, { color: colors.text }]}>Anterior</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="next-word-btn" style={[styles.navBtn, { backgroundColor: colors.primary }]} onPress={next}>
            <Text style={[styles.navText, { color: '#fff' }]}>Próxima</Text>
            <Ionicons name="chevron-forward" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, alignItems: 'center' },
  titleSection: { alignSelf: 'flex-start', marginBottom: 16, width: '100%' },
  sectionTitle: { fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  titleUnderline: { flexDirection: 'row', gap: 4, marginTop: 6 },
  underlinePart: { width: 24, height: 3, borderRadius: 2 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 16 },
  progress: { fontSize: 14, fontWeight: '600' },
  categoryLabel: { fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  flashcard: { width: '100%', borderRadius: 24, padding: 28, alignItems: 'center', borderWidth: 1, minHeight: 300, justifyContent: 'center' },
  emoji: { fontSize: 60, marginBottom: 12 },
  wordMain: { fontSize: 34, fontWeight: '900', marginBottom: 16, letterSpacing: 1, textAlign: 'center' },
  audioBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14, borderWidth: 1.5, marginBottom: 20 },
  audioBtnText: { fontSize: 15, fontWeight: '700' },
  translationBox: { alignItems: 'center', marginTop: 8 },
  translationLabel: { fontSize: 13, fontWeight: '500', marginBottom: 4 },
  wordTranslation: { fontSize: 26, fontWeight: '800' },
  confetti: { fontSize: 28, marginTop: 8 },
  revealBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14, borderWidth: 1.5 },
  revealText: { fontSize: 15, fontWeight: '700' },
  navRow: { flexDirection: 'row', gap: 12, marginTop: 24, width: '100%' },
  navBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderRadius: 14 },
  navText: { fontSize: 15, fontWeight: '700' },
});
