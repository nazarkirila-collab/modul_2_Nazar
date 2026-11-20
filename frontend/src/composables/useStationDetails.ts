import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { parseApiError } from '@/api/apiError'
import { stationService } from '@/services/stationService'
import type { AuditInput, AuditLog, Station } from '@/types'

// Стан екрана «Детальна картка»: станція + її журнал аудитів
export function useStationDetails() {
  const route = useRoute()
  const stationId = computed(() => (typeof route.params.id === 'string' ? route.params.id : ''))

  const station = ref<Station | null>(null)
  const audits = ref<AuditLog[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const notFound = ref(false)

  async function load() {
    isLoading.value = true
    error.value = null
    notFound.value = false
    try {
      const [stationData, auditsData] = await Promise.all([
        stationService.getById(stationId.value),
        stationService.getAudits(stationId.value),
      ])
      station.value = stationData
      audits.value = auditsData
    } catch (e) {
      const info = parseApiError(e)
      station.value = null
      if (info.status === 404) notFound.value = true
      else error.value = info.message
    } finally {
      isLoading.value = false
    }
  }

  // Після збереження перечитуємо журнал, щоб він одразу оновився (з сортуванням від сервера)
  async function addAudit(input: AuditInput) {
    await stationService.createAudit(stationId.value, input)
    audits.value = await stationService.getAudits(stationId.value)
  }

  // Компонент не перемонтовується при зміні :id, тому стежимо за параметром
  watch(
    stationId,
    (id) => {
      if (id && route.name === 'station-details') load()
    },
    { immediate: true },
  )

  return { station, audits, isLoading, error, notFound, load, addAudit }
}
