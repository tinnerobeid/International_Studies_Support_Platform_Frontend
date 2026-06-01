import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  FlatList, ActivityIndicator, StyleSheet,
} from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { jobsApi } from '@/lib/api/jobs'
import { locationsApi } from '@/lib/api/locations'
import { useLangStore } from '@/store/lang'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Search, MapPin } from 'lucide-react-native'
import JobCard from '@/components/JobCard'

const CATEGORY_ICONS: Record<string, string> = {
  kilimo: '🌾', madini: '⛏️', utalii: '🏨', nyumbani: '🏠',
  ujenzi: '🏗️', usafirishaji: '🚛', elimu: '📚', afya: '❤️',
  teknolojia: '💻', fedha: '💰', biashara: '🛍️', ngo: '🤝',
  serikali: '🏛️', ulinzi: '🛡️', viwanda: '🏭', habari: '📻',
  sheria: '⚖️', kawaida: '💼',
}

export default function HomeScreen() {
  const { lang, t } = useLangStore()
  const { user } = useAuthStore()
  const router = useRouter()
  const [search, setSearch] = useState('')

  const { data: featured, isLoading: featuredLoading, isError: featuredError } = useQuery({
    queryKey: ['featured-jobs'],
    queryFn: jobsApi.featured,
    retry: 1,
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: jobsApi.categories,
  })

  const userRegionId = (user as any)?.region
  const { data: nearbyJobs } = useQuery({
    queryKey: ['jobs-near-you', userRegionId],
    queryFn: () => jobsApi.list({ region: userRegionId }),
    enabled: !!userRegionId,
    select: (d) => d.results.slice(0, 5),
  })

  const handleSearch = () => {
    if (search.trim()) {
      router.push({ pathname: '/(tabs)/jobs', params: { q: search } })
    }
  }

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={s.hero}>
        <Text style={s.heroTitle}>
          {t('Find Your Next Job', 'Pata Kazi Yako')}
        </Text>
        <Text style={s.heroSub}>
          {t('Tanzania — all regions, all levels', 'Tanzania — mikoa yote, ngazi zote')}
        </Text>
        <View style={s.searchBar}>
          <Search size={18} color="#9ca3af" style={{ marginRight: 8 }} />
          <TextInput
            style={s.searchInput}
            placeholder={t('Job title, keyword...', 'Jina la kazi...')}
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
      </View>

      <View style={s.content}>
        {/* Jobs Near You */}
        {nearbyJobs && nearbyJobs.length > 0 && (
          <View style={s.section}>
            <View style={s.sectionRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <MapPin size={15} color="#059669" />
                <Text style={s.sectionTitle}>{t('Jobs Near You', 'Kazi Karibu Nawe')}</Text>
              </View>
              <TouchableOpacity onPress={() => router.push({ pathname: '/(tabs)/jobs', params: { region: userRegionId } })}>
                <Text style={s.seeAll}>{t('See all', 'Ona zote')}</Text>
              </TouchableOpacity>
            </View>
            {nearbyJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </View>
        )}

        {/* Categories */}
        {categories && categories.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>{t('Browse by Category', 'Tafuta kwa Aina')}</Text>
            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={s.catCard}
                  onPress={() => router.push({ pathname: '/(tabs)/jobs', params: { category: item.slug } })}
                >
                  <Text style={s.catEmoji}>{CATEGORY_ICONS[item.slug] || '💼'}</Text>
                  <Text style={s.catLabel} numberOfLines={2}>
                    {lang === 'sw' ? item.name_sw : item.name_en}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingVertical: 4 }}
            />
          </View>
        )}

        {/* Latest Jobs */}
        <View style={s.section}>
          <View style={s.sectionRow}>
            <Text style={s.sectionTitle}>{t('Latest Jobs', 'Kazi za Hivi Karibuni')}</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/jobs')}>
              <Text style={s.seeAll}>{t('See all', 'Ona zote')}</Text>
            </TouchableOpacity>
          </View>

          {featuredLoading ? (
            <ActivityIndicator color="#059669" style={{ marginTop: 20 }} />
          ) : featuredError ? (
            <View style={s.empty}>
              <Text style={s.emptyText}>{t('Could not load jobs. Check your connection.', 'Imeshindwa kupakia kazi. Angalia mtandao.')}</Text>
            </View>
          ) : featured && featured.length > 0 ? (
            featured.slice(0, 5).map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <View style={s.empty}>
              <Text style={s.emptyText}>{t('No jobs yet', 'Hakuna kazi bado')}</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  hero: {
    backgroundColor: '#059669',
    paddingTop: 60,
    paddingBottom: 28,
    paddingHorizontal: 20,
  },
  heroTitle: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 4 },
  heroSub: { color: '#a7f3d0', fontSize: 14, marginBottom: 16 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#111827' },
  content: { padding: 16 },
  section: { marginBottom: 24 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 12 },
  seeAll: { fontSize: 13, color: '#059669', fontWeight: '500' },
  catCard: {
    width: 80,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  catEmoji: { fontSize: 24, marginBottom: 4 },
  catLabel: { fontSize: 10, color: '#374151', textAlign: 'center', fontWeight: '500' },
  empty: { paddingVertical: 32, alignItems: 'center' },
  emptyText: { color: '#9ca3af', fontSize: 14 },
})
