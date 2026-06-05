import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface BonusItem {
  title: string;
  pdf_url: string;
}

interface BonusGroup {
  id: string;
  bonus_number: number;
  bonus_title: string;
  items: BonusItem[];
  order: number;
}

// Icon and color per bonus group
const BONUS_META: Record<number, { icon: string; color: string }> = {
  1: { icon: 'book', color: '#FFD700' },       // Caderno da Leitura - dourado
  2: { icon: 'restaurant', color: '#22C55E' }, // Lancheira - verde
  3: { icon: 'heart', color: '#9D4CDD' },      // Autismo - roxo
  4: { icon: 'school', color: '#2563EB' },     // Pedagógicas - azul
  5: { icon: 'library', color: '#F59E0B' },    // Método de Leitura - laranja
  6: { icon: 'language', color: '#EC4899' },   // Inglês - rosa
};

export default function RecursosTab() {
  const { colors } = useTheme();
  const { accessMode } = useAuth();
  const router = useRouter();
  const [groups, setGroups] = useState<BonusGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/content/resources`)
      .then(r => r.json())
      .then((data: BonusGroup[]) => {
        const sorted = [...data].sort((a, b) => {
          const an = a.bonus_number ?? a.order ?? 0;
          const bn = b.bonus_number ?? b.order ?? 0;
          return an - bn;
        });
        setGroups(sorted);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  const isLocked = accessMode === 'free';

  const handleItemPress = (pdf_url: string) => {
    if (isLocked) { router.push('/plans'); return; }
    Linking.openURL(pdf_url);
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
            Materiais exclusivos organizados por categoria
          </Text>
        </Animated.View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 30 }} />
        ) : (
          groups.map((group, gIdx) => {
            const meta = BONUS_META[group.bonus_number] || { icon: 'gift', color: colors.accent };
            return (
              <Animated.View
                key={group.id}
                entering={FadeInDown.delay(gIdx * 80).duration(400)}
                style={[styles.bonusCard, {
                  backgroundColor: isLocked ? colors.locked : colors.card,
                  borderColor: isLocked ? 'transparent' : meta.color + '40',
                }]}
              >
                {/* Header: BÔNUS N + Title */}
                <View style={styles.bonusHeader}>
                  <View style={[styles.numberBadge, { backgroundColor: isLocked ? colors.textSecondary + '20' : meta.color + '20', borderColor: isLocked ? 'transparent' : meta.color + '60' }]}>
                    <Ionicons
                      name={isLocked ? 'lock-closed' : (meta.icon as any)}
                      size={22}
                      color={isLocked ? colors.textSecondary : meta.color}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.bonusLabel, { color: isLocked ? colors.textSecondary : meta.color }]}>
                      BÔNUS {group.bonus_number}
                    </Text>
                    <Text style={[styles.bonusTitle, { color: isLocked ? colors.textSecondary : colors.text }]} numberOfLines={2}>
                      {group.bonus_title}
                    </Text>
                  </View>
                  <View style={[styles.countBadge, { backgroundColor: isLocked ? colors.textSecondary + '15' : meta.color + '15' }]}>
                    <Text style={[styles.countText, { color: isLocked ? colors.textSecondary : meta.color }]}>
                      {group.items.length}
                    </Text>
                  </View>
                </View>

                {/* Items list */}
                <View style={[styles.itemsList, { borderTopColor: meta.color + '20' }]}>
                  {group.items.map((item, iIdx) => (
                    <TouchableOpacity
                      key={`${group.id}_${iIdx}`}
                      testID={`bonus-${group.bonus_number}-item-${iIdx}`}
                      style={[styles.itemRow, iIdx > 0 && { borderTopWidth: 1, borderTopColor: colors.cardBorder + '60' }]}
                      onPress={() => handleItemPress(item.pdf_url)}
                      activeOpacity={0.6}
                      disabled={isLocked}
                    >
                      <Ionicons
                        name={isLocked ? 'lock-closed' : 'document-text-outline'}
                        size={18}
                        color={isLocked ? colors.textSecondary : meta.color}
                      />
                      <Text
                        style={[styles.itemTitle, { color: isLocked ? colors.textSecondary : colors.text }]}
                        numberOfLines={2}
                      >
                        {item.title}
                      </Text>
                      <Ionicons
                        name={isLocked ? 'lock-closed' : 'download-outline'}
                        size={18}
                        color={isLocked ? colors.textSecondary : colors.primary}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
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
    borderRadius: 18,
    borderWidth: 1.5,
    marginBottom: 16,
    overflow: 'hidden',
  },
  bonusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  numberBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  bonusLabel: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 3,
  },
  bonusTitle: {
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 22,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 32,
    alignItems: 'center',
  },
  countText: {
    fontSize: 13,
    fontWeight: '800',
  },
  itemsList: {
    borderTopWidth: 1,
    paddingHorizontal: 14,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  itemTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
});
