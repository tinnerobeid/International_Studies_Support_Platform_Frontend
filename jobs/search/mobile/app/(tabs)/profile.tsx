import {
  View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Switch,
} from 'react-native'
import { useAuthStore } from '@/store/auth'
import { useLangStore } from '@/store/lang'
import { authApi } from '@/lib/api/auth'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { User, Briefcase, FileText, LogOut, ChevronRight, Globe, Edit3, Award, Bell, Building2 } from 'lucide-react-native'

export default function ProfileScreen() {
  const { user, logout } = useAuthStore()
  const { lang, setLang, t } = useLangStore()
  const router = useRouter()

  const handleLogout = () => {
    Alert.alert(
      t('Logout', 'Ondoka'),
      t('Are you sure?', 'Una uhakika?'),
      [
        { text: t('Cancel', 'Ghairi'), style: 'cancel' },
        {
          text: t('Logout', 'Ondoka'),
          style: 'destructive',
          onPress: async () => {
            const refresh = await AsyncStorage.getItem('refresh_token')
            if (refresh) await authApi.logout(refresh).catch(() => {})
            await logout()
          },
        },
      ]
    )
  }

  if (!user) {
    return (
      <View style={s.center}>
        <User size={56} color="#d1d5db" />
        <Text style={s.guestTitle}>{t('You are not logged in', 'Haujaingia')}</Text>
        <TouchableOpacity style={s.loginBtn} onPress={() => router.push('/auth/login')}>
          <Text style={s.loginBtnText}>{t('Login', 'Ingia')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/auth/register')}>
          <Text style={s.registerLink}>{t('Create Account', 'Fungua Akaunti')}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView style={s.container}>
      {/* Avatar + name */}
      <View style={s.avatarSection}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{user.full_name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={s.name}>{user.full_name}</Text>
        <Text style={s.phone}>{user.phone_number}</Text>
        <View style={s.roleBadge}>
          <Text style={s.roleBadgeText}>
            {user.role === 'EMPLOYER' ? t('Employer', 'Mwajiri') : t('Job Seeker', 'Mtafutaji Kazi')}
          </Text>
        </View>
      </View>

      {/* Seeker section */}
      {user.role === 'JOB_SEEKER' && (
        <View style={s.section}>
          <TouchableOpacity style={s.row} onPress={() => router.push('/profile/edit')}>
            <Edit3 size={18} color="#059669" />
            <Text style={s.rowText}>{t('Edit Profile', 'Hariri Wasifu')}</Text>
            <ChevronRight size={16} color="#9ca3af" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
          <TouchableOpacity style={s.row} onPress={() => router.push('/profile/cv')}>
            <Award size={18} color="#059669" />
            <Text style={s.rowText}>{t('My CV', 'CV Yangu')}</Text>
            <ChevronRight size={16} color="#9ca3af" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
          <TouchableOpacity style={s.row} onPress={() => router.push('/profile/alerts')}>
            <Bell size={18} color="#059669" />
            <Text style={s.rowText}>{t('Job Alerts', 'Arifa za Kazi')}</Text>
            <ChevronRight size={16} color="#9ca3af" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
          <TouchableOpacity style={s.row} onPress={() => router.push('/dashboard/seeker')}>
            <FileText size={18} color="#059669" />
            <Text style={s.rowText}>{t('My Applications', 'Maombi Yangu')}</Text>
            <ChevronRight size={16} color="#9ca3af" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        </View>
      )}

      {/* Employer section */}
      {user.role === 'EMPLOYER' && (
        <View style={s.section}>
          <TouchableOpacity style={s.row} onPress={() => router.push('/dashboard/employer')}>
            <Briefcase size={18} color="#059669" />
            <Text style={s.rowText}>{t('My Jobs', 'Kazi Zangu')}</Text>
            <ChevronRight size={16} color="#9ca3af" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
          <TouchableOpacity style={s.row} onPress={() => router.push('/dashboard/post-job')}>
            <FileText size={18} color="#059669" />
            <Text style={s.rowText}>{t('Post a Job', 'Tuma Kazi')}</Text>
            <ChevronRight size={16} color="#9ca3af" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
          <TouchableOpacity style={s.row} onPress={() => router.push('/dashboard/company/new')}>
            <Building2 size={18} color="#059669" />
            <Text style={s.rowText}>{t('Create Company', 'Unda Kampuni')}</Text>
            <ChevronRight size={16} color="#9ca3af" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        </View>
      )}

      <View style={s.section}>
        <View style={s.row}>
          <Globe size={18} color="#6b7280" />
          <Text style={s.rowText}>{t('Language', 'Lugha')}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            <Text style={[s.langLabel, lang === 'en' && s.langActive]}>EN</Text>
            <Switch
              value={lang === 'sw'}
              onValueChange={(v) => setLang(v ? 'sw' : 'en')}
              trackColor={{ true: '#059669', false: '#e5e7eb' }}
              thumbColor="#fff"
            />
            <Text style={[s.langLabel, lang === 'sw' && s.langActive]}>SW</Text>
          </View>
        </View>
      </View>

      <View style={s.section}>
        <TouchableOpacity style={s.row} onPress={handleLogout}>
          <LogOut size={18} color="#ef4444" />
          <Text style={[s.rowText, { color: '#ef4444' }]}>{t('Logout', 'Ondoka')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingTop: 100 },
  guestTitle: { fontSize: 16, color: '#374151', fontWeight: '600' },
  loginBtn: { backgroundColor: '#059669', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 12 },
  loginBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  registerLink: { color: '#059669', fontSize: 14 },
  avatarSection: { backgroundColor: '#059669', paddingTop: 64, paddingBottom: 28, alignItems: 'center' },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '700' },
  name: { color: '#fff', fontSize: 20, fontWeight: '700' },
  phone: { color: '#a7f3d0', fontSize: 13, marginTop: 2 },
  roleBadge: { marginTop: 8, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  roleBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  section: { backgroundColor: '#fff', borderRadius: 14, marginHorizontal: 16, marginTop: 16, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  rowText: { fontSize: 15, color: '#111827', fontWeight: '500' },
  langLabel: { fontSize: 13, color: '#9ca3af', fontWeight: '600' },
  langActive: { color: '#059669' },
})
