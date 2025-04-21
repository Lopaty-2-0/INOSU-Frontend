// https://nuxt.com/docs/api/configuration/nuxt-config
import * as process from "node:process";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  pages: true,
  ssr: true,

  app: {
    head: {
      htmlAttrs: {
        "data-theme": "light",
        lang: "cs",
      },
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      noscript: [
        { innerHTML: "JavaScript is required" }
      ]
    }
  },

  typescript: {
    typeCheck: true
  },

  css: [
    "~/assets/style/variables.scss",
    "~/assets/style/global.scss",
    "~/assets/style/main.scss",
  ],

  sourcemap: process.env.NODE_ENV === "production",
  vite: {
    css :{
      preprocessorOptions : {
        scss: {
          api: "modern-compiler",
        }
      }
    },
  },

  modules: [
    "@nuxt/eslint",
    "@pinia/nuxt",
    //"@nuxtjs/i18n",
    "@nuxt/icon",
    // "nuxt-security"
    "@nuxtjs/tailwindcss"
  ],

  icon: {
    serverBundle: {
      collections: ["material-symbols"]
    }
  },
/*
  i18n: {
    strategy: "no_prefix",
    langDir: "~/translations/",
    locales: [
        { code: "en", iso: "en-US", file: "en.json" },
        { code: "cz", iso: "cs-CZ", file: "cz.json" }
    ],
    defaultLocale: "cz",
  },*/
/*
  security: {
    hidePoweredBy: true,
    corsHandler: {
      origin: process.env.API_ORIGIN,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: false,
    },
    xssValidator: false,
    headers: {
      crossOriginEmbedderPolicy: process.env.NODE_ENV === "development" ? "unsafe-none" : "require-corp",
      referrerPolicy: "origin",
      contentSecurityPolicy: {
        "img-src": ["self", "https:", "data:", "blob:", "http://89.203.248.163"],
      }
    }
  },*/

  routeRules: {
    "/**": {
      cors: true
    },
    "/": {
      redirect: "/login"
    }
  },

  runtimeConfig: {
    public: {
      serverUrl: process.env.SERVER_URL,
      apiUrl: process.env.SERVER_URL,
      production: process.env.NODE_ENV === "production",
    },
  }
})