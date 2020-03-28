import Vue          from 'vue'
import axios        from 'axios'
import {
  mapFields }       from 'vuex-map-fields'

Vue.mixin({
  data() { return {} },
  computed: {},
  methods: {
    // https://bloomington.in.gov/geoserver/publicgis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=publicgis:HistoricSitesandStructuresSurvey2018&cql_filter=AddLocID=21347&outputFormat=application%2Fjson

    /**
     *  A promise returning Historic Sites and Structures Survey
     *  information from 2018. via COB HANDxGIS
     * 
     * @promise   getHANDSHARDData
     * @param     { String } locationID 
     * @resolve   { Object }
     * @reject    { Error }
     * @return    { Promise <Object> }
     */
    getHANDSHARDData(locationID) {
      return new Promise((resolve, reject) => {
        axios.get(`${process.env.baseUrl}/geoserver/publicgis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=publicgis:HistoricSitesandStructuresSurvey2018&cql_filter=AddLocID%20like%20%27%25${locationID}%25%27%20&outputFormat=application%2Fjson`)
        .then((res) => {
          if(res.data.totalFeatures >= 1)
            resolve(this.$store.dispatch('setHANDSHARDData', res.data));

          else reject(this.$store.dispatch('setHANDSHARDData', null))
        })
        .catch((e) => reject(e))
      })
    },
    /**
     *  A promise returning inRoad road information.
     * 
     * @promise   getInRoadsData
     * @resolve   { Object }
     * @reject    { Error }
     * @return    { Promise <Object> }
     */
    getInRoadsData(dateFrom, dateTo) {
      return new Promise((resolve, reject) => {
        axios.get(`${process.env.inRoadsPath}start=${dateFrom}&end=${dateTo}&eventTypes%5B%5D=roadClosed&eventTypes%5B%5D=localOnly&eventTypes%5B%5D=laneRestriction&eventTypes%5B%5D=reservedMeter&eventTypes%5B%5D=noisePermit&eventTypes%5B%5D=sidewalk`)
        .then((res) => resolve(res.data))
        .catch((e) => reject(e))
      })
    },
    /**
     * A promise returning Monroe Co. Safe Places.
     *
     * @promise     getSafePlaces
     * @resolve     { Object }
     * @reject      { Error }
     * @return      { Promise <Object> }
     */
    getSafePlaces() {
      return new Promise((resolve, reject) => {
        axios.get(`${process.env.safePlaces}`)
        .then((res) => resolve(res.data))
        .catch((e)  => reject(e))
      })
    },
    /**
     * A promise returning City of Bloomington Playgrounds.
     *
     * @promise     getPlaygrounds
     * @resolve     { Object }
     * @reject      { Error }
     * @return      { Promise <Object> }
     */
    getPlaygrounds() {
      return new Promise((resolve, reject) => {
        axios.get(`${process.env.cityPlaygrounds}`)
        .then((res) => resolve(res.data))
        .catch((e)  => reject(e))
      })
    },
    /**
     * A promise returning local Schools.
     *
     * @promise     getLocalSchools
     * @resolve     { Object }
     * @reject      { Error }
     * @return      { Promise <Object> }
     */
    getLocalSchools() {
      return new Promise((resolve, reject) => {
        axios.get(`${process.env.localSchools}`)
        .then((res) => resolve(res.data))
        .catch((e)  => reject(e))
      })
    },
    /**
     * A promise returning City of Bloomington Parks.
     *
     * @promise     getCityOfBloomingtonParks
     * @resolve     { Object }
     * @reject      { Error }
     * @return      { Promise <Object> }
     */
    getCityOfBloomingtonParks() {
      return new Promise((resolve, reject) => {
        axios.get(`${process.env.cityParksGeoJson}`)
        .then((res) => resolve(res.data))
        .catch((e)  => reject(e))
      })
    },
    /**
     * A promise returning a Location result
     * via an Address ID.
     *
     * @promise   getLocation
     * @param     { Integer } id
     * @resolve   { Object }
     * @reject    { Error }
     * @return    { Promise <Object> }
     */
    getLocation(id) {
      return new Promise((resolve, reject) => {
        axios.get(`${process.env.baseUrl}${process.env.MAAddressesPath}/${id}?format=json`)
        .then((res) => resolve(res.data))
        .catch((e)  => reject(e))
      })
    },
    /**
     * A promise returning an Address result
     * via an Address String.
     *
     * @promise   getAddress
     * @param     { String } address
     * @resolve   { Object }
     * @reject    { Error }
     * @return    { Promise <Object> }
     */
    getAddress(address) {
      return new Promise((resolve, reject) => {
        let regExTest     = /\d+\s+\w+/,
            addressTest   = regExTest.test(address),
            encodeAddress = encodeURIComponent(address).replace(/%20/g, "+");

        if(addressTest) {
          axios.get(`${process.env.baseUrl}${process.env.MAAddressesPath}?format=json&address=${address}`)
          .then((res) => {
            if(res.data.length == 1) {
              resolve(res.data[0])
            } else if(res.data.length == 0) {
              reject(`No results for ${address}.`)
            } else if (res.data.length == 2) {
              reject(`Select option`)
            } else if(res.data.length <= 20) {
              resolve(res.data)
              console.dir(`getAddress() Search Result Count: ${res.data.length}`);
            } else {
              reject(`We didn't find an Address for '${address}'.`)
              console.dir(`getAddress() Search Result Count: ${res.data.length}`);
            }
          })
          .catch((e)  => reject(e))
        } else {
          reject('Please refine your Address Search.')
        }
      })
    },
    getWeather(lat, lng) {
      return new Promise((resolve, reject) => {
        axios.get(`${process.env.weatherUrl}weather?lat=${lat}&lon=${lng}&units=imperial&appid=${process.env.weatherApiKey}`)
        .then((res) => resolve(res.data))
        .catch((e)  => reject(e))
      })
    },
    getCouncilDistrictsGeoJson() {
      return new Promise((resolve, reject) => {
        axios.get(`${process.env.baseUrl}${process.env.councilDistrictsGeoJson}`)
        .then((res) => resolve(res.data))
        .catch((e)  => reject(e))
      })
    },
    getCityBoundaryGeoJson() {
      return new Promise((resolve, reject) => {
        axios.get(process.env.cityBoundaryGeoJson)
        .then((res) => resolve(res.data.features))
        .catch((e)  => reject(e))
      })
    },
    getWeather() {
      return new Promise((resolve, reject) => {
        axios.get(`${process.env.weatherUrl}weather?lat=${this.cityHallLatLong.lat}&lon=${this.cityHallLatLong.lng}&units=imperial&appid=${process.env.weatherApiKey}`)
        .then((res) => resolve(res.data))
        .catch((e)  => reject(e))
      })
    }
  }
})