import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Modal, TextInput, ActivityIndicator, Alert, Pressable, Switch,
} from 'react-native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { alertsApi } from '@/lib/api/alerts'
import { jobsApi } from '@/lib/api/jobs'
import { locationsApi } from '@/lib/api/locations'
import { useLangStore } from '@/store/lang'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ArrowLeft, Plus, Trash2, Bell, BellOff, ChevronDown } from 'lucide-react-native'
import type { JobAlert } from '@/types'

const EMPLOYMENT_OPTIONS = [
  { value: '', labelEn: 'Any type', labelSw: 'Aina yoyote' },
  { value: 'FULL_TIME', labelEn: 'Full Time', labelSw: 'Muda Wote' },
  { value: 'PART_TIME', labelEn: 'Part Time', labelSw: 'Muda wa Nusu' },
  { value: 'CONTRACT', labelEn: 'Contract', labelSw: 'Mkataba' },
  { value: 'CASUAL', labelEn: 'Casual', labelSw: 'Bahati Nasibu' },
  { value: 'INTERNSHIP', labelEn: 'Internship', labelSw: 'Mafunzo' },
]

export default function AlertsScreen() {
  const { lang, t } = useLangStore()
  const router = useRouter()
  const qc = useQueryClient()

  const { data: alerts, isLoading } = useQuery({ queryKey: ['alerts'], queryFn: alertsApi.list })
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: jobsApi.categories })
  const { data: regions } = useQuery({ queryKey: ['regions'], queryFn: locationsApi.regions })

  const [showForm, setShowForm] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null)
  const [employmentType, setEmploymentType] = useState('')
  const [showCatPicker, setShowCatPicker] = useState(false)
  const [showRegionPicker, setShowRegionPicker] = useState(false)

  const resetForm = () => {
    setKeyword('')
    setSelectedCategory(null)
    setSelectedRegion(null)
    setEmploymentType('')
  }

  const createMutation = useMutation({
    mutationFn: () => alertsApi.create({
      keyword,
      category: selectedCategory,
      region: selectedRegion,
      employment_type: employmentType,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['alerts'] })
      setShowForm(false)
      resetForm()
    },
    onError: () => Alert.alert(t('Error', 'Hitilafu'), t('Could not create alert.', 'Imeshindwa kuunda arifa.')),
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) =>
      alertsApi.update(id, { is_active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['alerts'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: alertsApi.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['alerts'] }),
  })

  const catName = (id: number | null) => {
    if (!id) return t('Any category', 'Aina yoyote')
    const c = categories?.find((c) => c.id === id)
    return c ? (lang === 'sw' ? c.name_sw : c.name_en) : t('Any category', 'Aina yoyote')
  }

  const regionName = (id: number | null) => {
    if (!id) return t('Any region', 'Mkoa wowote')
    const r = regions?.find((r) => r.id === id)
    return r ? (lang === 'sw' ? r.name_sw : r.name_en) : t('Any region', 'Mkoa wowote')
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft size={20} color="#374151" />
        </TouchableOpacity>
        <Text style={s.title}>{t('Job Alerts', 'Arifa za Kazi')}</Text>
        <TouchableOpacity style={s.addIconBtn} onPress={() => setShowForm(true)}>
          <Plus size={20} color="#059669" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator color="#059669" style={{ marginTop: 40 }} />
      ) : alerts && alerts.length === 0 ? (
        <View style={s.empty}>
          <Bell size={48} color="#d1d5db" />
          <Text style={s.emptyTitle}>{t('No alerts yet', 'Hakuna arifa bado')}</Text>
          <Text style={s.emptyHint}>
            {t('Create an alert to get notified when new jobs match your criteria.', 'Unda arifa ili upate taarifa kazi mpya zinazolingana na vigezo vyako.')}
          </Text>
          <TouchableOpacity style={s.createBtn} onPress={() => setShowForm(true)}>
            <Plus size={16} color="#fff" />
            <Text style={s.createBtnText}>{t('Create Alert', 'Unda Arifa')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={s.list} contentContainerStyle={{ padding: 16, gap: 10 }}>
          {alerts?.map((alert) => (
            <View key={alert.id} style={[s.card, !alert.is_active && s.cardInactive]}>
              <View style={s.cardRow}>
                <View style={{ flex: 1 }}>
                  {alert.keyword ? (
                    <Text style={s.keyword}>"{alert.keyword}"</Text>
                  ) : null}
                  <View style={s.tagRow}>
                    {alert.category_name ? <View style={s.tag}><Text style={s.tagText}>{alert.category_name}</Text></View> : null}
                    {alert.region_name ? <View style={s.tag}><Text style={s.tagText}>{alert.region_name}</Text></View> : null}
                    {alert.employment_type ? <View style={s.tag}><Text style={s.tagText}>{alert.employment_type.replace('_', ' ')}</Text></View> : null}
                    {!alert.keyword && !alert.category_name && !alert.region_name && !alert.employment_type && (
                      <View style={s.tag}><Text style={s.tagText}>{t('All jobs', 'Kazi zote')}</Text></View>
                    )}
                  </View>
                </View>
                <View style={s.actions}>
                  <Switch
                    value={alert.is_active}
                    onValueChange={(v) => toggleMutation.mutate({ id: alert.id, is_active: v })}
                    trackColor={{ true: '#059669', false: '#e5e7eb' }}
                    thumbColor="#fff"
                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                  />
                  <TouchableOpacity
                    onPress={() => Alert.alert(t('Delete alert?', 'Futa arifa?'), '', [
                      { text: t('Cancel', 'Ghairi'), style: 'cancel' },
                      { text: t('Delete', 'Futa'), style: 'destructive', onPress: () => deleteMutation.mutate(alert.id) },
                    ])}
                  >
                    <Trash2 size={15} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
              {!alert.is_active && (
                <Text style={s.pausedLabel}>{t('Paused', 'Imesimamishwa')}</Text>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      {/* Create Alert Modal */}
      <Modal visible={showForm} transparent animationType="slide">
        <Pressable style={s.overlay} onPress={() => { setShowForm(false); resetForm() }}>
          <Pressable style={s.sheet} onPress={() => {}}>
            <Text style={s.sheetTitle}>{t('New Alert', 'Arifa Mpya')}</Text>
            <ScrollView>
              <View style={s.formField}>
                <Text style={s.formLabel}>{t('Keyword', 'Neno la Utafutaji')}</Text>
                <TextInput
                  style={s.formInput}
                  value={keyword}
                  onChangeText={setKeyword}
                  placeholder={t('e.g. nurse, driver, accountant', 'mfano muuguzi, dereva, mhasibu')}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={s.formField}>
                <Text style={s.formLabel}>{t('Category', 'Aina ya Kazi')}</Text>
                <TouchableOpacity
                  style={s.selectBtn}
                  onPress={() => { setShowCatPicker(true); setShowRegionPicker(false) }}
                >
                  <Text style={{ color: selectedCategory ? '#111827' : '#9ca3af', fontSize: 14 }}>
                    {catName(selectedCategory)}
                  </Text>
                  <ChevronDown size={14} color="#9ca3af" />
                </TouchableOpacity>
                {showCatPicker && (
                  <View style={s.pickerList}>
                    <TouchableOpacity style={s.pickerItem} onPress={() => { setSelectedCategory(null); setShowCatPicker(false) }}>
                      <Text style={s.pickerItemText}>{t('Any category', 'Aina yoyote')}</Text>
                    </TouchableOpacity>
                    {categories?.map((c) => (
                      <TouchableOpacity key={c.id} style={s.pickerItem} onPress={() => { setSelectedCategory(c.id); setShowCatPicker(false) }}>
                        <Text style={[s.pickerItemText, selectedCategory === c.id && { color: '#059669', fontWeight: '700' }]}>
                          {lang === 'sw' ? c.name_sw : c.name_en}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={s.formField}>
                <Text style={s.formLabel}>{t('Region', 'Mkoa')}</Text>
                <TouchableOpacity
                  style={s.selectBtn}
                  onPress={() => { setShowRegionPicker(true); setShowCatPicker(false) }}
                >
                  <Text style={{ color: selectedRegion ? '#111827' : '#9ca3af', fontSize: 14 }}>
                    {regionName(selectedRegion)}
                  </Text>
                  <ChevronDown size={14} color="#9ca3af" />
                </TouchableOpacity>
                {showRegionPicker && (
                  <View style={s.pickerList}>
                    <TouchableOpacity style={s.pickerItem} onPress={() => { setSelectedRegion(null); setShowRegionPicker(false) }}>
                      <Text style={s.pickerItemText}>{t('Any region', 'Mkoa wowote')}</Text>
                    </TouchableOpacity>
                    {regions?.map((r) => (
                      <TouchableOpacity key={r.id} style={s.pickerItem} onPress={() => { setSelectedRegion(r.id); setShowRegionPicker(false) }}>
                        <Text style={[s.pickerItemText, selectedRegion === r.id && { color: '#059669', fontWeight: '700' }]}>
                          {lang === 'sw' ? r.name_sw : r.name_en}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={s.formField}>
                <Text style={s.formLabel}>{t('Employment Type', 'Aina ya Ajira')}</Text>
                <View style={s.pillRow}>
                  {EMPLOYMENT_OPTIONS.map((o) => (
                    <TouchableOpacity
                      key={o.value}
                      style={[s.pill, employmentType === o.value && s.pillActive]}
                      onPress={() => setEmploymentType(o.value)}
                    >
                      <Text style={[s.pillText, employmentType === o.value && s.pillTextActive]}>
                        {lang === 'sw' ? o.labelSw : o.labelEn}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={[s.btn, createMutation.isPending && s.btnDisabled]}
                onPress={() => createMutation.mutate()}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={s.btnText}>{t('Create Alert', 'Unda Arifa')}</Text>
                }
              </TouchableOpacity>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fff', paddingTop: 56, paddingBottom: 16,
    paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb',
  },
  backBtn: { padding: 4 },
  title: { flex: 1, fontSize: 18, fontWeight: '700', color: '#111827' },
  addIconBtn: { padding: 6 },
  list: { flex: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#374151' },
  emptyHint: { fontSize: 13, color: '#6b7280', textAlign: 'center', lineHeight: 20 },
  createBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#059669', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, marginTop: 8 },
  createBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#e5e7eb' },
  cardInactive: { opacity: 0.6 },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  keyword: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 6 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { backgroundColor: '#f3f4f6', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontSize: 11, color: '#374151', fontWeight: '500' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pausedLabel: { fontSize: 11, color: '#ef4444', marginTop: 6, fontWeight: '600' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%' },
  sheetTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 16, textAlign: 'center' },
  formField: { marginBottom: 14 },
  formLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  formInput: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#111827' },
  selectBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  pickerList: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, maxHeight: 160, overflow: 'hidden', marginTop: 4 },
  pickerItem: { paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  pickerItemText: { fontSize: 14, color: '#374151' },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff' },
  pillActive: { backgroundColor: '#059669', borderColor: '#059669' },
  pillText: { fontSize: 12, color: '#374151', fontWeight: '500' },
  pillTextActive: { color: '#fff' },
  btn: { backgroundColor: '#059669', borderRadius: 12, paddingVertical: 13, alignItems: 'center', marginTop: 8 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})
