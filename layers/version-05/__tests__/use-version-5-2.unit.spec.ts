// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest'
import { useVersion } from '../composables/useVersion'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
// import pkg from '@@/package.json' // We don't need the real value for testing
// import type { App } from 'vue'
// import { createApp } from 'vue'

// It is still an integration test as we need localStorage

// We don't need this utility function anymore
// We are testing the composable directly
// from https://alexop.dev/posts/how-to-test-vue-composables
/*
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
*/

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
        const { version, isVisible } = useVersion()
        expect(version).toBe(CURRENT_VERSION) 
        expect(isVisible.value).toBe(false) 
    })

    describe('should show banner', () => {
        it('when version is not stored', () => {
            const { init, isVisible } = useVersion()
            init()
            
            expect(isVisible.value).toBe(true) 
        })

        it('when version differs from localStorage', async () => {
            localStorage.setItem(VERSION_KEY, STORED_VERSION)
            const { init, isVisible } = useVersion()
            init()

            expect(isVisible.value).toBe(true) 
        })
    })

    describe('should hide banner', () => {
        it('when the same version is stored', () => {
            localStorage.setItem(VERSION_KEY, CURRENT_VERSION)
            const { init, isVisible } = useVersion()
            init()
            
            expect(isVisible.value).toBe(false) 
        })

        it('and store version in localStorage on closeBanner', () => {
            const { init, close, isVisible } = useVersion()
            init()
            
            close()
            
            expect(isVisible.value).toBe(false)
            expect(localStorage.getItem(VERSION_KEY)).toBe(CURRENT_VERSION)  
        })
    })
})