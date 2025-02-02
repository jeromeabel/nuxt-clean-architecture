import { defineNuxtConfig } from 'nuxt/config'
import pkg from './package.json'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    // '@nuxtjs/supabase',
    '@nuxt/eslint',
    '@nuxt/test-utils/module',
  ],
  devtools: { enabled: false },
  runtimeConfig: {
    public: {
      version: pkg.version,
    },
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-04-03',
  eslint: {
    config: { stylistic: true },
  },
})
