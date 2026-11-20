import axios from 'axios'
import type { FieldErrors } from '@/types'

export interface ApiErrorInfo {
  message: string
  status?: number
  fieldErrors: FieldErrors
}

interface ServerErrorBody {
  message?: string
  errors?: { field: string; message: string }[]
}

// Перетворює будь-яку помилку запиту на зрозумілий об'єкт для інтерфейсу
export function parseApiError(error: unknown): ApiErrorInfo {
  if (axios.isAxiosError<ServerErrorBody>(error)) {
    if (!error.response) {
      return {
        message: 'Не вдалося з’єднатися із сервером. Перевірте підключення та повторіть спробу.',
        fieldErrors: {},
      }
    }
    const fieldErrors: FieldErrors = {}
    error.response.data?.errors?.forEach((e) => {
      fieldErrors[e.field] = e.message
    })
    return {
      status: error.response.status,
      message: error.response.data?.message ?? `Помилка сервера (${error.response.status})`,
      fieldErrors,
    }
  }
  return { message: 'Невідома помилка', fieldErrors: {} }
}
