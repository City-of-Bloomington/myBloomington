const pkg = require('./package')
require('dotenv').config()

module.exports = {
  mode:             'universal',
  dev:              (process.env.NODE_ENV !== 'production'),
  router: {
    base:           `/${process.env.FE_BASE}`,
    scrollBehavior: function (to, from, savedPosition) {
      if (to.hash) {
        return { selector: to.hash }
      } else {
        return { x: 0, y: 0 }
      }
    },
  },
  head: {
    title:          pkg.prettyName,
    meta: [
      { charset:    'utf-8' },
      { name:       'viewport',
        content:    'width=device-width, initial-scale=1'
      },
      { hid:        'description',
        name:       'description',
        content:     process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel:        'icon',
        type:       'image/x-icon',
        href:       '/favicon.ico'
      },
      { rel:        'stylesheet',
        href:       'https://fonts.googleapis.com/css?family=Abel'
      }
    ]
  },

  env: {
    repo:                     pkg.repository.url,
    appName:                  process.env.APP_NAME,
    cityName:                 process.env.CITY_NAME,
    logoHeading:              process.env.LOGO_HEADING,
    logoSubHeading:           process.env.LOGO_SUB_HEADING,
    nuxtPort:                 process.env.NUXT_PORT || 9090,
    frontEndBase:             process.env.FE_BASE,
    baseUrl:                  process.env.BASE_URL,
    weatherUrl:               process.env.WEATHER_URL,
    councilDistrictsGeoJson:  process.env.COUNCIL_DISTRICTS_GEOJSON_PATH,
    cityParksGeoJson:         process.env.CITY_PARKS_GEOJSON_PATH,
    localSchools:             process.env.LOCAL_SCHOOLS_GEOJSON_PATH,
    MAAddressesPath:          process.env.MASTER_ADDRESS_ADDRESS_PATH,
    directoryUsernamePath:    process.env.DIRECTORY_USERNAME_PATH,
    onBoardCityCouncilPath:   process.env.ONBOARD_CITY_COUNCIL_PATH,
    googleApiKey:             process.env.GOOGLE_API_KEY,
    weatherApiKey:            process.env.WEATHER_API_KEY,
    districtReps:             process.env.DISTRICT_REPRESENTATIVES,
    sanitation:               process.env.SANITATION,
    indianapolis:             process.env.INDIANAPOLIS,
    monroeCounty:             process.env.MONROE_COUNTY,
    bloomington:              process.env.BLOOMINGTON
  },

  plugins: [
    { src:          '~/plugins/api-methods' },
    { src:          '~/plugins/design-system' },
    { src:          '~/plugins/filters' },
    { src:          '~/plugins/google-map', ssr: false}
  ],

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
