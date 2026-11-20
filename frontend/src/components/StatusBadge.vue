<script setup lang="ts">
import { STATUS_BADGE, STATUS_LABELS } from '@/constants/stations'
import type { StationStatus } from '@/types'

defineProps<{ status: StationStatus }>()
</script>

<template>
  <span class="badge whitespace-nowrap" :class="STATUS_BADGE[status]">{{ STATUS_LABELS[status] }}</span>
</template>
