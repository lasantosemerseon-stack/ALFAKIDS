import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/contexts/ThemeContext';
import { TouchableOpacity, View, StyleSheet, Image, Text } from 'react-native';

const NEW_LOGO = 'https://customer-assets.emergentagent.com/job_pedagogy-music-hub/artifacts/j41hwonf_Design%20sem%20nome%20%285%29.png';

export default function TabLayout() {
  const { colors, toggle, mode } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0, height: 70 },
        headerTintColor: colors.text,
        headerTitle: () => (
          <Image source={{ uri: NEW_LOGO }} style={styles.headerLogo} resizeMode="contain" />
        ),
        headerLeft: () => (
          <TouchableOpacity testID="menu-btn" style={styles.menuBtn}>
            <Ionicons name="menu" size={24} color={colors.primary} />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity testID="dark-mode-toggle" onPress={toggle} style={styles.themeBtn}>
            <View style={[styles.themeCircle, { backgroundColor: colors.primary + '20', borderColor: colors.primary + '40' }]}>
              <Ionicons name={mode === 'dark' ? 'sunny' : 'moon'} size={18} color={colors.primary} />
            </View>
          </TouchableOpacity>
        ),
        tabBarStyle: { backgroundColor: colors.bg, borderTopColor: colors.primary + '15', borderTopWidth: 1, height: 64, paddingBottom: 8, paddingTop: 4 },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
      }}
    >
      <Tabs.Screen
        name="musica"
        options={{
          title: 'Músicas',
          tabBarIcon: ({ color, size }) => <Ionicons name="musical-notes" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="alfabetizacao"
        options={{
          title: 'ABC',
          tabBarIcon: ({ color, size }) => <Ionicons name="book" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ingles"
        options={{
          title: 'English',
          tabBarIcon: ({ color, size }) => <Ionicons name="language" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="recursos"
        options={{
          title: 'Recursos',
          tabBarIcon: ({ color, size }) => <Ionicons name="folder-open" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  menuBtn: { marginLeft: 16, padding: 6 },
  themeBtn: { marginRight: 16, padding: 4 },
  themeCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerLogo: { width: 120, height: 40 },
});
