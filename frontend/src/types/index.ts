export type StationStatus = 'operational' | 'maintenance_required' | 'decommissioned'
export type SortField = 'lastAuditDate' | 'powerKw'
export type SortOrder = 'asc' | 'desc'

export interface Station {
  id: string
  name: string
  location: string
  operatingPressureBar: number
  powerKw: number
  status: StationStatus
  lastAuditDate: string
  description?: string
}
export type StationInput = Omit<Station, 'id'>

export interface AuditLog {
  id: string
  stationId: string
  inspectorName: string
  auditDate: string
  oilLevelPercent: number
  vibrationLevelMmS: number
  passed: boolean
  summary: string
}
export type AuditInput = Omit<AuditLog, 'id' | 'stationId'>

// Стан фільтрів реєстру (зберігається в query-параметрах URL)
export interface StationFilters {
  search: string
  status: StationStatus | ''
  sortBy: SortField | ''
  order: SortOrder
}

// Стани форм: числові поля можуть бути порожніми, поки користувач не ввів значення
export interface StationFormState {
  name: string
  location: string
  operatingPressureBar: number | ''
  powerKw: number | ''
  status: StationStatus
  lastAuditDate: string
  description: string
}

export interface AuditFormState {
  inspectorName: string
  auditDate: string
  oilLevelPercent: number | ''
  vibrationLevelMmS: number | ''
  passed: boolean
  summary: string
}

export type FieldErrors = Partial<Record<string, string>>
