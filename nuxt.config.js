import i18n from './plugins/i18n'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
 // ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',
  
  generate: {
    fallback: true
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s',
    title: 'Trade Design Blog',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/img/THIcon.svg' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~assets/custom.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~plugins/vuetify.js',
    '~/plugins/components.js',
    '~/plugins/mixin.js',
    '~/plugins/dialogs.js',
    { src: '~/plugins/upload-component.js', ssr: false },
    '~/plugins/alerts.js',
    '~/plugins/snackbars.js',
    '~/plugins/vueper.js',
    { src: `~plugins/video-player.js`, ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/moment'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/i18n',
    '@nuxtjs/toast',
    'vue-scrollto/nuxt',
    'nuxt-material-design-icons-iconfont',
    '@nuxtjs/firebase'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    },
  },
  i18n: {
    locales: [
        { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' },
        { code: 'es', iso: 'es-ES', name: 'Español', file: 'es.json' },
    ],
    defaultLocale: 'es',
    seo: true,
    lazy: true,
    langDir: '@/locales',
    vueI18n: i18n,
    detectBrowserLanguage: {
        useCookie: true,
        cookieKey: 'i18n_redirected',
        onlyOnRoot: true, // recommended
    }
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  firebase: {
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
     },
    services: {
        auth: {
          persistence: 'session',
          initialize:{
            onAuthStateChangedMutation: "setUser",
            onAuthStateChangedAction: 'onAuthStateChangedAction',
          }
        },
        firestore: true,
        storage: true,
        messaging: true,
        performance: true,
        analytics: true,
        database: true,
        functions: {
            location: 'us-central1',
            emulatorPort: 5001,
        }
    }
  },vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    options: {
        customProperties: true
    }
  },
  moment: {
    defaultLocale: 'es',
    locales: ['es']
  },
  publicRuntimeConfig: {
    storage: process.env.STORAGE_URL
  },
    // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: null
  }
}
