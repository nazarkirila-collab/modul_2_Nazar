import { STATION_STATUSES } from './types.js'
import type { FieldError } from './types.js'

function isNumber(value: any, min: number, max: number): boolean {
  return typeof value === 'number' && value >= min && value <= max
}

function isDate(value: any): boolean {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(value)
  return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

// Повертає список помилок. Порожній список — дані коректні
export function validateStation(body: any): FieldError[] {
  const errors: FieldError[] = []

  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  if (name.length < 3 || name.length > 60) {
    errors.push({ field: 'name', message: 'Назва має містити від 3 до 60 символів' })
  }
  if (typeof body?.location !== 'string' || !body.location.trim()) {
    errors.push({ field: 'location', message: 'Вкажіть цех або сектор' })
  }
  if (!isNumber(body?.operatingPressureBar, 1, 40)) {
    errors.push({ field: 'operatingPressureBar', message: 'Робочий тиск — число від 1 до 40 бар' })
  }
  if (!isNumber(body?.powerKw, 5, 1000)) {
    errors.push({ field: 'powerKw', message: 'Потужність — число від 5 до 1000 кВт' })
  }
  if (!STATION_STATUSES.includes(body?.status)) {
    errors.push({ field: 'status', message: 'Некоректний статус станції' })
  }
  if (!isDate(body?.lastAuditDate)) {
    errors.push({ field: 'lastAuditDate', message: 'Дата має бути у форматі YYYY-MM-DD' })
  }
  if (body?.description !== undefined && body?.description !== null) {
    if (typeof body.description !== 'string' || body.description.trim().length > 300) {
      errors.push({ field: 'description', message: 'Опис — текст не довше 300 символів' })
    }
  }
  return errors
}

export function validateAudit(body: any): FieldError[] {
  const errors: FieldError[] = []

  if (typeof body?.inspectorName !== 'string' || body.inspectorName.trim().length < 3) {
    errors.push({ field: 'inspectorName', message: 'ПІБ інспектора — не менше 3 символів' })
  }
  if (!isDate(body?.auditDate)) {
    errors.push({ field: 'auditDate', message: 'Дата має бути у форматі YYYY-MM-DD' })
  }
  if (!isNumber(body?.oilLevelPercent, 0, 100)) {
    errors.push({ field: 'oilLevelPercent', message: 'Рівень оливи — число від 0 до 100 %' })
  }
  if (!isNumber(body?.vibrationLevelMmS, 0, 25)) {
    errors.push({ field: 'vibrationLevelMmS', message: 'Вібрація — число від 0 до 25 мм/с' })
  }
  if (typeof body?.passed !== 'boolean') {
    errors.push({ field: 'passed', message: 'Вкажіть, чи допущено станцію до роботи' })
  }
  if (typeof body?.summary !== 'string' || body.summary.trim().length < 5) {
    errors.push({ field: 'summary', message: 'Висновок — не менше 5 символів' })
  }
  return errors
}
