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

    <div class="wrapper">
      <fn1-alert v-if="errors.addressRes"
               dismissible
               variant="warning">
        <p>{{ errors.addressRes }}</p>
      </fn1-alert>

      <details v-if="contacts.mayor">
        <summary>City Mayor</summary>
        <pre>{{ contacts.mayor }}</pre>
      </details>

      <hr>

      <details v-if="contacts.clerk">
        <summary>City Clerk</summary>
        <pre>{{ contacts.clerk }}</pre>
      </details>

      <hr>

      <details v-if="contacts.council">
        <summary>City Council</summary>
        <pre>{{ contacts.council }}</pre>
      </details>

      <hr>

      <details v-if="councilDistrict">
        <summary>Council District</summary>
        <pre>{{ councilDistrict }}</pre>
      </details>

      <hr>

      <details v-if="councilAtLargeReps">
        <summary>Council at Large</summary>
        <pre>{{ councilAtLargeReps }}</pre>
      </details>

      <hr>

      <details v-if="districtRep">
        <summary>Council District Rep</summary>
        <pre>{{ districtRep }}</pre>
      </details>

      <hr>

      <details v-if="addressResData">
        <summary>Address Data</summary>
        <pre>{{ addressResData }}</pre>
      </details>

      <hr>

      <details v-if="locationResData">
        <summary>Location Data</summary>
        <pre>{{ locationResData }}</pre>
      </details>
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
  data() {
    return {
      cityHallLatLong:    { lat: 39.16992723, lng: -86.53680559 },
      latLong:            {},
      zoom:               16,
      addressSearch:      null,
      addressResData:     null,
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
    searchSubmit(input) {
      /* */
      this.getAddress(input)
      .then((res) => {
        this.addressResData     = res;
        this.errors.addressRes  = null;
        console.log(`%c getAddress 👌 `,
                    this.consoleLog.success);
      })
      .then(() => {
        /* */
        this.getLocation(this.addressResData.id)
        .then((res) => {
          this.$router.push({query : { address: this.addressSearch}});

          this.locationResData    = res;
          this.errors.locationRes = null;

          console.log(`%c getLocation 👌 `,
                      this.consoleLog.success);

          if(this.locationResData) {
            let locationLat = this.locationResData.address.latitude,
                locationLng = this.locationResData.address.longitude;

            this.latLong = {
              lat: locationLat,
              lng: locationLng
            };

            this.zoom = 17;

            console.log(`%c updated latLng (gMap) 👌 `,
                        this.consoleLog.success);
          }

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
          this.locationResData    = null;
          this.errors.locationRes = e;
          console.log(`%c getLocation 🛑 `,
                      this.consoleLog.error,
                      `\n\n ${e} \n\n`);
        })
      })
      .catch((e)  => {
        this.addressSearch      = null;
        this.$router.replace({query : { }});
        this.addressResData     = null;
        this.locationResData    = null;
        this.councilDistrict    = null;
        this.districtRep        = null;
        this.errors.addressRes  = e;
        console.log(`%c getAddress 🛑 `,
                    this.consoleLog.error,
                    `\n\n ${e} \n\n`);
      })
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

  .wrapper {
    background-color: red;
    margin: 20px;
    padding: 20px;
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
          border-color: $color-green;
        }
      }
    }
  }
</style>