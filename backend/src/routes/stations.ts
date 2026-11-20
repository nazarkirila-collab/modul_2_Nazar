import { randomUUID } from 'node:crypto'
import { Router } from 'express'
import { readJson, writeJson } from '../storage.js'
import { STATION_STATUSES } from '../types.js'
import type { AuditInput, AuditLog, CompressorStation, StationInput, StationStatus } from '../types.js'
import { validateAudit, validateStation } from '../validation.js'

const router = Router()

const loadStations = () => readJson<CompressorStation[]>('stations.json', [])
const loadAudits = () => readJson<AuditLog[]>('audits.json', [])
const notFound = (id: string) => ({ message: `Станцію з id "${id}" не знайдено` })

// Беремо з тіла запиту лише потрібні поля й обрізаємо зайві пробіли
function toStationInput(body: any): StationInput {
  return {
    name: body.name.trim(),
    location: body.location.trim(),
    operatingPressureBar: body.operatingPressureBar,
    powerKw: body.powerKw,
    status: body.status,
    lastAuditDate: body.lastAuditDate,
    description: (body.description ?? '').trim(),
  }
}

function toAuditInput(body: any): AuditInput {
  return {
    inspectorName: body.inspectorName.trim(),
    auditDate: body.auditDate,
    oilLevelPercent: body.oilLevelPercent,
    vibrationLevelMmS: body.vibrationLevelMmS,
    passed: body.passed,
    summary: body.summary.trim(),
  }
}

// GET /api/stations?status=&search=&sortBy=&order=
router.get('/', async (req, res) => {
  const { status, search, sortBy, order } = req.query
  let list = await loadStations()

  if (typeof status === 'string' && STATION_STATUSES.includes(status as StationStatus)) {
    list = list.filter((s) => s.status === status)
  }
  if (typeof search === 'string' && search.trim()) {
    const q = search.trim().toLowerCase()
    list = list.filter((s) => s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q))
  }
  if (sortBy === 'lastAuditDate' || sortBy === 'powerKw') {
    const dir = order === 'desc' ? -1 : 1
    list = [...list].sort((a, b) => (a[sortBy] < b[sortBy] ? -dir : a[sortBy] > b[sortBy] ? dir : 0))
  }
  res.json(list)
})

// GET /api/stations/:id
router.get('/:id', async (req, res) => {
  const station = (await loadStations()).find((s) => s.id === req.params.id)
  if (!station) {
    res.status(404).json(notFound(req.params.id))
    return
  }
  res.json(station)
})

// POST /api/stations
router.post('/', async (req, res) => {
  const errors = validateStation(req.body)
  if (errors.length > 0) {
    res.status(400).json({ message: 'Помилка валідації', errors })
    return
  }
  const stations = await loadStations()
  const created: CompressorStation = { id: randomUUID(), ...toStationInput(req.body) }
  stations.push(created)
  await writeJson('stations.json', stations)
  res.status(201).json(created)
})

// PUT /api/stations/:id
router.put('/:id', async (req, res) => {
  const stations = await loadStations()
  const index = stations.findIndex((s) => s.id === req.params.id)
  if (index === -1) {
    res.status(404).json(notFound(req.params.id))
    return
  }
  const errors = validateStation(req.body)
  if (errors.length > 0) {
    res.status(400).json({ message: 'Помилка валідації', errors })
    return
  }
  const updated: CompressorStation = { id: stations[index].id, ...toStationInput(req.body) }
  stations[index] = updated
  await writeJson('stations.json', stations)
  res.json(updated)
})

// DELETE /api/stations/:id — разом із протоколами аудитів
router.delete('/:id', async (req, res) => {
  const stations = await loadStations()
  if (!stations.some((s) => s.id === req.params.id)) {
    res.status(404).json(notFound(req.params.id))
    return
  }
  const audits = await loadAudits()
  await writeJson('stations.json', stations.filter((s) => s.id !== req.params.id))
  await writeJson('audits.json', audits.filter((a) => a.stationId !== req.params.id))
  res.status(204).send()
})

// GET /api/stations/:id/audits
router.get('/:id/audits', async (req, res) => {
  const stations = await loadStations()
  if (!stations.some((s) => s.id === req.params.id)) {
    res.status(404).json(notFound(req.params.id))
    return
  }
  const audits = (await loadAudits())
    .filter((a) => a.stationId === req.params.id)
    .sort((a, b) => (a.auditDate < b.auditDate ? 1 : a.auditDate > b.auditDate ? -1 : 0))
  res.json(audits)
})

// POST /api/stations/:id/audits
router.post('/:id/audits', async (req, res) => {
  const stations = await loadStations()
  if (!stations.some((s) => s.id === req.params.id)) {
    res.status(404).json(notFound(req.params.id))
    return
  }
  const errors = validateAudit(req.body)
  if (errors.length > 0) {
    res.status(400).json({ message: 'Помилка валідації', errors })
    return
  }
  const audits = await loadAudits()
  const created: AuditLog = { id: randomUUID(), stationId: req.params.id, ...toAuditInput(req.body) }
  audits.push(created)
  await writeJson('audits.json', audits)
  res.status(201).json(created)
})

export default router
