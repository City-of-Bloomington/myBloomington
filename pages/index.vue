<template>
  <div>
    <fn1-header
      :logo="{
        url:      'https://bloomington.in.gov/',
        image:    'city-of-bloomington-logo.svg',
        imageAlt: 'City of Bloomington, IN'
      }"

      :logoHeadings="{
        topHeading:   'Bloomington.in.gov',
        subHeading:   'John Hamilton, Mayor',
      }"

      :application="{
        name: 'My Bloomington',
        url:  'https://bloomington.in.gov/mybloomington/'
      }"

      :navItems="null"
      :subNavItems="null">
    </fn1-header>

    <GmapMap
      :center="latLong"
      :zoom="zoom"
      map-type-id="roadmap"
      style="width: 100%; height: 315px"
      :options="{
        zoomControl:        false,
        mapTypeControl:     false,
        scaleControl:       false,
        streetViewControl:  false,
        rotateControl:      false,
        fullscreenControl:  false,
        disableDefaultUi:   true,
        draggable:          false,
        styles: [
          {
            featureType:    'landscape',
            stylers: [
              {
                color:      '#f2f2f2',
                visibility: 'on'
              }
            ]
          },
          {
            featureType:    'poi',
            stylers: [
              {
                visibility: 'off'
              }
            ]
          },
          // {
          //   featureType:    'poi.park',
          //   elementType:    'geometry',
          //   stylers: [
          //     {
          //       color:      '#C8ACA3',
          //       visibility: 'on'
          //     }
          //   ]
          // },
        ]

      }">
      <GmapMarker
        :position="latLong"
        :clickable="false"
        :draggable="false"
      />

      <form @submit.stop.prevent="searchSubmit(addressSearch)">
        <fn1-search v-model="addressSearch"
                    buttonValue="Search"
                    placeholder="Search Address"
                    name="address-search"
                    id="address-search" />
      </form>
    </GmapMap>

    <div class="overview">
      <div class="container">
        <ul v-if="locationResData">
          <li>
            <div class="weather">
              <div>
                <img :src="`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`"
                     :alt="weather.weather[0].main">
                <span>
                  <strong>Weather:</strong>
                  {{ weather.weather[0].main }} ~ {{ weather.main.temp }} &#176;F
                </span>
              </div>
            </div>
          </li>
          <li>
            <strong>Address:</strong>
            {{ locationResData.address.streetAddress }}<br>
            {{ locationResData.address.city }}, {{ locationResData.address.state }} {{ locationResData.address.zip }}
          </li>

          <li>
            <strong>Township:</strong>
            {{ locationResData.address.township_name }}
          </li>

          <li>
            <strong>Latitude:</strong>
            {{ locationResData.address.latitude }}
          </li>

          <li>
            <strong>Longitude:</strong>
            {{ locationResData.address.longitude }}
          </li>
        </ul>
      </div>
    </div>

    <div class="wrapper">
      <div class="container">
        <fn1-alert v-if="errors.addressRes"
                 dismissible
                 variant="warning">
          <p>{{ errors.addressRes }}</p>
        </fn1-alert>

        <template v-if="addressResChoices">
          <h2>Select an Address:</h2>
          <h5>"{{ addressSearch }}" returned ~{{ addressResChoices.length }} results.</strong></h5>
          <ul class="address-choices">
            <li v-for="a, i in addressResChoices"
                :key="i"
                @click="addressChoice(a)">
              <strong>{{a.streetAddress}}</strong> {{a.city}}, {{ a.state }} {{ a.zip }}
            </li>
          </ul>
        </template>

        <template v-if="!addressResChoices && locationResData">
          <h2>About this Address</h2>
          <hr>

          <template v-if="locationResData.address.jurisdiction_name">
            <p>
              <strong>Address is:</strong>
              <template v-if="locationResData.address.jurisdiction_name === 'Bloomington'">
                Inside
              </template>
              <template v-else>
                Outside
              </template>
              City Limits
            </p>
            <hr>
          </template>

          <template v-if="locationResData.purposes">
            <ul>
              <li v-for="p, i in locationResData.purposes">
                <strong>{{ p.purpose_type }}:</strong> {{ p.name }}
              </li>
            </ul>
            <hr>
          </template>

          <template v-if="locationResData.locations[0]">
            <ul>
              <li v-if="locationResData.locations[0].trash_day">
                <strong>Trash &amp; Recyling Pickup Day:</strong>
                {{ locationResData.locations[0].trash_day }}
              </li>

              <li v-if="locationResData.locations[0].recycle_week">
                <strong>Next Yard Waste Pickup Day:</strong>
                Week {{ locationResData.locations[0].recycle_week }}
              </li>
            </ul>
            <hr>
          </template>

          <h2>Find Your Government Online</h2>
          <hr>

          <template v-if="locations">
            <div style="display: flex; justify-content: space-between;">
              <ul v-for="l, i in locations">
                <li>{{ l.type }}</li>
                <li>{{ l.location }}</li>
                <li>
                  <strong>Website:</strong>
                  <a :href="l.website.url"
                     :alt="l.website.text">{{ l.website.text }}</a>
                </li>
                <li>
                  <strong>Phone:</strong>
                  {{ l.phone.number }}
                </li>
                <!-- <li>
                  <strong>Socials:</strong>
                  <template v-for="s, i in l.socials">
                    {{ s }}
                    <a :href="l.website.url"
                       :alt="l.website.text">{{ l.website.text }}</a>

                  </template>

                </li> -->
              </ul>
            </div>
            <hr>
          </template>
        </template>

        <template v-if="!addressResChoices">
          <details v-if="contacts.mayor">
            <summary>City Mayor</summary>
            <pre>{{ contacts.mayor }}</pre>
          </details>

          <hr v-if="contacts.mayor">

          <details v-if="contacts.clerk">
            <summary>City Clerk</summary>
            <pre>{{ contacts.clerk }}</pre>
          </details>

          <hr v-if="contacts.clerk">

          <details v-if="contacts.council">
            <summary>City Council</summary>
            <pre>{{ contacts.council }}</pre>
          </details>

          <hr v-if="contacts.council">

          <details v-if="councilDistrict">
            <summary>Council District</summary>
            <pre>{{ councilDistrict }}</pre>
          </details>

          <hr v-if="councilDistrict">

          <details v-if="councilAtLargeReps">
            <summary>Council at Large</summary>
            <pre>{{ councilAtLargeReps }}</pre>
          </details>

          <hr v-if="councilAtLargeReps">

          <details v-if="districtRep">
            <summary>Council District Rep</summary>
            <pre>{{ districtRep }}</pre>
          </details>

          <hr v-if="districtRep">

          <details v-if="addressResData">
            <summary>Address Data</summary>
            <pre>{{ addressResData }}</pre>
          </details>

          <hr v-if="addressResData">

          <details v-if="locationResData">
            <summary>Location Data</summary>
            <pre>{{ locationResData }}</pre>
          </details>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import axios          from 'axios'
