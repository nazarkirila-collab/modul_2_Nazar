<script setup lang="ts">
defineProps<{ title: string }>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <div class="modal modal-open" role="dialog" @keydown.esc="emit('close')">
    <div class="modal-box">
      <h3 class="mb-4 text-lg font-bold">{{ title }}</h3>
      <slot />
    </div>
    <div class="modal-backdrop" @click="emit('close')"></div>
  </div>
</template>
