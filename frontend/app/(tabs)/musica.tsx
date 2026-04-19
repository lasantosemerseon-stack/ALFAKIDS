import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Song {
  id: string; title: string; youtube_id: string; category: string;
  is_free: boolean; instruments: string[]; order: number;
}

export default function MusicaTab() {
  const { colors } = useTheme();
  const { user, accessMode } = useAuth();
  const router = useRouter();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<'infantil' | 'gospel'>('infantil');

  useEffect(() => { fetchSongs(); }, [category]);

  const fetchSongs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/songs?category=${category}`);
      const data = await res.json();
      // Sort: FREE songs first
      const sorted = [...data].sort((a: Song, b: Song) => {
        if (a.is_free && !b.is_free) return -1;
        if (!a.is_free && b.is_free) return 1;
        return a.order - b.order;
      });
      setSongs(sorted);
    } catch (e) { console.log('Fetch error:', e); }
    setLoading(false);
  };

  const canAccess = (song: Song) => song.is_free || accessMode === 'premium';

  const handleSongPress = (song: Song) => {
    if (canAccess(song)) { router.push(`/song/${song.id}`); }
    else { router.push('/plans'); }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Gradient Title */}
      <Animated.View entering={FadeInDown.duration(500)} style={styles.titleSection}>
        {user && (
          <Text style={[styles.welcomeText, { color: colors.primary }]}>
            Olá, {user.name}! 🎵
          </Text>
        )}
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          Interativo Musical
        </Text>
        <View style={styles.titleUnderline}>
          <View style={[styles.underlinePart, { backgroundColor: colors.primary }]} />
          <View style={[styles.underlinePart, { backgroundColor: colors.accent }]} />
          <View style={[styles.underlinePart, { backgroundColor: colors.secondary }]} />
        </View>
      </Animated.View>

      <View style={styles.categoryRow}>
        {(['infantil', 'gospel'] as const).map(cat => (
          <TouchableOpacity
            testID={`category-${cat}-btn`}
            key={cat}
            style={[styles.categoryBtn, {
              backgroundColor: category === cat ? colors.primary : 'transparent',
              borderColor: category === cat ? colors.primary : colors.cardBorder,
            }]}
            onPress={() => setCategory(cat)}
          >
            <Ionicons
              name={cat === 'infantil' ? 'happy' : 'heart'}
              size={16}
              color={category === cat ? '#fff' : colors.textSecondary}
            />
            <Text style={[styles.categoryText, { color: category === cat ? '#fff' : colors.textSecondary }]}>
              {cat === 'infantil' ? 'Escola Infantil' : 'Gospel'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.songsGrid} showsVerticalScrollIndicator={false}>
          {songs.map((song, idx) => {
            const unlocked = canAccess(song);
            return (
              <Animated.View key={song.id} entering={FadeInDown.delay(idx * 25).duration(350)}>
                <TouchableOpacity
                  testID={`song-card-${song.id}`}
                  style={[styles.songCard, {
                    backgroundColor: unlocked ? colors.card : colors.locked,
                    borderColor: song.is_free ? colors.primary : unlocked ? colors.cardBorder : 'transparent',
                    borderWidth: song.is_free ? 2 : 1,
                  }]}
                  onPress={() => handleSongPress(song)}
                  activeOpacity={0.7}
                >
                  <View style={styles.songTop}>
                    <View style={[styles.songIcon, { backgroundColor: unlocked ? colors.primary + '20' : colors.locked }]}>
                      <Ionicons
                        name={unlocked ? 'musical-notes' : 'lock-closed'}
                        size={26}
                        color={unlocked ? colors.primary : colors.textSecondary}
                      />
                    </View>
                    {song.is_free && (
                      <View style={[styles.freeBadge, { backgroundColor: colors.accent }]}>
                        <Text style={styles.freeBadgeText}>FREE</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.songTitle, { color: unlocked ? colors.text : colors.textSecondary }]} numberOfLines={2}>
                    {song.title}
                  </Text>
                  {unlocked && (
                    <View style={styles.instrumentsRow}>
                      <Text style={[styles.instCount, { color: colors.primary }]}>{song.instruments.length} instrumentos</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
          <View style={{ height: 20 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  titleSection: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  welcomeText: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  sectionTitle: { fontSize: 22, fontWeight: '800', letterSpacing: 1 },
  titleUnderline: { flexDirection: 'row', gap: 4, marginTop: 6 },
  underlinePart: { width: 24, height: 3, borderRadius: 2 },
  categoryRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 10 },
  categoryBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 24, borderWidth: 1 },
  categoryText: { fontSize: 13, fontWeight: '600' },
  songsGrid: { paddingHorizontal: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  songCard: { width: 170, borderRadius: 18, padding: 16, marginBottom: 4 },
  songTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  songIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  freeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  freeBadgeText: { color: '#0D0D0D', fontSize: 10, fontWeight: '900' },
  songTitle: { fontSize: 14, fontWeight: '700', marginBottom: 8, lineHeight: 19 },
  instrumentsRow: { flexDirection: 'row', alignItems: 'center' },
  instCount: { fontSize: 11, fontWeight: '600' },
});
