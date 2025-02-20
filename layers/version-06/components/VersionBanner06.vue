<script lang="ts" setup>
import { useVersion } from '../composables/useVersion'
import { createLocalStorageVersionRepository } from '../repositories/version-repository'
import VersionBannerUI from './VersionBannerUI.vue'

const repository = createLocalStorageVersionRepository()
const { isVisible, version, init, close } = useVersion(repository)

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
