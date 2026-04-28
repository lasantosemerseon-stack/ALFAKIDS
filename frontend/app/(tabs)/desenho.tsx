import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const COLORIFY_COVER = 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/9sxcm57d_COLRIFY%20APP.png';
const COLORIFY_URL = 'https://colorifypro.lovable.app/';

export default function DesenhoTab() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.titleSection}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Desenho</Text>
          <View style={styles.titleUnderline}>
            <View style={[styles.underlinePart, { backgroundColor: colors.primary }]} />
            <View style={[styles.underlinePart, { backgroundColor: colors.accent }]} />
            <View style={[styles.underlinePart, { backgroundColor: colors.secondary }]} />
          </View>
          <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
            Transforme suas fotos em desenhos e imprima para pintar em família
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <TouchableOpacity
            testID="colorify-cover-btn"
            style={styles.coverCard}
            onPress={() => Linking.openURL(COLORIFY_URL)}
            activeOpacity={0.85}
          >
            <Image source={{ uri: COLORIFY_COVER }} style={styles.coverImage} resizeMode="cover" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <TouchableOpacity
            testID="colorify-btn"
            style={[styles.openBtn, { backgroundColor: colors.primary }]}
            onPress={() => Linking.openURL(COLORIFY_URL)}
            activeOpacity={0.8}
          >
            <Ionicons name="color-palette" size={22} color="#fff" />
            <Text style={styles.openBtnText}>ABRIR APP DE DESENHO</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
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
  sectionSub: { fontSize: 13, marginTop: 8, lineHeight: 18 },
  coverCard: { borderRadius: 18, overflow: 'hidden', marginBottom: 20 },
  coverImage: { width: '100%', aspectRatio: 16 / 9 },
  openBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18, borderRadius: 18 },
  openBtnText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
});
