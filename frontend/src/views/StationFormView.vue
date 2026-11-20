<script setup lang="ts">
import ErrorState from '@/components/ErrorState.vue'
import FormField from '@/components/FormField.vue'
import { STATUS_LABELS, STATUS_VALUES } from '@/constants/stations'
import { useStationForm } from '@/composables/useStationForm'

const { form, errors, serverError, isEdit, stationId, isLoading, loadError, notFound, isSubmitting, load, submit } =
  useStationForm()
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <h1 class="mb-4 text-2xl font-bold">{{ isEdit ? 'Редагування станції' : 'Нова компресорна станція' }}</h1>

    <div v-if="isLoading" class="skeleton h-80 w-full" aria-busy="true"></div>

    <div v-else-if="notFound" class="py-12 text-center">
      <p class="text-lg">Станцію не знайдено — її не існує або її було видалено.</p>
      <RouterLink to="/" class="btn btn-primary mt-6">До реєстру</RouterLink>
    </div>

    <ErrorState v-else-if="loadError" :message="loadError" @retry="load" />

    <form v-else class="rounded-box bg-base-100 p-6 shadow-sm" novalidate @submit.prevent="submit">
      <div v-if="serverError" role="alert" class="alert alert-error alert-soft mb-4">{{ serverError }}</div>

      <FormField label="Назва / маркування" :error="errors.name">
        <input v-model="form.name" class="input w-full" maxlength="80" />
      </FormField>
      <FormField label="Цех або сектор" :error="errors.location">
        <input v-model="form.location" class="input w-full" />
      </FormField>
      <div class="grid gap-3 sm:grid-cols-2">
        <FormField label="Робочий тиск, бар" :error="errors.operatingPressureBar">
          <input v-model.number="form.operatingPressureBar" type="number" step="any" class="input w-full" />
        </FormField>
        <FormField label="Потужність, кВт" :error="errors.powerKw">
          <input v-model.number="form.powerKw" type="number" step="any" class="input w-full" />
        </FormField>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <FormField label="Статус" :error="errors.status">
          <select v-model="form.status" class="select w-full">
            <option v-for="s in STATUS_VALUES" :key="s" :value="s">{{ STATUS_LABELS[s] }}</option>
          </select>
        </FormField>
        <FormField label="Дата останнього аудиту" :error="errors.lastAuditDate">
          <input v-model="form.lastAuditDate" type="date" class="input w-full" />
        </FormField>
      </div>
      <FormField label="Технічні примітки (до 300 символів)" :error="errors.description">
        <textarea v-model="form.description" rows="4" class="textarea w-full"></textarea>
      </FormField>

      <div class="flex justify-end gap-2">
        <RouterLink
          :to="isEdit ? { name: 'station-details', params: { id: stationId } } : { name: 'stations' }"
          class="btn"
        >
          Скасувати
        </RouterLink>
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          <span v-if="isSubmitting" class="loading loading-spinner loading-sm"></span>
          {{ isEdit ? 'Зберегти зміни' : 'Створити' }}
        </button>
      </div>
    </form>
  </div>
</template>
