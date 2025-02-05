// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { App } from 'vue'
import { createApp } from 'vue'
// import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useVersion } from '../composables/useVersion'

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString()
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
  }
})()

// Replace global localStorage with mock
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

function withSetup<T>(composable: () => T): [T, App] {
  let result: T | null = null
  const app = createApp({
    setup() {
      result = composable()
      return () => {}
    },
  })
  
  app.mount(document.createElement('div'))
  return [result as T, app]
}

const VERSION_KEY = 'app-version'
const CURRENT_VERSION = '0.0.8'
const STORED_VERSION = '0.0.7'

// // Mock useRuntimeConfig from Nuxt

// Does not work while mocking localStorage
// mockNuxtImport('useRuntimeConfig', () => {
//   return () => ({
//     public: {
//       version: CURRENT_VERSION,
//     },
//   })
// })

vi.mock('#app/nuxt', () => ({
  useRuntimeConfig: () => ({
    public: {
      version: CURRENT_VERSION,
    },
  }),
}))
describe('useVersion', () => {
  beforeEach(() => {
    mockLocalStorage.removeItem(VERSION_KEY)
    vi.clearAllMocks()
  })

  it('should return correct initial state with withSetup', () => {
    const [result] = withSetup(() => useVersion())
    expect(result.version).toBe(CURRENT_VERSION)
    expect(result.isVisible.value).toBe(false)
    expect(mockLocalStorage.getItem).not.toHaveBeenCalled()
  })

  describe('should show banner', () => {
    it('when version is not stored', () => {
      const [result] = withSetup(() => useVersion())
      result.init()
      
      expect(result.isVisible.value).toBe(true)
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(VERSION_KEY)
    })

    it('when version differs from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValueOnce(STORED_VERSION)
      const [result] = withSetup(() => useVersion())
      
      result.init()
      
      expect(result.isVisible.value).toBe(true)
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(VERSION_KEY)
    })
  })

  describe('should hide banner', () => {
    it('when the same version is stored', () => {
      mockLocalStorage.getItem.mockReturnValueOnce(CURRENT_VERSION)
      const [result] = withSetup(() => useVersion())
      
      result.init()
      
      expect(result.isVisible.value).toBe(false)
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(VERSION_KEY)
    })

    it('and store version in localStorage on closeBanner', () => {
      const [result] = withSetup(() => useVersion())
      result.init()
      
      result.close()
      
      expect(result.isVisible.value).toBe(false)
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(VERSION_KEY, CURRENT_VERSION)
    })
  })
})