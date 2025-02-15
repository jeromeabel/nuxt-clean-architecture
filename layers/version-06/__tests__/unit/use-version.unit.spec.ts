// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useVersion } from '../../composables/useVersion'
import { createInMemoryVersionRepository } from "../../repositories/version-repository"

const CURRENT_VERSION = '0.0.8'
const STORED_VERSION = '0.0.7'

describe('useVersion', () => {

  const repository = createInMemoryVersionRepository(CURRENT_VERSION)

  beforeEach(() => {
   repository.clear()
  })

  it('should return correct initial state', () => {
    const{ version, isVisible } = useVersion(repository)

    expect(version).toBe(CURRENT_VERSION)
    expect(isVisible.value).toBe(false)
  })

  describe('should show banner', () => {
    it('when version is not stored', () => {
      const{ init, isVisible} = useVersion(repository)
      init()
      
      expect(isVisible.value).toBe(true)
    })

    it('when version differs from storage', () => {
      repository.storeVersion(STORED_VERSION)
      const{ init, isVisible} = useVersion(repository)
      
      init()
      
      expect(isVisible.value).toBe(true)
    })
  })

  describe('should hide banner', () => {
    it('when the same version is stored', () => {
      repository.storeVersion(CURRENT_VERSION)
      const{ init, isVisible} = useVersion(repository)

      init()
      
      expect(isVisible.value).toBe(false)
    })

    it('and store version in storage on closeBanner', () => {
      const{ init, isVisible, close} = useVersion(repository)
      
      init()
      
      close()
      
      expect(isVisible.value).toBe(false)
    })
  })
})