<script setup lang="ts">
import { STATUS_BORDER } from '@/constants/stations'
import type { Station } from '@/types'
import { formatDate } from '@/utils/format'
import StatusBadge from './StatusBadge.vue'

defineProps<{ station: Station }>()
const emit = defineEmits<{ delete: [station: Station] }>()
</script>

<template>
  <article class="card border border-l-4 border-base-300 bg-base-100 shadow-sm" :class="STATUS_BORDER[station.status]">
    <div class="card-body gap-3">
      <div class="flex items-start justify-between gap-2">
        <h2 class="card-title text-base">{{ station.name }}</h2>
        <StatusBadge :status="station.status" />
      </div>
      <p class="text-sm opacity-70">{{ station.location }}</p>
      <dl class="grid grid-cols-3 gap-2 text-sm">
        <div>
          <dt class="opacity-60">Тиск</dt>
          <dd class="font-semibold">{{ station.operatingPressureBar }} бар</dd>
        </div>
        <div>
          <dt class="opacity-60">Потужність</dt>
          <dd class="font-semibold">{{ station.powerKw }} кВт</dd>
        </div>
        <div>
          <dt class="opacity-60">Аудит</dt>
          <dd class="font-semibold">{{ formatDate(station.lastAuditDate) }}</dd>
        </div>
      </dl>
      <div class="card-actions justify-end">
        <RouterLink :to="{ name: 'station-details', params: { id: station.id } }" class="btn btn-primary btn-sm">
          Докладніше
        </RouterLink>
        <RouterLink :to="{ name: 'station-edit', params: { id: station.id } }" class="btn btn-outline btn-sm">
          Редагувати
        </RouterLink>
        <button class="btn btn-outline btn-error btn-sm" @click="emit('delete', station)">Видалити</button>
      </div>
    </div>
  </article>
</template>
