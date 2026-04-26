import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, Platform } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const PLAYLIST_ID = 'PLBU8yn5kXnNXF7Q5TrPGQqnfGQyQzNDdj';
const BANNER_IMG = 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/0wsekceb_AVISO%20IMPORTANTE%21.png';

export default function Videos100Tab() {
  const { colors } = useTheme();
  const [showPlaylist, setShowPlaylist] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.titleSection}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>+100 Vídeos de Alfabetização</Text>
          <View style={styles.titleUnderline}>
            <View style={[styles.underlinePart, { backgroundColor: colors.primary }]} />
            <View style={[styles.underlinePart, { backgroundColor: colors.accent }]} />
            <View style={[styles.underlinePart, { backgroundColor: colors.secondary }]} />
          </View>
          <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
            Conteúdo complementar de apoio à alfabetização
          </Text>
        </Animated.View>

        {/* Banner de Aviso */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Image source={{ uri: BANNER_IMG }} style={styles.bannerImg} resizeMode="contain" />
        </Animated.View>

        {/* Playlist Embed Button */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <TouchableOpacity
            testID="open-playlist-btn"
            style={[styles.playlistBtn, { backgroundColor: colors.primary }]}
            onPress={() => setShowPlaylist(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="play-circle" size={28} color="#fff" />
            <View style={{ flex: 1 }}>
              <Text style={styles.playlistBtnTitle}>ASSISTIR PLAYLIST COMPLETA</Text>
              <Text style={styles.playlistBtnSub}>+100 vídeos em tela cheia dentro do app</Text>
            </View>
            <Ionicons name="expand" size={22} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Ionicons name="information-circle" size={22} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Estes são materiais públicos do YouTube utilizados como apoio complementar. Todos os créditos pertencem aos seus respectivos criadores e canais originais.
            </Text>
          </View>
        </Animated.View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Fullscreen Playlist Modal */}
      <Modal visible={showPlaylist} animationType="slide" supportedOrientations={['portrait', 'landscape']}>
        <View style={styles.playlistModal}>
          <TouchableOpacity testID="close-playlist-btn" style={styles.closeBtn} onPress={() => setShowPlaylist(false)}>
            <Ionicons name="close-circle" size={36} color="#fff" />
          </TouchableOpacity>
          {Platform.OS === 'web' ? (
            <iframe
              src={`https://www.youtube.com/embed/videoseries?list=${PLAYLIST_ID}&autoplay=1`}
              style={{ width: '100%', height: '90%', border: 'none', borderRadius: 12 } as any}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="videocam" size={64} color="#01CFC9" />
              <Text style={{ color: '#fff', marginTop: 12, fontSize: 16 }}>Playlist do YouTube</Text>
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
  bannerImg: { width: '100%', height: 280, borderRadius: 16, marginBottom: 20 },
  playlistBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 18, borderRadius: 18, marginBottom: 16 },
  playlistBtnTitle: { color: '#fff', fontSize: 15, fontWeight: '900', letterSpacing: 1 },
  playlistBtnSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 16, borderRadius: 14, borderWidth: 1 },
  infoText: { flex: 1, fontSize: 12, lineHeight: 18 },
  playlistModal: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 16 },
  closeBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  placeholder: { alignItems: 'center', justifyContent: 'center', flex: 1 },
});
