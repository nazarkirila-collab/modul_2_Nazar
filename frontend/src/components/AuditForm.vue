<script setup lang="ts">
import { reactive, ref } from 'vue'
import { parseApiError } from '@/api/apiError'
import type { AuditFormState, AuditInput, FieldErrors } from '@/types'
import { todayIso } from '@/utils/format'
import { validateAudit } from '@/utils/validation'
import FormField from './FormField.vue'

const props = defineProps<{ save: (input: AuditInput) => Promise<void> }>()
const emit = defineEmits<{ saved: []; cancel: [] }>()

const form = reactive<AuditFormState>({
  inspectorName: '',
  auditDate: todayIso(),
  oilLevelPercent: '',
  vibrationLevelMmS: '',
  passed: true,
  summary: '',
})
const errors = ref<FieldErrors>({})
const serverError = ref('')
const isSubmitting = ref(false)

async function submit() {
  errors.value = validateAudit(form)
  if (Object.keys(errors.value).length > 0) return

  isSubmitting.value = true
  serverError.value = ''
  try {
    await props.save({
      inspectorName: form.inspectorName.trim(),
      auditDate: form.auditDate,
      oilLevelPercent: Number(form.oilLevelPercent),
      vibrationLevelMmS: Number(form.vibrationLevelMmS),
      passed: form.passed,
      summary: form.summary.trim(),
    })
    emit('saved')
  } catch (e) {
    const info = parseApiError(e)
    errors.value = info.fieldErrors
    serverError.value = info.message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form novalidate @submit.prevent="submit">
    <div v-if="serverError" role="alert" class="alert alert-error alert-soft mb-4">{{ serverError }}</div>
    <FormField label="ПІБ інженера-аудитора" :error="errors.inspectorName">
      <input v-model="form.inspectorName" class="input w-full" />
    </FormField>
    <FormField label="Дата інспекції" :error="errors.auditDate">
      <input v-model="form.auditDate" type="date" class="input w-full" />
    </FormField>
    <div class="grid grid-cols-2 gap-3">
      <FormField label="Рівень оливи, %" :error="errors.oilLevelPercent">
        <input v-model.number="form.oilLevelPercent" type="number" step="any" class="input w-full" />
      </FormField>
      <FormField label="Вібрація, мм/с" :error="errors.vibrationLevelMmS">
        <input v-model.number="form.vibrationLevelMmS" type="number" step="any" class="input w-full" />
      </FormField>
    </div>
    <FormField label="Вердикт" :error="errors.passed">
      <select v-model="form.passed" class="select w-full">
        <option :value="true">Допущено до роботи</option>
        <option :value="false">Відхилено</option>
      </select>
    </FormField>
    <FormField label="Висновок" :error="errors.summary">
      <textarea v-model="form.summary" rows="3" class="textarea w-full"></textarea>
    </FormField>
    <div class="modal-action">
      <button type="button" class="btn" :disabled="isSubmitting" @click="emit('cancel')">Скасувати</button>
      <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="loading loading-spinner loading-sm"></span>
        Зберегти
      </button>
    </div>
  </form>
</template>
