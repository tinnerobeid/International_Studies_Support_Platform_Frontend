import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { companiesApi } from '@/lib/api/companies'
import { useLangStore } from '@/store/lang'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react-native'

const EMPLOYEE_OPTIONS = [
  { value: '1-10', label: '1–10' },
  { value: '11-50', label: '11–50' },
  { value: '51-200', label: '51–200' },
  { value: '201-500', label: '201–500' },
  { value: '500+', label: '500+' },
]

export default function NewCompanyScreen() {
  const { t } = useLangStore()
  const router = useRouter()
  const qc = useQueryClient()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [employees, setEmployees] = useState('1-10')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const mutation = useMutation({
    mutationFn: companiesApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-companies'] })
      Alert.alert(
        t('Company Created', 'Kampuni Imeundwa'),
        t('Your company profile is ready.', 'Wasifu wa kampuni yako uko tayari.'),
        [{ text: 'OK', onPress: () => router.back() }]
      )
    },
    onError: (err: any) => {
      const data = err?.response?.data
      if (data && typeof data === 'object') {
        setErrors(data)
      } else {
        Alert.alert(t('Error', 'Hitilafu'), t('Could not create company.', 'Imeshindwa kuunda kampuni.'))
      }
    },
  })

  const handleSubmit = () => {
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = t('Company name is required', 'Jina la kampuni linahitajika')
    if (Object.keys(next).length) { setErrors(next); return }
    setErrors({})
    mutation.mutate({
      name: name.trim(),
      description: description.trim(),
      contact_email: email.trim(),
      phone_number: phone.trim(),
      website: website.trim(),
      employee_count: employees,
    })
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft size={20} color="#374151" />
        </TouchableOpacity>
        <Text style={s.title}>{t('Create Company', 'Unda Kampuni')}</Text>
      </View>

      <ScrollView style={s.container} contentContainerStyle={s.content}>
        <View style={s.field}>
          <Text style={s.label}>{t('Company Name', 'Jina la Kampuni')} *</Text>
          <TextInput
            style={[s.input, errors.name ? s.inputError : null]}
            value={name}
            onChangeText={setName}
            placeholder={t('e.g. Serengeti Holdings Ltd', 'mfano Serengeti Holdings Ltd')}
            placeholderTextColor="#9ca3af"
          />
          {errors.name ? <Text style={s.errorText}>{errors.name}</Text> : null}
        </View>

        <View style={s.field}>
          <Text style={s.label}>{t('Description', 'Maelezo')}</Text>
          <TextInput
            style={[s.input, s.textarea]}
            value={description}
            onChangeText={setDescription}
            placeholder={t('What does your company do?', 'Kampuni yako inafanya nini?')}
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={s.field}>
          <Text style={s.label}>{t('Contact Email', 'Barua Pepe')}</Text>
          <TextInput
            style={[s.input, errors.contact_email ? s.inputError : null]}
            value={email}
            onChangeText={setEmail}
            placeholder="info@company.co.tz"
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.contact_email ? <Text style={s.errorText}>{errors.contact_email}</Text> : null}
        </View>

        <View style={s.field}>
          <Text style={s.label}>{t('Phone Number', 'Nambari ya Simu')}</Text>
          <TextInput
            style={s.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="+255 ..."
            placeholderTextColor="#9ca3af"
            keyboardType="phone-pad"
          />
        </View>

        <View style={s.field}>
          <Text style={s.label}>{t('Website', 'Tovuti')}</Text>
          <TextInput
            style={s.input}
            value={website}
            onChangeText={setWebsite}
            placeholder="https://www.company.co.tz"
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
            keyboardType="url"
          />
        </View>

        <View style={s.field}>
          <Text style={s.label}>{t('Number of Employees', 'Idadi ya Wafanyakazi')}</Text>
          <View style={s.pillRow}>
            {EMPLOYEE_OPTIONS.map((o) => (
              <TouchableOpacity
                key={o.value}
                style={[s.pill, employees === o.value && s.pillActive]}
                onPress={() => setEmployees(o.value)}
              >
                <Text style={[s.pillText, employees === o.value && s.pillTextActive]}>
                  {o.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[s.btn, mutation.isPending && s.btnDisabled]}
          onPress={handleSubmit}
          disabled={mutation.isPending}
        >
          {mutation.isPending
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.btnText}>{t('Create Company', 'Unda Kampuni')}</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fff', paddingTop: 56, paddingBottom: 16,
    paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb',
  },
  backBtn: { padding: 4 },
  title: { fontSize: 18, fontWeight: '700', color: '#111827' },
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 20, gap: 16 },
  field: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151' },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: '#111827',
  },
  inputError: { borderColor: '#ef4444' },
  textarea: { height: 100 },
  errorText: { fontSize: 12, color: '#ef4444' },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff',
  },
  pillActive: { backgroundColor: '#059669', borderColor: '#059669' },
  pillText: { fontSize: 13, color: '#374151', fontWeight: '500' },
  pillTextActive: { color: '#fff' },
  btn: {
    backgroundColor: '#059669', borderRadius: 12,
    paddingVertical: 15, alignItems: 'center', marginTop: 8,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
})
