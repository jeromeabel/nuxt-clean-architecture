// @vitest-environment nuxt
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import pkg from '@@/package.json' // We are taking the version from the package.json file
import VersionBanner from '../components/VersionBanner02.vue';

describe('VersionBanner', () => {
  it('should display the version', async () => {
    const wrapper = mount(VersionBanner);
    await nextTick()
    expect(wrapper.text()).toContain(pkg.version); // "version": "0.0.2"
  });
 // Without nextTick(), it fails: AssertionError: expected '' to contain '0.0.2'
});