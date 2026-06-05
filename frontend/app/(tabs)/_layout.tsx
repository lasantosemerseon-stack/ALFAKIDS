import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/contexts/ThemeContext';
import { TouchableOpacity, View, StyleSheet, Image, Text, Modal, Pressable } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

const LOGO_SEM_FUNDO = 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/cz5cen1e_logo%20fundo.png';

export default function TabLayout() {
  const { colors, toggle, mode } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const menuItems = [
    { label: 'Videoaulas do Panda', icon: 'play-circle', route: '/(tabs)/videoaulas' },
    { label: 'Alfabetização 30 Dias', icon: 'book', route: '/(tabs)/alfabetizacao' },
    { label: '+100 Vídeos', icon: 'videocam', route: '/(tabs)/videos100' },
    { label: 'Aprender Inglês', icon: 'language', route: '/(tabs)/ingles' },
    { label: 'Desenho', icon: 'color-palette', route: '/(tabs)/desenho' },
    { label: 'Bônus', icon: 'gift', route: '/(tabs)/recursos' },
    { label: 'Ver Planos', icon: 'diamond', route: '/plans' },
  ];

  return (
    <>
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0, height: 64 },
          headerTitle: () => (
            <View style={styles.headerCenter}>
              <Image source={{ uri: LOGO_SEM_FUNDO }} style={styles.headerLogo} resizeMode="contain" />
            </View>
          ),
          headerTitleAlign: 'center' as const,
          headerLeft: () => (
            <TouchableOpacity testID="menu-btn" style={styles.menuBtn} onPress={() => setMenuOpen(true)}>
              <View style={styles.menuLines}>
                <View style={[styles.menuLine, { backgroundColor: colors.primary }]} />
                <View style={[styles.menuLine, styles.menuLineShort, { backgroundColor: colors.primary }]} />
                <View style={[styles.menuLine, { backgroundColor: colors.primary }]} />
              </View>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity testID="dark-mode-toggle" onPress={toggle} style={styles.themeBtn}>
              <View style={[styles.themeCircle, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
                <Ionicons name={mode === 'dark' ? 'sunny' : 'moon'} size={18} color={colors.primary} />
              </View>
            </TouchableOpacity>
          ),
          tabBarStyle: { backgroundColor: colors.bg, borderTopColor: colors.primary + '15', borderTopWidth: 1, height: 68, paddingBottom: 8, paddingTop: 4 },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarLabelStyle: { fontSize: 9, fontWeight: '700' },
        }}
      >
        <Tabs.Screen name="videoaulas" options={{ title: 'Panda', tabBarIcon: ({ color, size }) => <Ionicons name="play-circle" size={size} color={color} /> }} />
        <Tabs.Screen name="alfabetizacao" options={{ title: '30 Dias', tabBarIcon: ({ color, size }) => <Ionicons name="book" size={size} color={color} /> }} />
        <Tabs.Screen name="videos100" options={{ title: 'Vídeos', tabBarIcon: ({ color, size }) => <Ionicons name="videocam" size={size} color={color} /> }} />
        <Tabs.Screen name="ingles" options={{ title: 'English', tabBarIcon: ({ color, size }) => <Ionicons name="language" size={size} color={color} /> }} />
        <Tabs.Screen name="desenho" options={{ title: 'Desenho', tabBarIcon: ({ color, size }) => <Ionicons name="color-palette" size={size} color={color} /> }} />
        <Tabs.Screen name="recursos" options={{ title: 'Bônus', tabBarIcon: ({ color, size }) => <Ionicons name="gift" size={size} color={color} /> }} />
        <Tabs.Screen name="musica" options={{ href: null }} />
      </Tabs>

      <Modal visible={menuOpen} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setMenuOpen(false)}>
          <View style={[styles.menuPanel, { backgroundColor: colors.bg, borderColor: colors.primary + '25' }]}>
            <View style={styles.menuHeader}>
              <Image source={{ uri: LOGO_SEM_FUNDO }} style={styles.menuLogo} resizeMode="contain" />
              <TouchableOpacity onPress={() => setMenuOpen(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={[styles.menuDivider, { backgroundColor: colors.primary + '20' }]} />
            {menuItems.map((item, i) => (
              <TouchableOpacity key={i} testID={`menu-item-${i}`} style={styles.menuItem}
                onPress={() => { setMenuOpen(false); router.push(item.route as any); }}>
                <Ionicons name={item.icon as any} size={20} color={colors.primary} />
                <Text style={[styles.menuItemText, { color: colors.text }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  menuBtn: { marginLeft: 16, padding: 8 },
  menuLines: { gap: 5 },
  menuLine: { width: 22, height: 2.5, borderRadius: 2 },
  menuLineShort: { width: 16 },
  themeBtn: { marginRight: 16, padding: 4 },
  themeCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerLogo: { width: 160, height: 50 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  menuPanel: { width: 280, height: '100%', borderRightWidth: 1, padding: 20, paddingTop: 50 },
  menuHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  menuLogo: { width: 100, height: 36 },
  menuDivider: { height: 1, marginBottom: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  menuItemText: { fontSize: 16, fontWeight: '600' },
});
