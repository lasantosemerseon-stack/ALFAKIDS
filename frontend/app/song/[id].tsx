import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const INSTRUMENT_META: Record<string, { label: string; icon: string; color: string; freq: number; wave: OscillatorType }> = {
  piano: { label: 'Piano', icon: 'musical-note', color: '#01CFC9', freq: 523.25, wave: 'sine' },
  violao: { label: 'Violão', icon: 'musical-notes', color: '#0984E3', freq: 329.63, wave: 'triangle' },
  flauta: { label: 'Flauta', icon: 'mic', color: '#22C55E', freq: 698.46, wave: 'sine' },
  bateria: { label: 'Bateria', icon: 'disc', color: '#FFD700', freq: 150, wave: 'square' },
  baixo: { label: 'Baixo', icon: 'radio', color: '#7C3AED', freq: 130.81, wave: 'sawtooth' },
  pandeiro: { label: 'Pandeiro', icon: 'ellipse', color: '#F59E0B', freq: 800, wave: 'triangle' },
  violino: { label: 'Violino', icon: 'pulse', color: '#EC4899', freq: 440, wave: 'sawtooth' },
};

// Web Audio synthesizer - CONTINUOUS looping sounds
const audioContextRef: { current: any } = { current: null };
const activeOscillators: Map<string, { osc: any; gain: any }> = new Map();

function getAudioContext() {
  if (Platform.OS !== 'web') return null;
  try {
    if (!audioContextRef.current) {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return null;
      audioContextRef.current = new AudioCtx();
    }
    return audioContextRef.current;
  } catch (e) { return null; }
}

function startInstrumentSound(inst: string, freq: number, waveType: OscillatorType) {
  const ctx = getAudioContext();
  if (!ctx) return;
  stopInstrumentSound(inst);
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = waveType;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    activeOscillators.set(inst, { osc, gain });
  } catch (e) { /* ignore */ }
}

function stopInstrumentSound(inst: string) {
  const entry = activeOscillators.get(inst);
  if (entry) {
    try {
      entry.gain.gain.exponentialRampToValueAtTime(0.001, getAudioContext()!.currentTime + 0.1);
      setTimeout(() => { try { entry.osc.stop(); } catch(e) {} }, 150);
    } catch (e) { /* ignore */ }
    activeOscillators.delete(inst);
  }
}

