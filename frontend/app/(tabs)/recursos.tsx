import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const COLORIFY_URL = 'https://colorifypro.lovable.app/';

const CATEGORY_INFO: Record<string, { label: string; icon: string; color: string }> = {
  pedagogico: { label: 'Recursos Pedagógicos', icon: 'school', color: '#2563EB' },
  autismo: { label: 'Autismo e Inclusão', icon: 'heart', color: '#9D4CDD' },
  lancheira: { label: 'Lancheira Kids', icon: 'restaurant', color: '#22C55E' },
  bonus: { label: 'Bônus Exclusivos', icon: 'star', color: '#D97016' },
};

export default function RecursosTab() {
  const { colors } = useTheme();
  const { accessMode } = useAuth();
  const router = useRouter();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/content/resources`)
      .then(r => r.json()).then(setResources).catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  const isLocked = accessMode === 'free';

  const handleResourcePress = (r: any) => {
    if (isLocked) { router.push('/plans'); return; }
    Linking.openURL(r.pdf_url);
  };

  const grouped = resources.reduce((acc: Record<string, any[]>, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Colorify Section */}
        <Animated.View entering={FadeInDown.duration(500)}>
          <TouchableOpacity
            testID="colorify-btn"
            style={[styles.colorifyCard, { borderColor: colors.secondary }]}
            onPress={() => Linking.openURL(COLORIFY_URL)}
          >
            <View style={[styles.colorifyIcon, { backgroundColor: colors.secondary + '20' }]}>
              <Ionicons name="color-palette" size={28} color={colors.secondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.colorifyTitle, { color: colors.text }]}>
                Transforme suas fotos em desenhos em segundos e imprima para pintar em família
              </Text>
              <Text style={[styles.colorifySubtitle, { color: colors.secondary }]}>Abrir App de Colorir →</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 30 }} />
        ) : (
          Object.entries(grouped).map(([cat, items], catIdx) => {
            const info = CATEGORY_INFO[cat] || { label: cat, icon: 'document', color: colors.primary };
            return (
              <Animated.View key={cat} entering={FadeInDown.delay(200 + catIdx * 100).duration(500)}>
                <View style={styles.categoryHeader}>
                  <View style={[styles.catIcon, { backgroundColor: info.color + '20' }]}>
                    <Ionicons name={info.icon as any} size={20} color={info.color} />
                  </View>
                  <Text style={[styles.catTitle, { color: colors.text }]}>{info.label}</Text>
                  {cat === 'bonus' && (
                    <View style={[styles.bonusBadge, { backgroundColor: info.color }]}>
                      <Text style={styles.bonusBadgeText}>BÔNUS</Text>
                    </View>
                  )}
                </View>
                {(items as any[]).map((r: any) => (
                  <TouchableOpacity
                    testID={`resource-${r.id}`}
                    key={r.id}
                    style={[styles.resourceCard, {
                      backgroundColor: isLocked ? colors.locked : colors.card,
                      borderColor: isLocked ? 'transparent' : colors.cardBorder,
                    }]}
                    onPress={() => handleResourcePress(r)}
                  >
                    <Ionicons
                      name={isLocked ? 'lock-closed' : 'document-text'}
                      size={20}
                      color={isLocked ? colors.textSecondary : info.color}
                    />
                    <Text style={[styles.resourceTitle, { color: isLocked ? colors.textSecondary : colors.text }]} numberOfLines={1}>
                      {r.title}
                    </Text>
                    <Ionicons name="download-outline" size={18} color={isLocked ? colors.textSecondary : colors.primary} />
                  </TouchableOpacity>
                ))}
              </Animated.View>
            );
          })
        )}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16 },
  colorifyCard: { borderRadius: 16, padding: 16, borderWidth: 1.5, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  colorifyIcon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  colorifyTitle: { fontSize: 13, fontWeight: '600', lineHeight: 18, marginBottom: 4 },
  colorifySubtitle: { fontSize: 12, fontWeight: '700' },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10, marginTop: 16 },
  catIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  catTitle: { fontSize: 16, fontWeight: '700', flex: 1 },
  bonusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  bonusBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  resourceCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  resourceTitle: { flex: 1, fontSize: 13, fontWeight: '500' },
});
