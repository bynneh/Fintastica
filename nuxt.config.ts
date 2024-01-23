export default defineNuxtConfig({
  devtools: { enabled: false },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
    },
  },
  routeRules: {
    '/': { prerender: true },
  },
  supabase: {
    redirect: true,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/signup'],
    },
  },
  modules: [
    '@nuxtjs/google-fonts',
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@nuxtjs/device',
  ],
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL ?? 'http://localhost:3000',
    },
  },
  googleFonts: {
    families: {
      Outfit: [400, 600, 700],
    },
    download: false,
    preload: true,
    display: 'swap',
  },
  colorMode: {
    preference: 'dark',
  },
  image: {
    format: ['webp'],
    provider: 'cloudinary',
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/drwinsusg/image/upload/',
    },
  },
})
