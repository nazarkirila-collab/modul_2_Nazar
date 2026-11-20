export type StationStatus = 'operational' | 'maintenance_required' | 'decommissioned'

export const STATION_STATUSES: StationStatus[] = ['operational', 'maintenance_required', 'decommissioned']

export interface CompressorStation {
  id: string
  name: string
  location: string
  operatingPressureBar: number
  powerKw: number
  status: StationStatus
  lastAuditDate: string
  description?: string
}

export type StationInput = Omit<CompressorStation, 'id'>

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

export interface FieldError {
  field: string
  message: string
}
