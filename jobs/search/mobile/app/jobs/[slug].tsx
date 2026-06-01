import {
  View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator,
  StyleSheet, Linking, Alert,
} from 'react-native'
import LocationMap from '@/components/LocationMap'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { jobsApi } from '@/lib/api/jobs'
import { applicationsApi } from '@/lib/api/applications'
import { useLangStore } from '@/store/lang'
import { useAuthStore } from '@/store/auth'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import {
  ArrowLeft, MapPin, Clock, Users, Bookmark, BookmarkCheck,
  Phone, Mail, Navigation,
} from 'lucide-react-native'
import dayjs from 'dayjs'

const STATUS_COLORS: Record<string, string> = {
  FULL_TIME: '#d1fae5', PART_TIME: '#dbeafe', CONTRACT: '#fef3c7',
  CASUAL: '#f3e8ff', INTERNSHIP: '#fce7f3',
}

export default function JobDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const { t, lang } = useLangStore()
  const { user } = useAuthStore()
  const router = useRouter()
  const qc = useQueryClient()
  const [coverLetter, setCoverLetter] = useState('')
  const [saved, setSaved] = useState(false)

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', slug],
    queryFn: () => jobsApi.detail(slug!),
    enabled: !!slug,
  })

  const applyMutation = useMutation({
    mutationFn: () => {
      const fd = new FormData()
      fd.append('job', job!.id)
      if (coverLetter) fd.append('cover_letter', coverLetter)
      return applicationsApi.apply(fd)
    },
    onSuccess: () => {
      Alert.alert(t('Applied!', 'Umeomba!'), t('Application submitted.', 'Ombi limewasilishwa.'))
      qc.invalidateQueries({ queryKey: ['my-applications'] })
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || t('Failed', 'Imeshindwa')
      Alert.alert(t('Error', 'Hitilafu'), msg)
    },
  })

  const saveToggle = () => {
    if (!user) { router.push('/auth/login'); return }
    setSaved(!saved)
    applicationsApi.saveToggle(job!.id).catch(() => setSaved((v) => !v))
  }

  if (isLoading) {
    return <View style={s.center}><ActivityIndicator color="#059669" size="large" /></View>
  }

  if (!job) {
    return <View style={s.center}><Text>{t('Job not found', 'Kazi haikupatikana')}</Text></View>
  }

  const title = lang === 'sw' && job.title_sw ? job.title_sw : job.title
  const description = lang === 'sw' && job.description_sw ? job.description_sw : job.description
  const requirements = lang === 'sw' && job.requirements_sw ? job.requirements_sw : job.requirements
  const regionDisplay = lang === 'sw' ? (job.region_name_sw || job.region_name) : job.region_name

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Hi, I'm applying for the ${job.title} position.`)
    Linking.openURL(`whatsapp://send?phone=${job.whatsapp_number}&text=${msg}`)
  }

  const handleEmail = () => {
    Linking.openURL(`mailto:${job.contact_email}?subject=Application: ${job.title}`)
  }

  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.headerBg}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={s.saveBtn} onPress={saveToggle}>
            {saved
              ? <BookmarkCheck size={20} color="#fff" />
              : <Bookmark size={20} color="#fff" />}
          </TouchableOpacity>

          <View style={s.companyInitials}>
            <Text style={s.companyInitialsText}>{(job.company_name || '?').charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={s.jobTitle}>{title}</Text>
          <Text style={s.companyName}>{job.company_name}</Text>
        </View>

        {/* Meta chips */}
        <View style={s.metaRow}>
          {regionDisplay && (
            <View style={s.metaChip}>
              <MapPin size={12} color="#6b7280" />
              <Text style={s.metaChipText}>{regionDisplay}</Text>
            </View>
          )}
          <View style={[s.metaChip, { backgroundColor: STATUS_COLORS[job.employment_type] || '#f3f4f6' }]}>
            <Text style={[s.metaChipText, { color: '#065f46' }]}>{(job.employment_type || '').replace('_', ' ')}</Text>
          </View>
          {job.cv_required && (
            <View style={[s.metaChip, { backgroundColor: '#fef3c7' }]}>
              <Text style={[s.metaChipText, { color: '#92400e' }]}>{t('CV Required', 'CV Inahitajika')}</Text>
            </View>
          )}
        </View>

        <View style={s.body}>
          {/* Stats */}
          <View style={s.statsRow}>
            <View style={s.stat}>
              <Clock size={14} color="#6b7280" />
              <Text style={s.statText}>{t('Posted', 'Ilitumwa')} {dayjs(job.created_at).fromNow()}</Text>
            </View>
            <View style={s.stat}>
              <Users size={14} color="#6b7280" />
              <Text style={s.statText}>{job.applications_count} {t('applicants', 'waombaji')}</Text>
            </View>
          </View>

          {job.salary_display ? (
            <View style={s.salaryBox}>
              <Text style={s.salaryLabel}>{t('Salary', 'Mshahara')}</Text>
              <Text style={s.salaryVal}>{job.salary_display}</Text>
            </View>
          ) : null}

          {/* Description */}
          <Text style={s.sectionTitle}>{t('About the Role', 'Kuhusu Kazi')}</Text>
          <Text style={s.body_text}>{description}</Text>

          {requirements ? (
            <>
              <Text style={s.sectionTitle}>{t('Requirements', 'Mahitaji')}</Text>
              <Text style={s.body_text}>{requirements}</Text>
            </>
          ) : null}

          {/* Location map */}
          {regionDisplay && (
            <View style={{ marginBottom: 20 }}>
              <Text style={s.sectionTitle}>{t('Job Location', 'Mahali pa Kazi')}</Text>
              <LocationMap
                regionName={job.region_name}
                label={regionDisplay + (job.district_name ? `, ${job.district_name}` : '')}
                height={180}
              />
              {job.contact_address ? (
                <Text style={s.addressText}>{job.contact_address}</Text>
              ) : null}
            </View>
          )}

          {/* Apply Section */}
          {job.application_method === 'IN_APP' && (
            <View style={s.applyBox}>
              <Text style={s.sectionTitle}>{t('Apply Now', 'Omba Sasa')}</Text>
              <Text style={s.inputLabel}>{t('Cover Letter (optional)', 'Barua ya Maombi (si lazima)')}</Text>
              <TextInput
                style={s.textAreaInput}
                value={coverLetter}
                onChangeText={setCoverLetter}
                multiline
                numberOfLines={4}
                placeholder={t('Why should we hire you? (optional)', 'Kwa nini tuajiri wewe? (si lazima)')}
                placeholderTextColor="#9ca3af"
                textAlignVertical="top"
              />
              <TouchableOpacity
                style={[s.applyBtn, applyMutation.isPending && s.applyBtnDisabled]}
                onPress={() => {
                  if (!user) { router.push('/auth/login'); return }
                  applyMutation.mutate()
                }}
                disabled={applyMutation.isPending}
              >
                <Text style={s.applyBtnText}>
                  {applyMutation.isPending ? t('Submitting...', 'Inatuma...') : t('Submit Application', 'Tuma Ombi')}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {job.application_method === 'WHATSAPP' && (
            <TouchableOpacity style={s.whatsappBtn} onPress={handleWhatsApp}>
              <Text style={s.whatsappText}>💬 {t('Apply via WhatsApp', 'Omba kupitia WhatsApp')}</Text>
            </TouchableOpacity>
          )}

          {job.application_method === 'EMAIL' && (
            <TouchableOpacity style={s.emailBtn} onPress={handleEmail}>
              <Mail size={16} color="#1d4ed8" />
              <Text style={s.emailText}>{t('Apply via Email', 'Omba kupitia Barua Pepe')}</Text>
            </TouchableOpacity>
          )}

          {job.application_method === 'WALK_IN' && (
            <View style={s.walkInBox}>
              <Navigation size={16} color="#374151" />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={s.walkInLabel}>{t('Walk-In Address', 'Anwani ya Kutembelea')}</Text>
                <Text style={s.walkInAddr}>{job.contact_address}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  addressText: { fontSize: 13, color: '#6b7280', marginTop: 6, paddingHorizontal: 4 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerBg: {
    backgroundColor: '#059669',
    paddingTop: 56,
    paddingBottom: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backBtn: { position: 'absolute', top: 56, left: 20, padding: 4 },
  saveBtn: { position: 'absolute', top: 56, right: 20, padding: 4 },
  companyInitials: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  companyInitialsText: { color: '#fff', fontWeight: '700', fontSize: 24 },
  jobTitle: { color: '#fff', fontSize: 20, fontWeight: '700', textAlign: 'center' },
  companyName: { color: '#a7f3d0', fontSize: 14, marginTop: 4 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, paddingVertical: 12 },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f3f4f6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  metaChipText: { fontSize: 12, color: '#374151', fontWeight: '500' },
  body: { paddingHorizontal: 16, paddingBottom: 40 },
  statsRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 12, color: '#6b7280' },
  salaryBox: { backgroundColor: '#d1fae5', borderRadius: 12, padding: 12, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between' },
  salaryLabel: { fontSize: 12, color: '#065f46' },
  salaryVal: { fontSize: 15, fontWeight: '700', color: '#065f46' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 8, marginTop: 16 },
  body_text: { fontSize: 14, color: '#374151', lineHeight: 22 },
  applyBox: { marginTop: 8 },
  inputLabel: { fontSize: 13, color: '#374151', marginBottom: 6 },
  textAreaInput: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, minHeight: 80, padding: 12, marginBottom: 12, fontSize: 14, color: '#111827' },
  applyBtn: { backgroundColor: '#059669', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  applyBtnDisabled: { opacity: 0.5 },
  applyBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  whatsappBtn: { backgroundColor: '#25D366', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 16 },
  whatsappText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  emailBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#eff6ff', borderRadius: 12, paddingVertical: 14, marginTop: 16 },
  emailText: { color: '#1d4ed8', fontWeight: '700', fontSize: 15 },
  walkInBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#f3f4f6', borderRadius: 12, padding: 14, marginTop: 16 },
  walkInLabel: { fontSize: 12, color: '#6b7280', marginBottom: 2 },
  walkInAddr: { fontSize: 14, color: '#111827', fontWeight: '500' },
})
