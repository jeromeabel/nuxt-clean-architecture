---
tags:
  - types/resource
created: 2025-02-12
modified: 2025-02-15, 15:50
up: "[[Testing a Simple Nuxt Feature]]"
related: 
author: 
link: 
topic: 
status: 
duration: 
media: 
---
## Version 2: Extracting Logic into a Composable
_(Presenter/Humble Component Pattern)_

In this first refactoring, we extract the business logic into a composable (Presenter), leaving the component to solely handle UI rendering (Humble).

### Composable (Presenter)

Code: [useVersion.ts](https://github.com/jeromeabel/nuxt-clean-architecture/blob/feat/version-banner/layers/version-02/composables/useVersion.ts)
```ts
// File: layers/version-02/composables/useVersion.ts
export const useVersion = () => {
  const VERSION_KEY = 'app-version';
  const isVisible = ref(false);
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

  return { isVisible, version, close };
};
```

### Component (Humble/Dumb)

Code: [VersionBanner02.vue](https://github.com/jeromeabel/nuxt-clean-architecture/blob/feat/version-banner/layers/version-02/components/VersionBanner02.vue)

```vue
<script lang="ts" setup>
// File: layers/version-02/components/VersionBanner02.vue
// Note: In Nuxt, composables are auto-imported, so you don't need to import it manually.
const { isVisible, version, close } = useVersion();
</script>

<template>
  <div v-if="isVisible">
    New Version {{ version }}
    <button @click="close">Close</button>
  </div>
</template>
```

This should be enough. Let's test it!