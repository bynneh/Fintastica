export default defineNuxtConfig({
  devtools: { enabled: true },
  image: {
    format: ['webp'],
    provider: 'cloudinary',
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/drwinsusg/image/upload/',
    },
  },
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
      exclude: ['/', '/signup', '/settings/password-update'],
    },
  },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
    '@nuxtjs/fontaine',
    '@nuxt/image',
  ],
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL ?? 'http://localhost:3000',
    },
  },
  fontMetrics: {
    fonts: ['Outfit'],
  },
  colorMode: {
    preference: 'dark',
  },
})
