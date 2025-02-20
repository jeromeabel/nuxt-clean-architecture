// @vitest-environment nuxt
// We need to set the vitest environment to nuxt, as we use useRuntimeConfig from Nuxt, the happy-dom is not enough
import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import pkg from '@@/package.json' // We are taking the version from the package.json file
import VersionBanner from '../components/VersionBanner02.vue';

describe('VersionBanner', () => {

  let wrapper: VueWrapper

  it('should hide the banner at initial state', () => {
    wrapper = mount(VersionBanner);
    expect(wrapper.isVisible()).toBe(false)
  });

  describe('when there is no version stored', () => {

    beforeEach(() => {
      localStorage.clear()
      wrapper = mount(VersionBanner);
    })

    // Without nextTick(), it fails: **AssertionError**: expected false to be true // Object.is equality
    it('should show the banner ', async () => {
      await nextTick()
      expect(wrapper.isVisible()).toBe(true)
    });

    // Without nextTick(), it fails: **AssertionError**: expected '' to contain '0.0.2'
    it('should display the current version ', async () => {
      await nextTick()
      expect(wrapper.text()).toContain(pkg.version); // "version": "0.0.2"
    });
  })

  describe('when there is the same version stored', () => {
    // Without nextTick(), it would be false positive, we are receiving the default state (false),
    // not the state computed from the comparison of the versions
    it('should hide the banner ', async () => {
      localStorage.setItem('app-version', pkg.version)
      wrapper = mount(VersionBanner);
      await nextTick()
      expect(wrapper.isVisible()).toBe(false)
    });
  })

  describe('when there is another version stored', () => {
    // Without nextTick(), it fails: **AssertionError**: expected false to be true // Object.is equality
    it('should hide the banner ', async () => {
      localStorage.setItem('app-version', "1.0.0")
      wrapper = mount(VersionBanner);
      await nextTick()
      expect(wrapper.isVisible()).toBe(true)
    });
  })
});