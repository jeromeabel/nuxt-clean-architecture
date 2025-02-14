// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import VersionBanner02 from '../components/VersionBanner02.vue'
import { useVersion } from '../composables/useVersion' // Not needed in Nuxt

vi.mock('../composables/useVersion', () => ({
  useVersion: vi.fn(),
}))

describe("VersionBanner", () => {

  let wrapper: VueWrapper

  // Default mock return value
  const mockVersionData: ReturnType<typeof useVersion> = {
    isVisible: ref(true),
    version: '0.0.1',
    close: vi.fn(),
  }

  beforeEach(() => {
    vi.mocked(useVersion).mockReturnValue(mockVersionData)
    wrapper = shallowMount(VersionBanner02)
  })

  // Helpers
  const getBanner = () => wrapper.find('[data-testid="version-banner"]')
  const getCloseButton = () => wrapper.find('[data-testid="version-close"]')

  it("should display the version", () => {
    expect(getBanner().text()).toContain(mockVersionData.version)
  })

  it("should display the version banner when showBanner is true", () => {
    expect(getBanner().exists()).toBe(true)
  })

  it("should have a close button", async () => {
    expect(getCloseButton().exists()).toBe(true)
  })

  it("should not display the version banner when showBanner is false", () => {
    vi.mocked(useVersion).mockReturnValue({
      ...mockVersionData,
      isVisible: ref(false), // Switch to false
    })
    
    wrapper = shallowMount(VersionBanner02)
    expect(getBanner().exists()).toBe(false)
  })

  // Side note: we don't test if the banner is hidden, that logic comes from inside the composable
  it("should call close() when close button is clicked", async () => {
    await getCloseButton().trigger("click")
    expect(mockVersionData.close).toHaveBeenCalledOnce()
  })
})