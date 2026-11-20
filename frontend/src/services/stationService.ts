import { baseApi } from '@/api/baseApi'
import type { AuditInput, AuditLog, Station, StationFilters, StationInput } from '@/types'

export const stationService = {
  getAll(filters: StationFilters): Promise<Station[]> {
    // У запит потрапляють лише заповнені параметри
    const params: Record<string, string> = {}
    if (filters.search) params.search = filters.search
    if (filters.status) params.status = filters.status
    if (filters.sortBy) {
      params.sortBy = filters.sortBy
      params.order = filters.order
    }
    return baseApi.get<Station[]>('/stations', params)
  },
  getById: (id: string) => baseApi.get<Station>(`/stations/${id}`),
  create: (input: StationInput) => baseApi.post<Station>('/stations', input),
  update: (id: string, input: StationInput) => baseApi.put<Station>(`/stations/${id}`, input),
  remove: (id: string) => baseApi.delete(`/stations/${id}`),
  getAudits: (id: string) => baseApi.get<AuditLog[]>(`/stations/${id}/audits`),
  createAudit: (id: string, input: AuditInput) => baseApi.post<AuditLog>(`/stations/${id}/audits`, input),
}
