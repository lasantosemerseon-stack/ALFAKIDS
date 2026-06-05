import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface BonusItem {
  id: string;
  title: string;
  pdf_url: string;
  category: string;
  bonus_number?: number;
  order: number;
}

export default function RecursosTab() {
  const { colors } = useTheme();
  const { accessMode } = useAuth();
  const router = useRouter();
  const [resources, setResources] = useState<BonusItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/content/resources`)
      .then(r => r.json())
      .then((data: BonusItem[]) => {
        // Order strictly by bonus_number / order (fallback)
        const sorted = [...data].sort((a, b) => {
          const an = a.bonus_number ?? a.order ?? 0;
          const bn = b.bonus_number ?? b.order ?? 0;
          return an - bn;
        });
        setResources(sorted);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  const isLocked = accessMode === 'free';

  const handleResourcePress = (r: BonusItem) => {
    if (isLocked) { router.push('/plans'); return; }
    Linking.openURL(r.pdf_url);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.titleSection}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Bônus</Text>
          <View style={styles.titleUnderline}>
            <View style={[styles.underlinePart, { backgroundColor: colors.primary }]} />
            <View style={[styles.underlinePart, { backgroundColor: colors.accent }]} />
            <View style={[styles.underlinePart, { backgroundColor: colors.secondary }]} />
          </View>
          <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
            Materiais exclusivos para baixar e usar com seu filho
          </Text>
        </Animated.View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 30 }} />
        ) : (
          resources.map((r, idx) => {
            const number = r.bonus_number ?? r.order ?? idx + 1;
            return (
              <Animated.View key={r.id} entering={FadeInDown.delay(idx * 40).duration(400)}>
                <TouchableOpacity
                  testID={`bonus-${r.id}`}
                  style={[styles.bonusCard, {
                    backgroundColor: isLocked ? colors.locked : colors.card,
                    borderColor: isLocked ? 'transparent' : colors.cardBorder,
                  }]}
                  onPress={() => handleResourcePress(r)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.numberBadge, { backgroundColor: isLocked ? colors.textSecondary + '30' : colors.accent + '20', borderColor: isLocked ? 'transparent' : colors.accent + '60' }]}>
                    <Ionicons
                      name={isLocked ? 'lock-closed' : 'gift'}
                      size={18}
                      color={isLocked ? colors.textSecondary : colors.accent}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.bonusLabel, { color: isLocked ? colors.textSecondary : colors.accent }]}>
                      BÔNUS {number}
                    </Text>
                    <Text style={[styles.bonusTitle, { color: isLocked ? colors.textSecondary : colors.text }]} numberOfLines={2}>
                      {r.title}
                    </Text>
                  </View>
                  <Ionicons
                    name={isLocked ? 'lock-closed' : 'download-outline'}
                    size={20}
                    color={isLocked ? colors.textSecondary : colors.primary}
                  />
                </TouchableOpacity>
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
  titleSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  titleUnderline: { flexDirection: 'row', gap: 4, marginTop: 6 },
  underlinePart: { width: 24, height: 3, borderRadius: 2 },
  sectionSub: { fontSize: 13, marginTop: 8, lineHeight: 18 },
  bonusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  numberBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  bonusLabel: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  bonusTitle: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 19,
  },
});
