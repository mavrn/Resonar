import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-vuefire',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],

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
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
});
