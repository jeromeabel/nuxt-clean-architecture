// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import VersionBanner02 from '../components/VersionBanner02.vue'

// Mock the useVersion module.
vi.mock('../composables/useVersion', () => ({ 
    useVersion: () => ({
        isVisible: true, // Display the version and pass the test
        version: '0.0.1',
        close: () => {},
    }) 
}))

describe("VersionBanner", () => {
    it("should display the version", () => {
        const wrapper = shallowMount(VersionBanner02)
        expect(wrapper.text()).toContain('0.0.1')
    })
})