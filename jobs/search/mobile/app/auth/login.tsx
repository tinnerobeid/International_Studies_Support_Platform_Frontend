import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Image,
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
import { Platform as RNPlatform } from 'react-native'

WebBrowser.maybeCompleteAuthSession()

const ANDROID_CLIENT_ID = 'YOUR_ANDROID_GOOGLE_CLIENT_ID'
const IOS_CLIENT_ID = 'YOUR_IOS_GOOGLE_CLIENT_ID'
const WEB_CLIENT_ID = 'YOUR_WEB_GOOGLE_CLIENT_ID'

export default function LoginScreen() {
  const { login } = useAuthStore()
  const { t } = useLangStore()
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
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
      if (idToken) handleGoogleToken(idToken)
    } else if (response?.type === 'error') {
      setError(t('Google sign-in failed.', 'Google kuingia kumeshindwa.'))
      setGoogleLoading(false)
    }
  }, [response])

  const handleLogin = async () => {
    if (!username.trim()) { setError(t('Enter your username', 'Weka jina la mtumiaji')); return }
    if (!password) { setError(t('Enter your password', 'Weka nenosiri')); return }

    setError(''); setLoading(true)
    try {
      const data = await authApi.login(username.trim().toLowerCase(), password)
      await login(data.access, data.refresh, data.user)
      router.replace(data.user.role === 'EMPLOYER' ? '/dashboard/employer' : '/(tabs)/profile')
    } catch (err: any) {
      if (err.code === 'ECONNABORTED' || err.message === 'Network Error') {
        setError(t('Cannot reach server. Check your connection.', 'Hakuna muunganiko. Angalia mtandao wako.'))
      } else {
        setError(err.response?.data?.detail || t('Invalid username or password', 'Jina au nenosiri si sahihi'))
      }
    } finally { setLoading(false) }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setGoogleLoading(true)
    await promptAsync()
  }

  const handleGoogleToken = async (idToken: string) => {
    try {
      const data = await authApi.googleAuth(idToken)
      await login(data.access, data.refresh, data.user)
      router.replace(data.user.role === 'EMPLOYER' ? '/dashboard/employer' : '/(tabs)/profile')
    } catch (err: any) {
      setError(err.response?.data?.detail || t('Google sign-in failed.', 'Google kuingia kumeshindwa.'))
    } finally { setGoogleLoading(false) }
  }

  const handleAppleSignIn = async () => {
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
        setError(err.response?.data?.detail || t('Apple sign-in failed.', 'Apple kuingia kumeshindwa.'))
      }
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={s.iconBox}>
          <Briefcase size={32} color="#059669" />
        </View>
        <Text style={s.title}>{t('Welcome back', 'Karibu tena')}</Text>
        <Text style={s.sub}>{t('Login to your Search account', 'Ingia kwenye akaunti yako ya Search')}</Text>

        {/* Social buttons */}
        <TouchableOpacity
          style={s.socialBtn}
          onPress={handleGoogleSignIn}
          disabled={!request || googleLoading}
        >
          {googleLoading ? (
            <ActivityIndicator color="#374151" size="small" />
          ) : (
            <>
              <Text style={s.googleIcon}>G</Text>
              <Text style={s.socialBtnText}>{t('Continue with Google', 'Endelea na Google')}</Text>
            </>
          )}
        </TouchableOpacity>

        {RNPlatform.OS === 'ios' && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={12}
            style={s.appleBtn}
            onPress={handleAppleSignIn}
          />
        )}

        <View style={s.dividerRow}>
          <View style={s.dividerLine} />
          <Text style={s.dividerText}>{t('or', 'au')}</Text>
          <View style={s.dividerLine} />
        </View>

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

        <Text style={s.label}>{t('Password', 'Nenosiri')}</Text>
        <View style={s.passwordRow}>
          <TextInput
            style={s.passwordInput}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholder={t('Enter password', 'Weka nenosiri')}
            placeholderTextColor="#9ca3af"
            onSubmitEditing={handleLogin}
            returnKeyType="done"
          />
          <TouchableOpacity style={s.eyeBtn} onPress={() => setShowPassword((v) => !v)}>
            {showPassword ? <EyeOff size={18} color="#9ca3af" /> : <Eye size={18} color="#9ca3af" />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={s.forgotLink} onPress={() => router.push('/auth/forgot-password')}>
          <Text style={s.forgotText}>{t('Forgot password?', 'Umesahau nenosiri?')}</Text>
        </TouchableOpacity>

        {error ? <Text style={s.error}>{error}</Text> : null}

        <TouchableOpacity style={s.btn} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>{t('Login', 'Ingia')}</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={s.altLink} onPress={() => router.push('/auth/register')}>
          <Text style={s.altText}>
            {t("Don't have an account? ", "Huna akaunti? ")}
            <Text style={s.altHighlight}>{t('Register', 'Jisajili')}</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', padding: 24, paddingTop: 80 },
  iconBox: { width: 64, height: 64, backgroundColor: '#d1fae5', borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '700', color: '#111827', marginBottom: 6 },
  sub: { fontSize: 14, color: '#6b7280', marginBottom: 24 },
  socialBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12,
    paddingVertical: 13, marginBottom: 10, backgroundColor: '#fff',
  },
  googleIcon: { fontSize: 16, fontWeight: '700', color: '#ea4335' },
  socialBtnText: { fontSize: 15, fontWeight: '600', color: '#374151' },
  appleBtn: { width: '100%', height: 48, marginBottom: 10 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e5e7eb' },
  dividerText: { fontSize: 13, color: '#9ca3af', fontWeight: '500' },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#111827', marginBottom: 16 },
  passwordRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, marginBottom: 16 },
  passwordInput: { flex: 1, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#111827' },
  eyeBtn: { paddingHorizontal: 14 },
  forgotLink: { alignSelf: 'flex-end', marginTop: -8, marginBottom: 16 },
  forgotText: { color: '#059669', fontSize: 13, fontWeight: '600' },
  error: { color: '#ef4444', fontSize: 13, marginBottom: 12 },
  btn: { backgroundColor: '#059669', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 12, marginTop: 4 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  altLink: { marginTop: 20 },
  altText: { textAlign: 'center', fontSize: 14, color: '#6b7280' },
  altHighlight: { color: '#059669', fontWeight: '700' },
})
