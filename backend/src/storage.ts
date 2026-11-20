import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

// Папка data лежить поруч із package.json (сервер запускається з папки backend)
const DATA_DIR = path.join(process.cwd(), 'data')

export async function readJson<T>(fileName: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(path.join(DATA_DIR, fileName), 'utf-8')
    return JSON.parse(raw) as T
  } catch (error) {
    // Якщо файлу ще немає — повертаємо значення за замовчуванням
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return fallback
    throw error
  }
}

export async function writeJson<T>(fileName: string, data: T): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(path.join(DATA_DIR, fileName), JSON.stringify(data, null, 2), 'utf-8')
}
