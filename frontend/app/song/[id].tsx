import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { WebView } from 'react-native-webview';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const INSTRUMENT_META: Record<string, { label: string; icon: string; color: string }> = {
  piano: { label: 'Piano', icon: 'musical-note', color: '#BF9663' },
  violao: { label: 'Violão', icon: 'guitar', color: '#D97016' },
  flauta: { label: 'Flauta', icon: 'mic', color: '#22C55E' },
  bateria: { label: 'Bateria', icon: 'disc', color: '#2563EB' },
  baixo: { label: 'Baixo', icon: 'radio', color: '#9D4CDD' },
  pandeiro: { label: 'Pandeiro', icon: 'ellipse', color: '#F59E0B' },
  violino: { label: 'Violino', icon: 'pulse', color: '#EC4899' },
};

export default function SongPlayer() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [song, setSong] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeInstruments, setActiveInstruments] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showFireworks, setShowFireworks] = useState(false);
  const [score, setScore] = useState(0);
  const timerRef = useRef<any>(null);
  const scoreRef = useRef(0);

  useEffect(() => {
    if (id) {
      fetch(`${API_URL}/api/songs/${id}`)
        .then(r => r.json()).then(data => {
          setSong(data);
          setActiveInstruments(new Set(data.instruments || []));
        }).catch(console.log)
        .finally(() => setLoading(false));
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [id]);

  useEffect(() => {
    if (isPlaying && activeInstruments.size > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            endSong();
            return 0;
          }
          scoreRef.current += activeInstruments.size * 0.2;
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, activeInstruments.size]);

  const endSong = () => {
    setIsPlaying(false);
    const finalScore = Math.min(10, Math.round(scoreRef.current * 10) / 10);
    setScore(finalScore);
    setShowFireworks(true);
  };

  const toggleInstrument = (inst: string) => {
    setActiveInstruments(prev => {
      const next = new Set(prev);
      if (next.has(inst)) { next.delete(inst); } else { next.add(inst); }
      if (next.size === 0) setIsPlaying(false);
      return next;
    });
  };

  const startPlaying = () => {
    if (activeInstruments.size > 0) {
      setIsPlaying(true);
      setTimeLeft(60);
      scoreRef.current = 0;
    }
  };

  const resetSong = () => {
    setShowFireworks(false);
    setScore(0);
    setTimeLeft(60);
    scoreRef.current = 0;
    if (song) setActiveInstruments(new Set(song.instruments));
  };

  if (loading || !song) return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 60 }} />
    </SafeAreaView>
  );

  if (showFireworks) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
        <ScrollView contentContainerStyle={styles.fireworksContainer}>
          <Animated.View entering={ZoomIn.duration(600)} style={styles.fireworksContent}>
            <Text style={styles.fireworksEmoji}>🎆🎉🎆</Text>
            <Animated.View entering={FadeInUp.delay(300).duration(500)}>
              <Text style={[styles.congratsText, { color: colors.secondary }]}>PARABÉNS!</Text>
              <Text style={[styles.congratsName, { color: colors.primary }]}>
                {user?.name || 'Campeão'}!
              </Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(600).duration(500)} style={[styles.scoreCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>Sua nota é</Text>
              <Text style={[styles.scoreValue, { color: colors.secondary }]}>{score.toFixed(1)}</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Ionicons key={i} name={i <= Math.round(score / 2) ? 'star' : 'star-outline'} size={28} color={colors.secondary} />
                ))}
              </View>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(900).duration(500)} style={styles.fireworksBtns}>
              <TouchableOpacity testID="play-again-btn" style={[styles.fwBtn, { backgroundColor: colors.secondary }]} onPress={resetSong}>
                <Ionicons name="refresh" size={20} color="#0D0D0D" />
                <Text style={styles.fwBtnText}>Tocar Novamente</Text>
              </TouchableOpacity>
              <TouchableOpacity testID="next-song-btn" style={[styles.fwBtn, { backgroundColor: colors.primary }]} onPress={() => router.back()}>
                <Ionicons name="musical-notes" size={20} color="#0D0D0D" />
                <Text style={styles.fwBtnText}>Próxima Música</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const youtubeHTML = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{margin:0;padding:0}body{background:#000}iframe{width:100%;height:100%;border:none}</style></head><body><iframe src="https://www.youtube.com/embed/${song.youtube_id}?autoplay=${isPlaying ? 1 : 0}&controls=1&modestbranding=1&rel=0&end=60" allow="autoplay;encrypted-media" allowfullscreen></iframe></body></html>`;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity testID="back-btn" onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.songTitle, { color: colors.text }]} numberOfLines={1}>{song.title}</Text>
        <View style={styles.timerBadge}>
          <Ionicons name="time" size={14} color={timeLeft <= 10 ? '#FF4444' : colors.primary} />
          <Text style={[styles.timerText, { color: timeLeft <= 10 ? '#FF4444' : colors.primary }]}>{timeLeft}s</Text>
        </View>
      </View>

      <View style={styles.videoContainer}>
        {Platform.OS === 'web' ? (
          <View style={styles.webVideoWrapper}>
            <iframe
              src={`https://www.youtube.com/embed/${song.youtube_id}?autoplay=0&controls=1&modestbranding=1&rel=0&end=60`}
              style={{ width: '100%', height: '100%', border: 'none' } as any}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </View>
        ) : (
          <WebView source={{ html: youtubeHTML }} style={styles.video} allowsInlineMediaPlayback javaScriptEnabled />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.instrumentsSection}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          Toque nos instrumentos para ativar/desativar
        </Text>
        <View style={styles.instrumentsGrid}>
          {song.instruments.map((inst: string, idx: number) => {
            const meta = INSTRUMENT_META[inst] || { label: inst, icon: 'musical-note', color: colors.primary };
            const isActive = activeInstruments.has(inst);
            return (
              <Animated.View key={inst} entering={FadeInDown.delay(idx * 80).duration(400)}>
                <TouchableOpacity
                  testID={`instrument-${inst}`}
                  style={[styles.instrumentBtn, {
                    backgroundColor: isActive ? meta.color + '25' : colors.locked,
                    borderColor: isActive ? meta.color : 'transparent',
                  }]}
                  onPress={() => toggleInstrument(inst)}
                >
                  <View style={[styles.instrumentIcon, { backgroundColor: isActive ? meta.color : colors.textSecondary }]}>
                    <Ionicons name={isActive ? 'volume-high' : 'volume-mute'} size={20} color="#fff" />
                  </View>
                  <Text style={[styles.instrumentLabel, { color: isActive ? colors.text : colors.textSecondary }]}>
                    {meta.label}
                  </Text>
                  <Ionicons name={isActive ? 'radio-button-on' : 'radio-button-off'} size={18} color={isActive ? meta.color : colors.textSecondary} />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {!isPlaying ? (
          <TouchableOpacity
            testID="start-playing-btn"
            style={[styles.playButton, { backgroundColor: activeInstruments.size > 0 ? colors.secondary : colors.locked }]}
            onPress={startPlaying}
            disabled={activeInstruments.size === 0}
          >
            <Ionicons name="play" size={24} color="#0D0D0D" />
            <Text style={styles.playButtonText}>
              {activeInstruments.size > 0 ? 'INICIAR MÚSICA' : 'Ative um instrumento'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            testID="stop-playing-btn"
            style={[styles.playButton, { backgroundColor: '#FF4444' }]}
            onPress={endSong}
          >
            <Ionicons name="stop" size={24} color="#fff" />
            <Text style={[styles.playButtonText, { color: '#fff' }]}>PARAR</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  backBtn: { padding: 4 },
  songTitle: { flex: 1, fontSize: 16, fontWeight: '700' },
  timerBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)' },
  timerText: { fontSize: 14, fontWeight: '700' },
  videoContainer: { height: 200, marginHorizontal: 16, borderRadius: 14, overflow: 'hidden', backgroundColor: '#000' },
  webVideoWrapper: { width: '100%', height: '100%' },
  video: { flex: 1 },
  instrumentsSection: { padding: 16 },
  sectionLabel: { fontSize: 12, fontWeight: '500', textAlign: 'center', marginBottom: 14 },
  instrumentsGrid: { gap: 8 },
  instrumentBtn: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 1.5, gap: 12 },
  instrumentIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  instrumentLabel: { flex: 1, fontSize: 15, fontWeight: '600' },
  playButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 20, paddingVertical: 16, borderRadius: 16 },
  playButtonText: { fontSize: 16, fontWeight: '800', color: '#0D0D0D', letterSpacing: 1 },
  fireworksContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  fireworksContent: { alignItems: 'center', width: '100%', maxWidth: 360 },
  fireworksEmoji: { fontSize: 48, marginBottom: 16 },
  congratsText: { fontSize: 36, fontWeight: '800', textAlign: 'center', letterSpacing: 4 },
  congratsName: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginTop: 8, marginBottom: 24 },
  scoreCard: { borderRadius: 20, padding: 24, alignItems: 'center', width: '100%', marginBottom: 24 },
  scoreLabel: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  scoreValue: { fontSize: 52, fontWeight: '900' },
  starsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  fireworksBtns: { gap: 12, width: '100%' },
  fwBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 14 },
  fwBtnText: { fontSize: 15, fontWeight: '700', color: '#0D0D0D' },
});
