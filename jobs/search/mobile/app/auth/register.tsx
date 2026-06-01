import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native'
import { useState, useEffect } from 'react'
import { authApi } from '@/lib/api/auth'
import { useAuthStore } from '@/store/auth'
import { useLangStore } from '@/store/lang'
import { useRouter } from 'expo-router'
import { Briefcase, Eye, EyeOff } from 'lucide-react-native'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import * as AppleAuthentication from 'expo-apple-authentication'

WebBrowser.maybeCompleteAuthSession()

const ANDROID_CLIENT_ID = 'YOUR_ANDROID_GOOGLE_CLIENT_ID'
const IOS_CLIENT_ID = 'YOUR_IOS_GOOGLE_CLIENT_ID'
const WEB_CLIENT_ID = 'YOUR_WEB_GOOGLE_CLIENT_ID'

const ROLES = [
  { value: 'JOB_SEEKER', en: 'Job Seeker', sw: 'Mtafutaji Kazi', emoji: '👤' },
  { value: 'EMPLOYER', en: 'Employer', sw: 'Mwajiri', emoji: '🏢' },
]

export default function RegisterScreen() {
  const { login } = useAuthStore()
  const { t } = useLangStore()
  const router = useRouter()

  const [role, setRole] = useState('JOB_SEEKER')
  const [googleLoading, setGoogleLoading] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [phone, setPhone] = useState('+255 ')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    scopes: ['openid', 'profile', 'email'],
  })

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.authentication?.idToken
      if (idToken) {
        setGoogleLoading(true)
        authApi.googleAuth(idToken)
          .then(async (data) => { await login(data.access, data.refresh, data.user); router.replace(data.user.role === 'EMPLOYER' ? '/dashboard/employer' : '/(tabs)/profile') })
          .catch((e) => setError(e.response?.data?.detail || t('Google sign-up failed.', 'Google usajili umeshindwa.')))
          .finally(() => setGoogleLoading(false))
      }
    }
  }, [response])

  const handleAppleSignUp = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      })
      if (!credential.identityToken) throw new Error('No identity token')
      const data = await authApi.appleAuth(
        credential.identityToken,
        credential.fullName?.givenName || '',
        credential.fullName?.familyName || '',
      )
      await login(data.access, data.refresh, data.user)
      router.replace(data.user.role === 'EMPLOYER' ? '/dashboard/employer' : '/(tabs)/profile')
    } catch (err: any) {
      if (err.code !== 'ERR_REQUEST_CANCELED') {
        setError(err.response?.data?.detail || t('Apple sign-up failed.', 'Apple usajili umeshindwa.'))
      }
    }
  }

  const handleRegister = async () => {
    if (!firstName.trim()) { setError(t('Enter your first name', 'Weka jina la kwanza')); return }
    if (!lastName.trim()) { setError(t('Enter your last name', 'Weka jina la ukoo')); return }
    if (!username.trim()) { setError(t('Choose a username', 'Chagua jina la mtumiaji')); return }
    if (username.length < 3) { setError(t('Username must be at least 3 characters', 'Jina la mtumiaji liwe na herufi 3+')); return }
    if (!password || password.length < 6) { setError(t('Password must be at least 6 characters', 'Nenosiri liwe na herufi 6+')); return }
    if (password !== confirmPassword) { setError(t('Passwords do not match', 'Manenosiri hayafanani')); return }
    if (!phone.replace('+255', '').trim()) { setError(t('Enter your phone number', 'Weka namba ya simu')); return }

    setError(''); setLoading(true)
    try {
      const data = await authApi.register({
        username: username.trim().toLowerCase(),
        password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone_number: phone.replace(/\s/g, ''),
        address: address.trim(),
        role,
      })
      await login(data.access, data.refresh, data.user)
      router.replace(data.user.role === 'EMPLOYER' ? '/dashboard/employer' : '/(tabs)/profile')
    } catch (err: any) {
      if (err.code === 'ECONNABORTED' || err.message === 'Network Error') {
        setError(t('Cannot reach server. Check your connection.', 'Hakuna muunganiko. Angalia mtandao wako.'))
      } else {
        const d = err.response?.data
        const msg = d?.username?.[0] || d?.phone_number?.[0] || d?.detail || t('Registration failed', 'Usajili umeshindwa')
        setError(msg)
      }
    } finally { setLoading(false) }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={s.iconBox}>
          <Briefcase size={32} color="#059669" />
        </View>
        <Text style={s.title}>{t('Create Account', 'Fungua Akaunti')}</Text>
        <Text style={s.sub}>{t("Join Search — Tanzania's job platform", 'Jiunge na Search')}</Text>

        {/* Social sign-up */}
        <TouchableOpacity
          style={s.socialBtn}
          onPress={() => { setGoogleLoading(true); promptAsync() }}
          disabled={!request || googleLoading}
        >
          {googleLoading
            ? <ActivityIndicator color="#374151" size="small" />
            : <>
                <Text style={s.googleIcon}>G</Text>
                <Text style={s.socialBtnText}>{t('Continue with Google', 'Endelea na Google')}</Text>
              </>
          }
        </TouchableOpacity>

        {Platform.OS === 'ios' && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={12}
            style={s.appleBtn}
            onPress={handleAppleSignUp}
          />
        )}

        <View style={s.dividerRow}>
          <View style={s.dividerLine} />
          <Text style={s.dividerText}>{t('or register manually', 'au jisajili kwa mkono')}</Text>
          <View style={s.dividerLine} />
        </View>

        {/* Role */}
        <Text style={s.label}>{t('I am a...', 'Mimi ni...')}</Text>
        <View style={s.roleRow}>
          {ROLES.map((r) => (
            <TouchableOpacity
              key={r.value}
              style={[s.roleCard, role === r.value && s.roleCardActive]}
              onPress={() => setRole(r.value)}
            >
              <Text style={s.roleEmoji}>{r.emoji}</Text>
              <Text style={[s.roleLabel, role === r.value && s.roleLabelActive]}>
                {t(r.en, r.sw)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Name row */}
        <View style={s.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={s.label}>{t('First Name', 'Jina la Kwanza')} *</Text>
            <TextInput
              style={s.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder={t('John', 'Juma')}
              placeholderTextColor="#9ca3af"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.label}>{t('Last Name', 'Jina la Ukoo')} *</Text>
            <TextInput
              style={s.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder={t('Doe', 'Mwamba')}
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

        <Text style={s.label}>{t('Username', 'Jina la Mtumiaji')} *</Text>
        <TextInput
          style={s.input}
          value={username}
          onChangeText={(v) => setUsername(v.replace(/[^a-z0-9_]/gi, '').toLowerCase())}
          placeholder={t('e.g. john_doe', 'mfano: juma_mwamba')}
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={s.label}>{t('Password', 'Nenosiri')} *</Text>
        <View style={s.passwordRow}>
          <TextInput
            style={s.passwordInput}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholder={t('Min. 6 characters', 'Angalau herufi 6')}
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity style={s.eyeBtn} onPress={() => setShowPassword((v) => !v)}>
            {showPassword ? <EyeOff size={18} color="#9ca3af" /> : <Eye size={18} color="#9ca3af" />}
          </TouchableOpacity>
        </View>

        <Text style={s.label}>{t('Confirm Password', 'Thibitisha Nenosiri')} *</Text>
        <View style={[s.passwordRow, confirmPassword.length > 0 && password !== confirmPassword && s.passwordRowError]}>
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
        {confirmPassword.length > 0 && password !== confirmPassword ? (
          <Text style={s.matchError}>{t('Passwords do not match', 'Manenosiri hayafanani')}</Text>
        ) : null}

        <Text style={s.label}>{t('Phone Number', 'Namba ya Simu')} *</Text>
        <TextInput
          style={s.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="+255 7XX XXX XXX"
          placeholderTextColor="#9ca3af"
        />

        <Text style={s.label}>{t('Address', 'Anwani')}</Text>
        <TextInput
          style={s.input}
          value={address}
          onChangeText={setAddress}
          placeholder={t('Street, City, Region', 'Mtaa, Mji, Mkoa')}
          placeholderTextColor="#9ca3af"
        />

        {error ? <Text style={s.error}>{error}</Text> : null}

        <TouchableOpacity style={s.btn} onPress={handleRegister} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.btnText}>{t('Create Account', 'Fungua Akaunti')}</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={s.altLink} onPress={() => router.push('/auth/login')}>
          <Text style={s.altText}>
            {t('Already have an account? ', 'Una akaunti tayari? ')}
            <Text style={s.altHighlight}>{t('Login', 'Ingia')}</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', padding: 24, paddingTop: 56 },
  iconBox: { width: 64, height: 64, backgroundColor: '#d1fae5', borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '700', color: '#111827', marginBottom: 6 },
  sub: { fontSize: 14, color: '#6b7280', marginBottom: 16 },
  socialBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingVertical: 13, marginBottom: 10, backgroundColor: '#fff' },
  googleIcon: { fontSize: 16, fontWeight: '700', color: '#ea4335' },
  socialBtnText: { fontSize: 15, fontWeight: '600', color: '#374151' },
  appleBtn: { width: '100%', height: 48, marginBottom: 10 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e5e7eb' },
  dividerText: { fontSize: 12, color: '#9ca3af' },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  row: { flexDirection: 'row' },
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  roleCard: { flex: 1, borderWidth: 2, borderColor: '#e5e7eb', borderRadius: 14, padding: 14, alignItems: 'center' },
  roleCardActive: { borderColor: '#059669', backgroundColor: '#f0fdf4' },
  roleEmoji: { fontSize: 28, marginBottom: 6 },
  roleLabel: { fontSize: 13, fontWeight: '600', color: '#374151' },
  roleLabelActive: { color: '#059669' },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#111827', marginBottom: 16, backgroundColor: '#fff' },
  passwordRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, marginBottom: 16, backgroundColor: '#fff' },
  passwordRowError: { borderColor: '#ef4444' },
  matchError: { color: '#ef4444', fontSize: 12, marginTop: -12, marginBottom: 12 },
  passwordInput: { flex: 1, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#111827' },
  eyeBtn: { paddingHorizontal: 14 },
  error: { color: '#ef4444', fontSize: 13, marginBottom: 12 },
  btn: { backgroundColor: '#059669', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 12, marginTop: 4 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  altLink: { marginTop: 16, marginBottom: 32 },
  altText: { textAlign: 'center', fontSize: 14, color: '#6b7280' },
  altHighlight: { color: '#059669', fontWeight: '700' },
})
