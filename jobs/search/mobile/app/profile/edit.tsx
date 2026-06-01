import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, Switch, Image,
} from 'react-native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileApi } from '@/lib/api/profile'
import { locationsApi } from '@/lib/api/locations'
import { useLangStore } from '@/store/lang'
import { useRouter } from 'expo-router'
import { useState, useEffect } from 'react'
import { ArrowLeft, ChevronDown, Camera } from 'lucide-react-native'
import * as ImagePicker from 'expo-image-picker'
import LocationMap from '@/components/LocationMap'

const GENDER_OPTIONS = [
  { value: 'M', labelEn: 'Male', labelSw: 'Mme' },
  { value: 'F', labelEn: 'Female', labelSw: 'Mke' },
  { value: 'O', labelEn: 'Other', labelSw: 'Nyingine' },
]

export default function EditProfileScreen() {
  const { lang, t } = useLangStore()
  const router = useRouter()
  const qc = useQueryClient()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['seeker-profile'],
    queryFn: profileApi.get,
  })

  const { data: regions } = useQuery({
    queryKey: ['regions'],
    queryFn: locationsApi.regions,
  })

  const [bio, setBio] = useState('')
  const [gender, setGender] = useState('')
  const [dob, setDob] = useState('')
  const [isDiscoverable, setIsDiscoverable] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null)
  const [showRegionPicker, setShowRegionPicker] = useState(false)
  const [photoUri, setPhotoUri] = useState<string | null>(null)

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert(
        t('Permission needed', 'Ruhusa inahitajika'),
        t('Please allow photo access in settings.', 'Tafadhali ruhusu upatikanaji wa picha katika mipangilio.')
      )
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri)
    }
  }

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || '')
      setGender(profile.gender || '')
      setDob(profile.date_of_birth || '')
      setIsDiscoverable(profile.is_discoverable)
      setSelectedRegion(profile.region)
    }
  }, [profile])

  const mutation = useMutation({
    mutationFn: (data: object) => profileApi.update(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['seeker-profile'] })
      Alert.alert(t('Saved', 'Imehifadhiwa'), t('Profile updated.', 'Wasifu umesasishwa.'), [
        { text: 'OK', onPress: () => router.back() },
      ])
    },
    onError: () => {
      Alert.alert(t('Error', 'Hitilafu'), t('Could not save profile.', 'Imeshindwa kuhifadhi wasifu.'))
    },
  })

  const handleSave = async () => {
    if (photoUri) {
      const formData = new FormData()
      formData.append('bio', bio)
      formData.append('gender', gender)
      if (dob) formData.append('date_of_birth', dob)
      formData.append('is_discoverable', String(isDiscoverable))
      formData.append('profile_photo', {
        uri: photoUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any)
      mutation.mutate(formData as any)
    } else {
      mutation.mutate({
        bio,
        gender,
        date_of_birth: dob || null,
        is_discoverable: isDiscoverable,
      })
    }
  }

  const regionName = regions?.find((r) => r.id === selectedRegion)
    ? (lang === 'sw'
        ? regions.find((r) => r.id === selectedRegion)!.name_sw
        : regions.find((r) => r.id === selectedRegion)!.name_en)
    : t('Select region', 'Chagua mkoa')

  if (isLoading) {
    return (
      <View style={s.loadingCenter}>
        <ActivityIndicator color="#059669" />
      </View>
    )
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
        <Text style={s.title}>{t('Edit Profile', 'Hariri Wasifu')}</Text>
      </View>

      <ScrollView style={s.container} contentContainerStyle={s.content}>
        {/* Profile Photo */}
        <View style={s.photoSection}>
          <TouchableOpacity style={s.photoWrap} onPress={pickPhoto}>
            {photoUri || profile?.profile_photo ? (
              <Image
                source={{ uri: photoUri || profile!.profile_photo! }}
                style={s.photo}
              />
            ) : (
              <View style={s.photoPlaceholder}>
                <Camera size={28} color="#9ca3af" />
              </View>
            )}
            <View style={s.photoBadge}>
              <Camera size={12} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={s.photoHint}>{t('Tap to change photo', 'Gusa kubadilisha picha')}</Text>
        </View>

        <View style={s.field}>
          <Text style={s.label}>{t('Bio', 'Maelezo Mafupi')}</Text>
          <TextInput
            style={[s.input, s.textarea]}
            value={bio}
            onChangeText={setBio}
            placeholder={t('Tell employers about yourself...', 'Jiambie kwa waajiri...')}
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={400}
          />
          <Text style={s.charCount}>{bio.length}/400</Text>
        </View>

        <View style={s.field}>
          <Text style={s.label}>{t('Gender', 'Jinsia')}</Text>
          <View style={s.pillRow}>
            {GENDER_OPTIONS.map((g) => (
              <TouchableOpacity
                key={g.value}
                style={[s.pill, gender === g.value && s.pillActive]}
                onPress={() => setGender(g.value)}
              >
                <Text style={[s.pillText, gender === g.value && s.pillTextActive]}>
                  {lang === 'sw' ? g.labelSw : g.labelEn}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={s.field}>
          <Text style={s.label}>{t('Date of Birth', 'Tarehe ya Kuzaliwa')}</Text>
          <TextInput
            style={s.input}
            value={dob}
            onChangeText={setDob}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#9ca3af"
            keyboardType="numbers-and-punctuation"
          />
        </View>

        <View style={s.field}>
          <Text style={s.label}>{t('Region', 'Mkoa')}</Text>
          <TouchableOpacity
            style={[s.input, s.selectRow]}
            onPress={() => setShowRegionPicker(!showRegionPicker)}
          >
            <Text style={{ color: selectedRegion ? '#111827' : '#9ca3af', fontSize: 15 }}>
              {regionName}
            </Text>
            <ChevronDown size={16} color="#9ca3af" />
          </TouchableOpacity>
          {showRegionPicker && regions && (
            <View style={s.dropdown}>
              {regions.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  style={[s.dropdownItem, selectedRegion === r.id && s.dropdownItemActive]}
                  onPress={() => { setSelectedRegion(r.id); setShowRegionPicker(false) }}
                >
                  <Text style={[s.dropdownItemText, selectedRegion === r.id && { color: '#059669', fontWeight: '700' }]}>
                    {lang === 'sw' ? r.name_sw : r.name_en}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={[s.field, s.switchRow]}>
          <View style={{ flex: 1 }}>
            <Text style={s.label}>{t('Discoverable by Employers', 'Waajiri Wanaweza Kunipata')}</Text>
            <Text style={s.hint}>
              {t(
                'Allow employers to find your profile when browsing seekers.',
                'Ruhusu waajiri kupata wasifu wako wanapotafuta waombaji.'
              )}
            </Text>
          </View>
          <Switch
            value={isDiscoverable}
            onValueChange={setIsDiscoverable}
            trackColor={{ true: '#059669', false: '#e5e7eb' }}
            thumbColor="#fff"
          />
        </View>

        {selectedRegion && regions && (
          <View style={s.field}>
            <Text style={s.label}>{t('Your Location', 'Eneo Lako')}</Text>
            <LocationMap
              regionName={regions.find((r) => r.id === selectedRegion)?.name_en}
              height={160}
            />
          </View>
        )}

        <TouchableOpacity
          style={[s.btn, mutation.isPending && s.btnDisabled]}
          onPress={handleSave}
          disabled={mutation.isPending}
        >
          {mutation.isPending
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.btnText}>{t('Save Changes', 'Hifadhi Mabadiliko')}</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  loadingCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  photoSection: { alignItems: 'center', marginBottom: 8 },
  photoWrap: { position: 'relative' },
  photo: { width: 90, height: 90, borderRadius: 45 },
  photoPlaceholder: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
  photoBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#059669', borderRadius: 12, width: 24, height: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  photoHint: { fontSize: 12, color: '#9ca3af', marginTop: 6 },
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
  hint: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: '#111827',
  },
  textarea: { height: 100 },
  charCount: { fontSize: 11, color: '#9ca3af', textAlign: 'right' },
  pillRow: { flexDirection: 'row', gap: 8 },
  pill: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff',
  },
  pillActive: { backgroundColor: '#059669', borderColor: '#059669' },
  pillText: { fontSize: 13, color: '#374151', fontWeight: '500' },
  pillTextActive: { color: '#fff' },
  selectRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dropdown: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb',
    borderRadius: 10, maxHeight: 200, overflow: 'hidden',
  },
  dropdownItem: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  dropdownItemActive: { backgroundColor: '#f0fdf4' },
  dropdownItemText: { fontSize: 14, color: '#374151' },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 12, padding: 14 },
  btn: {
    backgroundColor: '#059669', borderRadius: 12,
    paddingVertical: 15, alignItems: 'center', marginTop: 8,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
})
