# Part 7/10: Test the composable (v4)

## First Test (v4-1)

Code: [use-version-4-1.unit.spec.ts](https://github.com/jeromeabel/nuxt-clean-architecture/blob/feat/version-banner/layers/version-04/__tests__/use-version-4-1.unit.spec.ts)

```ts
// File: layers/version-04/__tests__/use-version.spec.ts
// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { useVersion } from '../composables/useVersion'
import pkg from '@@/package.json'

describe('useVersion', () => {
  // Warning: "[Vue warn]: onMounted is called when there is no active component instance to be associated with"
  it('should return the correct initial state', () => {
    const { version, isVisible } = useVersion()
    expect(version).toBe(pkg.version) // pkg.version = "0.0.2"
    expect(isVisible.value).toBe(false)        
  })
})
```

There are two issues ("code smells") with this test:

- **Nuxt Dependency:** The test requires the Nuxt environment because the composable uses `useRuntimeConfig` from Nuxt. This makes it more of an integration test, but we can set that aside for now.
- **onMounted Warning:** The warning indicates that `onMounted` is being called without an active component instance. For proper execution, the composable should be wrapped inside a component.

Let's focus on the second issue. We have two options:

1. **Move `onMounted` to the wrapper component.**
2. **Create a Vue app to test the composable.**

### When Should `onMounted` Be Used Inside a Composable?

Option 2 might seem heavy-handed and could indicate an area for improvement. However, if the logic is shared across multiple components, placing `onMounted` inside the composable may be acceptable. Still, because it complicates testing, it might be better to move `onMounted` outside the composable when possible.

To explore testing a composable that uses `onMounted`, we can use a helper function called `withSetup`, inspired by [Alexander Opalic](https://alexop.dev/). This function creates a Vue app with a setup context to handle lifecycle methods and expose the composable.

## Testing with withSetup (v4-2)

Code: [use-version-4-2.unit.spec.ts](https://github.com/jeromeabel/nuxt-clean-architecture/blob/feat/version-banner/layers/version-04/__tests__/use-version-4-2.unit.spec.ts)

```ts
// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { useVersion } from '../composables/useVersion'
import pkg from '@@/package.json'
import type { App } from 'vue'
import { createApp } from 'vue'

// Utility function to create a Vue component context with a setup function.
// Source: https://alexop.dev/posts/how-to-test-vue-composables/#introduction-to-withsetup
function withSetup<T>(composable: () => T): [T, App] {
  let result: T | null = null
  const app = createApp({
    setup() {
      result = composable()
      return () => {} // Render an empty element
    },
  })
  app.mount(document.createElement('div')) // Attach to the DOM
  return [result as T, app] // The type assertion is safe since result will be set.
}

describe('useVersion', () => {
  it('should return the correct initial state', () => {
    const [result] = withSetup(() => useVersion())
    expect(result.version).toBe(pkg.version) // Expected "0.0.2"
    expect(result.isVisible.value).toBe(false) 
  })
})
```

However, we encounter another issue: although the warning disappears, the test now fails. The problem is that we cannot check the composable's state before the `onMounted` hook is executed within the setup function. Other tests might work as expected, but not this one.

For now, we'll skip this test and focus on the others. We will later find a better solution to avoid `onMounted` side effects in our tests.

### Alternative to Using withSetup

Another option is to define an empty component to wrap the composable:

```ts
const createComposableWrapper = () => {
  return mount(
    defineComponent({
      setup() {
        return useVersion()
      },
      template: '<div />', // A template is required by @vue/test-utils
    }),
  )
}

// Example usage:
it('should return the correct initial state with createComposableWrapper', () => {
  const wrapper = createComposableWrapper()
  const { isVisible } = wrapper.vm
  expect(isVisible).toBe(false)
})
```

The downside is that accessing `.vm` is generally discouraged because it exposes internal component details.

## Complete Composable Test (v4-3)

Code: [use-version-4-3.unit.spec.ts](https://github.com/jeromeabel/nuxt-clean-architecture/blob/feat/version-banner/layers/version-04/__tests__/use-version-4-3.unit.spec.ts)

```ts
// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { useVersion } from '../composables/useVersion'
import pkg from '@@/package.json'
import type { App } from 'vue'
import { createApp } from 'vue'

// This is an integration test.

function withSetup<T>(composable: () => T): [T, App] {
  let result: T | null = null
  const app = createApp({
    setup() {
      result = composable()
      return () => {} // Render an empty element
    },
  })
  app.mount(document.createElement('div')) // Attach to the DOM
  return [result as T, app] // Safe type assertion since result is set.
}

describe('useVersion', () => {
  // Issue with onMounted: we skip this test because onMounted is called during setup,
  // so we cannot verify the state before onMounted executes.
  it.skip('should return the correct initial state with withSetup', () => {
    const [result] = withSetup(() => useVersion())
    expect(result.version).toBe(pkg.version) 
    expect(result.isVisible.value).toBe(false) 
  })

  describe('should show the banner', () => {
    it('when the version is not stored', () => {
      localStorage.removeItem('app-version')
      const [result] = withSetup(() => useVersion())
      expect(result.isVisible.value).toBe(true) 
    })

    // The localStorage value '0.0.1' differs from the app version '0.0.2'
    it('when the version differs from localStorage', () => {
      localStorage.setItem('app-version', '0.0.1')
      const [result] = withSetup(() => useVersion()) 
      expect(result.isVisible.value).toBe(true) 
    })
  })

  describe('should hide the banner', () => {
    // When localStorage equals the app version '0.0.2'
    it('when the same version is stored', () => {
      localStorage.setItem('app-version', '0.0.2')
      const [result] = withSetup(() => useVersion()) 
      expect(result.isVisible.value).toBe(false) 
    })

    // On closing the banner, the app version should be stored in localStorage
    it('and store the version in localStorage when closeBanner is called', () => {
      localStorage.setItem('app-version', '0.0.1')
      const [result] = withSetup(() => useVersion())
      result.close()
      expect(result.isVisible.value).toBe(false) 
      expect(localStorage.getItem('app-version')).toBe('0.0.2')  
    })
  })
})
```

## Next Step

There are a few ways to improve this test further:

- **Move `onMounted` to the Parent:** Instead of having `onMounted` in the composable, move it to the parent component and use an `init()` method to test initial values before `onMounted` executes. This would allow you to avoid using the `withSetup` utility function.
- **Mock Dependencies:** By mocking `useRuntimeConfig` and `localStorage`, you can transform this integration test into a unit test.

Improving this test by converting it into a unit test would be a valuable enhancement.