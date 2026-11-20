<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { SORT_LABELS, SORT_VALUES, STATUS_LABELS, STATUS_VALUES } from '@/constants/stations'
import { useStationFilters } from '@/composables/useStationFilters'
import type { SortField, StationStatus } from '@/types'

const { filters, hasActiveFilters, updateFilters, resetFilters } = useStationFilters()

// Пошук оновлює URL із затримкою, щоб не надсилати запит на кожну літеру
const searchText = ref(filters.value.search)
let timer = 0

watch(searchText, (value) => {
  clearTimeout(timer)
  timer = window.setTimeout(() => updateFilters({ search: value }), 300)
})
// Синхронізація назад: скидання фільтрів, кнопка «Назад» у браузері
watch(
  () => filters.value.search,
  (value) => {
    searchText.value = value
  },
)
onUnmounted(() => clearTimeout(timer))

const status = computed({
  get: () => filters.value.status,
  set: (value: StationStatus | '') => updateFilters({ status: value }),
})
const sortBy = computed({
  get: () => filters.value.sortBy,
  set: (value: SortField | '') => updateFilters({ sortBy: value }),
})
function toggleOrder() {
  updateFilters({ order: filters.value.order === 'asc' ? 'desc' : 'asc' })
}
</script>

<template>
  <div class="mb-6 grid gap-3 rounded-box bg-base-100 p-4 shadow-sm md:grid-cols-5">
    <input v-model="searchText" type="search" class="input w-full md:col-span-2" placeholder="Пошук за назвою або цехом" />
    <select v-model="status" class="select w-full">
      <option value="">Всі статуси</option>
      <option v-for="s in STATUS_VALUES" :key="s" :value="s">{{ STATUS_LABELS[s] }}</option>
    </select>
    <div class="flex gap-2">
      <select v-model="sortBy" class="select w-full">
        <option value="">Без сортування</option>
        <option v-for="s in SORT_VALUES" :key="s" :value="s">{{ SORT_LABELS[s] }}</option>
      </select>
      <button class="btn btn-square" :disabled="!filters.sortBy" title="Змінити напрямок" @click="toggleOrder">
        {{ filters.order === 'asc' ? '↑' : '↓' }}
      </button>
    </div>
    <button class="btn btn-outline" :disabled="!hasActiveFilters" @click="resetFilters">Скинути</button>
  </div>
</template>
