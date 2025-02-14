// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { useVersion } from '../composables/useVersion'
import pkg from '@@/package.json'

describe('useVersion', () => {

    // Warning output: "[Vue warn]: onMounted is called when there is no active component instance to be associated with"
    it('should return correct initial state', () => {
        const { version, isVisible } = useVersion()
        expect(version).toBe(pkg.version) // pkg.version = "0.0.2"
        expect(isVisible.value).toBe(false)        
    })
})