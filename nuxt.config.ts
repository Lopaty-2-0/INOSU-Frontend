// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  pages: true,
  ssr: true,

  app: {
    head: {
      htmlAttrs: {
        lang: "cs",
      },
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1"
    }
  },

  typescript: {
    typeCheck: true
  },

  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
    'nuxt-security',
    '@nuxtjs/i18n'
  ],

  i18n: {
    strategy: "no_prefix",
    langDir: './translations/',
    locales: [
        { code: 'en', iso: 'en-US', file: 'en.json' },
        { code: 'cz', iso: 'cs-CZ', file: 'cz.json' }
    ],
    defaultLocale: "cz",
  }
})
