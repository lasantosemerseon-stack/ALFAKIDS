import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/contexts/ThemeContext';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

export default function TabLayout() {
  const { colors, toggle, mode } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0.5, borderBottomColor: colors.cardBorder },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700', fontSize: 16, color: colors.secondary },
        tabBarStyle: { backgroundColor: colors.bg, borderTopColor: colors.cardBorder, borderTopWidth: 0.5, height: 60, paddingBottom: 8 },
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        headerRight: () => (
          <TouchableOpacity testID="dark-mode-toggle" onPress={toggle} style={styles.themeBtn}>
            <Ionicons name={mode === 'dark' ? 'sunny' : 'moon'} size={20} color={colors.primary} />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="musica"
        options={{
          title: 'Músicas',
          headerTitle: 'alfakids',
          tabBarIcon: ({ color, size }) => <Ionicons name="musical-notes" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="alfabetizacao"
        options={{
          title: 'ABC',
          headerTitle: 'Alfabetização',
          tabBarIcon: ({ color, size }) => <Ionicons name="book" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ingles"
        options={{
          title: 'English',
          headerTitle: 'Aprender em Inglês',
          tabBarIcon: ({ color, size }) => <Ionicons name="language" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="recursos"
        options={{
          title: 'Recursos',
          headerTitle: 'Recursos Pedagógicos',
          tabBarIcon: ({ color, size }) => <Ionicons name="folder-open" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  themeBtn: { marginRight: 16, padding: 6 },
});
