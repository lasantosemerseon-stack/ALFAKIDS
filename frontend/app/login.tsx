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
  const { colors } = useTheme();
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
    <SafeAreaView style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity testID="login-back-btn" onPress={() => router.back()} style={styles.backRow}>
            <Ionicons name="chevron-back" size={22} color={colors.secondary} />
            <Text style={[styles.backText, { color: colors.secondary }]}>Voltar</Text>
          </TouchableOpacity>

          <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
            <Image source={{ uri: NEW_LOGO }} style={styles.logo} resizeMode="contain" />
            <Text style={[styles.welcomeText, { color: colors.secondary }]}>
              {isPremium ? 'Acesso Premium' : 'Alfabetização Interativa'}
            </Text>
            <Text style={[styles.subtitle, { color: '#888' }]}>Entre com seu email utilizado na compra</Text>
            <View style={styles.lineRow}>
              <View style={[styles.accentLine, { backgroundColor: colors.primary }]} />
              <View style={[styles.accentLine, { backgroundColor: colors.accent }]} />
              <View style={[styles.accentLine, { backgroundColor: colors.secondary }]} />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.card}>
            {/* Animated border glow */}
            <View style={[styles.glowBorderOuter, { borderColor: colors.primary }]} />

            <View style={styles.inputGroup}>
              <View style={[styles.inputWrapper, { borderColor: 'rgba(1,207,201,0.3)' }]}>
                <Ionicons name="mail-outline" size={18} color={colors.primary} style={styles.inputIcon} />
                <TextInput
                  testID="login-email-input"
                  style={[styles.input, { color: '#333' }]}
                  placeholder="Seu email"
                  placeholderTextColor="#aaa"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={[styles.inputWrapper, { borderColor: 'rgba(1,207,201,0.3)' }]}>
                <Ionicons name="person-outline" size={18} color={colors.primary} style={styles.inputIcon} />
                <TextInput
                  testID="login-name-input"
                  style={[styles.input, { color: '#333' }]}
                  placeholder="Nome da criança"
                  placeholderTextColor="#aaa"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={[styles.inputWrapper, { borderColor: 'rgba(1,207,201,0.3)' }]}>
                <Ionicons name="lock-closed-outline" size={18} color={colors.primary} style={styles.inputIcon} />
                <TextInput
                  testID="login-password-input"
                  style={[styles.input, { color: '#333' }]}
                  placeholder="Senha de acesso"
                  placeholderTextColor="#aaa"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            {/* Premium animated button */}
            <TouchableOpacity
              testID="login-submit-btn"
              style={[styles.loginBtn, { backgroundColor: colors.primary }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <View style={[styles.btnGlowBorder, { borderColor: colors.accent }]} />
              <Text style={[styles.loginBtnText, { color: '#fff' }]}>{loading ? 'Entrando...' : 'Continuar'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID="install-app-btn"
              style={[styles.installBtn, { borderColor: colors.secondary }]}
              onPress={() => setShowInstall(true)}
              activeOpacity={0.7}
            >
              <View style={[styles.btnGlowBorder, { borderColor: colors.primary, opacity: 0.3 }]} />
              <Ionicons name="download-outline" size={18} color={colors.secondary} />
              <Text style={[styles.installBtnText, { color: colors.secondary }]}>Instalar App</Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.helpText}>Precisa de ajuda? Entre em contato</Text>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showInstall} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowInstall(false)}>
              <Ionicons name="close-circle" size={28} color={colors.secondary} />
            </TouchableOpacity>
            <Ionicons name="phone-portrait-outline" size={40} color={colors.primary} style={{ alignSelf: 'center', marginBottom: 16 }} />
            <Text style={styles.modalTitle}>Instalar o App</Text>
            {[
              'Toque no ícone de Compartilhar (quadrado com seta para cima, no rodapé).',
              'Role para baixo e selecione "Adicionar à Tela de Início".',
              'Toque em "Adicionar" no canto superior direito.',
            ].map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}><Text style={styles.stepNumText}>{i + 1}</Text></View>
                <Text style={styles.modalStep}>{step}</Text>
              </View>
            ))}
            <TouchableOpacity style={[styles.modalOkBtn, { backgroundColor: colors.primary }]} onPress={() => setShowInstall(false)}>
              <Text style={[styles.modalOkText, { color: '#fff' }]}>Entendi!</Text>
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
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 20 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  backText: { fontSize: 14, fontWeight: '500' },
  header: { alignItems: 'center', marginBottom: 24 },
  logo: { width: 200, height: 80, marginBottom: 12 },
  welcomeText: { fontSize: 18, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  subtitle: { fontSize: 13, marginBottom: 8 },
  lineRow: { flexDirection: 'row', gap: 4 },
  accentLine: { width: 30, height: 3, borderRadius: 2 },
  card: { borderRadius: 24, padding: 24, backgroundColor: '#FFFFFF', position: 'relative', shadowColor: '#01CFC9', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 8 },
  glowBorderOuter: { position: 'absolute', top: -1, left: -1, right: -1, bottom: -1, borderRadius: 25, borderWidth: 2, opacity: 0.4 },
  inputGroup: { marginBottom: 14 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', height: 52, borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 14, backgroundColor: '#F5F6FA' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15 },
  error: { color: '#FF4444', fontSize: 13, textAlign: 'center', marginBottom: 8 },
  loginBtn: { paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 8, position: 'relative', overflow: 'hidden' },
  btnGlowBorder: { position: 'absolute', top: -1, left: -1, right: -1, bottom: -1, borderRadius: 17, borderWidth: 2, opacity: 0.5 },
  loginBtnText: { fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  installBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14, paddingVertical: 14, borderRadius: 16, borderWidth: 1.5, position: 'relative', overflow: 'hidden' },
  installBtnText: { fontSize: 15, fontWeight: '600' },
  helpText: { textAlign: 'center', color: '#aaa', fontSize: 12, marginTop: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { borderRadius: 24, padding: 28, width: '100%', maxWidth: 360, position: 'relative', backgroundColor: '#fff' },
  modalClose: { position: 'absolute', top: 16, right: 16, zIndex: 10 },
  modalTitle: { fontSize: 22, fontWeight: '800', marginBottom: 20, textAlign: 'center', color: '#333' },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  stepNumber: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  stepNumText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  modalStep: { flex: 1, fontSize: 14, lineHeight: 20, color: '#555' },
  modalOkBtn: { paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 8 },
  modalOkText: { fontSize: 15, fontWeight: '700' },
});
