<script lang="ts" setup>
import { useVersion } from '../composables/useVersion'

const { isVisible, version, close } = useVersion()
</script>

<template>
  <div
    v-if="isVisible"
    class="w-screen py-4 text-center bg-gray-200"
    data-testid="version-banner"
  >
    (02) New Version {{ version }}
    <button
      class="rounded bg-black text-white px-2"
      data-testid="version-close"
      @click="close"
    >
      Close
    </button>
  </div>
</template>
