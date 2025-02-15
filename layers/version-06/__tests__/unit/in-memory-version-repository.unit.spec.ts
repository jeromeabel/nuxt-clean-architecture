// @vitest-environment node
import { describe, it, expect, beforeEach } from 'vitest'
import { createInMemoryVersionRepository } from '../../repositories/version-repository'

const CURRENT_VERSION = '0.0.1'
const OTHER_VERSION = '0.0.2'

describe('InMemoryVersionRepository', () => {
  let repository = createInMemoryVersionRepository(CURRENT_VERSION)

  beforeEach(() => {
    repository.clear()
  })

  it('should return configured current version', () => {
    expect(repository.getCurrentVersion()).toBe(CURRENT_VERSION)
  })

  it('should return undefined when no version is configured', () => {
    repository = createInMemoryVersionRepository(undefined)
    expect(repository.getCurrentVersion()).toBeUndefined()
  })

  it('should return undefined for stored version when not set', () => {
    expect(repository.getStoredVersion()).toBeUndefined()
  })

  it('should save and retrieve stored version', () => {
    repository.storeVersion(OTHER_VERSION)
    expect(repository.getStoredVersion()).toBe(OTHER_VERSION)
  })

  it('should clear stored version', () => {
    repository.storeVersion(OTHER_VERSION)
    repository.clear()
    expect(repository.getStoredVersion()).toBeUndefined()
  })
})
