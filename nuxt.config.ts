// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-vuefire'],

  vuefire: {
    config: {
      apiKey: 'AIzaSyCgV1C1nyvG2eJ13tGs1CwDJh_dcaGWTXc',
      authDomain: 'sonar0.firebaseapp.com',
      projectId: 'sonar0',
      storageBucket: 'sonar0.appspot.com',
      messagingSenderId: '1096856922094',
      appId: '1:1096856922094:web:9df9aea96f320e132e90ff',
      measurementId: 'G-JFRVL2QV3C',
    },
  },
});
