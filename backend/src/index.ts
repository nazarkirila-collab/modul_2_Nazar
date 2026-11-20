import cors from 'cors'
import express from 'express'
import type { ErrorRequestHandler } from 'express'
import stationsRouter from './routes/stations.js'

const app = express()
const PORT = Number(process.env.PORT) || 3000

// Middleware підключаємо ДО маршрутів, інакше req.body буде undefined
app.use(cors())
app.use(express.json())

app.use('/api/stations', stationsRouter)

app.use('/api', (_req, res) => {
  res.status(404).json({ message: 'Маршрут не знайдено' })
})

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err?.type === 'entity.parse.failed') {
    res.status(400).json({ message: 'Некоректний JSON у тілі запиту' })
    return
  }
  console.error(err)
  res.status(500).json({ message: 'Внутрішня помилка сервера' })
}
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`API запущено: http://localhost:${PORT}/api/stations`)
})
