import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Modal, TextInput, ActivityIndicator, Alert, Pressable, Switch,
} from 'react-native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileApi } from '@/lib/api/profile'
import { useLangStore } from '@/store/lang'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ArrowLeft, Plus, Trash2, Briefcase, GraduationCap, Award, FileText } from 'lucide-react-native'
import type { WorkExperience, Education, SeekerSkill } from '@/types'

const EDUCATION_LEVELS = [
  { value: 'PRIMARY', labelEn: 'Primary', labelSw: 'Msingi' },
  { value: 'O_LEVEL', labelEn: 'O-Level', labelSw: 'Kidato IV' },
  { value: 'A_LEVEL', labelEn: 'A-Level', labelSw: 'Kidato VI' },
  { value: 'CERTIFICATE', labelEn: 'Certificate', labelSw: 'Cheti' },
  { value: 'DIPLOMA', labelEn: 'Diploma', labelSw: 'Stashahada' },
  { value: 'DEGREE', labelEn: "Bachelor's", labelSw: 'Shahada' },
  { value: 'MASTERS', labelEn: "Master's", labelSw: 'Uzamili' },
  { value: 'PHD', labelEn: 'PhD', labelSw: 'Uzamivu' },
]
const SKILL_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'EXPERT']

type Tab = 'experience' | 'education' | 'skills'

