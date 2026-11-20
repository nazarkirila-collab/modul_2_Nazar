<template>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Завантаження">
    <div v-for="n in 6" :key="n" class="skeleton h-48 w-full"></div>
  </div>
</template>
