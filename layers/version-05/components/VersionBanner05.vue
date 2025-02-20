<script lang="ts" setup>
import { useVersion } from '../composables/useVersion'

const { isVisible, version, init, close } = useVersion()

onMounted(() => {
  init()
})
</script>

<template>
  <VersionBannerUI
    :is-visible="isVisible"
    :version="version"
    @close="close"
  />
</template>
