import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Switch, KeyboardAvoidingView, Platform, Alert,
} from 'react-native'
import { useQuery, useMutation } from '@tanstack/react-query'
import { jobsApi } from '@/lib/api/jobs'
import { companiesApi } from '@/lib/api/companies'
import { locationsApi } from '@/lib/api/locations'
import { useLangStore } from '@/store/lang'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ArrowLeft, ChevronDown } from 'lucide-react-native'

const EMP_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'CASUAL', 'INTERNSHIP', 'VOLUNTEER']
const EXP_LEVELS = ['NO_EXPERIENCE', 'JUNIOR', 'MID', 'SENIOR', 'EXECUTIVE']
const APP_METHODS = [
  { value: 'IN_APP', label: 'Via App' },
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'EMAIL', label: 'Email' },
  { value: 'WALK_IN', label: 'Walk-In' },
]

export default function PostJobScreen() {
  const { t } = useLangStore()
  const router = useRouter()

  const { data: regions } = useQuery({ queryKey: ['regions'], queryFn: locationsApi.regions })
  const { data: myCompanies, isLoading: companiesLoading } = useQuery({
    queryKey: ['my-companies'],
    queryFn: companiesApi.mine,
  })

  const [form, setForm] = useState({
    title: '', description: '', requirements: '',
    employment_type: 'FULL_TIME', experience_level: 'NO_EXPERIENCE',
    salary_display: '', application_method: 'IN_APP',
    whatsapp_number: '', contact_email: '', contact_address: '',
    positions_available: '1', cv_required: false, status: 'ACTIVE',
    region: '', category: '',
  })

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }))

  const mutation = useMutation({
    mutationFn: (data: object) => jobsApi.create(data),
    onSuccess: () => {
      Alert.alert(t('Published!', 'Imechapishwa!'), t('Job posted successfully.', 'Kazi imetumwa.'))
      router.replace('/dashboard/employer')
    },
    onError: (err: any) => {
      Alert.alert(t('Error', 'Hitilafu'), JSON.stringify(err.response?.data || 'Failed'))
    },
  })

  const handleSubmit = () => {
    if (!form.title) { Alert.alert(t('Required', 'Inahitajika'), t('Enter job title', 'Weka jina la kazi')); return }
    if (!form.description) { Alert.alert(t('Required', 'Inahitajika'), t('Enter description', 'Weka maelezo')); return }
    if (!myCompanies || myCompanies.length === 0) {
      Alert.alert(
        t('No Company', 'Hakuna Kampuni'),
        t('Create a company profile first before posting jobs.', 'Tengeneza wasifu wa kampuni kwanza kabla ya kutuma kazi.'),
      )
      return
    }
    const company = myCompanies[0].id
    const payload: any = {
      ...form,
      company,
      positions_available: Number(form.positions_available),
    }
    if (!payload.region) delete payload.region
    if (!payload.category) delete payload.category
    mutation.mutate(payload)
  }

  const inputCls = s.input

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft size={20} color="#374151" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{t('Post a Job', 'Tuma Kazi')}</Text>
      </View>

      <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
        {/* Company info */}
        {companiesLoading ? (
          <ActivityIndicator color="#059669" style={{ marginVertical: 12 }} />
        ) : myCompanies && myCompanies.length > 0 ? (
          <View style={s.companyBanner}>
            <Text style={s.companyBannerLabel}>{t('Posting as', 'Inachapishwa kwa niaba ya')}</Text>
            <Text style={s.companyBannerName}>{myCompanies[0].name}</Text>
          </View>
        ) : (
          <View style={s.noCompanyBox}>
            <Text style={s.noCompanyText}>
              {t('You need a company profile to post jobs.', 'Unahitaji wasifu wa kampuni kutuma kazi.')}
            </Text>
            <TouchableOpacity onPress={() => router.push('/dashboard/employer')} style={s.noCompanyBtn}>
              <Text style={s.noCompanyBtnText}>{t('Create Company', 'Tengeneza Kampuni')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Basic info */}
        <View style={s.card}>
          <Text style={s.cardTitle}>{t('Basic Information', 'Taarifa za Msingi')}</Text>

          <Text style={s.label}>{t('Job Title', 'Jina la Kazi')} *</Text>
          <TextInput style={inputCls} value={form.title} onChangeText={(v) => set('title', v)} placeholder="e.g. Software Developer" />

          <Text style={s.label}>{t('Region', 'Mkoa')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            {[{ id: '', name_en: 'Any', name_sw: 'Yoyote' }, ...(regions || [])].map((r) => (
              <TouchableOpacity
                key={r.id}
                style={[s.chip, form.region === String(r.id) && s.chipActive]}
                onPress={() => set('region', String(r.id))}
              >
                <Text style={[s.chipText, form.region === String(r.id) && s.chipTextActive]}>{r.name_en}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Details */}
        <View style={s.card}>
          <Text style={s.cardTitle}>{t('Job Details', 'Maelezo ya Kazi')}</Text>

          <Text style={s.label}>{t('Description', 'Maelezo')} *</Text>
          <TextInput style={[inputCls, s.textarea]} value={form.description} onChangeText={(v) => set('description', v)} placeholder={t('Describe the role...', 'Eleza kazi...')} multiline numberOfLines={4} textAlignVertical="top" />

          <Text style={s.label}>{t('Requirements', 'Mahitaji')}</Text>
          <TextInput style={[inputCls, s.textarea]} value={form.requirements} onChangeText={(v) => set('requirements', v)} placeholder={t('Skills, qualifications...', 'Ujuzi, sifa...')} multiline numberOfLines={3} textAlignVertical="top" />
        </View>

        {/* Type & Salary */}
        <View style={s.card}>
          <Text style={s.cardTitle}>{t('Type & Salary', 'Aina na Mshahara')}</Text>

          <Text style={s.label}>{t('Employment Type', 'Aina ya Ajira')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            {EMP_TYPES.map((v) => (
              <TouchableOpacity key={v} style={[s.chip, form.employment_type === v && s.chipActive]} onPress={() => set('employment_type', v)}>
                <Text style={[s.chipText, form.employment_type === v && s.chipTextActive]}>{v.replace('_', ' ')}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={s.label}>{t('Experience Level', 'Kiwango cha Uzoefu')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            {EXP_LEVELS.map((v) => (
              <TouchableOpacity key={v} style={[s.chip, form.experience_level === v && s.chipActive]} onPress={() => set('experience_level', v)}>
                <Text style={[s.chipText, form.experience_level === v && s.chipTextActive]}>{v.replace('_', ' ')}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={s.label}>{t('Salary (display text)', 'Mshahara')}</Text>
          <TextInput style={inputCls} value={form.salary_display} onChangeText={(v) => set('salary_display', v)} placeholder="e.g. TZS 500,000/month" />

          <Text style={s.label}>{t('Positions Available', 'Nafasi Zilizopo')}</Text>
          <TextInput style={inputCls} value={form.positions_available} onChangeText={(v) => set('positions_available', v)} keyboardType="number-pad" />
        </View>

        {/* How to apply */}
        <View style={s.card}>
          <Text style={s.cardTitle}>{t('How to Apply', 'Jinsi ya Kuomba')}</Text>

          <View style={s.methodRow}>
            {APP_METHODS.map(({ value, label }) => (
              <TouchableOpacity
                key={value}
                style={[s.methodChip, form.application_method === value && s.methodChipActive]}
                onPress={() => set('application_method', value)}
              >
                <Text style={[s.methodChipText, form.application_method === value && s.methodChipTextActive]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {form.application_method === 'WHATSAPP' && (
            <>
              <Text style={s.label}>{t('WhatsApp Number', 'Namba ya WhatsApp')}</Text>
              <TextInput style={inputCls} value={form.whatsapp_number} onChangeText={(v) => set('whatsapp_number', v)} placeholder="+255712345678" keyboardType="phone-pad" />
            </>
          )}
          {form.application_method === 'EMAIL' && (
            <>
              <Text style={s.label}>{t('Contact Email', 'Barua Pepe')}</Text>
              <TextInput style={inputCls} value={form.contact_email} onChangeText={(v) => set('contact_email', v)} placeholder="jobs@company.com" keyboardType="email-address" />
            </>
          )}
          {form.application_method === 'WALK_IN' && (
            <>
              <Text style={s.label}>{t('Address', 'Anwani')}</Text>
              <TextInput style={inputCls} value={form.contact_address} onChangeText={(v) => set('contact_address', v)} placeholder="Street, City" />
            </>
          )}

          <View style={s.switchRow}>
            <Text style={s.label}>{t('Require CV', 'Hitaji CV')}</Text>
            <Switch
              value={form.cv_required}
              onValueChange={(v) => set('cv_required', v)}
              trackColor={{ true: '#059669', false: '#e5e7eb' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[s.submitBtn, mutation.isPending && s.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={mutation.isPending}
        >
          {mutation.isPending
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.submitBtnText}>{t('Publish Job', 'Chapisha Kazi')}</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', paddingTop: 56, paddingBottom: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  container: { padding: 16, paddingBottom: 40 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#e5e7eb' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#111827', marginBottom: 12, backgroundColor: '#fff' },
  textarea: { minHeight: 80 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#e5e7eb', marginRight: 8 },
  chipActive: { backgroundColor: '#d1fae5', borderColor: '#059669' },
  chipText: { fontSize: 12, color: '#374151' },
  chipTextActive: { color: '#065f46', fontWeight: '600' },
  methodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  methodChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  methodChipActive: { backgroundColor: '#059669', borderColor: '#059669' },
  methodChipText: { fontSize: 13, color: '#374151', fontWeight: '500' },
  methodChipTextActive: { color: '#fff' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  submitBtn: { backgroundColor: '#059669', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 4 },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  companyBanner: { backgroundColor: '#d1fae5', borderRadius: 12, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: '#6ee7b7' },
  companyBannerLabel: { fontSize: 11, color: '#065f46', marginBottom: 2 },
  companyBannerName: { fontSize: 15, fontWeight: '700', color: '#064e3b' },
  noCompanyBox: { backgroundColor: '#fef3c7', borderRadius: 12, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#fcd34d', alignItems: 'center' },
  noCompanyText: { fontSize: 13, color: '#92400e', textAlign: 'center', marginBottom: 10 },
  noCompanyBtn: { backgroundColor: '#059669', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  noCompanyBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
})
