// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { useVersion } from '../composables/useVersion'
import pkg from '@@/package.json'
import type { App } from 'vue'
import { createApp } from 'vue'

// Utility function from https://alexop.dev/posts/how-to-test-vue-composables/
function withSetup<T>(composable: () => T): [T, App] {
    let result: T | null = null // init
    const app = createApp({
      setup() {
        result = composable()
        return () => {} // Render an empty element
      },
    })
  
    app.mount(document.createElement('div')) // Attach to DOM
    return [result as T, app]
  }

describe('useVersion', () => {
    it('should return correct initial state with withSetup', () => {
        const [result] = withSetup(() => useVersion())
        expect(result.version).toBe(pkg.version) 
        expect(result.isVisible.value).toBe(false) 
    })

    describe('should show banner', () => {
        it('when version is not stored', () => {
            localStorage.removeItem('app-version')
            const [result] = withSetup(() => useVersion())
            result.init()
            
            expect(result.isVisible.value).toBe(true) 
        })

        // localStorage '0.0.1' is different than the '0.0.2' app version
        it('when version differs from localStorage', async () => {
            localStorage.setItem('app-version', '0.0.1')
            const [result] = withSetup(() => useVersion()) 
            result.init()

            expect(result.isVisible.value).toBe(true) 
        })
    })

    describe('should hide banner', () => {
        // localStorage is equal to '0.0.2' app version
        it('when the same version is stored', () => {
            localStorage.setItem('app-version', '0.0.2')
            const [result] = withSetup(() => useVersion()) 
            result.init()
            
            expect(result.isVisible.value).toBe(false) 
        })

        // store '0.0.2' app version in localStorage
        it('and store version in localStorage on closeBanner', () => {
            localStorage.setItem('app-version', '0.0.1')
            const [result] = withSetup(() => useVersion())
            result.init()
            
            result.close()
            
            expect(result.isVisible.value).toBe(false) 
            expect(localStorage.getItem('app-version')).toBe('0.0.2')  
        })
    })
})
