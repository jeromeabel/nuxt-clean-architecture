<script lang="ts" setup>
const VERSION_KEY = 'app-version'
const isVisible = ref(false)

const version = useRuntimeConfig().public.version // CATCH: if the version is undefined

const close = () => {
  isVisible.value = false
  localStorage.setItem(VERSION_KEY, version) // CATCH: don't store an undefined value
}

onMounted(() => {
  if (localStorage.getItem(VERSION_KEY) !== version) { // CATCH: if the version is undefined
    isVisible.value = true
  }
})
</script>

<template>
  <div
    v-if="isVisible"
    class="w-screen py-4 text-center bg-gray-100"
  >
    (01) New Version {{ version }}
    <button
      class="rounded bg-black text-white px-2"
      @click="close"
    >
      Close
    </button>
  </div>
</template>
