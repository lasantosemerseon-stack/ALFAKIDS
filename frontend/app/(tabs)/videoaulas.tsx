import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Platform } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const SECTIONS = [
  {
    title: 'Músicas das Vogais',
    subtitle: 'Clipes musicais para aprender as vogais',
    icon: 'musical-notes',
    color: '#FF6B6B',
    videos: [
      { id: 'ma', title: 'A de Abelha', letter: 'A', url: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/7cmv8fdh_LETRA%20A%20MUSICA.MOV', type: 'file' },
      { id: 'me', title: 'E de Elefante', letter: 'E', url: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/imnynb42_LETRA%20E%20MUSICA.MOV', type: 'file' },
      { id: 'mi', title: 'I de Iguana', letter: 'I', url: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/mutiojys_LETRA%20I%20MUSICA.MOV', type: 'file' },
      { id: 'mo', title: 'O de Ovelha', letter: 'O', url: '', type: 'soon' },
      { id: 'mu', title: 'U de Unicórnio', letter: 'U', url: '', type: 'soon' },
    ],
  },
  {
    title: 'Vogais com o Panda',
    subtitle: 'Videoaulas ensinando cada vogal',
    icon: 'school',
    color: '#01CFC9',
    videos: [
      { id: 'va', title: 'Vogal A', letter: 'A', url: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/1jhlnpjn_VOGAL%20A.MOV', type: 'file' },
      { id: 've', title: 'Vogal E', letter: 'E', url: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/gpy48mfn_VOGAL%20E.MOV', type: 'file' },
      { id: 'vi', title: 'Vogal I', letter: 'I', url: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/kpzprhbu_VOGAL%20I.MOV', type: 'file' },
      { id: 'vo', title: 'Vogal O', letter: 'O', url: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/zra9811o_VOGAL%20O.MOV', type: 'file' },
      { id: 'vu', title: 'Vogal U', letter: 'U', url: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/7tjvbc4q_VOGAL%20U.MOV', type: 'file' },
    ],
  },
  {
    title: 'Consoantes com o Panda',
    subtitle: 'Videoaulas ensinando as consoantes',
    icon: 'text',
    color: '#0984E3',
    videos: [
      { id: 'cb', title: 'Consoante B', letter: 'B', url: '', type: 'soon' },
      { id: 'cc', title: 'Consoante C', letter: 'C', url: '', type: 'soon' },
      { id: 'cd', title: 'Consoante D', letter: 'D', url: '', type: 'soon' },
    ],
  },
  {
    title: 'Sílabas com o Panda',
    subtitle: 'Videoaulas ensinando as sílabas',
    icon: 'library',
    color: '#FFD700',
    videos: [
      { id: 'sba', title: 'Sílabas BA BE BI', letter: 'BA', url: '', type: 'soon' },
      { id: 'sca', title: 'Sílabas CA CE CI', letter: 'CA', url: '', type: 'soon' },
    ],
  },
];

export default function VideoaulasTab() {
  const { colors } = useTheme();
  const [playingVideo, setPlayingVideo] = useState<{ url: string; title: string } | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.titleSection}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Videoaulas do Panda</Text>
          <View style={styles.titleUnderline}>
            <View style={[styles.underlinePart, { backgroundColor: colors.primary }]} />
            <View style={[styles.underlinePart, { backgroundColor: colors.accent }]} />
            <View style={[styles.underlinePart, { backgroundColor: colors.secondary }]} />
          </View>
          <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>Método AlfaSonoro - Aprenda com o Panda!</Text>
        </Animated.View>

        {SECTIONS.map((section, sIdx) => (
          <Animated.View key={section.title} entering={FadeInDown.delay(100 + sIdx * 80).duration(400)}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: section.color + '20' }]}>
                <Ionicons name={section.icon as any} size={20} color={section.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sectionName, { color: colors.text }]}>{section.title}</Text>
                <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>{section.subtitle}</Text>
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsRow}>
              {section.videos.map((video) => (
                <TouchableOpacity
                  key={video.id}
                  testID={`video-${video.id}`}
                  style={[styles.videoCard, { backgroundColor: video.type === 'soon' ? colors.locked : section.color + '15', borderColor: video.type === 'soon' ? 'transparent' : section.color + '40' }]}
                  onPress={() => video.type === 'file' && video.url ? setPlayingVideo({ url: video.url, title: video.title }) : null}
                  activeOpacity={video.type === 'soon' ? 1 : 0.7}
                >
                  <View style={[styles.cardCover, { backgroundColor: video.type === 'soon' ? colors.textSecondary + '30' : section.color + '30' }]}>
                    <Text style={[styles.letterBig, { color: video.type === 'soon' ? colors.textSecondary : section.color }]}>{video.letter}</Text>
                    {video.type === 'soon' ? (
                      <Ionicons name="lock-closed" size={18} color={colors.textSecondary} style={styles.cardOverlayIcon} />
                    ) : (
                      <Ionicons name="play-circle" size={24} color={section.color} style={styles.cardOverlayIcon} />
                    )}
                  </View>
                  <Text style={[styles.cardTitle, { color: video.type === 'soon' ? colors.textSecondary : colors.text }]} numberOfLines={1}>{video.title}</Text>
                  {video.type === 'soon' && <Text style={[styles.soonText, { color: colors.textSecondary }]}>Em breve</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        ))}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Fullscreen Video Modal */}
      <Modal visible={!!playingVideo} animationType="slide" supportedOrientations={['portrait', 'landscape']}>
        <View style={styles.videoModal}>
          <TouchableOpacity testID="close-video-btn" style={styles.closeVideoBtn} onPress={() => setPlayingVideo(null)}>
            <Ionicons name="close-circle" size={36} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.videoModalTitle}>{playingVideo?.title}</Text>
          {playingVideo && Platform.OS === 'web' ? (
            <video
              src={playingVideo.url}
              controls
              autoPlay
              style={{ width: '100%', height: '80%', backgroundColor: '#000', borderRadius: 12 } as any}
            />
          ) : (
            <View style={styles.videoPlaceholder}>
              <Ionicons name="play-circle" size={64} color="#01CFC9" />
              <Text style={{ color: '#fff', marginTop: 12 }}>Reproduzindo: {playingVideo?.title}</Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16 },
  titleSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  titleUnderline: { flexDirection: 'row', gap: 4, marginTop: 6 },
  underlinePart: { width: 24, height: 3, borderRadius: 2 },
  sectionSub: { fontSize: 13, marginTop: 8 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12, marginTop: 12 },
  sectionIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  sectionName: { fontSize: 17, fontWeight: '800' },
  sectionSubtitle: { fontSize: 12, marginTop: 2 },
  cardsRow: { paddingBottom: 8, gap: 12 },
  videoCard: { width: 140, borderRadius: 16, overflow: 'hidden', borderWidth: 1 },
  cardCover: { width: '100%', height: 100, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  letterBig: { fontSize: 36, fontWeight: '900' },
  cardOverlayIcon: { position: 'absolute', bottom: 6, right: 6 },
  cardTitle: { fontSize: 12, fontWeight: '700', paddingHorizontal: 10, paddingVertical: 8 },
  soonText: { fontSize: 10, paddingHorizontal: 10, paddingBottom: 8 },
  videoModal: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 16 },
  closeVideoBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  videoModalTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 16 },
  videoPlaceholder: { width: '100%', height: '70%', backgroundColor: '#111', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
