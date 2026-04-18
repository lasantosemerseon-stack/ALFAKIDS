import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const PLAYLIST_URL = 'https://www.youtube.com/watch?v=WyA6GscP4DA&list=PLBU8yn5kXnNXF7Q5TrPGQqnfGQyQzNDdj&pp=gAQB';

export default function AlfabetizacaoTab() {
  const { colors } = useTheme();
  const { accessMode } = useAuth();
  const router = useRouter();
  const [days, setDays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/content/alphabetization`)
      .then(r => r.json()).then(setDays).catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  const isLocked = accessMode === 'free';

  const handleDayPress = (day: any) => {
    if (isLocked) {
      router.push('/plans');
    } else {
      Linking.openURL(day.pdf_url);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <View style={[styles.headerIcon, { backgroundColor: colors.accent + '20' }]}>
            <Ionicons name="book" size={32} color={colors.accent} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            Método Guiado para Acelerar a{'\n'}Alfabetização em até 30 Dias
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Método fônico comprovado por Harvard - ensine o SOM das letras
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <TouchableOpacity
            testID="playlist-btn"
            style={[styles.playlistCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            onPress={() => Linking.openURL(PLAYLIST_URL)}
          >
            <Ionicons name="videocam" size={24} color={colors.secondary} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.playlistTitle, { color: colors.text }]}>Playlist +100 Vídeos Auxiliares</Text>
              <Text style={[styles.playlistNote, { color: colors.textSecondary }]}>
                Vídeos públicos do YouTube como apoio complementar
              </Text>
            </View>
            <Ionicons name="open-outline" size={18} color={colors.primary} />
          </TouchableOpacity>
        </Animated.View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 30 }} />
        ) : (
          <View style={styles.daysContainer}>
            {days.map((day, idx) => (
              <Animated.View key={day.day} entering={FadeInDown.delay(100 + idx * 40).duration(400)}>
                <TouchableOpacity
                  testID={`day-${day.day}-btn`}
                  style={[styles.dayCard, {
                    backgroundColor: isLocked ? colors.locked : colors.card,
                    borderColor: isLocked ? 'transparent' : colors.cardBorder,
                  }]}
                  onPress={() => handleDayPress(day)}
                >
                  <View style={[styles.dayBadge, { backgroundColor: isLocked ? colors.textSecondary : colors.accent }]}>
                    <Text style={styles.dayBadgeText}>{day.day}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.dayTitle, { color: isLocked ? colors.textSecondary : colors.text }]}>
                      Dia {day.day}
                    </Text>
                    <Text style={[styles.daySubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
                      {day.title}
                    </Text>
                  </View>
                  <Ionicons
                    name={isLocked ? 'lock-closed' : 'document-text'}
                    size={18}
                    color={isLocked ? colors.textSecondary : colors.primary}
                  />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        )}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16 },
  header: { alignItems: 'center', marginBottom: 24, paddingHorizontal: 8 },
  headerIcon: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '700', textAlign: 'center', lineHeight: 24, marginBottom: 8 },
  subtitle: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
  playlistCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 20 },
  playlistTitle: { fontSize: 14, fontWeight: '600' },
  playlistNote: { fontSize: 11, marginTop: 2 },
  daysContainer: { gap: 8 },
  dayCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 1, gap: 12 },
  dayBadge: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  dayBadgeText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  dayTitle: { fontSize: 14, fontWeight: '600' },
  daySubtitle: { fontSize: 12, marginTop: 2 },
});