export default function CVBuilderScreen() {
  const { lang, t } = useLangStore()
  const router = useRouter()
  const qc = useQueryClient()
  const [tab, setTab] = useState<Tab>('experience')

  // ── Work Experience ──
  const { data: experiences } = useQuery({ queryKey: ['experience'], queryFn: profileApi.experience.list })
  const [showExpForm, setShowExpForm] = useState(false)
  const [expForm, setExpForm] = useState({ job_title: '', company_name: '', start_date: '', end_date: '', is_current: false, description: '' })

  const addExpMutation = useMutation({
    mutationFn: () => profileApi.experience.create(expForm as any),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['experience'] }); setShowExpForm(false); setExpForm({ job_title: '', company_name: '', start_date: '', end_date: '', is_current: false, description: '' }) },
    onError: (e: any) => Alert.alert(t('Error', 'Hitilafu'), e?.response?.data?.end_date?.[0] || t('Could not save.', 'Imeshindwa.')),
  })

  const delExpMutation = useMutation({
    mutationFn: profileApi.experience.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['experience'] }),
  })

  // ── Education ──
  const { data: educations } = useQuery({ queryKey: ['education'], queryFn: profileApi.education.list })
  const [showEduForm, setShowEduForm] = useState(false)
  const [eduForm, setEduForm] = useState({ institution_name: '', level: 'DEGREE', field_of_study: '', start_year: '', end_year: '', grade: '' })

  const addEduMutation = useMutation({
    mutationFn: () => profileApi.education.create({ ...eduForm, start_year: Number(eduForm.start_year), end_year: eduForm.end_year ? Number(eduForm.end_year) : null } as any),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['education'] }); setShowEduForm(false); setEduForm({ institution_name: '', level: 'DEGREE', field_of_study: '', start_year: '', end_year: '', grade: '' }) },
    onError: () => Alert.alert(t('Error', 'Hitilafu'), t('Could not save.', 'Imeshindwa.')),
  })

  const delEduMutation = useMutation({
    mutationFn: profileApi.education.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['education'] }),
  })

  // ── Skills ──
  const { data: catalog } = useQuery({ queryKey: ['skill-catalog'], queryFn: profileApi.skills.catalog })
  const { data: mySkills } = useQuery({ queryKey: ['my-skills'], queryFn: profileApi.skills.mine })
  const [skillSearch, setSkillSearch] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('INTERMEDIATE')

  const addSkillMutation = useMutation({
    mutationFn: ({ skill_id, level }: { skill_id: number; level: string }) =>
      profileApi.skills.add(skill_id, level),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-skills'] }),
    onError: (e: any) => Alert.alert(t('Error', 'Hitilafu'), e?.response?.data?.skill_id || t('Could not add skill.', 'Imeshindwa kuongeza.')),
  })

  const delSkillMutation = useMutation({
    mutationFn: profileApi.skills.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-skills'] }),
  })

  const mySkillIds = new Set(mySkills?.map((s) => s.skill.id) || [])
  const filteredCatalog = catalog?.filter((sk) =>
    !mySkillIds.has(sk.id) &&
    (sk.name_en.toLowerCase().includes(skillSearch.toLowerCase()) ||
      sk.name_sw.toLowerCase().includes(skillSearch.toLowerCase()))
  ) || []

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft size={20} color="#374151" />
        </TouchableOpacity>
        <Text style={s.title}>{t('My CV', 'CV Yangu')}</Text>
      </View>

      {/* Tabs */}
      <View style={s.tabs}>
        {([['experience', t('Experience', 'Uzoefu'), Briefcase], ['education', t('Education', 'Elimu'), GraduationCap], ['skills', t('Skills', 'Ujuzi'), Award]] as const).map(([key, label, Icon]) => (
          <TouchableOpacity
            key={key}
            style={[s.tab, tab === key && s.tabActive]}
            onPress={() => setTab(key as Tab)}
          >
            <Icon size={15} color={tab === key ? '#059669' : '#9ca3af'} />
            <Text style={[s.tabText, tab === key && s.tabTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={s.body} contentContainerStyle={{ padding: 16, gap: 12 }}>
        {/* ──── EXPERIENCE TAB ──── */}
        {tab === 'experience' && (
          <>
            {experiences?.map((exp) => (
              <View key={exp.id} style={s.card}>
                <View style={s.cardRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.cardTitle}>{exp.job_title}</Text>
                    <Text style={s.cardSub}>{exp.company_name}</Text>
                    <Text style={s.cardMeta}>
                      {exp.start_date} → {exp.is_current ? t('Present', 'Sasa') : exp.end_date}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => Alert.alert(t('Delete?', 'Futa?'), '', [
                      { text: t('Cancel', 'Ghairi'), style: 'cancel' },
                      { text: t('Delete', 'Futa'), style: 'destructive', onPress: () => delExpMutation.mutate(exp.id) },
                    ])}
                  >
                    <Trash2 size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
                {exp.description ? <Text style={s.cardDesc}>{exp.description}</Text> : null}
              </View>
            ))}

            <TouchableOpacity style={s.addBtn} onPress={() => setShowExpForm(true)}>
              <Plus size={16} color="#059669" />
              <Text style={s.addBtnText}>{t('Add Experience', 'Ongeza Uzoefu')}</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ──── EDUCATION TAB ──── */}
        {tab === 'education' && (
          <>
            {educations?.map((edu) => (
              <View key={edu.id} style={s.card}>
                <View style={s.cardRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.cardTitle}>{edu.institution_name}</Text>
                    <Text style={s.cardSub}>
                      {EDUCATION_LEVELS.find((l) => l.value === edu.level)?.[lang === 'sw' ? 'labelSw' : 'labelEn'] || edu.level}
                      {edu.field_of_study ? ` · ${edu.field_of_study}` : ''}
                    </Text>
                    <Text style={s.cardMeta}>
                      {edu.start_year} → {edu.end_year || t('Present', 'Sasa')}
                      {edu.grade ? ` · ${edu.grade}` : ''}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => Alert.alert(t('Delete?', 'Futa?'), '', [
                      { text: t('Cancel', 'Ghairi'), style: 'cancel' },
                      { text: t('Delete', 'Futa'), style: 'destructive', onPress: () => delEduMutation.mutate(edu.id) },
                    ])}
                  >
                    <Trash2 size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <TouchableOpacity style={s.addBtn} onPress={() => setShowEduForm(true)}>
              <Plus size={16} color="#059669" />
              <Text style={s.addBtnText}>{t('Add Education', 'Ongeza Elimu')}</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ──── SKILLS TAB ──── */}
        {tab === 'skills' && (
          <>
            {mySkills && mySkills.length > 0 && (
              <View style={s.card}>
                <Text style={s.sectionLabel}>{t('My Skills', 'Ujuzi Wangu')}</Text>
                <View style={s.pillWrap}>
                  {mySkills.map((sk) => (
                    <TouchableOpacity
                      key={sk.id}
                      style={s.skillPill}
                      onLongPress={() => Alert.alert(t('Remove?', 'Ondoa?'), sk.skill.name_en, [
                        { text: t('Cancel', 'Ghairi'), style: 'cancel' },
                        { text: t('Remove', 'Ondoa'), style: 'destructive', onPress: () => delSkillMutation.mutate(sk.id) },
                      ])}
                    >
                      <Text style={s.skillName}>{lang === 'sw' ? (sk.skill.name_sw || sk.skill.name_en) : sk.skill.name_en}</Text>
                      <Text style={s.skillLevel}>{sk.level}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={s.hint}>{t('Long-press a skill to remove it.', 'Bonyeza kwa muda kuondoa ujuzi.')}</Text>
              </View>
            )}

            <View style={s.card}>
              <Text style={s.sectionLabel}>{t('Add from Catalog', 'Ongeza kutoka Orodha')}</Text>
              <View style={s.levelRow}>
                {SKILL_LEVELS.map((l) => (
                  <TouchableOpacity
                    key={l}
                    style={[s.levelPill, selectedLevel === l && s.levelPillActive]}
                    onPress={() => setSelectedLevel(l)}
                  >
                    <Text style={[s.levelPillText, selectedLevel === l && s.levelPillTextActive]}>{l}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={s.searchInput}
                value={skillSearch}
                onChangeText={setSkillSearch}
                placeholder={t('Search skills...', 'Tafuta ujuzi...')}
                placeholderTextColor="#9ca3af"
              />
              <View style={s.catalogList}>
                {filteredCatalog.slice(0, 20).map((sk) => (
                  <TouchableOpacity
                    key={sk.id}
                    style={s.catalogItem}
                    onPress={() => addSkillMutation.mutate({ skill_id: sk.id, level: selectedLevel })}
                  >
                    <Text style={s.catalogItemText}>{lang === 'sw' ? (sk.name_sw || sk.name_en) : sk.name_en}</Text>
                    <Plus size={14} color="#059669" />
                  </TouchableOpacity>
                ))}
                {filteredCatalog.length === 0 && (
                  <Text style={s.emptyText}>{t('No skills found.', 'Hakuna ujuzi ulioopatikana.')}</Text>
                )}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* ──── ADD EXPERIENCE MODAL ──── */}
      <Modal visible={showExpForm} transparent animationType="slide">
        <Pressable style={s.overlay} onPress={() => setShowExpForm(false)}>
          <Pressable style={s.sheet} onPress={() => {}}>
            <Text style={s.sheetTitle}>{t('Add Experience', 'Ongeza Uzoefu')}</Text>
            <ScrollView>
              {[
                { key: 'job_title', label: t('Job Title', 'Cheo') },
                { key: 'company_name', label: t('Company', 'Kampuni') },
                { key: 'start_date', label: t('Start Date', 'Tarehe ya Kuanza') + ' (YYYY-MM-DD)' },
              ].map((f) => (
                <View key={f.key} style={{ marginBottom: 12 }}>
                  <Text style={s.modalLabel}>{f.label}</Text>
                  <TextInput
                    style={s.modalInput}
                    value={(expForm as any)[f.key]}
                    onChangeText={(v) => setExpForm((prev) => ({ ...prev, [f.key]: v }))}
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              ))}

              <View style={s.switchRow}>
                <Text style={s.modalLabel}>{t('Current Job', 'Kazi ya Sasa')}</Text>
                <Switch
                  value={expForm.is_current}
                  onValueChange={(v) => setExpForm((p) => ({ ...p, is_current: v, end_date: v ? '' : p.end_date }))}
                  trackColor={{ true: '#059669', false: '#e5e7eb' }}
                  thumbColor="#fff"
                />
              </View>

              {!expForm.is_current && (
                <View style={{ marginBottom: 12 }}>
                  <Text style={s.modalLabel}>{t('End Date', 'Tarehe ya Kumalizika')} (YYYY-MM-DD)</Text>
                  <TextInput
                    style={s.modalInput}
                    value={expForm.end_date}
                    onChangeText={(v) => setExpForm((p) => ({ ...p, end_date: v }))}
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              )}

              <View style={{ marginBottom: 12 }}>
                <Text style={s.modalLabel}>{t('Description', 'Maelezo')}</Text>
                <TextInput
                  style={[s.modalInput, { height: 80 }]}
                  value={expForm.description}
                  onChangeText={(v) => setExpForm((p) => ({ ...p, description: v }))}
                  multiline
                  textAlignVertical="top"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <TouchableOpacity
                style={[s.btn, addExpMutation.isPending && s.btnDisabled]}
                onPress={() => addExpMutation.mutate()}
                disabled={addExpMutation.isPending}
              >
                {addExpMutation.isPending ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>{t('Save', 'Hifadhi')}</Text>}
              </TouchableOpacity>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ──── ADD EDUCATION MODAL ──── */}
      <Modal visible={showEduForm} transparent animationType="slide">
        <Pressable style={s.overlay} onPress={() => setShowEduForm(false)}>
          <Pressable style={s.sheet} onPress={() => {}}>
            <Text style={s.sheetTitle}>{t('Add Education', 'Ongeza Elimu')}</Text>
            <ScrollView>
              <View style={{ marginBottom: 12 }}>
                <Text style={s.modalLabel}>{t('Institution', 'Taasisi')}</Text>
                <TextInput
                  style={s.modalInput}
                  value={eduForm.institution_name}
                  onChangeText={(v) => setEduForm((p) => ({ ...p, institution_name: v }))}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text style={s.modalLabel}>{t('Level', 'Kiwango')}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 4 }}>
                  {EDUCATION_LEVELS.map((l) => (
                    <TouchableOpacity
                      key={l.value}
                      style={[s.levelPill, eduForm.level === l.value && s.levelPillActive, { marginRight: 6 }]}
                      onPress={() => setEduForm((p) => ({ ...p, level: l.value }))}
                    >
                      <Text style={[s.levelPillText, eduForm.level === l.value && s.levelPillTextActive]}>
                        {lang === 'sw' ? l.labelSw : l.labelEn}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {[
                { key: 'field_of_study', label: t('Field of Study', 'Fani ya Masomo') },
                { key: 'start_year', label: t('Start Year', 'Mwaka wa Kuanza') },
                { key: 'end_year', label: t('End Year', 'Mwaka wa Kumalizika') + ' (' + t('optional', 'hiari') + ')' },
                { key: 'grade', label: t('Grade / GPA', 'Daraja') + ' (' + t('optional', 'hiari') + ')' },
              ].map((f) => (
                <View key={f.key} style={{ marginBottom: 12 }}>
                  <Text style={s.modalLabel}>{f.label}</Text>
                  <TextInput
                    style={s.modalInput}
                    value={(eduForm as any)[f.key]}
                    onChangeText={(v) => setEduForm((p) => ({ ...p, [f.key]: v }))}
                    keyboardType={f.key.includes('year') ? 'numeric' : 'default'}
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              ))}

              <TouchableOpacity
                style={[s.btn, addEduMutation.isPending && s.btnDisabled]}
                onPress={() => addEduMutation.mutate()}
                disabled={addEduMutation.isPending}
              >
                {addEduMutation.isPending ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>{t('Save', 'Hifadhi')}</Text>}
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
  title: { fontSize: 18, fontWeight: '700', color: '#111827' },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 12 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#059669' },
  tabText: { fontSize: 12, color: '#9ca3af', fontWeight: '500' },
  tabTextActive: { color: '#059669', fontWeight: '700' },
  body: { flex: 1 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#e5e7eb' },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  cardSub: { fontSize: 13, color: '#374151', marginTop: 2 },
  cardMeta: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  cardDesc: { fontSize: 13, color: '#4b5563', marginTop: 8 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center', paddingVertical: 12, backgroundColor: '#f0fdf4', borderRadius: 10, borderWidth: 1, borderColor: '#bbf7d0', borderStyle: 'dashed' },
  addBtnText: { color: '#059669', fontWeight: '600', fontSize: 14 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 10 },
  pillWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillPill: { backgroundColor: '#d1fae5', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  skillName: { fontSize: 13, fontWeight: '600', color: '#065f46' },
  skillLevel: { fontSize: 10, color: '#059669', marginTop: 1 },
  hint: { fontSize: 11, color: '#9ca3af', marginTop: 8 },
  levelRow: { flexDirection: 'row', gap: 6, marginBottom: 10 },
  levelPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff' },
  levelPillActive: { backgroundColor: '#059669', borderColor: '#059669' },
  levelPillText: { fontSize: 12, color: '#374151', fontWeight: '500' },
  levelPillTextActive: { color: '#fff' },
  searchInput: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, color: '#111827', marginBottom: 8 },
  catalogList: { maxHeight: 220 },
  catalogItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  catalogItemText: { fontSize: 14, color: '#374151' },
  emptyText: { color: '#9ca3af', textAlign: 'center', paddingVertical: 16 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '85%' },
  sheetTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 16, textAlign: 'center' },
  modalLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 4 },
  modalInput: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#111827' },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  btn: { backgroundColor: '#059669', borderRadius: 12, paddingVertical: 13, alignItems: 'center', marginTop: 8 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})
