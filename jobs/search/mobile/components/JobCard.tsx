import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useLangStore } from '@/store/lang'
import { MapPin, Clock } from 'lucide-react-native'
import dayjs from 'dayjs'
import type { Job } from '@/types'

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  FULL_TIME: { bg: '#d1fae5', text: '#065f46' },
  PART_TIME: { bg: '#dbeafe', text: '#1e40af' },
  CONTRACT: { bg: '#fef3c7', text: '#92400e' },
  CASUAL: { bg: '#f3e8ff', text: '#6b21a8' },
  INTERNSHIP: { bg: '#fce7f3', text: '#9d174d' },
  VOLUNTEER: { bg: '#e0f2fe', text: '#0c4a6e' },
}

export default function JobCard({ job }: { job: Job }) {
  const { lang, t } = useLangStore()
  const router = useRouter()
  const typeColor = TYPE_COLORS[job.employment_type] || { bg: '#f3f4f6', text: '#374151' }
  const title = lang === 'sw' && job.title_sw ? job.title_sw : job.title

  return (
    <TouchableOpacity
      style={s.card}
      onPress={() => router.push(`/jobs/${job.slug}`)}
      activeOpacity={0.7}
    >
      <View style={s.header}>
        <View style={s.initials}>
          <Text style={s.initialsText}>{job.company_name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={s.info}>
          <Text style={s.title} numberOfLines={1}>{title}</Text>
          <Text style={s.company} numberOfLines={1}>{job.company_name}</Text>
        </View>
      </View>

      <View style={s.meta}>
        {job.region_name && (
          <View style={s.metaItem}>
            <MapPin size={12} color="#6b7280" />
            <Text style={s.metaText}>{job.region_name}</Text>
          </View>
        )}
        <View style={s.metaItem}>
          <Clock size={12} color="#6b7280" />
          <Text style={s.metaText}>{dayjs(job.created_at).fromNow()}</Text>
        </View>
      </View>

      <View style={s.footer}>
        <View style={[s.badge, { backgroundColor: typeColor.bg }]}>
          <Text style={[s.badgeText, { color: typeColor.text }]}>
            {job.employment_type.replace('_', ' ')}
          </Text>
        </View>
        {job.cv_required && (
          <View style={s.cvBadge}>
            <Text style={s.cvText}>{t('CV Required', 'CV Inahitajika')}</Text>
          </View>
        )}
        {job.salary_display ? (
          <Text style={s.salary}>{job.salary_display}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  )
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  initials: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  initialsText: { color: '#065f46', fontWeight: '700', fontSize: 16 },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: '600', color: '#111827' },
  company: { fontSize: 12, color: '#6b7280', marginTop: 1 },
  meta: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 11, color: '#6b7280' },
  footer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  cvBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, backgroundColor: '#fef3c7' },
  cvText: { fontSize: 11, fontWeight: '600', color: '#92400e' },
  salary: { fontSize: 12, color: '#059669', fontWeight: '600', marginLeft: 'auto' },
})
