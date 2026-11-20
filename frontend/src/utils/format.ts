export function formatDate(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleDateString('uk-UA')
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}
