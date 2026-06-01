import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert,
} from 'react-native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { applicationsApi } from '@/lib/api/applications'
import { useLangStore } from '@/store/lang'
import { useRouter } from 'expo-router'
import { ArrowLeft, X } from 'lucide-react-native'
import dayjs from 'dayjs'

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  SUBMITTED: { bg: '#f3f4f6', text: '#374151' },
  VIEWED: { bg: '#dbeafe', text: '#1e40af' },
  SHORTLISTED: { bg: '#d1fae5', text: '#065f46' },
  REJECTED: { bg: '#fee2e2', text: '#991b1b' },
  HIRED: { bg: '#ede9fe', text: '#5b21b6' },
}

export default function SeekerDashboardScreen() {
  const { t } = useLangStore()
  const router = useRouter()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: applicationsApi.mine,
  })

  const withdrawMutation = useMutation({
    mutationFn: (id: string) => applicationsApi.withdraw(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-applications'] }),
    onError: () => Alert.alert(t('Error', 'Hitilafu'), t('Could not withdraw', 'Imeshindwa kufuta')),
  })

  const apps = data?.results || []

  const confirmWithdraw = (id: string) => {
    Alert.alert(
      t('Withdraw Application', 'Futa Ombi'),
      t('Are you sure?', 'Una uhakika?'),
      [
        { text: t('Cancel', 'Ghairi'), style: 'cancel' },
        { text: t('Withdraw', 'Futa'), style: 'destructive', onPress: () => withdrawMutation.mutate(id) },
      ]
    )
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft size={20} color="#374151" />
        </TouchableOpacity>
        <Text style={s.title}>{t('My Applications', 'Maombi Yangu')}</Text>
        <View style={s.count}>
          <Text style={s.countText}>{apps.length}</Text>
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator color="#059669" style={{ marginTop: 40 }} />
      ) : apps.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyText}>{t("You haven't applied yet", 'Bado hujaomba kazi')}</Text>
          <TouchableOpacity style={s.browseBtn} onPress={() => router.push('/(tabs)/jobs')}>
            <Text style={s.browseBtnText}>{t('Browse Jobs', 'Tafuta Kazi')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={apps}
          keyExtractor={(item) => item.id}
          contentContainerStyle={s.list}
          renderItem={({ item }) => {
            const sc = STATUS_COLORS[item.status] || STATUS_COLORS.SUBMITTED
            return (
              <View style={s.card}>
                <View style={s.cardTop}>
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity onPress={() => router.push(`/jobs/${item.job_slug}`)}>
                      <Text style={s.jobTitle} numberOfLines={1}>{item.job_title}</Text>
                    </TouchableOpacity>
                    <Text style={s.company}>{item.company_name}</Text>
                    <Text style={s.time}>{t('Applied', 'Uliomba')} {dayjs(item.applied_at).fromNow()}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 8 }}>
                    <View style={[s.statusBadge, { backgroundColor: sc.bg }]}>
                      <Text style={[s.statusText, { color: sc.text }]}>{item.status}</Text>
                    </View>
                    <TouchableOpacity onPress={() => confirmWithdraw(item.id)} style={s.withdrawBtn}>
                      <X size={14} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )
          }}
        />
      )}
    </View>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', paddingTop: 56, paddingBottom: 16, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  backBtn: { padding: 4 },
  title: { flex: 1, fontSize: 18, fontWeight: '700', color: '#111827' },
  count: { backgroundColor: '#d1fae5', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  countText: { color: '#065f46', fontWeight: '700', fontSize: 12 },
  list: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start' },
  jobTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
  company: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  time: { fontSize: 11, color: '#9ca3af', marginTop: 4 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: '600' },
  withdrawBtn: { padding: 4 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  emptyText: { color: '#9ca3af', fontSize: 15 },
  browseBtn: { backgroundColor: '#059669', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
  browseBtnText: { color: '#fff', fontWeight: '700' },
})
