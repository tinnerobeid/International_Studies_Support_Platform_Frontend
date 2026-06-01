import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { applicationsApi } from '@/lib/api/applications'
import { useLangStore } from '@/store/lang'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'expo-router'
import { Bookmark } from 'lucide-react-native'
import dayjs from 'dayjs'

export default function SavedScreen() {
  const { t } = useLangStore()
  const { user } = useAuthStore()
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ['saved-jobs'],
    queryFn: applicationsApi.saved,
    enabled: !!user,
  })

  if (!user) {
    return (
      <View style={s.center}>
        <Bookmark size={48} color="#d1d5db" />
        <Text style={s.emptyTitle}>{t('Sign in to see saved jobs', 'Ingia kuona kazi zilizohifadhiwa')}</Text>
        <TouchableOpacity style={s.loginBtn} onPress={() => router.push('/auth/login')}>
          <Text style={s.loginBtnText}>{t('Login', 'Ingia')}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (isLoading) return <ActivityIndicator color="#059669" style={{ marginTop: 60 }} />

  const saved = data?.results || []

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>{t('Saved Jobs', 'Kazi Zilizohifadhiwa')}</Text>
      </View>

      {saved.length === 0 ? (
        <View style={s.center}>
          <Bookmark size={48} color="#d1d5db" />
          <Text style={s.emptyTitle}>{t('No saved jobs', 'Hakuna kazi zilizohifadhiwa')}</Text>
        </View>
      ) : (
        <FlatList
          data={saved}
          keyExtractor={(item) => item.id}
          contentContainerStyle={s.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={s.card}
              onPress={() => router.push(`/jobs/${item.job.slug}`)}
            >
              <Text style={s.jobTitle} numberOfLines={1}>{item.job.title}</Text>
              <Text style={s.company}>{item.job.company_name}</Text>
              <Text style={s.region}>{item.job.region_name}</Text>
              <Text style={s.time}>{dayjs(item.saved_at).fromNow()}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { backgroundColor: '#fff', paddingTop: 56, paddingBottom: 16, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  title: { fontSize: 20, fontWeight: '700', color: '#111827' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyTitle: { fontSize: 15, color: '#9ca3af', textAlign: 'center' },
  loginBtn: { backgroundColor: '#059669', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
  loginBtnText: { color: '#fff', fontWeight: '700' },
  list: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  jobTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
  company: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  region: { fontSize: 12, color: '#9ca3af', marginTop: 1 },
  time: { fontSize: 11, color: '#d1d5db', marginTop: 6, alignSelf: 'flex-end' },
})
