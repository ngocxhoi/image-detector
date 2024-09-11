// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  modules: ["@nuxtjs/tailwindcss"],

  runtimeConfig: {
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
  },
});
