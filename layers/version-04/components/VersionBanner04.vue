<script lang="ts" setup>
import { useVersion } from '../composables/useVersion'

const { isVisible, version, close } = useVersion()
</script>

<template>
  <VersionBannerUI
    :is-visible="isVisible"
    :version="version"
    @close="close"
  />
</template>
