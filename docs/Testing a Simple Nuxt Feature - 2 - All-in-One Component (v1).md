# Part 2/10: All-In-One Components (v1)

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

- **Difficult to test:**
  - **Too many concerns:** The component handles state, lifecycle hooks (`onMounted()`), business logic, dependencies ( `useRuntimeConfig`, `localStorage`), and UI.
  - **Implicit Type Assumption**: There's no explicit type check or validation. If `version` is `undefined` or an unexpected type, it could cause unintended behavior.

## Next Step

What are your thoughts on this implementation? Does this structure seem sufficient, or do you see areas for improvement?

## Decision Map

```mermaid
graph TB;

    %% Start %%
    A((fa:fa-flag-checkered Start Feature:<br> <b>Version Banner</b>))

    %% Specs v1 Checklist %%
    B[fa:fa-list Specifications v1]

    %% Development Process %%
    C[fa:fa-code All-In-One Component]
    D{{fa:fa-eye Test: Visual Testing}}
    E{Enough Confidence?}
    F((fa:fa-door-open Exit))

    %% Issues %%
    G[fa:fa-triangle-exclamation Difficult to Test]
    G1[fa:fa-triangle-exclamation <b>Type Assumptions</b>]
    G2[fa:fa-triangle-exclamation <b>Too Many Concerns</b>:<br>UI, State, Lifecycle, Dependencies]

    %% Specs v2 Checklist %%
    H1["fa:fa-bullseye Version Handling ➜ Entity & Validation"]
    H2["fa:fa-bullseye Component ➜ UI Only"]
    I[fa:fa-list Specifications v2]

    J((v2))

    %% Connections %%
    A --> |"[ fa:fa-compass Guided By YAGNI ]"| B
    B --> |First Implementation| C
    C --> D
    D --> E
    E --> |Yes| F
    E --> |No| G

    G -->|"[ fa:fa-compass Guided By Primitive Obsession ]"| G1
    G -->|"[ fa:fa-compass Guided By SRP ]"| G2
    G1 --> H1
    G2 --> H2
    H1 --> I
    H2 --> I
    I --> J

    %% Define Styles %%
    classDef start fill:#4CAF50,stroke:#2E7D32,color:#FFFFFF;
    classDef exit fill:#D32F2F,stroke:#B71C1C,color:#FFFFFF;
    classDef decision fill:#FBC02D,stroke:#F9A825,color:#000000;
    classDef issue fill:#FF7043,stroke:#BF360C,color:#FFFFFF;
    classDef action fill:#42A5F5,stroke:#1E88E5,color:#FFFFFF;
    classDef checklist fill:#E1F5FE,stroke:#0277BD,color:#000000;
    
    class A start;
    class F exit;
    class E decision;
    class G,G1,G2 issue;
    class H1,H2 action;
```