import { mapFields }  from 'vuex-map-fields'

export default {
  beforeRouteEnter (to, from, next) {
    next(vm => {
      let addressQueryParam = to.query.address;
      if(addressQueryParam){
        vm.addressSearch = addressQueryParam;
        vm.searchSubmit(addressQueryParam);
      }
    });
  },
  // beforeRouteUpdate (to, from, next) {
  //   // console.dir('changed route');
  //   // let addressQueryParam = from.query.address;
  //   // if(addressQueryParam){
  //   //   this.addressSearch = addressQueryParam;
  //   //   this.searchSubmit(addressQueryParam);
  //   // }
  //   // next(false)
  // },
  // filters: {
  //   capitalize: function (str) {
  //     return str.toLowerCase().replace(/^\w|\s\w/g, (value) => {
  //       return value.toUpperCase();
  //     })
  //   }
  // },
  data() {
    return {
      cityName:           'City of Bloomington',
      cityHallLatLong:    { lat: 39.16992723, lng: -86.53680559 },
      latLong:            {},
      weather:            null,
      zoom:               13,
      addressSearch:      null,
      addressResData:     null,
      addressResChoices:  null,
      locationResData:    null,
      councilDistrict:    null,
      councilAtLargeReps: null,
      districtRep:        null,
      errors: {
        addressRes:       null,
        locationRes:      null
      }
    }
  },
  created() {
    this.latLong = this.cityHallLatLong;
  },
  mounted() {
    this.getWeather(this.cityHallLatLong.lat, this.cityHallLatLong.lng)
    .then((res) => {
      this.weather = res;
      console.log(`%c getWeather 👌 `,
                  this.consoleLog.success);
    })
    .catch((e)  => {
      console.log(`%c getWeather 🛑 `,
                  this.consoleLog.error,
                  `\n\n ${e} \n\n`);
    })

    this.getDirectoryUser('mayor')
    .then((res) => {
      this.$store.dispatch('contacts/setMayor', res);
      console.log(`%c getMayor 👌 `,
                  this.consoleLog.success);
    })
    .catch((e) => {
      console.log(`%c getMayor 🛑 `,
                  this.consoleLog.error,
                  `\n\n ${e} \n\n`);
    });

    this.getDirectoryUser('clerk')
    .then((res) => {
      this.$store.dispatch('contacts/setClerk', res);
      console.log(`%c getClerk 👌 `,
                  this.consoleLog.success);
    })
    .catch((e) => {
      console.log(`%c getClerk 🛑 `,
                  this.consoleLog.error,
                  `\n\n ${e} \n\n`);
    });

    this.getCityCouncil()
    .then((res) => {
      this.$store.dispatch('contacts/setCouncil', res);
      console.log(`%c getCityCouncil 👌 `,
                  this.consoleLog.success);

      this.councilAtLarge()
      .then((res) => {
        this.councilAtLargeReps = res;
        console.log(`%c councilAtLarge 👌 `,
                  this.consoleLog.success);

      })
      .catch((e)  => {
        console.log(`%c councilAtLarge 🛑 `,
                    this.consoleLog.error,
                    `\n\n ${e} \n\n`);
      })
    })
    .catch((e)  => {
      console.log(`%c getCityCouncil 🛑 `,
                  this.consoleLog.error,
                  `\n\n ${e} \n\n`);
    })
  },
  computed: {
    ...mapFields([
      'consoleLog',
      'locations',
      'sanitation',
      'contacts'
    ])
  },
  methods: {
    councilAtLarge() {
      return new Promise((resolve, reject) => {
        if(this.contacts.council) {
          let councilALarge = this.contacts.council
          .filter((item) => item.name === 'At-Large');
          resolve(councilALarge);
        } else {
          reject(`Counldn't determine City Council at Large.`)
        }
      })
    },
    addressChoice(address) {
      this.addressSearch  = address.streetAddress;
      this.addressResData = address;
      if(this.addressResData)
        this.locationLookup();
    },
    searchSubmit(input) {
      this.addressResChoices  = null;
      this.locationResData    = null;
      this.councilDistrict    = null;
      this.districtRep        = null;
      this.errors.addressRes  = null;
      this.addressLookup(input);
    },
    addressLookup(address) {
      this.$router.push({query : { address: address}});
      this.getAddress(address)
      .then((res) => {
        console.dir(res.length);
        if(res.length > 1) {
          this.addressResData     = null;
          this.addressResChoices  = res;
        } else {
          this.addressResData     = res;
          this.errors.addressRes  = null;
          this.locationLookup();
          console.log(`%c getAddress 👌 `,
                      this.consoleLog.success);
        }
      })
      .catch((e)  => {
        this.$router.replace({query : { }});

        this.addressSearch      = null;
        this.addressResData     = null;
        this.locationResData    = null;
        this.errors.addressRes  = e;
        console.log(`%c getAddress 🛑 `,
                    this.consoleLog.error,
                    `\n\n ${e} \n\n`);
      })
    },
    locationLookup() {
      if(this.addressResData.id) {
        this.getLocation(this.addressResData.id)
        .then((res) => {
          this.addressResChoices = null;

          this.locationResData    = res;
          this.errors.locationRes = null;


          this.$router.push({query : { address: this.locationResData.address.streetAddress}});

          console.log(`%c getLocation 👌 `,
                      this.consoleLog.success);

          this.setLatLong(this.locationResData.address.latitude,this.locationResData.address.longitude);

          this.getCouncilDistrict()
          .then((res) => {
            this.councilDistrict = res;
            console.log(`%c getCouncilDistrict 👌 `,
                        this.consoleLog.success);

            this.councilDistrictRep(this.councilDistrict.id);
          })
          .catch((e)  => {
            console.log(`%c getCouncilDistrict 🛑 `,
                        this.consoleLog.error,
                        `\n\n ${e} \n\n`);
          });
        })
        .catch((e) => {
          this.$router.replace({query : { }});
          this.locationResData    = null;
          this.errors.locationRes = e;
          console.log(`%c getLocation 🛑 `,
                      this.consoleLog.error,
                      `\n\n ${e} \n\n`);
        })
      } else {
        console.dir('Need to select an Address first');
      }
    },
    setLatLong(lat, lng) {
      let locationLat = lat,
          locationLng = lng;

      this.latLong = {
        lat: locationLat,
        lng: locationLng
      };

      this.zoom = 17;

      console.log(`%c updated latLng (gMap) 👌 `,
                  this.consoleLog.success);
    },
    getCouncilDistrict() {
      return new Promise((resolve, reject) => {
        let locationPurposes = this.locationResData.purposes,
          districtID         = locationPurposes
          .find((item) => item.purpose_type === 'CITY COUNCIL DISTRICT');

        if(districtID){
          resolve(districtID)
        } else {
          reject(`Couldn't determine the Council District`)
        }
      })
    },
    councilDistrictRep(id) {
      switch(id) {
        case 1:
          this.filterDistrictRep('District I')
          break;
        case 2:
          this.filterDistrictRep('District II')
          break;
        case 3:
          this.filterDistrictRep('District III')
          break;
        case 4:
          this.filterDistrictRep('District IV')
          break;
        case 5:
          this.filterDistrictRep('District V')
          break;
        case 6:
          this.filterDistrictRep('District VI')
          break;
        default:
          this.districtRep = null
      }
    },
    filterDistrictRep(district) {
      this.districtRep = this.contacts.council
      .filter((item) => item.name == district);
    },
  }
}
</script>

