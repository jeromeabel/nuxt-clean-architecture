// @vitest-environment nuxt
import { describe, it, expect, beforeEach } from 'vitest'
import { useVersion } from '../composables/useVersion'
// import pkg from '@@/package.json' // We don't need the real value for testing
import type { App } from 'vue'
import { createApp } from 'vue'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

// It is still an integration test as we need localStorage

// Utility function 
// from https://alexop.dev/posts/how-to-test-vue-composables
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

const VERSION_KEY = 'app-version'
const CURRENT_VERSION = '0.0.8'
const STORED_VERSION = '0.0.7'

// Mock useRuntimeConfig from Nuxt
mockNuxtImport('useRuntimeConfig', () => {
   return () => ({
     public: {
       version: CURRENT_VERSION,
     },
   })
})

describe('useVersion', () => {

    beforeEach(() => {
        localStorage.removeItem(VERSION_KEY)
    })

    it('should return correct initial state with withSetup', () => {
        const [result] = withSetup(() => useVersion())
        expect(result.version).toBe(CURRENT_VERSION) 
        expect(result.isVisible.value).toBe(false) 
    })

    describe('should show banner', () => {
        it('when version is not stored', () => {
            const [result] = withSetup(() => useVersion())
            result.init()
            
            expect(result.isVisible.value).toBe(true) 
        })

        it('when version differs from localStorage', async () => {
            localStorage.setItem(VERSION_KEY, STORED_VERSION)
            const [result] = withSetup(() => useVersion()) 
            result.init()

            expect(result.isVisible.value).toBe(true) 
        })
    })

    describe('should hide banner', () => {
        it('when the same version is stored', () => {
            localStorage.setItem(VERSION_KEY, CURRENT_VERSION)
            const [result] = withSetup(() => useVersion()) 
            result.init()
            
            expect(result.isVisible.value).toBe(false) 
        })

        it('and store version in localStorage on closeBanner', () => {
            const [result] = withSetup(() => useVersion())
            result.init()
            
            result.close()
            
            expect(result.isVisible.value).toBe(false)
            expect(localStorage.getItem(VERSION_KEY)).toBe(CURRENT_VERSION)  
        })
    })
})