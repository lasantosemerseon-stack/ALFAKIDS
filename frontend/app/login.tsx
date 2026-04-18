import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Modal, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import { useAuth } from '../src/contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

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
  const accentColor = isPremium ? colors.primary : colors.accent;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
            <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
              {isPremium ? 'Acesso Premium' : 'Alfabetização Interativa'}
            </Text>
            <Text style={[styles.title, { color: accentColor }]}>alfakids</Text>
            <View style={[styles.line, { backgroundColor: accentColor }]} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Seu Email</Text>
            <TextInput
              testID="login-email-input"
              style={[styles.input, { backgroundColor: colors.bgSecondary, color: colors.text, borderColor: colors.cardBorder }]}
              placeholder="seu@email.com"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>Nome da Criança</Text>
            <TextInput
              testID="login-name-input"
              style={[styles.input, { backgroundColor: colors.bgSecondary, color: colors.text, borderColor: colors.cardBorder }]}
              placeholder="Nome da criança"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>Senha</Text>
            <TextInput
              testID="login-password-input"
              style={[styles.input, { backgroundColor: colors.bgSecondary, color: colors.text, borderColor: colors.cardBorder }]}
              placeholder="Senha de acesso"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              testID="login-submit-btn"
              style={[styles.loginBtn, { backgroundColor: accentColor }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginBtnText}>{loading ? 'Entrando...' : 'Continuar'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID="install-app-btn"
              style={[styles.installBtn, { borderColor: accentColor }]}
              onPress={() => setShowInstall(true)}
            >
              <Text style={[styles.installBtnText, { color: accentColor }]}>Instalar App</Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={[styles.backText, { color: colors.textSecondary }]}>Voltar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showInstall} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Instalar o App</Text>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowInstall(false)}>
              <Text style={[styles.modalCloseText, { color: colors.textSecondary }]}>✕</Text>
            </TouchableOpacity>
            <Text style={[styles.modalStep, { color: colors.textSecondary }]}>
              1. Toque no ícone de Compartilhar (quadrado com seta para cima, no rodapé).
            </Text>
            <Text style={[styles.modalStep, { color: colors.textSecondary }]}>
              2. Role para baixo e selecione "Adicionar à Tela de Início".
            </Text>
            <Text style={[styles.modalStep, { color: colors.textSecondary }]}>
              3. Toque em "Adicionar" no canto superior direito.
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 },
  header: { alignItems: 'center', marginBottom: 32 },
  welcomeText: { fontSize: 14, fontWeight: '400', marginBottom: 8 },
  title: { fontSize: 32, fontWeight: '700', letterSpacing: 2 },
  line: { width: 80, height: 2, marginTop: 12, borderRadius: 1 },
  card: { borderRadius: 20, padding: 24, borderWidth: 1 },
  label: { fontSize: 13, fontWeight: '500', marginBottom: 6, marginTop: 16 },
  input: { height: 50, borderRadius: 12, paddingHorizontal: 16, fontSize: 15, borderWidth: 1 },
  error: { color: '#FF4444', fontSize: 13, marginTop: 12, textAlign: 'center' },
  loginBtn: { marginTop: 24, paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  loginBtnText: { color: '#0D0D0D', fontSize: 16, fontWeight: '700' },
  installBtn: { marginTop: 12, paddingVertical: 14, borderRadius: 14, alignItems: 'center', borderWidth: 1.5 },
  installBtnText: { fontSize: 15, fontWeight: '600' },
  backBtn: { marginTop: 20, alignItems: 'center' },
  backText: { fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { borderRadius: 20, padding: 24, width: '100%', maxWidth: 360, position: 'relative' },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  modalClose: { position: 'absolute', top: 16, right: 16 },
  modalCloseText: { fontSize: 20 },
  modalStep: { fontSize: 15, lineHeight: 24, marginBottom: 12 },
});
