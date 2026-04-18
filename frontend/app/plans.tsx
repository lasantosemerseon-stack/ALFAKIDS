import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const CHECKOUT_LIFETIME = 'https://pay.cakto.com.br/aw2hie4_853925';
const CHECKOUT_MONTHLY = 'https://pay.cakto.com.br/dboxghv';

export default function PlansScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const openLink = (url: string) => Linking.openURL(url);

  // Calculate discount: monthly R$37 * 3 = R$111 vs R$37 one-time
  const monthlyTotal3 = 27 * 3; // R$81 for 3 months
  const lifetimePrice = 37;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity testID="plans-back-btn" onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
          <Text style={[styles.backText, { color: colors.textSecondary }]}>Voltar</Text>
        </TouchableOpacity>

        <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>PLANOS</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Desbloqueie todo o conteúdo premium do alfakids
          </Text>
          <View style={[styles.goldenLine, { backgroundColor: colors.primary }]} />
        </Animated.View>

        {/* Urgency Banner */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <View style={[styles.urgencyBanner, { backgroundColor: '#FF4444' + '15', borderColor: '#FF4444' + '40' }]}>
            <Ionicons name="flame" size={18} color="#FF4444" />
            <Text style={styles.urgencyText}>
              Oferta válida somente hoje! Amanhã volta para o valor original.
            </Text>
          </View>
        </Animated.View>

        {/* Lifetime Plan - Featured */}
        <Animated.View entering={FadeInDown.delay(400).duration(700)}>
          <View style={[styles.planCard, styles.planFeatured]}>
            {/* Glowing border effect */}
            <View style={[styles.glowBorder, { borderColor: colors.secondary }]} />
            <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
              <Ionicons name="star" size={12} color="#0D0D0D" />
              <Text style={styles.badgeText}> MAIS POPULAR</Text>
            </View>
            <Text style={[styles.planName, { color: '#FFFFFF' }]}>Acesso Vitalício</Text>
            <View style={styles.priceRow}>
              <Text style={[styles.currency, { color: colors.secondary }]}>R$</Text>
              <Text style={[styles.price, { color: colors.secondary }]}>37</Text>
              <Text style={[styles.priceCents, { color: colors.secondary }]}>,00</Text>
            </View>
            <View style={[styles.paymentTag, { backgroundColor: colors.secondary + '20' }]}>
              <Text style={[styles.paymentTagText, { color: colors.secondary }]}>PAGAMENTO ÚNICO</Text>
            </View>
            <Text style={[styles.planDesc, { color: 'rgba(255,255,255,0.7)' }]}>
              Acesso completo para sempre. Todas as músicas, instrumentos, conteúdos pedagógicos e atualizações futuras.
            </Text>
            <View style={styles.features}>
              {[
                '85+ Músicas Infantis e Gospel',
                'Instrumentos Interativos',
                'Conteúdos de Alfabetização',
                'Aprender Inglês',
                'Recursos Pedagógicos',
                'App de Colorir',
                'Lancheira Kids + Bônus',
                'Modo Noturno',
                'Atualizações Futuras Grátis',
              ].map((f, i) => (
                <View key={i} style={styles.featureRow}>
                  <Ionicons name="checkmark-circle" size={18} color={colors.secondary} />
                  <Text style={[styles.featureText, { color: 'rgba(255,255,255,0.6)' }]}>{f}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              testID="plan-lifetime-btn"
              style={[styles.planBtn, { backgroundColor: colors.secondary }]}
              onPress={() => openLink(CHECKOUT_LIFETIME)}
              activeOpacity={0.8}
            >
              <Ionicons name="diamond" size={20} color="#0D0D0D" />
              <Text style={styles.planBtnText}>QUERO ACESSO VITALÍCIO</Text>
            </TouchableOpacity>
            <Text style={[styles.guarantee, { color: 'rgba(255,255,255,0.4)' }]}>
              Acesso imediato após o pagamento
            </Text>
          </View>
        </Animated.View>

        {/* Monthly Plan */}
        <Animated.View entering={FadeInDown.delay(600).duration(700)}>
          <View style={[styles.planCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Text style={[styles.planName, { color: colors.text }]}>Acesso Mensal</Text>
            <View style={styles.priceRow}>
              <Text style={[styles.currency, { color: colors.primary }]}>R$</Text>
              <Text style={[styles.price, { color: colors.primary }]}>27</Text>
              <Text style={[styles.priceCents, { color: colors.primary }]}>,00</Text>
            </View>
            <Text style={[styles.planDetail, { color: colors.textSecondary }]}>por mês</Text>
            <Text style={[styles.planDesc, { color: colors.textSecondary }]}>
              Acesso completo por 1 mês a todos os recursos premium do alfakids.
            </Text>
            <TouchableOpacity
              testID="plan-monthly-btn"
              style={[styles.planBtn, { backgroundColor: colors.primary }]}
              onPress={() => openLink(CHECKOUT_MONTHLY)}
              activeOpacity={0.8}
            >
              <Text style={styles.planBtnText}>ASSINAR MENSAL</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Bottom separator */}
        <Animated.View entering={FadeInDown.delay(800).duration(500)} style={styles.bottomSection}>
          <View style={[styles.goldenLine, { backgroundColor: colors.primary, width: 80 }]} />
          <Text style={[styles.bottomText, { color: colors.textSecondary }]}>
            Dúvidas? Entre em contato conosco
          </Text>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 24 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
  backText: { fontSize: 14, fontWeight: '500' },
  header: { alignItems: 'center', marginBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: '800', letterSpacing: 5 },
  headerSubtitle: { fontSize: 14, marginTop: 8, textAlign: 'center' },
  goldenLine: { width: 120, height: 1.5, marginTop: 12, borderRadius: 1 },
  urgencyBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 20 },
  urgencyText: { flex: 1, color: '#FF6B6B', fontSize: 13, fontWeight: '600' },
  planCard: { borderRadius: 24, padding: 28, borderWidth: 1.5, marginBottom: 20, position: 'relative', overflow: 'hidden' },
  planFeatured: { backgroundColor: 'rgba(20, 15, 10, 0.95)', borderColor: '#D97016', borderWidth: 2 },
  glowBorder: { position: 'absolute', inset: -2, borderRadius: 26, borderWidth: 2, opacity: 0.3 },
  badge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginBottom: 16 },
  badgeText: { color: '#0D0D0D', fontSize: 11, fontWeight: '800' },
  planName: { fontSize: 24, fontWeight: '800', marginBottom: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  currency: { fontSize: 20, fontWeight: '700', marginTop: 10 },
  price: { fontSize: 64, fontWeight: '900', lineHeight: 70 },
  priceCents: { fontSize: 20, fontWeight: '700', marginTop: 10 },
  paymentTag: { alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, marginBottom: 16 },
  paymentTagText: { fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  planDetail: { fontSize: 14, fontWeight: '500', marginBottom: 12 },
  planDesc: { fontSize: 13, lineHeight: 20, marginBottom: 20 },
  features: { marginBottom: 24, gap: 10 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureText: { fontSize: 13, fontWeight: '500' },
  planBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18, borderRadius: 16 },
  planBtnText: { color: '#0D0D0D', fontSize: 15, fontWeight: '800', letterSpacing: 1 },
  guarantee: { textAlign: 'center', fontSize: 11, marginTop: 12 },
  bottomSection: { alignItems: 'center', marginTop: 12 },
  bottomText: { fontSize: 12, marginTop: 12 },
});
