import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native'
import { useState } from 'react'
import { authApi } from '@/lib/api/auth'
import { useLangStore } from '@/store/lang'
import { useRouter } from 'expo-router'
import { KeyRound, Eye, EyeOff } from 'lucide-react-native'

export default function ForgotPasswordScreen() {
  const { t } = useLangStore()
  const router = useRouter()

  const [step, setStep] = useState<'verify' | 'done'>('verify')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('+255 ')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleReset = async () => {
    if (!username.trim()) { setError(t('Enter your username', 'Weka jina la mtumiaji')); return }
    if (!phone.replace('+255', '').trim()) { setError(t('Enter your phone number', 'Weka namba ya simu')); return }
    if (!newPassword || newPassword.length < 6) { setError(t('Password must be at least 6 characters', 'Nenosiri liwe na herufi 6+')); return }
    if (newPassword !== confirmPassword) { setError(t('Passwords do not match', 'Manenosiri hayafanani')); return }

    setError(''); setLoading(true)
    try {
      await authApi.resetPassword(
        username.trim().toLowerCase(),
        phone.replace(/\s/g, ''),
        newPassword,
      )
      setStep('done')
    } catch (err: any) {
      if (err.code === 'ECONNABORTED' || err.message === 'Network Error') {
        setError(t('Cannot reach server. Check your connection.', 'Hakuna muunganiko.'))
      } else {
        setError(err.response?.data?.detail || t('Reset failed. Check your details.', 'Imeshindwa. Angalia taarifa zako.'))
      }
    } finally { setLoading(false) }
  }

  if (step === 'done') {
    return (
      <View style={s.center}>
        <View style={s.successIcon}>
          <KeyRound size={32} color="#059669" />
        </View>
        <Text style={s.successTitle}>{t('Password Reset!', 'Nenosiri Limewekwa Upya!')}</Text>
        <Text style={s.successSub}>
          {t('You can now login with your new password.', 'Sasa unaweza kuingia na nenosiri lako jipya.')}
        </Text>
        <TouchableOpacity style={s.btn} onPress={() => router.replace('/auth/login')}>
          <Text style={s.btnText}>{t('Go to Login', 'Nenda Kuingia')}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={s.backLink} onPress={() => router.back()}>
          <Text style={s.backLinkText}>{t('← Back', '← Rudi')}</Text>
        </TouchableOpacity>

        <View style={s.iconBox}>
          <KeyRound size={32} color="#059669" />
        </View>
        <Text style={s.title}>{t('Recover Password', 'Rudisha Nenosiri')}</Text>
        <Text style={s.sub}>
          {t(
            'Enter your username and phone number to verify your identity, then set a new password.',
            'Weka jina la mtumiaji na namba ya simu kuthibitisha utambulisho wako, kisha weka nenosiri jipya.',
          )}
        </Text>

        <Text style={s.label}>{t('Username', 'Jina la Mtumiaji')}</Text>
        <TextInput
          style={s.input}
          value={username}
          onChangeText={setUsername}
          placeholder={t('your_username', 'jina_lako')}
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={s.label}>{t('Phone Number', 'Namba ya Simu')}</Text>
        <TextInput
          style={s.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="+255 7XX XXX XXX"
          placeholderTextColor="#9ca3af"
        />

        <Text style={s.label}>{t('New Password', 'Nenosiri Jipya')}</Text>
        <View style={s.passwordRow}>
          <TextInput
            style={s.passwordInput}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showNew}
            placeholder={t('Min. 6 characters', 'Angalau herufi 6')}
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity style={s.eyeBtn} onPress={() => setShowNew((v) => !v)}>
            {showNew ? <EyeOff size={18} color="#9ca3af" /> : <Eye size={18} color="#9ca3af" />}
          </TouchableOpacity>
        </View>

        <Text style={s.label}>{t('Confirm New Password', 'Thibitisha Nenosiri Jipya')}</Text>
        <View style={s.passwordRow}>
          <TextInput
            style={s.passwordInput}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirm}
            placeholder={t('Repeat password', 'Rudia nenosiri')}
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity style={s.eyeBtn} onPress={() => setShowConfirm((v) => !v)}>
            {showConfirm ? <EyeOff size={18} color="#9ca3af" /> : <Eye size={18} color="#9ca3af" />}
          </TouchableOpacity>
        </View>

        {error ? <Text style={s.error}>{error}</Text> : null}

        <TouchableOpacity style={s.btn} onPress={handleReset} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.btnText}>{t('Reset Password', 'Weka Nenosiri Jipya')}</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', padding: 24, paddingTop: 56 },
  backLink: { marginBottom: 24 },
  backLinkText: { color: '#059669', fontSize: 14, fontWeight: '600' },
  iconBox: { width: 64, height: 64, backgroundColor: '#d1fae5', borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 8 },
  sub: { fontSize: 14, color: '#6b7280', lineHeight: 20, marginBottom: 28 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#111827', marginBottom: 16, backgroundColor: '#fff' },
  passwordRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, marginBottom: 16, backgroundColor: '#fff' },
  passwordInput: { flex: 1, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#111827' },
  eyeBtn: { paddingHorizontal: 14 },
  error: { color: '#ef4444', fontSize: 13, marginBottom: 12 },
  btn: { backgroundColor: '#059669', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  center: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 32 },
  successIcon: { width: 80, height: 80, backgroundColor: '#d1fae5', borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successTitle: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 10, textAlign: 'center' },
  successSub: { fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
})