<style lang="scss" scoped>
  header {
    padding: 15px 20px;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  h5 {
    margin: 20px 0;
    // padding: 5px 15px;
    color: lighten($text-color, 20%);
    font-style: italic;
    font-weight: $weight-semi-bold;
    // border-top: 1px solid darken($color-grey, 5%);
    // border-bottom: 1px solid darken($color-grey, 5%);
  }

  .wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 0 0 40px 0;
  }

  .container {
    width: 1024px;
  }

  .overview {
    z-index: 1;
    position: relative;
    top: -40px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    background-color: $color-blue;
    color: white;
    padding: 20px 0;

    h4 {
      margin: 0 0 15px 0;
    }

    h4, p, ul, li {
      color: white;
    }

    .container {

      ul {
        display: flex;
        align-items: center;
        justify-content: space-between;

        li {
          strong {
            display: block;
            margin: 0 0 5px 0;
          }
        }
      }
    }
  }

  .vue-map-container {
    position: relative;

    &:before {
      z-index: 1;
      position: absolute;
      content: '';
      height: 100%;
      width: 100%;
      background-color: rgba($color-blue-darker, 0.15);
    }

    // &:hover {
    //   &:before {
    //     background-color: rgba($color-blue-darker, 0.2);
    //   }
    // }

    ::v-deep .vue-map-hidden {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 100px 0 0 0;
      height: 100%;
      width: 100%;

      form {
        z-index: 1;
        width: 400px;

        label {
          @include visuallyHidden;
        }

        input {
          border: 1px solid $text-color;
          color: $text-color;
        }

        button[type=submit] {
          background-color: $color-green;
          border-color: $text-color;

          &:hover,
          &:focus {
            background-color: darken($color-green, 5%);
          }
        }
      }
    }
  }

  .weather {
    div {
      &:first-of-type {
        display: flex;
        align-items: center;
      }
    }
  }

  .address-choices {
    li {
      cursor: pointer;
      color: $text-color;
      background-color: white;
      border-bottom: 1px solid darken($color-grey, 5%);
      margin: 0;
      padding: 15px;

      &:hover {
        background-color: rgba($color-cloud, 0.5);
      }

      &:nth-child(even) {
        background-color: rgba($color-cloud, 0.3);

        &:hover {
          background-color: rgba($color-cloud, 0.5);
        }
      }

      &:last-of-type {
        border-bottom: 0;
      }
    }
  }
</style>