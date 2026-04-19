import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Modal, ScrollView, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import { useAuth } from '../src/contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const NEW_LOGO = 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/j41hwonf_Design%20sem%20nome%20%285%29.png';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode: string }>();
  const mode = params.mode || 'premium';
  const { colors, mode: themeMode } = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showInstall, setShowInstall] = useState(false);

  const handleLogin = async () => {
    if (!email || !name || !password) { setError('Preencha todos os campos'); return; }
    setLoading(true);
    setError('');
    const success = await login(email, name, password, mode);
    setLoading(false);
    if (success) { router.replace('/(tabs)/musica'); }
    else { setError('Senha incorreta. Verifique e tente novamente.'); }
  };

  const isPremium = mode === 'premium';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity testID="login-back-btn" onPress={() => router.back()} style={styles.backRow}>
            <Ionicons name="chevron-back" size={22} color={colors.primary} />
            <Text style={[styles.backText, { color: colors.primary }]}>Voltar</Text>
          </TouchableOpacity>

          <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
            <Image source={{ uri: NEW_LOGO }} style={styles.logo} resizeMode="contain" />
            {/* Animated line under logo */}
            <View style={styles.shimmerLineContainer}>
              <View style={[styles.shimmerLine, { backgroundColor: colors.primary }]} />
            </View>
            <Text style={[styles.titleText, { color: colors.primary }]}>
              {isPremium ? 'ACESSO PREMIUM' : 'ALFABETIZAÇÃO'}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Entre com seu email utilizado na compra
            </Text>
          </Animated.View>

          {/* Main card with glow border */}
          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <View style={[styles.cardOuter, { borderColor: colors.primary + '30' }]}>
              {/* Glow effect borders */}
              <View style={[styles.glowTop, { backgroundColor: colors.primary, opacity: 0.15 }]} />
              <View style={[styles.glowBottom, { backgroundColor: colors.secondary, opacity: 0.1 }]} />

              <View style={[styles.card, { backgroundColor: colors.card }]}>
                <View style={styles.inputGroup}>
                  <View style={[styles.inputWrapper, { borderColor: colors.primary + '30', backgroundColor: colors.bgSecondary }]}>
                    <Ionicons name="mail-outline" size={18} color={colors.primary} style={styles.inputIcon} />
                    <TextInput testID="login-email-input" style={[styles.input, { color: colors.text }]} placeholder="Seu email" placeholderTextColor={colors.textSecondary} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <View style={[styles.inputWrapper, { borderColor: colors.primary + '30', backgroundColor: colors.bgSecondary }]}>
                    <Ionicons name="person-outline" size={18} color={colors.primary} style={styles.inputIcon} />
                    <TextInput testID="login-name-input" style={[styles.input, { color: colors.text }]} placeholder="Nome da criança" placeholderTextColor={colors.textSecondary} value={name} onChangeText={setName} />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <View style={[styles.inputWrapper, { borderColor: colors.primary + '30', backgroundColor: colors.bgSecondary }]}>
                    <Ionicons name="lock-closed-outline" size={18} color={colors.primary} style={styles.inputIcon} />
                    <TextInput testID="login-password-input" style={[styles.input, { color: colors.text }]} placeholder="Senha de acesso" placeholderTextColor={colors.textSecondary} value={password} onChangeText={setPassword} secureTextEntry />
                  </View>
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                {/* Premium glow button */}
                <View style={styles.btnGlowWrapper}>
                  <View style={[styles.btnGlow, { backgroundColor: colors.primary, opacity: 0.2 }]} />
                  <TouchableOpacity testID="login-submit-btn" style={[styles.loginBtn, { backgroundColor: colors.primary }]} onPress={handleLogin} disabled={loading} activeOpacity={0.8}>
                    <Text style={styles.loginBtnText}>{loading ? 'ENTRANDO...' : 'CONTINUAR'}</Text>
                  </TouchableOpacity>
                </View>

                {/* Install button with glow */}
                <View style={styles.btnGlowWrapper}>
                  <View style={[styles.btnGlowSmall, { backgroundColor: colors.secondary, opacity: 0.15 }]} />
                  <TouchableOpacity testID="install-app-btn" style={[styles.installBtn, { borderColor: colors.secondary }]} onPress={() => setShowInstall(true)} activeOpacity={0.7}>
                    <Ionicons name="download-outline" size={18} color={colors.secondary} />
                    <Text style={[styles.installBtnText, { color: colors.secondary }]}>INSTALAR APP</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.shimmerLineContainer}>
            <View style={[styles.shimmerLine, { backgroundColor: colors.primary }]} />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showInstall} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.primary + '30' }]}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowInstall(false)}>
              <Ionicons name="close-circle" size={28} color={colors.primary} />
            </TouchableOpacity>
            <Ionicons name="phone-portrait-outline" size={40} color={colors.primary} style={{ alignSelf: 'center', marginBottom: 16 }} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>INSTALAR O APP</Text>
            {['Toque no ícone de Compartilhar (quadrado com seta para cima).', 'Role e selecione "Adicionar à Tela de Início".', 'Toque em "Adicionar" no canto superior direito.'].map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}><Text style={styles.stepNumText}>{i + 1}</Text></View>
                <Text style={[styles.modalStep, { color: colors.textSecondary }]}>{step}</Text>
              </View>
            ))}
            <TouchableOpacity style={[styles.modalOkBtn, { backgroundColor: colors.primary }]} onPress={() => setShowInstall(false)}>
              <Text style={styles.modalOkText}>ENTENDI!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 20, justifyContent: 'center' },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
  backText: { fontSize: 14, fontWeight: '600' },
  header: { alignItems: 'center', marginBottom: 24 },
  logo: { width: 180, height: 70, marginBottom: 12 },
  shimmerLineContainer: { alignItems: 'center', marginVertical: 12 },
  shimmerLine: { width: 200, height: 1.5, borderRadius: 1 },
  titleText: { fontSize: 22, fontWeight: '900', letterSpacing: 3, marginTop: 8 },
  subtitle: { fontSize: 13, marginTop: 6 },
  cardOuter: { borderRadius: 24, borderWidth: 1, overflow: 'hidden', position: 'relative' },
  glowTop: { position: 'absolute', top: -50, left: '20%', width: '60%', height: 100, borderRadius: 50 },
  glowBottom: { position: 'absolute', bottom: -30, right: '10%', width: '50%', height: 80, borderRadius: 40 },
  card: { borderRadius: 24, padding: 24 },
  inputGroup: { marginBottom: 14 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', height: 54, borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 14 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15 },
  error: { color: '#FF4444', fontSize: 13, textAlign: 'center', marginBottom: 8, fontWeight: '600' },
  btnGlowWrapper: { position: 'relative', marginTop: 10 },
  btnGlow: { position: 'absolute', top: -8, left: '10%', width: '80%', height: 60, borderRadius: 30 },
  btnGlowSmall: { position: 'absolute', top: -4, left: '15%', width: '70%', height: 50, borderRadius: 25 },
  loginBtn: { paddingVertical: 18, borderRadius: 16, alignItems: 'center', position: 'relative', zIndex: 1 },
  loginBtnText: { color: '#fff', fontSize: 17, fontWeight: '900', letterSpacing: 2 },
  installBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 16, borderWidth: 1.5, position: 'relative', zIndex: 1 },
  installBtnText: { fontSize: 15, fontWeight: '800', letterSpacing: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { borderRadius: 24, padding: 28, width: '100%', maxWidth: 360, position: 'relative', borderWidth: 1 },
  modalClose: { position: 'absolute', top: 16, right: 16, zIndex: 10 },
  modalTitle: { fontSize: 20, fontWeight: '900', marginBottom: 20, textAlign: 'center', letterSpacing: 2 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  stepNumber: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  stepNumText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  modalStep: { flex: 1, fontSize: 14, lineHeight: 20 },
  modalOkBtn: { paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 8 },
  modalOkText: { color: '#fff', fontSize: 15, fontWeight: '800', letterSpacing: 1 },
});
