import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const CHECKOUT_LIFETIME = 'https://pay.cakto.com.br/aw2hie4_853925';
const CHECKOUT_MONTHLY = 'https://pay.cakto.com.br/dboxghv';
const NEW_LOGO = 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/j41hwonf_Design%20sem%20nome%20%285%29.png';

export default function PlansScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity testID="plans-back-btn" onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>Voltar</Text>
        </TouchableOpacity>

        <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
          <Image source={{ uri: NEW_LOGO }} style={styles.logo} resizeMode="contain" />
          <Text style={[styles.headerTitle, { color: colors.primary }]}>PLANOS</Text>
          <View style={styles.shimmerLineContainer}>
            <View style={[styles.shimmerLine, { backgroundColor: colors.primary }]} />
          </View>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Desbloqueie todo o conteúdo premium
          </Text>
        </Animated.View>

        {/* Urgency */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <View style={[styles.urgencyBanner, { backgroundColor: '#FF444415', borderColor: '#FF444440' }]}>
            <Ionicons name="flame" size={18} color="#FF4444" />
            <Text style={styles.urgencyText}>Oferta válida somente hoje! Amanhã volta para o valor original.</Text>
          </View>
        </Animated.View>

        {/* LIFETIME PLAN - Premium with glow */}
        <Animated.View entering={FadeInDown.delay(400).duration(700)}>
            <View style={[styles.planCard, styles.planFeatured, { borderColor: colors.primary + '50' }]}>
              {/* Badge */}
              <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Ionicons name="star" size={14} color="#fff" />
                <Text style={styles.badgeText}> MAIS POPULAR</Text>
              </View>

              <Text style={[styles.planName, { color: '#FFFFFF' }]}>ACESSO VITALÍCIO</Text>

              <View style={styles.priceRow}>
                <Text style={[styles.currency, { color: colors.primary }]}>R$</Text>
                <Text style={[styles.price, { color: colors.primary }]}>37</Text>
                <Text style={[styles.priceCents, { color: colors.primary }]}>,00</Text>
              </View>

              <View style={[styles.paymentTag, { backgroundColor: colors.primary + '20', borderColor: colors.primary + '40' }]}>
                <Text style={[styles.paymentTagText, { color: colors.primary }]}>PAGAMENTO ÚNICO</Text>
              </View>

              <Text style={[styles.planDesc, { color: 'rgba(255,255,255,0.6)' }]}>
                Acesso completo para sempre. Todas as músicas, instrumentos, conteúdos e atualizações futuras.
              </Text>

              <View style={styles.features}>
                {['85+ Músicas Infantis e Gospel', 'Instrumentos Interativos', 'Conteúdos de Alfabetização', 'Aprender Inglês', 'Recursos Pedagógicos', 'App de Colorir', 'Lancheira Kids + Bônus', 'Modo Noturno', 'Atualizações Futuras'].map((f, i) => (
                  <View key={i} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                    <Text style={[styles.featureText, { color: 'rgba(255,255,255,0.6)' }]}>{f}</Text>
                  </View>
                ))}
              </View>

              {/* Button */}
              <TouchableOpacity testID="plan-lifetime-btn" style={[styles.planBtn, { backgroundColor: colors.primary }]} onPress={() => Linking.openURL(CHECKOUT_LIFETIME)} activeOpacity={0.8}>
                <Ionicons name="diamond" size={20} color="#fff" />
                <Text style={styles.planBtnText}>QUERO ACESSO VITALÍCIO</Text>
              </TouchableOpacity>

              <Text style={[styles.guarantee, { color: 'rgba(255,255,255,0.3)' }]}>Acesso imediato após o pagamento</Text>
            </View>
        </Animated.View>

        {/* MONTHLY PLAN */}
        <Animated.View entering={FadeInDown.delay(600).duration(700)}>
          <View style={[styles.planCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Text style={[styles.planName, { color: colors.text }]}>ACESSO MENSAL</Text>
            <View style={styles.priceRow}>
              <Text style={[styles.currency, { color: colors.secondary }]}>R$</Text>
              <Text style={[styles.price, { color: colors.secondary }]}>27</Text>
              <Text style={[styles.priceCents, { color: colors.secondary }]}>,00</Text>
            </View>
            <Text style={[styles.planDetail, { color: colors.textSecondary }]}>por mês</Text>
            <TouchableOpacity testID="plan-monthly-btn" style={[styles.planBtn, { backgroundColor: colors.secondary }]} onPress={() => Linking.openURL(CHECKOUT_MONTHLY)} activeOpacity={0.8}>
              <Text style={styles.planBtnText}>ASSINAR MENSAL</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(800).duration(500)} style={styles.shimmerLineContainer}>
          <View style={[styles.shimmerLine, { backgroundColor: colors.primary }]} />
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
  backText: { fontSize: 14, fontWeight: '600' },
  header: { alignItems: 'center', marginBottom: 24 },
  logo: { width: 140, height: 50, marginBottom: 12 },
  headerTitle: { fontSize: 30, fontWeight: '900', letterSpacing: 6 },
  shimmerLineContainer: { alignItems: 'center', marginVertical: 10 },
  shimmerLine: { width: 200, height: 1.5, borderRadius: 1 },
  headerSubtitle: { fontSize: 14, marginTop: 4, textAlign: 'center' },
  urgencyBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 24 },
  urgencyText: { flex: 1, color: '#FF6B6B', fontSize: 13, fontWeight: '700' },
  planGlowWrapper: { position: 'relative', marginBottom: 20 },
  planGlowTop: { position: 'absolute', top: -15, left: '15%', width: '70%', height: 30, borderRadius: 15, opacity: 0.12 },
  planGlowRight: { position: 'absolute', top: '30%', right: -10, width: 20, height: '40%', borderRadius: 10, opacity: 0.1 },
  planGlowBottom: { position: 'absolute', bottom: -10, left: '20%', width: '60%', height: 20, borderRadius: 10, opacity: 0.1 },
  planCard: { borderRadius: 24, padding: 28, borderWidth: 2, marginBottom: 20, position: 'relative', overflow: 'hidden' },
  planFeatured: { backgroundColor: 'rgba(13, 13, 20, 0.95)' },
  badge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 24, marginBottom: 16 },
  badgeText: { color: '#fff', fontSize: 13, fontWeight: '900', letterSpacing: 1 },
  planName: { fontSize: 22, fontWeight: '900', marginBottom: 8, letterSpacing: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  currency: { fontSize: 22, fontWeight: '700', marginTop: 12 },
  price: { fontSize: 68, fontWeight: '900', lineHeight: 74 },
  priceCents: { fontSize: 22, fontWeight: '700', marginTop: 12 },
  paymentTag: { alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, marginBottom: 16, borderWidth: 1 },
  paymentTagText: { fontSize: 13, fontWeight: '900', letterSpacing: 2 },
  planDetail: { fontSize: 14, fontWeight: '500', marginBottom: 16 },
  planDesc: { fontSize: 13, lineHeight: 20, marginBottom: 20 },
  features: { marginBottom: 24, gap: 10 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureText: { fontSize: 13, fontWeight: '500' },
  btnGlowWrapper: { position: 'relative' },
  btnGlow: { position: 'absolute', top: -8, left: '10%', width: '80%', height: 60, borderRadius: 30 },
  planBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18, borderRadius: 18, position: 'relative', zIndex: 1 },
  planBtnText: { color: '#fff', fontSize: 15, fontWeight: '900', letterSpacing: 1 },
  guarantee: { textAlign: 'center', fontSize: 11, marginTop: 14 },
});
