import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'stations', component: () => import('@/views/StationsView.vue') },
    { path: '/stations', redirect: '/' },
    { path: '/stations/new', name: 'station-new', component: () => import('@/views/StationFormView.vue') },
    { path: '/stations/:id', name: 'station-details', component: () => import('@/views/StationDetailsView.vue') },
    { path: '/stations/:id/edit', name: 'station-edit', component: () => import('@/views/StationFormView.vue') },
    // 404 — завжди останнім у списку
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },
  ],
})

export default router
