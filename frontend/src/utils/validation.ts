import { STATUS_VALUES } from '@/constants/stations'
import type { AuditFormState, FieldErrors, StationFormState } from '@/types'

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function inRange(value: unknown, min: number, max: number): boolean {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max
}

function isDate(value: string): boolean {
  return DATE_RE.test(value) && !Number.isNaN(new Date(value).getTime())
}

export function validateStation(f: StationFormState): FieldErrors {
  const errors: FieldErrors = {}
  const name = f.name.trim()
  if (!name) errors.name = 'Назва обов’язкова'
  else if (name.length < 3 || name.length > 60) errors.name = 'Назва має містити від 3 до 60 символів'
  if (!f.location.trim()) errors.location = 'Вкажіть цех або сектор'
  if (!inRange(f.operatingPressureBar, 1, 40)) errors.operatingPressureBar = 'Тиск — число від 1 до 40 бар'
  if (!inRange(f.powerKw, 5, 1000)) errors.powerKw = 'Потужність — число від 5 до 1000 кВт'
  if (!STATUS_VALUES.includes(f.status)) errors.status = 'Оберіть статус'
  if (!isDate(f.lastAuditDate)) errors.lastAuditDate = 'Вкажіть коректну дату'
  if (f.description.trim().length > 300) errors.description = 'Опис не довше 300 символів'
  return errors
}

export function validateAudit(f: AuditFormState): FieldErrors {
  const errors: FieldErrors = {}
  if (f.inspectorName.trim().length < 3) errors.inspectorName = 'ПІБ — не менше 3 символів'
  if (!isDate(f.auditDate)) errors.auditDate = 'Вкажіть коректну дату'
  if (!inRange(f.oilLevelPercent, 0, 100)) errors.oilLevelPercent = 'Рівень оливи — від 0 до 100 %'
  if (!inRange(f.vibrationLevelMmS, 0, 25)) errors.vibrationLevelMmS = 'Вібрація — від 0 до 25 мм/с'
  if (f.summary.trim().length < 5) errors.summary = 'Висновок — не менше 5 символів'
  return errors
}
