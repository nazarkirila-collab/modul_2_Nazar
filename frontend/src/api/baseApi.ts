import axios from 'axios'

// Адреса API береться зі змінної оточення (.env.development / .env.production)
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

export const baseApi = {
  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    return (await client.get<T>(url, { params })).data
  },
  async post<T>(url: string, body?: unknown): Promise<T> {
    return (await client.post<T>(url, body)).data
  },
  async put<T>(url: string, body?: unknown): Promise<T> {
    return (await client.put<T>(url, body)).data
  },
  async delete(url: string): Promise<void> {
    await client.delete(url)
  },
}
