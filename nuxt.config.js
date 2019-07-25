const pkg = require('./package')
require('dotenv').config()

module.exports = {
  mode: 'universal',

  dev:  (process.env.NODE_ENV !== 'production'),

  router: {
    base: `/mybloomington/`
  },

  head: {
    title: pkg.prettyName,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  env: {
    repo:           pkg.repository.url,
    nuxtPort:       process.env.NUXT_PORT || 9090,
  },

  plugins: [
    { src: '~/plugins/api-methods' },
    { src: '~/plugins/design-system' },
    { src: '~/plugins/google-map', ssr: false}
  ],

  // scripts: [
  //   { src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCMWVZ2htAxF65lh9Hgh3lPmynbOhAWfQU',
  //     async: true,
  //     defer: true}
  // ],

  loading: { color: '#fff' },

  css: ['~assets/scss/style.scss'],

  styleResources: {
    scss: [
      './assets/scss/*.scss'
    ]
  },

  modules: ['@nuxtjs/style-resources'],

  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      transpile: [/^vue2-google-maps($|\/)/];
      if(!ctx.isDev) {
        config.output.publicPath = `/${process.env.FE_BASE}/_nuxt/`
      }
    }
  }
}
