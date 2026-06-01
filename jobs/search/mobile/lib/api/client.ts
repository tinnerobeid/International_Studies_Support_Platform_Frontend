import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const API_URL = 'http://192.168.35.196:8000/api/v1'

export const api = axios.create({ baseURL: API_URL, timeout: 10000 })

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refresh = await AsyncStorage.getItem('refresh_token')
        if (!refresh) return Promise.reject(error)
        const { data } = await axios.post(`${API_URL}/auth/refresh/`, { refresh })
        await AsyncStorage.setItem('access_token', data.access)
        original.headers.Authorization = `Bearer ${data.access}`
        return api(original)
      } catch {
        await AsyncStorage.removeItem('access_token')
        await AsyncStorage.removeItem('refresh_token')
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)
