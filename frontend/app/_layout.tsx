import { Stack } from 'expo-router';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { AuthProvider } from '../src/contexts/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';

function AppRoot() {
  const { width } = useWindowDimensions();
  // Mobile native => no constraint (let device decide)
  // Mobile web (small browser <900px) => 480px (perfeito como está)
  // Desktop web (>= 900px) => max 1280px (preenche a tela como plataforma)
  const isWeb = Platform.OS === 'web';
  const isDesktop = isWeb && width >= 900;

  const containerStyle = [
    styles.rootContainer,
    isWeb && (isDesktop ? styles.desktopContainer : styles.mobileWebContainer),
  ];

  return (
    <View style={containerStyle}>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="plans" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="song/[id]" options={{ presentation: 'modal' }} />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StatusBar style="light" />
        <AppRoot />
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
  // Desktop: plataforma web full-width até 1280px
  desktopContainer: {
    maxWidth: 1280,
  },
  // Mobile web (navegador estreito) — mantém formato mobile compacto
  mobileWebContainer: {
    maxWidth: 480,
  },
});
