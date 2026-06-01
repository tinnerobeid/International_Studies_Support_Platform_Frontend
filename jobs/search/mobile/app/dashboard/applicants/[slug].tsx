import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, Modal, Pressable, TextInput, Linking, Alert,
} from 'react-native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { applicationsApi } from '@/lib/api/applications'
import { useLangStore } from '@/store/lang'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft, Phone, FileText, ChevronDown, MessageCircle, StickyNote } from 'lucide-react-native'
import { useState } from 'react'
import dayjs from 'dayjs'
import AsyncStorage from '@react-native-async-storage/async-storage'

const STATUS_OPTIONS = ['SUBMITTED', 'VIEWED', 'SHORTLISTED', 'REJECTED', 'HIRED']
const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  SUBMITTED: { bg: '#f3f4f6', text: '#374151' },
  VIEWED: { bg: '#dbeafe', text: '#1e40af' },
  SHORTLISTED: { bg: '#d1fae5', text: '#065f46' },
  REJECTED: { bg: '#fee2e2', text: '#991b1b' },
  HIRED: { bg: '#ede9fe', text: '#5b21b6' },
}

export default function ApplicantsScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const { t } = useLangStore()
  const router = useRouter()
  const qc = useQueryClient()
  const [pickerFor, setPickerFor] = useState<string | null>(null)
  const [noteFor, setNoteFor] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')
  const [notes, setNotes] = useState<Record<string, string>>({})

  const openNote = async (id: string) => {
    const saved = await AsyncStorage.getItem(`note_${id}`)
    setNoteText(saved || '')
    setNoteFor(id)
  }

  const saveNote = async () => {
    if (noteFor) {
      await AsyncStorage.setItem(`note_${noteFor}`, noteText)
      setNotes((prev) => ({ ...prev, [noteFor]: noteText }))
    }
    setNoteFor(null)
  }

  const openWhatsApp = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    const number = cleaned.startsWith('0') ? '255' + cleaned.slice(1) : cleaned
    Linking.openURL(`https://wa.me/${number}`).catch(() =>
      Alert.alert('WhatsApp', 'Could not open WhatsApp.')
    )
  }

  const { data, isLoading } = useQuery({
    queryKey: ['applicants', slug],
    queryFn: () => applicationsApi.forJob(slug),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      applicationsApi.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applicants', slug] }),
  })

  const apps = data?.results || []

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft size={20} color="#374151" />
        </TouchableOpacity>
        <Text style={s.title}>{t('Applicants', 'Waombaji')}</Text>
        <View style={s.count}>
          <Text style={s.countText}>{apps.length} {t('total', 'jumla')}</Text>
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator color="#059669" style={{ marginTop: 40 }} />
      ) : apps.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyText}>{t('No applications yet', 'Hakuna maombi bado')}</Text>
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
                <View style={s.cardHeader}>
                  <View style={s.initials}>
                    <Text style={s.initialsText}>{item.applicant_name.charAt(0).toUpperCase()}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.name}>{item.applicant_name}</Text>
                    <View style={s.phoneRow}>
                      <Phone size={11} color="#6b7280" />
                      <Text style={s.phone}>{item.applicant_phone}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[s.statusPill, { backgroundColor: sc.bg }]}
                    onPress={() => setPickerFor(item.id)}
                  >
                    <Text style={[s.statusPillText, { color: sc.text }]}>{item.status}</Text>
                    <ChevronDown size={10} color={sc.text} />
                  </TouchableOpacity>
                </View>

                {item.cover_letter ? (
                  <Text style={s.coverLetter} numberOfLines={3}>"{item.cover_letter}"</Text>
                ) : null}

                <View style={s.cardMeta}>
                  <Text style={s.appliedAt}>{t('Applied', 'Aliomba')} {dayjs(item.applied_at).fromNow()}</Text>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    {item.cv_file ? (
                      <TouchableOpacity style={s.cvLink}>
                        <FileText size={12} color="#059669" />
                        <Text style={s.cvText}>{t('CV', 'CV')}</Text>
                      </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity
                      style={s.cvLink}
                      onPress={() => openWhatsApp(item.applicant_phone)}
                    >
                      <MessageCircle size={12} color="#25d366" />
                      <Text style={[s.cvText, { color: '#25d366' }]}>WhatsApp</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={s.cvLink}
                      onPress={() => openNote(item.id)}
                    >
                      <StickyNote size={12} color="#f59e0b" />
                      <Text style={[s.cvText, { color: '#f59e0b' }]}>{t('Note', 'Kumbukumbu')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {(notes[item.id] || '') ? (
                  <View style={s.notePreview}>
                    <Text style={s.notePreviewText} numberOfLines={2}>{notes[item.id]}</Text>
                  </View>
                ) : null}
              </View>
            )
          }}
        />
      )}

      {/* Note modal */}
      <Modal visible={!!noteFor} transparent animationType="slide">
        <Pressable style={s.overlay} onPress={saveNote}>
          <Pressable style={s.picker} onPress={() => {}}>
            <Text style={s.pickerTitle}>{t('Employer Note', 'Kumbukumbu ya Mwajiri')}</Text>
            <TextInput
              style={s.noteInput}
              value={noteText}
              onChangeText={setNoteText}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              placeholder={t('Add private notes about this applicant...', 'Ongeza maelezo ya faragha kuhusu mwombaji huyu...')}
              placeholderTextColor="#9ca3af"
            />
            <TouchableOpacity style={s.saveNoteBtn} onPress={saveNote}>
              <Text style={s.saveNoteBtnText}>{t('Save Note', 'Hifadhi Kumbukumbu')}</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Status picker modal */}
      <Modal visible={!!pickerFor} transparent animationType="slide">
        <Pressable style={s.overlay} onPress={() => setPickerFor(null)}>
          <View style={s.picker}>
            <Text style={s.pickerTitle}>{t('Update Status', 'Badilisha Hali')}</Text>
            {STATUS_OPTIONS.map((st) => {
              const sc = STATUS_COLORS[st]
              return (
                <TouchableOpacity
                  key={st}
                  style={s.pickerOption}
                  onPress={() => {
                    if (pickerFor) statusMutation.mutate({ id: pickerFor, status: st })
                    setPickerFor(null)
                  }}
                >
                  <View style={[s.dot, { backgroundColor: sc.bg }]} />
                  <Text style={[s.pickerOptionText, { color: sc.text }]}>{st}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', paddingTop: 56, paddingBottom: 16, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  backBtn: { padding: 4 },
  title: { flex: 1, fontSize: 18, fontWeight: '700', color: '#111827' },
  count: { backgroundColor: '#d1fae5', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  countText: { color: '#065f46', fontWeight: '600', fontSize: 12 },
  list: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  initials: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#d1fae5', alignItems: 'center', justifyContent: 'center' },
  initialsText: { color: '#065f46', fontWeight: '700', fontSize: 15 },
  name: { fontSize: 14, fontWeight: '600', color: '#111827' },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  phone: { fontSize: 11, color: '#6b7280' },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  statusPillText: { fontSize: 11, fontWeight: '600' },
  coverLetter: { fontSize: 13, color: '#4b5563', fontStyle: 'italic', backgroundColor: '#f9fafb', borderRadius: 8, padding: 10, marginBottom: 8 },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  appliedAt: { fontSize: 11, color: '#9ca3af' },
  cvLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cvText: { fontSize: 12, color: '#059669', fontWeight: '500' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#9ca3af', fontSize: 15 },
  notePreview: { backgroundColor: '#fffbeb', borderRadius: 6, padding: 8, marginTop: 6 },
  notePreviewText: { fontSize: 12, color: '#92400e' },
  noteInput: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, fontSize: 14, color: '#111827', height: 120, marginBottom: 12 },
  saveNoteBtn: { backgroundColor: '#f59e0b', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  saveNoteBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  picker: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  pickerTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 16, textAlign: 'center' },
  pickerOption: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  dot: { width: 10, height: 10, borderRadius: 5 },
  pickerOptionText: { fontSize: 15, fontWeight: '600' },
})
