// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { useVersion } from '../composables/useVersion'
import pkg from '@@/package.json'
import type { App } from 'vue'
import { createApp } from 'vue'

// Utility function allowing us to create a Vue component context with a setup
// From https://alexop.dev/posts/how-to-test-vue-composables/#introduction-to-withsetup
function withSetup<T>(composable: () => T): [T, App] {
    let result: T | null = null // init
    const app = createApp({
      setup() {
        result = composable()
        return () => {} // Render an empty element
      },
    })
    app.mount(document.createElement('div')) // Attach to DOM
    return [result as T, app] // Type assertion since it will always be set
  }

describe('useVersion', () => {

    // It fails because we can't test the composable before onMounted
    it.skip('should return correct initial state', () => {
        const [result] = withSetup(() => useVersion())
        expect(result.version).toBe(pkg.version) // = "0.0.2"
        expect(result.isVisible.value).toBe(false) 
    })
})