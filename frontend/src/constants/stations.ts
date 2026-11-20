import type { SortField, StationStatus } from '@/types'

export const STATUS_LABELS: Record<StationStatus, string> = {
  operational: 'В роботі',
  maintenance_required: 'Потребує ТО',
  decommissioned: 'Виведено з експлуатації',
}

export const STATUS_BADGE: Record<StationStatus, string> = {
  operational: 'badge-success',
  maintenance_required: 'badge-warning',
  decommissioned: 'badge-neutral',
}

export const STATUS_BORDER: Record<StationStatus, string> = {
  operational: 'border-l-success',
  maintenance_required: 'border-l-warning',
  decommissioned: 'border-l-neutral',
}

export const STATUS_VALUES = Object.keys(STATUS_LABELS) as StationStatus[]

export const SORT_LABELS: Record<SortField, string> = {
  lastAuditDate: 'За датою аудиту',
  powerKw: 'За потужністю',
}
export const SORT_VALUES = Object.keys(SORT_LABELS) as SortField[]
