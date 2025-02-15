// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import VersionBannerUI from '../../components/VersionBannerUI.vue'

describe("VersionBanner", () => {

  let wrapper: VueWrapper

  // Setup the component
  const createWrapper = (props = {}) => {
    return shallowMount(VersionBannerUI, {
      props: {
        isVisible: true,
        version: "0.0.1",
        ...props, // Allow overriding props dynamically
      },
    })
  }

  beforeEach(() => {
    wrapper = createWrapper()
  })
  
  // Helpers
  const getBanner = () => wrapper.find('[data-testid="version-banner"]')
  const getCloseButton = () => wrapper.find('[data-testid="version-close"]')

  it("should display the version", () => {
    expect(getBanner().text()).toContain("0.0.1")
  })

  it("should display the version banner when showBanner is true", () => {
    expect(getBanner().exists()).toBe(true)
  })

  it("should have a close button", async () => {
    expect(getCloseButton().exists()).toBe(true)
  })

  it("should not display the version banner when showBanner is false", () => {
    wrapper = createWrapper({ isVisible: false })
    expect(getBanner().exists()).toBe(false)
  })

  it("should call close() when close button is clicked", () => {
    getCloseButton().trigger("click")
    expect(wrapper.emitted()).toHaveProperty('close')
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})