<script setup lang="ts">
defineProps<{ label: string; error?: string }>()
</script>

<template>
  <label class="mb-4 block">
    <span class="mb-1 block text-sm font-medium">{{ label }}</span>
    <slot />
    <span v-if="error" class="mt-1 block text-sm text-error">{{ error }}</span>
  </label>
</template>
