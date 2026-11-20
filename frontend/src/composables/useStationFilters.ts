import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { LocationQueryValue } from 'vue-router'
import { SORT_VALUES, STATUS_VALUES } from '@/constants/stations'
import type { SortField, StationFilters, StationStatus } from '@/types'

function firstValue(value: LocationQueryValue | LocationQueryValue[] | undefined): string {
  const v = Array.isArray(value) ? value[0] : value
  return typeof v === 'string' ? v : ''
}

// Фільтри живуть в URL (query-параметри): їх зберігає оновлення сторінки і посилання колезі
export function useStationFilters() {
  const route = useRoute()
  const router = useRouter()

  const filters = computed<StationFilters>(() => {
    const status = firstValue(route.query.status)
    const sortBy = firstValue(route.query.sortBy)
    return {
      search: firstValue(route.query.search),
      status: STATUS_VALUES.includes(status as StationStatus) ? (status as StationStatus) : '',
      sortBy: SORT_VALUES.includes(sortBy as SortField) ? (sortBy as SortField) : '',
      order: firstValue(route.query.order) === 'desc' ? 'desc' : 'asc',
    }
  })

  const hasActiveFilters = computed(
    () => Boolean(filters.value.search || filters.value.status || filters.value.sortBy),
  )

  function updateFilters(patch: Partial<StationFilters>) {
    const next = { ...filters.value, ...patch }
    const query: Record<string, string> = {}
    if (next.search) query.search = next.search
    if (next.status) query.status = next.status
    if (next.sortBy) {
      query.sortBy = next.sortBy
      query.order = next.order
    }
    router.replace({ query })
  }

  function resetFilters() {
    router.replace({ query: {} })
  }

  return { filters, hasActiveFilters, updateFilters, resetFilters }
}
