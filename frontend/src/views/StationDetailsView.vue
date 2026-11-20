<script setup lang="ts">
import { ref } from 'vue'
import AuditForm from '@/components/AuditForm.vue'
import AuditList from '@/components/AuditList.vue'
import BaseModal from '@/components/BaseModal.vue'
import ErrorState from '@/components/ErrorState.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { useStationDetails } from '@/composables/useStationDetails'
import { formatDate } from '@/utils/format'

const { station, audits, isLoading, error, notFound, load, addAudit } = useStationDetails()
const showAuditForm = ref(false)
</script>

<template>
  <div>
    <div v-if="isLoading" class="space-y-4" aria-busy="true">
      <div class="skeleton h-10 w-1/2"></div>
      <div class="skeleton h-40 w-full"></div>
      <div class="skeleton h-40 w-full"></div>
    </div>

    <div v-else-if="notFound" class="py-16 text-center">
      <h1 class="text-2xl font-bold">Станцію не знайдено</h1>
      <p class="mt-2 opacity-70">Станції з такою адресою не існує або її було видалено.</p>
      <RouterLink to="/" class="btn btn-primary mt-6">До реєстру</RouterLink>
    </div>

    <ErrorState v-else-if="error" :message="error" @retry="load" />

    <template v-else-if="station">
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-3">
          <h1 class="text-2xl font-bold">{{ station.name }}</h1>
          <StatusBadge :status="station.status" />
        </div>
        <div class="flex gap-2">
          <RouterLink to="/" class="btn btn-ghost">До реєстру</RouterLink>
          <RouterLink :to="{ name: 'station-edit', params: { id: station.id } }" class="btn btn-outline">
            Редагувати
          </RouterLink>
        </div>
      </div>

      <section class="mb-8 rounded-box bg-base-100 p-5 shadow-sm">
        <dl class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt class="text-sm opacity-60">Цех / сектор</dt>
            <dd class="font-semibold">{{ station.location }}</dd>
          </div>
          <div>
            <dt class="text-sm opacity-60">Робочий тиск</dt>
            <dd class="font-semibold">{{ station.operatingPressureBar }} бар</dd>
          </div>
          <div>
            <dt class="text-sm opacity-60">Потужність</dt>
            <dd class="font-semibold">{{ station.powerKw }} кВт</dd>
          </div>
          <div>
            <dt class="text-sm opacity-60">Останній аудит</dt>
            <dd class="font-semibold">{{ formatDate(station.lastAuditDate) }}</dd>
          </div>
        </dl>
        <p v-if="station.description" class="mt-4 text-sm">{{ station.description }}</p>
      </section>

      <section>
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-xl font-bold">Журнал інспекцій</h2>
          <button class="btn btn-primary btn-sm" @click="showAuditForm = true">Додати інспекцію</button>
        </div>
        <AuditList :audits="audits" />
      </section>

      <BaseModal v-if="showAuditForm" title="Новий протокол інспекції" @close="showAuditForm = false">
        <AuditForm :save="addAudit" @saved="showAuditForm = false" @cancel="showAuditForm = false" />
      </BaseModal>
    </template>
  </div>
</template>
