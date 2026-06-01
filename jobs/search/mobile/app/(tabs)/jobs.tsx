import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  ActivityIndicator, StyleSheet, Modal, ScrollView,
} from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { jobsApi } from '@/lib/api/jobs'
import { locationsApi } from '@/lib/api/locations'
import { useLangStore } from '@/store/lang'
import { useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react-native'
import JobCard from '@/components/JobCard'

const EMP_TYPES = [
  ['FULL_TIME', 'Full Time'], ['PART_TIME', 'Part Time'],
  ['CONTRACT', 'Contract'], ['CASUAL', 'Casual'], ['INTERNSHIP', 'Internship'],
]

export default function JobsScreen() {
  const { t, lang } = useLangStore()
  const params = useLocalSearchParams<{ q?: string; category?: string }>()

  const [search, setSearch] = useState(params.q || '')
  const [page, setPage] = useState(1)
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    region: '' as string,
    category: params.category || '',
    employment_type: '',
  })

  useEffect(() => {
    if (params.category) setFilters((f) => ({ ...f, category: params.category! }))
    if (params.q) setSearch(params.q)
  }, [params.category, params.q])

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['jobs', search, filters, page],
    queryFn: () => jobsApi.list({
      q: search || undefined,
      region: filters.region ? Number(filters.region) : undefined,
      category: filters.category || undefined,
      employment_type: filters.employment_type || undefined,
      page,
    }),
    retry: 1,
  })

  const { data: regions } = useQuery({ queryKey: ['regions'], queryFn: locationsApi.regions })

  const jobs = data?.results || []
  const totalPages = data ? Math.ceil(data.count / 20) : 1

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>{t('Browse Jobs', 'Tafuta Kazi')}</Text>
        <View style={s.searchRow}>
          <View style={s.searchBox}>
            <Search size={16} color="#9ca3af" />
            <TextInput
              style={s.searchInput}
              placeholder={t('Search...', 'Tafuta...')}
              placeholderTextColor="#9ca3af"
              value={search}
              onChangeText={(v) => { setSearch(v); setPage(1) }}
              returnKeyType="search"
            />
            {search ? (
              <TouchableOpacity onPress={() => { setSearch(''); setPage(1) }}>
                <X size={14} color="#9ca3af" />
              </TouchableOpacity>
            ) : null}
          </View>
          <TouchableOpacity
            style={[s.filterBtn, (filters.region || filters.category || filters.employment_type) && s.filterBtnActive]}
            onPress={() => setFilterOpen(true)}
          >
            <SlidersHorizontal size={18} color={(filters.region || filters.category || filters.employment_type) ? '#fff' : '#374151'} />
          </TouchableOpacity>
        </View>
        {data && (
          <Text style={s.countText}>{data.count} {t('jobs found', 'kazi zimepatikana')}</Text>
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator color="#059669" style={{ marginTop: 40 }} />
      ) : isError ? (
        <View style={s.empty}>
          <Text style={s.emptyText}>{t('Could not load jobs. Check your connection.', 'Imeshindwa kupakia kazi. Angalia mtandao.')}</Text>
        </View>
      ) : jobs.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyText}>{t('No jobs found', 'Hakuna kazi zilizopatikana')}</Text>
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <JobCard job={item} />}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            totalPages > 1 ? (
              <View style={s.pagination}>
                <TouchableOpacity
                  onPress={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={[s.pageBtn, page === 1 && s.pageBtnDisabled]}
                >
                  <Text style={s.pageBtnText}>{t('Previous', 'Iliyopita')}</Text>
                </TouchableOpacity>
                <Text style={s.pageInfo}>{page} / {totalPages}</Text>
                <TouchableOpacity
                  onPress={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={[s.pageBtn, page === totalPages && s.pageBtnDisabled]}
                >
                  <Text style={s.pageBtnText}>{t('Next', 'Inayofuata')}</Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
        />
      )}

      {/* Filter Modal */}
      <Modal visible={filterOpen} animationType="slide" presentationStyle="pageSheet">
        <View style={s.modalContainer}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>{t('Filters', 'Vichujio')}</Text>
            <TouchableOpacity onPress={() => setFilterOpen(false)}>
              <X size={22} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={s.modalBody}>
            <Text style={s.filterLabel}>{t('Region', 'Mkoa')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {[{ id: '', name_en: 'All', name_sw: 'Zote' }, ...(regions || [])].map((r) => (
                <TouchableOpacity
                  key={r.id}
                  style={[s.chip, filters.region === String(r.id) && s.chipActive]}
                  onPress={() => setFilters((f) => ({ ...f, region: String(r.id) }))}
                >
                  <Text style={[s.chipText, filters.region === String(r.id) && s.chipTextActive]}>
                    {lang === 'sw' ? r.name_sw : r.name_en}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={s.filterLabel}>{t('Employment Type', 'Aina ya Ajira')}</Text>
            <View style={s.chipRow}>
              {EMP_TYPES.map(([v, l]) => (
                <TouchableOpacity
                  key={v}
                  style={[s.chip, filters.employment_type === v && s.chipActive]}
                  onPress={() => setFilters((f) => ({ ...f, employment_type: f.employment_type === v ? '' : v }))}
                >
                  <Text style={[s.chipText, filters.employment_type === v && s.chipTextActive]}>{l}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={s.modalFooter}>
            <TouchableOpacity
              style={s.clearBtn}
              onPress={() => { setFilters({ region: '', category: '', employment_type: '' }); setFilterOpen(false) }}
            >
              <Text style={s.clearBtnText}>{t('Clear All', 'Futa Yote')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.applyBtn} onPress={() => { setPage(1); setFilterOpen(false) }}>
              <Text style={s.applyBtnText}>{t('Apply', 'Tumia')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { backgroundColor: '#fff', paddingTop: 56, paddingBottom: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 10 },
  searchRow: { flexDirection: 'row', gap: 8 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#111827' },
  filterBtn: { width: 42, height: 42, backgroundColor: '#f3f4f6', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  filterBtnActive: { backgroundColor: '#059669' },
  countText: { fontSize: 12, color: '#6b7280', marginTop: 8 },
  list: { padding: 16 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText: { color: '#9ca3af', fontSize: 15 },
  pagination: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  pageBtn: { backgroundColor: '#059669', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  pageBtnDisabled: { backgroundColor: '#e5e7eb' },
  pageBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  pageInfo: { color: '#374151', fontSize: 13 },
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingTop: 28 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  modalBody: { padding: 20 },
  filterLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 10 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff' },
  chipActive: { backgroundColor: '#d1fae5', borderColor: '#059669' },
  chipText: { fontSize: 13, color: '#374151' },
  chipTextActive: { color: '#065f46', fontWeight: '600' },
  modalFooter: { flexDirection: 'row', gap: 12, padding: 20, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  clearBtn: { flex: 1, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  clearBtnText: { color: '#374151', fontWeight: '600' },
  applyBtn: { flex: 1, backgroundColor: '#059669', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  applyBtnText: { color: '#fff', fontWeight: '700' },
})
