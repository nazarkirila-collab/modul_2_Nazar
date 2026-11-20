import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import { parseApiError } from '@/api/apiError'
import { stationService } from '@/services/stationService'
import type { FieldErrors, StationFormState, StationInput } from '@/types'
import { todayIso } from '@/utils/format'
import { validateStation } from '@/utils/validation'

const LEAVE_MESSAGE = 'Є незбережені зміни. Покинути сторінку без збереження?'

function emptyForm(): StationFormState {
  return {
    name: '',
    location: '',
    operatingPressureBar: '',
    powerKw: '',
    status: 'operational',
    lastAuditDate: todayIso(),
    description: '',
  }
}

// Логіка форми створення / редагування станції
export function useStationForm() {
  const route = useRoute()
  const router = useRouter()

  const stationId = computed(() => (typeof route.params.id === 'string' ? route.params.id : ''))
  const isEdit = computed(() => stationId.value !== '')

  const form = reactive<StationFormState>(emptyForm())
  const initialSnapshot = ref(JSON.stringify(form))
  const errors = ref<FieldErrors>({})
  const serverError = ref('')
  const isLoading = ref(false)
  const loadError = ref('')
  const notFound = ref(false)
  const isSubmitting = ref(false)
  let isSaved = false

  // Форма «брудна», якщо поточні значення відрізняються від початкових
  const isDirty = computed(() => JSON.stringify(form) !== initialSnapshot.value)

  function resetTo(state: StationFormState) {
    Object.assign(form, state)
    initialSnapshot.value = JSON.stringify(form)
    errors.value = {}
    serverError.value = ''
  }

  async function load() {
    loadError.value = ''
    notFound.value = false
    if (!isEdit.value) {
      resetTo(emptyForm())
      return
    }
    isLoading.value = true
    try {
      const s = await stationService.getById(stationId.value)
      resetTo({
        name: s.name,
        location: s.location,
        operatingPressureBar: s.operatingPressureBar,
        powerKw: s.powerKw,
        status: s.status,
        lastAuditDate: s.lastAuditDate,
        description: s.description ?? '',
      })
    } catch (e) {
      const info = parseApiError(e)
      if (info.status === 404) notFound.value = true
      else loadError.value = info.message
    } finally {
      isLoading.value = false
    }
  }

  async function submit() {
    errors.value = validateStation(form)
    if (Object.keys(errors.value).length > 0) return

    isSubmitting.value = true
    serverError.value = ''
    try {
      const input: StationInput = {
        name: form.name.trim(),
        location: form.location.trim(),
        operatingPressureBar: Number(form.operatingPressureBar),
        powerKw: Number(form.powerKw),
        status: form.status,
        lastAuditDate: form.lastAuditDate,
        description: form.description.trim(),
      }
      const saved = isEdit.value
        ? await stationService.update(stationId.value, input)
        : await stationService.create(input)
      isSaved = true // після збереження попередження про вихід не потрібне
      await router.push({ name: 'station-details', params: { id: saved.id } })
    } catch (e) {
      const info = parseApiError(e)
      errors.value = info.fieldErrors // повідомлення валідації від сервера
      serverError.value = info.message
    } finally {
      isSubmitting.value = false
    }
  }

  // Захист від втрати даних: перехід усередині застосунку
  onBeforeRouteLeave(() => {
    if (isDirty.value && !isSaved) return window.confirm(LEAVE_MESSAGE)
  })

  // ...і закриття вкладки / оновлення сторінки
  function onBeforeUnload(event: BeforeUnloadEvent) {
    if (isDirty.value && !isSaved) event.preventDefault()
  }
  onMounted(() => window.addEventListener('beforeunload', onBeforeUnload))
  onUnmounted(() => window.removeEventListener('beforeunload', onBeforeUnload))

  // Той самий компонент обслуговує /new та /:id/edit, тому слідкуємо за маршрутом
  watch(
    () => [route.name, stationId.value],
    () => {
      if (route.name === 'station-new' || route.name === 'station-edit') {
        isSaved = false
        load()
      }
    },
    { immediate: true },
  )

  return { form, errors, serverError, isEdit, stationId, isLoading, loadError, notFound, isSubmitting, load, submit }
}
