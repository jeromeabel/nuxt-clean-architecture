// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest'
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

const VERSION_KEY = 'app-version'
const CURRENT_VERSION = '0.0.8'
const STORED_VERSION = '0.0.7'

// // Mock useRuntimeConfig from Nuxt: Does not work while mocking localStorage
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

  it('should return correct initial state', () => {
    const{ version, isVisible } = useVersion()

    expect(version).toBe(CURRENT_VERSION)
    expect(isVisible.value).toBe(false)
    expect(mockLocalStorage.getItem).not.toHaveBeenCalled()
  })

  describe('should show banner', () => {
    it('when version is not stored', () => {
      const{ init, isVisible} = useVersion()
      init()
      
      expect(isVisible.value).toBe(true)
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(VERSION_KEY)
    })

    it('when version differs from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValueOnce(STORED_VERSION)
      const{ init, isVisible} = useVersion()
      
      init()
      
      expect(isVisible.value).toBe(true)
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(VERSION_KEY)
    })
  })

  describe('should hide banner', () => {
    it('when the same version is stored', () => {
      mockLocalStorage.getItem.mockReturnValueOnce(CURRENT_VERSION)
      const{ init, isVisible} = useVersion()

      init()
      
      expect(isVisible.value).toBe(false)
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(VERSION_KEY)
    })

    it('and store version in localStorage on closeBanner', () => {
      const{ init, isVisible, close} = useVersion()
      
      init()
      
      close()
      
      expect(isVisible.value).toBe(false)
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(VERSION_KEY, CURRENT_VERSION)
    })
  })
})