import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Platform, Image } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const COVERS = {
  musicas: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/u96rfqaz_MUSICAS%20DA%20VOGAIS%2C.png',
  vogais: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/9xwu2jxr_CAPA%20VOGAIS%20COM%20O%20PANDA.png',
  consoantes: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/jw72p0l8_CONSOANTES%20COM%20O%20PANDA.png',
  silabas: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/z6yg1dl7_S%C3%8DLABAS%20COM%20O%20PANDA.png',
};

const SECTIONS = [
  {
    id: 'musicas',
    title: 'Músicas das Vogais',
    cover: COVERS.musicas,
    videos: [
      { id: 'ma', title: 'Letra A - Música', url: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/7cmv8fdh_LETRA%20A%20MUSICA.MOV' },
      { id: 'me', title: 'Letra E - Música', url: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/imnynb42_LETRA%20E%20MUSICA.MOV' },
      { id: 'mi', title: 'Letra I - Música', url: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/mutiojys_LETRA%20I%20MUSICA.MOV' },
      { id: 'mo', title: 'Letra O - Música', url: '' },
      { id: 'mu', title: 'Letra U - Música', url: '' },
    ],
  },
  {
    id: 'vogais',
    title: 'Vogais com o Panda',
    cover: COVERS.vogais,
    videos: [
      { id: 'va', title: 'Vogal A', url: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/1jhlnpjn_VOGAL%20A.MOV' },
      { id: 've', title: 'Vogal E', url: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/gpy48mfn_VOGAL%20E.MOV' },
      { id: 'vi', title: 'Vogal I', url: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/kpzprhbu_VOGAL%20I.MOV' },
      { id: 'vo', title: 'Vogal O', url: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/zra9811o_VOGAL%20O.MOV' },
      { id: 'vu', title: 'Vogal U', url: 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/7tjvbc4q_VOGAL%20U.MOV' },
    ],
  },
  {
    id: 'consoantes',
    title: 'Consoantes com o Panda',
    cover: COVERS.consoantes,
    videos: [
      { id: 'cb', title: 'Consoante B', url: '' },
      { id: 'cc', title: 'Consoante C', url: '' },
      { id: 'cd', title: 'Consoante D', url: '' },
    ],
  },
  {
    id: 'silabas',
    title: 'Sílabas com o Panda',
    cover: COVERS.silabas,
    videos: [
      { id: 'sba', title: 'Sílabas BA BE BI', url: '' },
      { id: 'sca', title: 'Sílabas CA CE CI', url: '' },
    ],
  },
];

export default function VideoaulasTab() {
  const { colors } = useTheme();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<{ url: string; title: string } | null>(null);

  const currentSection = SECTIONS.find(s => s.id === openSection);

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
          <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>Método AlfaSonoro</Text>
        </Animated.View>

        {openSection && currentSection ? (
          <>
            <TouchableOpacity style={styles.backBtn} onPress={() => setOpenSection(null)}>
              <Ionicons name="chevron-back" size={22} color={colors.primary} />
              <Text style={[styles.backText, { color: colors.primary }]}>Voltar</Text>
            </TouchableOpacity>
            <Text style={[styles.openTitle, { color: colors.text }]}>{currentSection.title}</Text>
            {currentSection.videos.map((video, idx) => (
              <Animated.View key={video.id} entering={FadeInDown.delay(idx * 60).duration(350)}>
                <TouchableOpacity
                  testID={`video-${video.id}`}
                  style={[styles.videoItem, { backgroundColor: video.url ? colors.card : colors.locked, borderColor: video.url ? colors.cardBorder : 'transparent' }]}
                  onPress={() => video.url ? setPlayingVideo({ url: video.url, title: video.title }) : null}
                  activeOpacity={video.url ? 0.7 : 1}
                >
                  <View style={[styles.videoThumb, { backgroundColor: video.url ? colors.primary + '20' : colors.textSecondary + '20' }]}>
                    <Ionicons name={video.url ? 'play-circle' : 'lock-closed'} size={28} color={video.url ? colors.primary : colors.textSecondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.videoTitle, { color: video.url ? colors.text : colors.textSecondary }]}>{video.title}</Text>
                    {!video.url && <Text style={[styles.soonLabel, { color: colors.textSecondary }]}>Em breve</Text>}
                  </View>
                  {video.url && <Ionicons name="chevron-forward" size={20} color={colors.primary} />}
                </TouchableOpacity>
              </Animated.View>
            ))}
          </>
        ) : (
          SECTIONS.map((section, sIdx) => (
            <Animated.View key={section.id} entering={FadeInDown.delay(sIdx * 100).duration(400)}>
              <TouchableOpacity
                testID={`section-${section.id}`}
                style={styles.coverCard}
                onPress={() => setOpenSection(section.id)}
                activeOpacity={0.85}
              >
                <Image source={{ uri: section.cover }} style={styles.coverImage} resizeMode="cover" />
                <View style={styles.coverOverlay}>
                  <Text style={styles.coverCount}>{section.videos.filter(v => v.url).length}/{section.videos.length} vídeos</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))
        )}
        <View style={{ height: 30 }} />
      </ScrollView>

      <Modal visible={!!playingVideo} animationType="slide" supportedOrientations={['portrait', 'landscape']}>
        <View style={styles.videoModal}>
          <TouchableOpacity testID="close-video-btn" style={styles.closeVideoBtn} onPress={() => setPlayingVideo(null)}>
            <Ionicons name="close-circle" size={36} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.videoModalTitle}>{playingVideo?.title}</Text>
          {playingVideo && Platform.OS === 'web' ? (
            <video src={playingVideo.url} controls autoPlay style={{ width: '100%', height: '80%', backgroundColor: '#000', borderRadius: 12 } as any} />
          ) : (
            <View style={styles.placeholder}><Ionicons name="play-circle" size={64} color="#01CFC9" /></View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16 },
  titleSection: { marginBottom: 16 },
  sectionTitle: { fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  titleUnderline: { flexDirection: 'row', gap: 4, marginTop: 6 },
  underlinePart: { width: 24, height: 3, borderRadius: 2 },
  sectionSub: { fontSize: 13, marginTop: 6 },
  coverCard: { borderRadius: 18, overflow: 'hidden', marginBottom: 14, position: 'relative' },
  coverImage: { width: '100%', height: 180 },
  coverOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 10, backgroundColor: 'rgba(0,0,0,0.5)' },
  coverCount: { color: '#fff', fontSize: 12, fontWeight: '700', textAlign: 'right' },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  backText: { fontSize: 14, fontWeight: '600' },
  openTitle: { fontSize: 20, fontWeight: '900', marginBottom: 16 },
  videoItem: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 10 },
  videoThumb: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  videoTitle: { fontSize: 15, fontWeight: '700' },
  soonLabel: { fontSize: 11, marginTop: 2 },
  videoModal: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 16 },
  closeVideoBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  videoModalTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 16 },
  placeholder: { alignItems: 'center', justifyContent: 'center', flex: 1 },
});
