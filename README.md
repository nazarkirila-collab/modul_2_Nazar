# Диспетчерський облік компресорних станцій (МКР №2)

Монорепозиторій з двох незалежних частин. Єдиного кореневого `package.json` немає.

```
project-root/
├── backend/    Node.js + Express + TypeScript, дані у data/*.json
└── frontend/   Vue 3 + TypeScript + Vue Router + Pinia + Axios + Tailwind CSS + DaisyUI
```

## Запуск (потрібен Node.js 20+)

Сервер (порт 3000, змінюється через PORT):

```
cd backend
npm install
npm run dev        # розробка (автоперезапуск)
# або: npm run build && npm start
```

Клієнт (http://localhost:5173):

```
cd frontend
npm install
npm run dev
```

Адреса API клієнта задається у `frontend/.env.development` (`VITE_API_URL`).
Для продакшену — у `frontend/.env.production`.

## REST API

| Метод | Шлях | Відповіді |
|---|---|---|
| GET | /api/stations?status=&search=&sortBy=lastAuditDate\|powerKw&order=asc\|desc | 200 |
| GET | /api/stations/:id | 200, 404 |
| POST | /api/stations | 201, 400 (список полів із помилками) |
| PUT | /api/stations/:id | 200, 400, 404 |
| DELETE | /api/stations/:id (разом з аудитами) | 204, 404 |
| GET | /api/stations/:id/audits | 200 (може бути []), 404 |
| POST | /api/stations/:id/audits | 201, 400, 404 |

## Маршрути клієнта

| URL | Екран |
|---|---|
| / (?search=&status=&sortBy=&order=) | Реєстр станцій, фільтри зберігаються в URL |
| /stations/:id | Картка станції та журнал інспекцій |
| /stations/new, /stations/:id/edit | Форма створення / редагування |
| будь-яка інша адреса | 404 |

## Архітектура клієнта

Компонент → Composable → Store (Pinia) / Service → Base API (Axios)

- `components/`, `views/` — лише відображення
- `composables/` — стан екрана, фільтри в URL, логіка форми
- `stores/` — Pinia-сховище реєстру
- `services/`, `api/` — запити до сервера
- `utils/validation.ts` — клієнтська валідація, `types/` — типи
