<script setup lang="ts">
import type { AuditLog } from '@/types'
import { formatDate } from '@/utils/format'

defineProps<{ audits: AuditLog[] }>()
</script>

<template>
  <p v-if="audits.length === 0" class="rounded-box bg-base-100 p-6 text-center opacity-70">
    Протоколів інспекції ще немає.
  </p>
  <div v-else class="overflow-x-auto rounded-box bg-base-100 shadow-sm">
    <table class="table">
      <thead>
        <tr>
          <th>Дата</th>
          <th>Інспектор</th>
          <th>Олива, %</th>
          <th>Вібрація, мм/с</th>
          <th>Вердикт</th>
          <th>Висновок</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="audit in audits" :key="audit.id">
          <td class="whitespace-nowrap">{{ formatDate(audit.auditDate) }}</td>
          <td>{{ audit.inspectorName }}</td>
          <td>{{ audit.oilLevelPercent }}</td>
          <td>{{ audit.vibrationLevelMmS }}</td>
          <td>
            <span class="badge" :class="audit.passed ? 'badge-success' : 'badge-error'">
              {{ audit.passed ? 'Допущено' : 'Відхилено' }}
            </span>
          </td>
          <td>{{ audit.summary }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
