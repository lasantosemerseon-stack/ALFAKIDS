import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
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
      setSongs(data);
    } catch (e) { console.log('Fetch songs error:', e); }
    setLoading(false);
  };

  const canAccess = (song: Song) => song.is_free || accessMode === 'premium';

  const handleSongPress = (song: Song) => {
    if (canAccess(song)) {
      router.push(`/song/${song.id}`);
    } else {
      router.push('/plans');
    }
  };

  const instrumentIcon = (name: string) => {
    const icons: Record<string, string> = {
      piano: 'musical-note', violao: 'guitar', flauta: 'mic', bateria: 'disc',
      baixo: 'radio', pandeiro: 'ellipse', violino: 'pulse',
    };
    return icons[name] || 'musical-note';
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {user && (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.welcomeBar}>
          <Text style={[styles.welcomeText, { color: colors.primary }]}>
            Olá, {user.name}! 🎵
          </Text>
        </Animated.View>
      )}

      <View style={styles.categoryRow}>
        {(['infantil', 'gospel'] as const).map(cat => (
          <TouchableOpacity
            testID={`category-${cat}-btn`}
            key={cat}
            style={[styles.categoryBtn, category === cat && { backgroundColor: colors.secondary }]}
            onPress={() => setCategory(cat)}
          >
            <Ionicons
              name={cat === 'infantil' ? 'happy' : 'heart'}
              size={16}
              color={category === cat ? '#0D0D0D' : colors.textSecondary}
            />
            <Text style={[styles.categoryText, { color: category === cat ? '#0D0D0D' : colors.textSecondary }]}>
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
              <Animated.View key={song.id} entering={FadeInDown.delay(idx * 30).duration(400)}>
                <TouchableOpacity
                  testID={`song-card-${song.id}`}
                  style={[styles.songCard, {
                    backgroundColor: unlocked ? colors.card : colors.locked,
                    borderColor: unlocked ? colors.cardBorder : 'transparent',
                  }]}
                  onPress={() => handleSongPress(song)}
                  activeOpacity={0.7}
                >
                  <View style={styles.songTop}>
                    <View style={[styles.songIcon, { backgroundColor: unlocked ? colors.secondary + '20' : colors.locked }]}>
                      <Ionicons
                        name={unlocked ? 'musical-notes' : 'lock-closed'}
                        size={24}
                        color={unlocked ? colors.secondary : colors.textSecondary}
                      />
                    </View>
                    {song.is_free && (
                      <View style={[styles.freeBadge, { backgroundColor: '#22C55E' }]}>
                        <Text style={styles.freeBadgeText}>FREE</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.songTitle, { color: unlocked ? colors.text : colors.textSecondary }]} numberOfLines={2}>
                    {song.title}
                  </Text>
                  {unlocked && (
                    <View style={styles.instrumentsRow}>
                      {song.instruments.slice(0, 3).map((inst, i) => (
                        <Ionicons key={i} name={instrumentIcon(inst) as any} size={12} color={colors.primary} style={{ marginRight: 4 }} />
                      ))}
                      <Text style={[styles.instCount, { color: colors.textSecondary }]}>{song.instruments.length} inst.</Text>
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
  welcomeBar: { paddingHorizontal: 20, paddingVertical: 12 },
  welcomeText: { fontSize: 16, fontWeight: '600' },
  categoryRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8, gap: 10 },
  categoryBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  categoryText: { fontSize: 13, fontWeight: '600' },
  songsGrid: { paddingHorizontal: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  songCard: { width: 160, borderRadius: 16, padding: 14, borderWidth: 1, marginBottom: 4 },
  songTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  songIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  freeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  freeBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  songTitle: { fontSize: 13, fontWeight: '600', marginBottom: 8, lineHeight: 18 },
  instrumentsRow: { flexDirection: 'row', alignItems: 'center' },
  instCount: { fontSize: 10, marginLeft: 2 },
});
