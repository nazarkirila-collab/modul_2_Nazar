<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { parseApiError } from '@/api/apiError'
import BaseModal from '@/components/BaseModal.vue'
import ErrorState from '@/components/ErrorState.vue'
import StationCard from '@/components/StationCard.vue'
import StationFilters from '@/components/StationFilters.vue'
import StationSkeleton from '@/components/StationSkeleton.vue'
import { useStationFilters } from '@/composables/useStationFilters'
import { useStationsStore } from '@/stores/stations.store'
import type { Station } from '@/types'

const route = useRoute()
const store = useStationsStore()
const { stations, isLoading, error } = storeToRefs(store)
const { filters, hasActiveFilters, resetFilters } = useStationFilters()

function load() {
  return store.fetchStations(filters.value)
}

// Будь-яка зміна фільтрів в URL → новий запит. Перевірка маршруту не дає робити зайвий запит під час виходу зі сторінки
watch(
  filters,
  () => {
    if (route.name === 'stations') load()
  },
  { immediate: true },
)

// Видалення з підтвердженням
const stationToDelete = ref<Station | null>(null)
const isDeleting = ref(false)
const deleteError = ref('')

function askDelete(station: Station) {
  deleteError.value = ''
  stationToDelete.value = station
}

async function confirmDelete() {
  if (!stationToDelete.value) return
  isDeleting.value = true
  deleteError.value = ''
  try {
    await store.deleteStation(stationToDelete.value.id)
    stationToDelete.value = null
  } catch (e) {
    deleteError.value = parseApiError(e).message
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-2xl font-bold">Реєстр компресорних станцій</h1>
      <RouterLink to="/stations/new" class="btn btn-primary">Додати станцію</RouterLink>
    </div>

    <StationFilters />

    <StationSkeleton v-if="isLoading" />
    <ErrorState v-else-if="error" :message="error" @retry="load" />
    <div v-else-if="stations.length === 0" class="rounded-box bg-base-100 p-10 text-center">
      <p class="text-lg">За поточними критеріями станцій не знайдено.</p>
      <button v-if="hasActiveFilters" class="btn btn-outline mt-4" @click="resetFilters">Скинути фільтри</button>
    </div>
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StationCard v-for="station in stations" :key="station.id" :station="station" @delete="askDelete" />
    </div>

    <BaseModal v-if="stationToDelete" title="Видалити станцію?" @close="stationToDelete = null">
      <p>
        Станцію <strong>{{ stationToDelete.name }}</strong> та всі її протоколи інспекцій буде видалено без можливості
        відновлення.
      </p>
      <div v-if="deleteError" role="alert" class="alert alert-error alert-soft mt-4">{{ deleteError }}</div>
      <div class="modal-action">
        <button class="btn" :disabled="isDeleting" @click="stationToDelete = null">Скасувати</button>
        <button class="btn btn-error" :disabled="isDeleting" @click="confirmDelete">
          <span v-if="isDeleting" class="loading loading-spinner loading-sm"></span>
          Видалити
        </button>
      </div>
    </BaseModal>
  </div>
</template>
