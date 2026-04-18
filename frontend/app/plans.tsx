import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const CHECKOUT_LIFETIME = 'https://pay.cakto.com.br/aw2hie4_853925';
const CHECKOUT_MONTHLY = 'https://pay.cakto.com.br/dboxghv';

export default function PlansScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const openLink = (url: string) => Linking.openURL(url);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: colors.textSecondary }]}>← Voltar</Text>
        </TouchableOpacity>

        <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>PLANOS</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Desbloqueie todo o conteúdo premium
          </Text>
          <View style={[styles.goldenLine, { backgroundColor: colors.primary }]} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(700)}>
          <View style={[styles.planCard, styles.planHighlight, { borderColor: colors.secondary }]}>
            <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
              <Text style={styles.badgeText}>MAIS POPULAR</Text>
            </View>
            <Text style={[styles.planName, { color: colors.text }]}>Acesso Vitalício</Text>
            <View style={styles.priceRow}>
              <Text style={[styles.currency, { color: colors.secondary }]}>R$</Text>
              <Text style={[styles.price, { color: colors.secondary }]}>37</Text>
              <Text style={[styles.priceCents, { color: colors.secondary }]}>,00</Text>
            </View>
            <Text style={[styles.planDetail, { color: colors.primary }]}>PAGAMENTO ÚNICO</Text>
            <Text style={[styles.planDesc, { color: colors.textSecondary }]}>
              Acesso completo para sempre a todas as músicas, instrumentos, conteúdos e recursos pedagógicos.
            </Text>
            <View style={styles.features}>
              {['85+ Músicas Infantis e Gospel', 'Instrumentos Interativos', 'Modo Noturno', 'Recursos Pedagógicos', 'Conteúdo de Inglês', 'App de Colorir', 'Atualizações Futuras'].map((f, i) => (
                <View key={i} style={styles.featureRow}>
                  <Text style={[styles.check, { color: colors.secondary }]}>✓</Text>
                  <Text style={[styles.featureText, { color: colors.textSecondary }]}>{f}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              testID="plan-lifetime-btn"
              style={[styles.planBtn, { backgroundColor: colors.secondary }]}
              onPress={() => openLink(CHECKOUT_LIFETIME)}
            >
              <Text style={styles.planBtnText}>QUERO ACESSO VITALÍCIO</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(700)}>
          <View style={[styles.planCard, { borderColor: colors.cardBorder, backgroundColor: colors.card }]}>
            <Text style={[styles.planName, { color: colors.text }]}>Acesso Mensal</Text>
            <View style={styles.priceRow}>
              <Text style={[styles.currency, { color: colors.primary }]}>R$</Text>
              <Text style={[styles.price, { color: colors.primary }]}>27</Text>
              <Text style={[styles.priceCents, { color: colors.primary }]}>,00</Text>
            </View>
            <Text style={[styles.planDetail, { color: colors.textSecondary }]}>por mês</Text>
            <Text style={[styles.planDesc, { color: colors.textSecondary }]}>
              Acesso completo por 1 mês a todos os recursos premium.
            </Text>
            <TouchableOpacity
              testID="plan-monthly-btn"
              style={[styles.planBtn, { backgroundColor: colors.primary }]}
              onPress={() => openLink(CHECKOUT_MONTHLY)}
            >
              <Text style={styles.planBtnText}>ASSINAR MENSAL</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 24 },
  backBtn: { marginBottom: 16 },
  backText: { fontSize: 15 },
  header: { alignItems: 'center', marginBottom: 32 },
  headerTitle: { fontSize: 28, fontWeight: '700', letterSpacing: 4 },
  headerSubtitle: { fontSize: 14, marginTop: 8 },
  goldenLine: { width: 120, height: 2, marginTop: 12, borderRadius: 1 },
  planCard: { borderRadius: 20, padding: 24, borderWidth: 1.5, marginBottom: 20, position: 'relative', overflow: 'hidden' },
  planHighlight: { borderWidth: 2 },
  badge: { position: 'absolute', top: 0, right: 0, paddingHorizontal: 16, paddingVertical: 6, borderBottomLeftRadius: 12 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  planName: { fontSize: 22, fontWeight: '700', marginBottom: 8, marginTop: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-start' },
  currency: { fontSize: 18, fontWeight: '600', marginTop: 8 },
  price: { fontSize: 56, fontWeight: '800', lineHeight: 60 },
  priceCents: { fontSize: 18, fontWeight: '600', marginTop: 8 },
  planDetail: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
  planDesc: { fontSize: 13, lineHeight: 20, marginBottom: 16 },
  features: { marginBottom: 20 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  check: { fontSize: 16, fontWeight: '700', marginRight: 10 },
  featureText: { fontSize: 13 },
  planBtn: { paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  planBtnText: { color: '#0D0D0D', fontSize: 15, fontWeight: '700', letterSpacing: 1 },
});
