import { defineStore } from 'pinia'
import { ref } from 'vue'
import { parseApiError } from '@/api/apiError'
import { stationService } from '@/services/stationService'
import type { Station, StationFilters } from '@/types'

export const useStationsStore = defineStore('stations', () => {
  // State
  const stations = ref<Station[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function fetchStations(filters: StationFilters) {
    isLoading.value = true
    error.value = null
    try {
      stations.value = await stationService.getAll(filters)
    } catch (e) {
      error.value = parseApiError(e).message
    } finally {
      isLoading.value = false
    }
  }

  async function deleteStation(id: string) {
    await stationService.remove(id)
    stations.value = stations.value.filter((s) => s.id !== id)
  }

  return { stations, isLoading, error, fetchStations, deleteStation }
})
