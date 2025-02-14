// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { useVersion } from '../composables/useVersion'
import pkg from '@@/package.json'
import type { App } from 'vue'
import { createApp } from 'vue'

// It is an integration test...

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

    // Issue with onMounted (= skipped)
    // onMounted is called before the test (in the setup()), so we don't have the state false before onMounted
    it.skip('should return correct initial state with withSetup', () => {
        const [result] = withSetup(() => useVersion())
        expect(result.version).toBe(pkg.version) 
        expect(result.isVisible.value).toBe(false) 
    })

    describe('should show banner', () => {
        it('when version is not stored', () => {
            localStorage.removeItem('app-version')
            const [result] = withSetup(() => useVersion())
            expect(result.isVisible.value).toBe(true) 
        })

        // localStorage '0.0.1' is different than the '0.0.2' app version
        it('when version differs from localStorage', async () => {
            localStorage.setItem('app-version', '0.0.1')
            const [result] = withSetup(() => useVersion()) 
            expect(result.isVisible.value).toBe(true) 
        })
    })

    describe('should hide banner', () => {
        // localStorage is equal to '0.0.2' app version
        it('when the same version is stored', () => {
            localStorage.setItem('app-version', '0.0.2')
            const [result] = withSetup(() => useVersion()) 
            expect(result.isVisible.value).toBe(false) 
        })

        // store '0.0.2' app version in localStorage
        it('and store version in localStorage on closeBanner', () => {
            localStorage.setItem('app-version', '0.0.1')
            const [result] = withSetup(() => useVersion())
            result.close()
            expect(result.isVisible.value).toBe(false) 
            expect(localStorage.getItem('app-version')).toBe('0.0.2')  
        })
    })
})

/*
Backup

Step 1:
    it('should return correct initial state', () => {
        const { version, isVisible } = useVersion()
        expect(version).toBe(pkg.version) // pkg.version = "0.0.2"
        expect(isVisible.value).toBe(false)        
    })
Output: "[Vue warn]: onMounted is called when there is no active component instance to be associated with"

Step 2 - alternative to withSetup()
    const createComposableWrapper = () => {
    return mount(
        defineComponent({
        setup() {
            return useVersion()
        },
        template: '<div />',
        }),
    )
    }

    it('should return correct initial state with createComposableWrapper', () => {
        const wrapper = createComposableWrapper()
        const { isVisible, version } = wrapper.vm
        expect(version).toBe(pkg.version) // pkg.version = "0.0.2"
        expect(isVisible).toBe(false)
    })

    Using ".vm" is commonly not recommended, as it is like we are testing internal details
  */