<script lang="ts" setup>
defineProps<{
  isVisible: boolean,
  version: string
}>();

const emit = defineEmits(['close']);
</script>

<template>
  <div
    v-if="isVisible"
    class="w-screen py-4 text-center bg-gray-300"
    data-testid="version-banner"
  >
    (03) New Version {{ version }}
    <button
      class="rounded bg-black text-white px-2"
      data-testid="version-close"
      @click="emit('close')"
    >
      Close
    </button>
  </div>
</template>
