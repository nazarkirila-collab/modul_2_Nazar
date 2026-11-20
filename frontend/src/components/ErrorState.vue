<script setup lang="ts">
defineProps<{ message: string }>()
const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div role="alert" class="alert alert-error alert-soft">
    <span class="flex-1">{{ message }}</span>
    <button class="btn btn-sm" @click="emit('retry')">Повторити запит</button>
  </div>
</template>
