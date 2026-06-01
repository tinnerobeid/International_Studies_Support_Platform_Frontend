import { Tabs } from 'expo-router'
import { useLangStore } from '@/store/lang'
import { useAuthStore } from '@/store/auth'
import { Briefcase, Search, BookmarkCheck, User } from 'lucide-react-native'

export default function TabLayout() {
  const { t } = useLangStore()
  const { user } = useAuthStore()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: { borderTopColor: '#e5e7eb', paddingTop: 4 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('Home', 'Nyumbani'),
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: t('Jobs', 'Kazi'),
          tabBarIcon: ({ color, size }) => <Briefcase color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: t('Saved', 'Zilizohifadhiwa'),
          tabBarIcon: ({ color, size }) => <BookmarkCheck color={color} size={size} />,
          href: user ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('Profile', 'Wasifu'),
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  )
}
