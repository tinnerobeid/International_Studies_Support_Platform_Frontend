import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert,
} from 'react-native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { jobsApi } from '@/lib/api/jobs'
import { useLangStore } from '@/store/lang'
import { useRouter } from 'expo-router'
import { ArrowLeft, Plus, Users, Eye } from 'lucide-react-native'
import dayjs from 'dayjs'

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  ACTIVE: { bg: '#d1fae5', text: '#065f46' },
  DRAFT: { bg: '#f3f4f6', text: '#374151' },
  CLOSED: { bg: '#fee2e2', text: '#991b1b' },
  EXPIRED: { bg: '#fef3c7', text: '#92400e' },
}

export default function EmployerDashboardScreen() {
  const { t } = useLangStore()
  const router = useRouter()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['my-jobs'],
    queryFn: jobsApi.mine,
  })

  const closeMutation = useMutation({
    mutationFn: (slug: string) => jobsApi.update(slug, { status: 'CLOSED' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-jobs'] }),
  })

  const jobs = data?.results || []
  const activeCount = jobs.filter((j) => j.status === 'ACTIVE').length
  const totalApps = jobs.reduce((s, j) => s + (j.applications_count || 0), 0)

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft size={20} color="#374151" />
        </TouchableOpacity>
        <Text style={s.title}>{t('My Jobs', 'Kazi Zangu')}</Text>
        <TouchableOpacity style={s.addBtn} onPress={() => router.push('/dashboard/post-job')}>
          <Plus size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={s.statsRow}>
        <View style={s.stat}>
          <Text style={s.statVal}>{activeCount}</Text>
          <Text style={s.statLabel}>{t('Active', 'Zinazoendelea')}</Text>
        </View>
        <View style={s.statDivider} />
        <View style={s.stat}>
          <Text style={s.statVal}>{jobs.length}</Text>
          <Text style={s.statLabel}>{t('Total', 'Jumla')}</Text>
        </View>
        <View style={s.statDivider} />
        <View style={s.stat}>
          <Text style={s.statVal}>{totalApps}</Text>
          <Text style={s.statLabel}>{t('Applications', 'Maombi')}</Text>
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator color="#059669" style={{ marginTop: 40 }} />
      ) : jobs.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyText}>{t('No jobs posted yet', 'Hakuna kazi bado')}</Text>
          <TouchableOpacity style={s.postBtn} onPress={() => router.push('/dashboard/post-job')}>
            <Text style={s.postBtnText}>{t('Post a Job', 'Tuma Kazi')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={s.list}
          renderItem={({ item }) => {
            const sc = STATUS_COLORS[item.status] || STATUS_COLORS.DRAFT
            return (
              <View style={s.card}>
                <View style={s.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.jobTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={s.meta}>{dayjs(item.created_at).format('MMM D, YYYY')}</Text>
                    <Text style={s.appCount}>{item.applications_count} {t('applications', 'maombi')}</Text>
                  </View>
                  <View style={[s.statusBadge, { backgroundColor: sc.bg }]}>
                    <Text style={[s.statusText, { color: sc.text }]}>{item.status}</Text>
                  </View>
                </View>
                <View style={s.actions}>
                  <TouchableOpacity
                    style={s.actionBtn}
                    onPress={() => router.push(`/dashboard/applicants/${item.slug}`)}
                  >
                    <Users size={14} color="#374151" />
                    <Text style={s.actionText}>{t('Applicants', 'Waombaji')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={s.actionBtn}
                    onPress={() => router.push(`/jobs/${item.slug}`)}
                  >
                    <Eye size={14} color="#374151" />
                    <Text style={s.actionText}>{t('View', 'Ona')}</Text>
                  </TouchableOpacity>
                  {item.status === 'ACTIVE' && (
                    <TouchableOpacity
                      style={[s.actionBtn, s.closeBtn]}
                      onPress={() => Alert.alert(
                        t('Close Job', 'Funga Kazi'),
                        t('Close this listing?', 'Funga tangazo hili?'),
                        [
                          { text: t('Cancel', 'Ghairi'), style: 'cancel' },
                          { text: t('Close', 'Funga'), style: 'destructive', onPress: () => closeMutation.mutate(item.slug) },
                        ]
                      )}
                    >
                      <Text style={s.closeBtnText}>{t('Close', 'Funga')}</Text>
                    </TouchableOpacity>
                  )}
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
  addBtn: { width: 36, height: 36, backgroundColor: '#059669', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  stat: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 22, fontWeight: '700', color: '#111827' },
  statLabel: { fontSize: 11, color: '#6b7280', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: '#e5e7eb' },
  list: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  jobTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
  meta: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  appCount: { fontSize: 12, color: '#6b7280', marginTop: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  actionText: { fontSize: 12, color: '#374151' },
  closeBtn: { borderColor: '#fecaca' },
  closeBtnText: { fontSize: 12, color: '#ef4444' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  emptyText: { color: '#9ca3af', fontSize: 15 },
  postBtn: { backgroundColor: '#059669', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
  postBtnText: { color: '#fff', fontWeight: '700' },
})
