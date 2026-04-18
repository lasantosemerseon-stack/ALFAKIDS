import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Modal, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import { useAuth } from '../src/contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Image } from 'react-native';

const MASCOT_URL = 'https://static.prod-images.emergentagent.com/jobs/ac182c3c-c918-4b1d-b4ee-4df3aec12d34/images/958755e7930dbc405da4d1f7010f7927192346d880987c5e44402d5aad6ad5d5.png';
const LOGO_URL = 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/8lneoeq1_LOGO%20KIDS%20ALFA.jpeg';

// Purple/Blue palette from second logo
const loginColors = {
  bgGradientTop: '#1A0A2E',
  bgGradientBot: '#0D0D1A',
  accent: '#7C3AED',
  accentLight: '#A78BFA',
  accentCyan: '#00E5FF',
  accentBlue: '#2563EB',
  cardBg: 'rgba(124, 58, 237, 0.08)',
  cardBorder: 'rgba(124, 58, 237, 0.25)',
  inputBg: 'rgba(13, 13, 26, 0.8)',
  inputBorder: 'rgba(124, 58, 237, 0.3)',
};

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
    if (!email || !name || !password) {
      setError('Preencha todos os campos');
      return;
    }
    setLoading(true);
    setError('');
    const success = await login(email, name, password, mode);
    setLoading(false);
    if (success) {
      router.replace('/(tabs)/musica');
    } else {
      setError('Senha incorreta. Verifique e tente novamente.');
    }
  };

  const isPremium = mode === 'premium';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: loginColors.bgGradientTop }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity testID="login-back-btn" onPress={() => router.back()} style={styles.backRow}>
            <Ionicons name="chevron-back" size={22} color={loginColors.accentLight} />
            <Text style={[styles.backText, { color: loginColors.accentLight }]}>Voltar</Text>
          </TouchableOpacity>

          <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
            <Image source={{ uri: MASCOT_URL }} style={styles.mascot} resizeMode="contain" />
            <Image source={{ uri: LOGO_URL }} style={styles.logo} resizeMode="contain" />
            <Text style={[styles.welcomeText, { color: loginColors.accentLight }]}>
              {isPremium ? 'Acesso Premium' : 'Alfabetização Interativa'}
            </Text>
            <Text style={styles.subtitle}>Entre com seu email utilizado na compra</Text>
            <View style={[styles.line, { backgroundColor: loginColors.accent }]} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={[styles.card, { backgroundColor: loginColors.cardBg, borderColor: loginColors.cardBorder }]}>
            <View style={styles.inputGroup}>
              <View style={[styles.inputWrapper, { backgroundColor: loginColors.inputBg, borderColor: loginColors.inputBorder }]}>
                <Ionicons name="mail-outline" size={18} color={loginColors.accentLight} style={styles.inputIcon} />
                <TextInput
                  testID="login-email-input"
                  style={[styles.input, { color: '#FFFFFF' }]}
                  placeholder="Seu email"
                  placeholderTextColor="rgba(167, 139, 250, 0.4)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={[styles.inputWrapper, { backgroundColor: loginColors.inputBg, borderColor: loginColors.inputBorder }]}>
                <Ionicons name="person-outline" size={18} color={loginColors.accentLight} style={styles.inputIcon} />
                <TextInput
                  testID="login-name-input"
                  style={[styles.input, { color: '#FFFFFF' }]}
                  placeholder="Nome da criança"
                  placeholderTextColor="rgba(167, 139, 250, 0.4)"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={[styles.inputWrapper, { backgroundColor: loginColors.inputBg, borderColor: loginColors.inputBorder }]}>
                <Ionicons name="lock-closed-outline" size={18} color={loginColors.accentLight} style={styles.inputIcon} />
                <TextInput
                  testID="login-password-input"
                  style={[styles.input, { color: '#FFFFFF' }]}
                  placeholder="Senha de acesso"
                  placeholderTextColor="rgba(167, 139, 250, 0.4)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            {error ? (
              <Animated.View entering={FadeInDown.duration(300)}>
                <Text style={styles.error}>{error}</Text>
              </Animated.View>
            ) : null}

            <TouchableOpacity
              testID="login-submit-btn"
              style={[styles.loginBtn, { backgroundColor: loginColors.accent }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.loginBtnText}>{loading ? 'Entrando...' : 'Continuar'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID="install-app-btn"
              style={[styles.installBtn, { borderColor: loginColors.accentCyan }]}
              onPress={() => setShowInstall(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="download-outline" size={18} color={loginColors.accentCyan} />
              <Text style={[styles.installBtnText, { color: loginColors.accentCyan }]}>Instalar App</Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.helpText}>Precisa de ajuda? Entre em contato</Text>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showInstall} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: loginColors.bgGradientTop, borderColor: loginColors.cardBorder }]}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowInstall(false)}>
              <Ionicons name="close-circle" size={28} color={loginColors.accentLight} />
            </TouchableOpacity>
            <Ionicons name="phone-portrait-outline" size={40} color={loginColors.accent} style={{ alignSelf: 'center', marginBottom: 16 }} />
            <Text style={[styles.modalTitle, { color: '#FFFFFF' }]}>Instalar o App</Text>
            <View style={styles.stepRow}>
              <View style={[styles.stepNumber, { backgroundColor: loginColors.accent }]}><Text style={styles.stepNumText}>1</Text></View>
              <Text style={styles.modalStep}>Toque no ícone de Compartilhar (quadrado com seta para cima, no rodapé).</Text>
            </View>
            <View style={styles.stepRow}>
              <View style={[styles.stepNumber, { backgroundColor: loginColors.accent }]}><Text style={styles.stepNumText}>2</Text></View>
              <Text style={styles.modalStep}>Role para baixo e selecione "Adicionar à Tela de Início".</Text>
            </View>
            <View style={styles.stepRow}>
              <View style={[styles.stepNumber, { backgroundColor: loginColors.accent }]}><Text style={styles.stepNumText}>3</Text></View>
              <Text style={styles.modalStep}>Toque em "Adicionar" no canto superior direito.</Text>
            </View>
            <TouchableOpacity style={[styles.modalOkBtn, { backgroundColor: loginColors.accent }]} onPress={() => setShowInstall(false)}>
              <Text style={styles.modalOkText}>Entendi!</Text>
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
  mascot: { width: 100, height: 100, marginBottom: 8 },
  logo: { width: 140, height: 60, marginBottom: 8 },
  welcomeText: { fontSize: 16, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  subtitle: { fontSize: 13, color: 'rgba(167, 139, 250, 0.6)', marginBottom: 8 },
  line: { width: 60, height: 2, borderRadius: 1 },
  card: { borderRadius: 24, padding: 24, borderWidth: 1 },
  inputGroup: { marginBottom: 14 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', height: 52, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, height: '100%' },
  error: { color: '#FF6B6B', fontSize: 13, textAlign: 'center', marginBottom: 8 },
  loginBtn: { paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 8 },
  loginBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  installBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14, paddingVertical: 14, borderRadius: 14, borderWidth: 1.5 },
  installBtnText: { fontSize: 15, fontWeight: '600' },
  helpText: { textAlign: 'center', color: 'rgba(167, 139, 250, 0.4)', fontSize: 12, marginTop: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { borderRadius: 24, padding: 28, width: '100%', maxWidth: 360, position: 'relative', borderWidth: 1 },
  modalClose: { position: 'absolute', top: 16, right: 16, zIndex: 10 },
  modalTitle: { fontSize: 22, fontWeight: '800', marginBottom: 20, textAlign: 'center' },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  stepNumber: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  stepNumText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  modalStep: { flex: 1, fontSize: 14, lineHeight: 20, color: 'rgba(255,255,255,0.7)' },
  modalOkBtn: { paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 8 },
  modalOkText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
