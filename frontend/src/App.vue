<template>
  <div class="min-h-screen bg-base-200">
    <header class="navbar bg-base-100 shadow-sm">
      <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-4">
        <RouterLink to="/" class="text-lg font-bold">Диспетчерська КС</RouterLink>
        <nav class="flex gap-2">
          <RouterLink to="/" class="btn btn-ghost btn-sm">Реєстр</RouterLink>
          <RouterLink to="/stations/new" class="btn btn-primary btn-sm">Нова станція</RouterLink>
        </nav>
      </div>
    </header>
    <main class="mx-auto w-full max-w-6xl px-4 py-6">
      <RouterView />
    </main>
  </div>
</template>
