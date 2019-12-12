const pkg = require('./package')
require('dotenv').config()

module.exports = {
  mode:             'universal',
  dev:              (process.env.NODE_ENV !== 'production'),
  router: {
    base:           `/${process.env.FE_BASE}`,
  },

  head: {
    title:          pkg.name,
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      {'http-equiv':'X-UA-Compatible', content: 'IE=edge'},
      { charset:    'utf-8' },
      { name:       'viewport',
        content:    'width=device-width, initial-scale=1'
      },
      { hid:        'description',
        name:       'description',
        content:     process.env.npm_package_description || ''
      }
    ],
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.6.0/polyfill.min.js' }
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
    cityPlaygrounds:          process.env.CITY_PLAYGROUNDS_GEOJSON_PATH,
    safePlaces:               process.env.SAFE_PLACES_PATH,
    MAAddressesPath:          process.env.MASTER_ADDRESS_ADDRESS_PATH,
    directoryUsernamePath:    process.env.DIRECTORY_USERNAME_PATH,
    onBoardCityCouncilPath:   process.env.ONBOARD_CITY_COUNCIL_PATH,
    inRoadsPath:              process.env.INROADS_URL,
    cityBoundaryGeoJson:      process.env.CITY_BOUNDARY_PATH,
    googleApiKey:             process.env.GOOGLE_API_KEY,
    weatherApiKey:            process.env.WEATHER_API_KEY,
    districtLookupPath:       process.env.MONROE_CO_DISTRICT_LOOKUP_URL,
    folks:                    JSON.parse(process.env.FOLKS),
    sanitation:               JSON.parse(process.env.SANITATION),
    indiana:                  JSON.parse(process.env.INDIANA),
    monroeCounty:             JSON.parse(process.env.MONROE_COUNTY),
    bloomington:              JSON.parse(process.env.BLOOMINGTON),
    coordsProjection:         process.env.COORDS_PROJECTION,
    cityHallLatLong:          JSON.parse(process.env.CITY_HALL_LAT_LONG),
    voterPrecinctsPath:       process.env.MONROE_CO_VOTER_PRECINCTS_URL
  },

  plugins: [
    { src:          '~/plugins/api-methods' },
    { src:          '~/plugins/universal-methods' },
    { src:          '~/plugins/universal-computed' },
    { src:          '~/plugins/design-system' },
    { src:          '~/plugins/filters' },
    { src:          '~/plugins/google-map', ssr: false},
    { src:          '~/plugins/click-outside'},
    { src:          '~/plugins/mq', ssr: false},
    /*
    ** Note: Change domain & enable for launch.
    */
    // { src:          '~/plugins/google-analytics.js', ssr: false }
  ],

  loading: { color: '#fff' },

  css: ['~assets/scss/style.scss'],

  styleResources: {
    scss: [
      './assets/scss/*.scss'
    ]
  },

  modules: ['@nuxtjs/style-resources'],

  buildModules: [
    '@nuxtjs/moment'
  ],

  babel: {
    plugins: ['@babel/plugin-transform-modules-commonjs'],
  },

  build: {
    /*
    ** You can extend webpack config here
    */
    transpile: [/^vue2-google-maps($|\/)/],
    extend(config, ctx) {
      if(!ctx.isDev) {
        // config.output.publicPath = `/${process.env.FE_BASE}/_nuxt`
      }
    }
  }
}
