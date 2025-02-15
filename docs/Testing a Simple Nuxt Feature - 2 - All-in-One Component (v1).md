---
tags:
  - types/resource
created: 2025-02-12
modified: 2025-02-15, 15:48
up: "[[Testing a Simple Nuxt Feature]]"
related: 
author: 
link: 
topic: 
status: 
duration: 
media: 
---

Code: [VersionBanner01.vue](https://github.com/jeromeabel/nuxt-clean-architecture/blob/feat/version-banner/layers/version-01/components/VersionBanner01.vue)

## Version 1: Initial Implementation

```vue
<script lang="ts" setup>
// File: layers/version-01/components/VersionBanner01.vue
const VERSION_KEY = 'app-version';
const isVisible = ref(false);
// INFOS: useRuntimeConfig() retrieve variables from the config file nuxt.config.ts
const version = useRuntimeConfig().public.version; 

const close = () => {
  isVisible.value = false;
  localStorage.setItem(VERSION_KEY, version);
};

onMounted(() => {
  if (localStorage.getItem(VERSION_KEY) !== version) {
    isVisible.value = true;
  }
});
</script>

<template>
  <div v-if="isVisible">
    New Version {{ version }}
    <button @click="close">Close</button>
  </div>
</template>
```

## Issues with this Implementation

- **Too many concerns:** The component handles state, lifecycle hooks, business logic, and UI.
- **Difficult to test:** Testing requires mocking `useRuntimeConfig`, `localStorage`, and handling `onMounted()`.
- **Implicit Type Assumption**: There's no explicit type check or validation. If `version` is `undefined` or an unexpected type, it could cause unintended behavior.

## Next Step
What are your thoughts on this implementation? Does this structure seem sufficient, or do you see areas for improvement? 