function stopAllSounds() {
  activeOscillators.forEach((_, inst) => stopInstrumentSound(inst));
}

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
    return () => { if (timerRef.current) clearInterval(timerRef.current); stopAllSounds(); };
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
    stopAllSounds();
    const finalScore = Math.min(10, Math.round(scoreRef.current * 10) / 10);
    setScore(finalScore);
    setShowFireworks(true);
  };

  const toggleInstrument = useCallback((inst: string) => {
    const meta = INSTRUMENT_META[inst];
    setActiveInstruments(prev => {
      const next = new Set(prev);
      if (next.has(inst)) {
        next.delete(inst);
        stopInstrumentSound(inst);
      } else {
        next.add(inst);
        if (meta) startInstrumentSound(inst, meta.freq, meta.wave);
      }
      if (next.size === 0) { setIsPlaying(false); stopAllSounds(); }
      return next;
    });
  }, []);

  const tapInstrument = useCallback((inst: string) => {
    // Already playing continuously, just visual feedback
  }, []);

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
            <Text style={styles.fireworksEmoji}>🎆🎉🎊🎆🎉</Text>
            <Animated.View entering={FadeInUp.delay(300).duration(500)}>
              <Text style={[styles.congratsText, { color: colors.primary }]}>PARABÉNS!</Text>
              <Text style={[styles.congratsName, { color: colors.accent }]}>
                {user?.name || 'Campeão'}!
              </Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(600).duration(500)} style={[styles.scoreCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>Sua nota é</Text>
              <Text style={[styles.scoreValue, { color: colors.primary }]}>{score.toFixed(1)}</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Ionicons key={i} name={i <= Math.round(score / 2) ? 'star' : 'star-outline'} size={32} color={colors.accent} />
                ))}
              </View>
              <Text style={[styles.scoreMessage, { color: colors.textSecondary }]}>
                Vamos para a próxima música!
              </Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(900).duration(500)} style={styles.fireworksBtns}>
              <TouchableOpacity testID="play-again-btn" style={[styles.fwBtn, { backgroundColor: colors.primary }]} onPress={resetSong}>
                <Ionicons name="refresh" size={20} color="#fff" />
                <Text style={[styles.fwBtnText, { color: '#fff' }]}>Tocar Novamente</Text>
              </TouchableOpacity>
              <TouchableOpacity testID="next-song-btn" style={[styles.fwBtn, { backgroundColor: colors.secondary }]} onPress={() => router.back()}>
                <Ionicons name="musical-notes" size={20} color="#fff" />
                <Text style={[styles.fwBtnText, { color: '#fff' }]}>Mais Músicas</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity testID="back-btn" onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.songTitle, { color: colors.text }]} numberOfLines={1}>{song.title}</Text>
        <View style={[styles.timerBadge, { backgroundColor: timeLeft <= 10 ? '#FF444420' : colors.primary + '20' }]}>
          <Ionicons name="time" size={14} color={timeLeft <= 10 ? '#FF4444' : colors.primary} />
          <Text style={[styles.timerText, { color: timeLeft <= 10 ? '#FF4444' : colors.primary }]}>{timeLeft}s</Text>
        </View>
      </View>

      {/* YouTube Video */}
      <View style={styles.videoContainer}>
        {Platform.OS === 'web' ? (
          <iframe
            src={`https://www.youtube.com/embed/${song.youtube_id}?autoplay=0&controls=1&modestbranding=1&rel=0&end=60`}
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: 14 } as any}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <View style={styles.videoPlaceholder}>
            <Ionicons name="play-circle" size={48} color={colors.primary} />
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.instrumentsSection}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          Toque nos instrumentos! Cada um produz um som diferente 🎵
        </Text>
        <View style={styles.instrumentsGrid}>
          {song.instruments.map((inst: string, idx: number) => {
            const meta = INSTRUMENT_META[inst] || { label: inst, icon: 'musical-note', color: colors.primary, freq: 440, wave: 'sine' as OscillatorType };
            const isActive = activeInstruments.has(inst);
            return (
              <Animated.View key={inst} entering={FadeInDown.delay(idx * 60).duration(350)}>
                <TouchableOpacity
                  testID={`instrument-${inst}`}
                  style={[styles.instrumentBtn, {
                    backgroundColor: isActive ? meta.color + '18' : colors.locked,
                    borderColor: isActive ? meta.color : 'transparent',
                    borderWidth: isActive ? 2 : 1,
                  }]}
                  onPress={() => toggleInstrument(inst)}
                  activeOpacity={0.6}
                >
                  <View style={[styles.instrumentIcon, { backgroundColor: isActive ? meta.color : colors.textSecondary + '40' }]}>
                    <Ionicons name={isActive ? 'volume-high' : 'volume-mute'} size={24} color="#fff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.instrumentLabel, { color: isActive ? colors.text : colors.textSecondary }]}>
                      {meta.label}
                    </Text>
                    <Text style={[styles.instrumentHint, { color: isActive ? meta.color : colors.textSecondary }]}>
                      {isActive ? 'Tocando... Toque para parar' : 'Toque para ativar'}
                    </Text>
                  </View>
                  <View style={[styles.statusDot, { backgroundColor: isActive ? meta.color : colors.textSecondary + '40' }]} />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {!isPlaying ? (
          <TouchableOpacity
            testID="start-playing-btn"
            style={[styles.playButton, { backgroundColor: activeInstruments.size > 0 ? colors.primary : colors.locked }]}
            onPress={startPlaying}
            disabled={activeInstruments.size === 0}
          >
            <Ionicons name="play" size={24} color="#fff" />
            <Text style={[styles.playButtonText, { color: '#fff' }]}>
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
  timerBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  timerText: { fontSize: 14, fontWeight: '700' },
  videoContainer: { height: 200, marginHorizontal: 16, borderRadius: 14, overflow: 'hidden', backgroundColor: '#000' },
  videoPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  instrumentsSection: { padding: 16 },
  sectionLabel: { fontSize: 13, fontWeight: '500', textAlign: 'center', marginBottom: 14 },
  instrumentsGrid: { gap: 10 },
  instrumentBtn: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, gap: 14 },
  instrumentIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  instrumentLabel: { fontSize: 16, fontWeight: '700' },
  instrumentHint: { fontSize: 11, marginTop: 2 },
  statusDot: { width: 12, height: 12, borderRadius: 6 },
  playButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 20, paddingVertical: 18, borderRadius: 18 },
  playButtonText: { fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  fireworksContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  fireworksContent: { alignItems: 'center', width: '100%', maxWidth: 360 },
  fireworksEmoji: { fontSize: 48, marginBottom: 16 },
  congratsText: { fontSize: 38, fontWeight: '900', textAlign: 'center', letterSpacing: 4 },
  congratsName: { fontSize: 30, fontWeight: '700', textAlign: 'center', marginTop: 8, marginBottom: 24 },
  scoreCard: { borderRadius: 24, padding: 28, alignItems: 'center', width: '100%', marginBottom: 24, borderWidth: 1 },
  scoreLabel: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  scoreValue: { fontSize: 56, fontWeight: '900' },
  starsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  scoreMessage: { fontSize: 14, marginTop: 12 },
  fireworksBtns: { gap: 12, width: '100%' },
  fwBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 16 },
  fwBtnText: { fontSize: 15, fontWeight: '700' },
});
