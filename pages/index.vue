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

    <div class="overview" v-if="locationResData">
      <div class="row">
        <div class="container">
          <div class="weather">
              <img :src="`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`"
                   :alt="weather.weather[0].main">
              <p>
                <strong>Weather:</strong>
                {{ weather.weather[0].main }} ~ {{ weather.main.temp }} &#176;F
              </p>
          </div>

          <div>
            <fn1-badge :class="[{'inside': locationResData.address.jurisdiction_name === 'Bloomington', 'outside': locationResData.address.jurisdiction_name != 'Bloomington'}]">
              <template v-if="locationResData.address.jurisdiction_name === 'Bloomington'">
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-check fa-w-16 fa-3x"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" class=""></path></svg>
                Inside
              </template>

              <template v-else>
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" class="svg-inline--fa fa-times fa-w-11 fa-3x"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" class=""></path></svg>
                Outside
              </template>
              Bloomington City Limits
            </fn1-badge>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="container">
          <div>
            <p>
              <strong>Address:</strong>
              {{ locationResData.address.streetAddress }}
              {{ locationResData.address.city }}, {{ locationResData.address.state }} {{ locationResData.address.zip }}
            </p>
          </div>

          <div>
            <p>
              <strong>Latitude:</strong>
              {{ locationResData.address.latitude }}<!-- <br> -->
              <strong>Longitude:</strong>
              {{ locationResData.address.longitude }}
            </p>
          </div>
        </div>
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
          <div class="row data" v-if="locationResData.purposes">
            <header>
              <h2>About this Address</h2>

              <div>
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-marked-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-map-marked-alt fa-w-18 fa-3x"><path fill="currentColor" d="M288 0c-69.59 0-126 56.41-126 126 0 56.26 82.35 158.8 113.9 196.02 6.39 7.54 17.82 7.54 24.2 0C331.65 284.8 414 182.26 414 126 414 56.41 357.59 0 288 0zm0 168c-23.2 0-42-18.8-42-42s18.8-42 42-42 42 18.8 42 42-18.8 42-42 42zM20.12 215.95A32.006 32.006 0 0 0 0 245.66v250.32c0 11.32 11.43 19.06 21.94 14.86L160 448V214.92c-8.84-15.98-16.07-31.54-21.25-46.42L20.12 215.95zM288 359.67c-14.07 0-27.38-6.18-36.51-16.96-19.66-23.2-40.57-49.62-59.49-76.72v182l192 64V266c-18.92 27.09-39.82 53.52-59.49 76.72-9.13 10.77-22.44 16.95-36.51 16.95zm266.06-198.51L416 224v288l139.88-55.95A31.996 31.996 0 0 0 576 426.34V176.02c0-11.32-11.43-19.06-21.94-14.86z"></path></svg>

                <blockquote>
                  <p>Here is an overview of services offered by the City of Bloomington to the address you've requested.</p>
                </blockquote>
              </div>
            </header>

            <table>
              <caption class="sr-only">
                Address Location Purposes
              </caption>
              <thead class="sr-only">
                <tr>
                  <th scope="col">Purpose Type</th>
                  <th scope="col">Purpose Name</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <th scope="row">Township:</th>
                  <td>{{ locationResData.address.township_name }}</td>
                </tr>

                <tr v-for="p, i in locationResData.purposes">
                  <th scope="row">{{ p.purpose_type }}:</th>
                  <td>
                    {{ p.name }}

                    <template v-if="p.purpose_type === 'RESIDENTIAL PARKING ZONE'"><br>
                      <small>
                        Permit required Monday – Friday, 8:00am – 5:00pm
                      </small>
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="row data">
            <header>
              <h2>Pickup Days</h2>

              <div>
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-trash fa-w-14 fa-3x"><path fill="currentColor" d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z" class=""></path></svg>

                <blockquote>
                  <p>Yard waste pickups are between April and December only. Some conditions may cause delays to the schedule. Please see <a href="https://bloomington.in.gov/trash">Trash &amp; Recycling Pickup</a> for details.</p>
                </blockquote>
              </div>
            </header>

            <table>
              <caption class="sr-only">
                  Address Location Waste Pickup
                </caption>
                <thead class="sr-only">
                  <tr>
                    <th scope="col">Type</th>
                    <th scope="col">Day/Week</th>
                  </tr>
                </thead>

              <tbody>
                <tr>
                  <th scope="row">Trash &amp; Recyling:</th>
                  <td>{{ locationResData.locations[0].trash_day }}</td>
                </tr>

                <tr>
                  <th scope="row">Yard Waste:</th>
                  <td>
                    <a :href="trashLink(locationResData.locations[0].recycle_week, locationResData.locations[0].trash_day)">
                      Week {{ locationResData.locations[0].recycle_week }}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="row data" v-if="false">
          <!-- <div class="row data" v-if="locations"> -->
            <header>
              <h2>Government Online</h2>
            </header>

            <div class="locations">
              <div class="location" v-for="l, i in locations">
                <ul>
                  <li>{{ l.type }}</li>
                  <li>{{ l.location }}</li>
                  <!-- <li>
                    <strong>Website:</strong>
                    <a :href="l.website.url"
                       :alt="l.website.text">{{ l.website.text }}</a>
                  </li>
                  <li>
                    <strong>Phone:</strong>
                    {{ l.phone.number }}
                  </li> -->
                </ul>

                <table>
                  <caption class="sr-only">
                    Online Government Information
                  </caption>
                  <thead class="sr-only">
                    <tr>
                      <th scope="col">Key/Value</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <th scope="row">
                        Website:<br>
                        <a :href="l.website.url"
                           :alt="l.website.text">{{ l.website.text }}</a>
                      </th>
                    </tr>

                    <tr v-for="s, i in l.socials">
                      <th scope="row">
                        {{ s.type }}:<br>
                        <a :href="s.url"
                           :alt="s.text">{{ s.text }}</a>
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="row data">
            <header>
              <h2>Elected Officials</h2>
            </header>

            <div class="contacts" v-if="contacts.mayor">
              <div class="row contact mayor">
                <div class="img">
                  <img src="contacts/mayor/john-hamilton.jpg" :alt="`Mayor ${contacts.mayor.displayname}`">
                </div>

                <div class="about">

                  <h2>{{ contacts.mayor.displayname }}</h2>
                  <h4>{{ contacts.mayor.name }}</h4>

                  <table>
                    <caption class="sr-only">
                      Address Location Purposes
                    </caption>
                    <thead class="sr-only">
                      <tr>
                        <th scope="col">Purpose Type</th>
                        <th scope="col">Purpose Name</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <th scope="row">Email:</th>
                        <td>{{ contacts.mayor.email }}</td>
                      </tr>

                      <tr>
                        <th scope="row">Telephone:</th>
                        <td>{{ contacts.mayor.pager }}</td>
                      </tr>

                      <tr>
                        <th scope="row">Mailing Address:</th>
                        <td>
                          {{ contacts.mayor.department }}<br>
                          401 N Morton St<br>
                          Bloomington, IN 47404
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div class="row data">
            <header>
              <h2>City Council</h2>
            </header>

            <div class="contacts">
              <div class="row council">
                <div class="contact">
                  <div class="img" style="background-image: url('contacts/city-council/andy-ruff.jpg');"></div>

                  <div class="about">
                    <h2>
                      {{ councilAtLargeReps[0].currentMember.firstname }}
                      {{ councilAtLargeReps[0].currentMember.lastname }}
                    </h2>
                    <h4>At Large</h4>

                    <table>
                      <caption class="sr-only">
                        City Council Member {{ councilAtLargeReps[0].currentMember.firstname }} {{ councilAtLargeReps[0].currentMember.lastname }}
                      </caption>
                      <thead class="sr-only">
                        <tr>
                          <th scope="col">Purpose Type</th>
                          <th scope="col">Purpose Name</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <th scope="row">Email:</th>
                          <td>ruffa@bloomington.in.gov</td>
                        </tr>

                        <tr>
                          <th scope="row">Address:</th>
                          <td>1414 E University</td>
                        </tr>

                        <tr>
                          <th scope="row">Phone:</th>
                          <td>812-349-3409</td>
                        </tr>

                        <tr>
                          <th scope="row">Fax:</th>
                          <td>812-349-3570</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div class="contact">
                  <div class="img" style="background-image: url('contacts/city-council/susan-sandberg.jpg');"></div>

                  <div class="about">
                    <h2>
                      {{ councilAtLargeReps[1].currentMember.firstname }}
                      {{ councilAtLargeReps[1].currentMember.lastname }}
                    </h2>
                    <h4>At Large</h4>

                    <table>
                      <caption class="sr-only">
                        City Council Member {{ councilAtLargeReps[1].currentMember.firstname }} {{ councilAtLargeReps[1].currentMember.lastname }}
                      </caption>
                      <thead class="sr-only">
                        <tr>
                          <th scope="col">Purpose Type</th>
                          <th scope="col">Purpose Name</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <th scope="row">Email:</th>
                          <td>sandbers@bloomington.in.gov</td>
                        </tr>

                        <tr>
                          <th scope="row">Address:</th>
                          <td>2201 N Fritz Dr</td>
                        </tr>

                        <tr>
                          <th scope="row">Phone:</th>
                          <td>812-349-3409</td>
                        </tr>

                        <tr>
                          <th scope="row">Fax:</th>
                          <td>812-349-3570</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div class="contact">
                  <div class="img" style="background-image: url('contacts/city-council/jim-sims.jpg');"></div>

                  <div class="about">
                    <h2>
                      {{ councilAtLargeReps[2].currentMember.firstname }}
                      {{ councilAtLargeReps[2].currentMember.lastname }}
                    </h2>
                    <h4>At Large</h4>

                    <table>
                      <caption class="sr-only">
                        City Council Member {{ councilAtLargeReps[2].currentMember.firstname }} {{ councilAtLargeReps[2].currentMember.lastname }}
                      </caption>
                      <thead class="sr-only">
                        <tr>
                          <th scope="col">Purpose Type</th>
                          <th scope="col">Purpose Name</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <th scope="row">Email:</th>
                          <td>simsji@bloomington.in.gov</td>
                        </tr>

                        <tr>
                          <th scope="row">Phone:</th>
                          <td>812-349-3409</td>
                        </tr>

                        <tr>
                          <th scope="row">Fax:</th>
                          <td>812-349-3570</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row data" v-if="districtRep">
            <header>
              <h2>District Representative</h2>
            </header>

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
            </GmapMap>

            <div class="contacts">
              <div class="row council">
                <div class="contact">
                  <div class="img" :style="`background-image: url( ${districtRepImage} );`"></div>

                  <div class="about">
                    <h2>
                      {{ districtRep[0].currentMember.firstname }}
                      {{ districtRep[0].currentMember.lastname }}
                    </h2>
                    <h4>{{ districtRep[0].name }} Representative</h4>

                    <table>
                      <caption class="sr-only">
                        City Council District Representative {{ districtRep[0].currentMember.firstname }}
                      {{ districtRep[0].currentMember.lastname }}
                      </caption>
                      <thead class="sr-only">
                        <tr>
                          <th scope="col">Purpose Type</th>
                          <th scope="col">Purpose Name</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <th scope="row">Email:</th>
                          <td>ruffa@bloomington.in.gov</td>
                        </tr>

                        <tr>
                          <th scope="row">Address:</th>
                          <td>1414 E University</td>
                        </tr>

                        <tr>
                          <th scope="row">Phone:</th>
                          <td>812-349-3409</td>
                        </tr>

                        <tr>
                          <th scope="row">Fax:</th>
                          <td>812-349-3570</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <footer>
      <div class="container">
        <p>The information reported comes from the <strong>City of Bloomington Geographic Information Systems (GIS)</strong> and related databases.</p>

        <p>City staff strives to keep complete and accurate information and regrets any errors or omissions. To report missing City of Bloomington addresses or other profile errors, please contact the City of Bloomington GIS Staff at <strong>812-349-3454</strong> or <strong>email</strong> us at <a href="mailto: gis@bloomington.in.gov">gis@bloomington.in.gov</a>.</p>
      </div>
    </footer>
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
  beforeRouteUpdate (to, from, next) {
    let addressQueryParam = from.query.address;
    if(addressQueryParam){
      this.addressSearch = addressQueryParam;
      this.searchSubmit(addressQueryParam);
    }
  },
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
    ]),
    districtRepImage() {
      let rep = this.councilDistrict.id;
      switch(rep) {
        case 1:
          return 'contacts/district-representatives/1/chris-sturbaum.jpg';
          break;
        case 2:
          return 'contacts/district-representatives/2/dorothy-granger.jpg';
          break;
        case 3:
          return 'contacts/district-representatives/3/allison-chopra.jpg';
          break;
        case 4:
          return 'contacts/district-representatives/4/dave-rollo.jpg';
          break;
        case 5:
          return 'contacts/district-representatives/5/isabel-piedmont-smith.jpg';
          break;
        case 6:
          return 'contacts/district-representatives/6/stephen-volan.jpg';
          break;
      }

    },
  },
  methods: {
    trashLink(week, day) {
      if(week === 'A'){
        switch(day) {
          case 'Monday':
            return this.sanitation.A.Monday;
            break;
          case 'Tuesday':
            return this.sanitation.A.Tuesday;
            break;
          case 'Wednesday':
            return this.sanitation.A.Wednesday;
            break;
          case 'Thursday':
            return this.sanitation.A.Thursday;
            break;
        }
      } else if(week === 'B'){
        switch(day) {
          case 'Monday':
            return this.sanitation.B.Monday;
            break;
          case 'Tuesday':
            return this.sanitation.B.Tuesday;
            break;
          case 'Wednesday':
            return this.sanitation.B.Wednesday;
            break;
          case 'Thursday':
            return this.sanitation.B.Thursday;
            break;
        }
      }
    },
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

      this.zoom = 18;

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

  footer {
    margin: 0 0 60px 0;

    p {
      color: $text-color;
      margin: 0 0 20px 0;
    }
  }

  ul {
    list-style: none;
    padding: 0;
  }

  a {
    color: $color-blue;

    &:hover,
    &:focus {
      color: darken($color-blue, 5%);
    }
  }

  h2 {
    position: relative;
    text-transform: uppercase;
    font-weight: $weight-semi-bold;
    letter-spacing: .5px;
    font-size: 28px;
    color: lighten($text-color, 15%);
    border-bottom: 2px solid $color-grey;
    padding: 0 0 10px 0;
    margin: 0 0 40px 0;

    &:after {
      position: absolute;
      content: '';
      bottom: -2px;
      left: 0;
      height: 4px;
      width: 125px;
      background-color: $color-orange-light;
    }
  }

  blockquote {
    letter-spacing: .5px;
    font-weight: 500;
    font-style: italic;
    border-left: 2px solid $color-grey-light;
  }

  h5 {
    margin: 20px 0;
    color: lighten($text-color, 20%);
    font-style: italic;
    font-weight: $weight-semi-bold;
  }

  .wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 0 0 40px 0;
  }

  .container {
    width: 1024px;
    margin: 0 auto;
  }

  .row {
    width: 100%;

    &.data {
      margin: 0;
      padding: 0 0 60px 0;
      // border-bottom: 1px dashed lighten($color-grey, 5%);

      header {
        // background-color: green;
        display: flex;
        flex-wrap: wrap;
        margin: 0;
        padding: 0;

        div {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          width: 100%;
          margin: 0 0 40px 0;
        }

        blockquote {
          width: calc(100% - 90px);
          margin: 0;
          padding: 0 0 0 40px;
          font-size: 18px;

          p {
            color: lighten($text-color, 5%);
          }
        }
      }

      .vue-map-container {
        margin: 0 0 40px 0;
      }

      // div:not(.contacts):not(.locations):not(.location) {
      //   display: flex;
      //   // align-items: flex-start;
      //   flex-wrap: wrap;
      //   width: 100%;
      //   // background-color: green;
      // }

      .locations {
        // background-color: red;
        display: flex;
        justify-content: space-between;

        .location {
          padding: 0 20px;
          // background-color: blue;

          &:first-child {
            padding: 0 20px 0 0;
          }

          &:last-child {
            padding: 0 0 0 20px;
          }
        }

        ul {
          li {
            color: lighten($text-color, 5%);

            &:nth-child(1) {
              letter-spacing: 1px;
              text-transform: uppercase;
              font-weight: $weight-semi-bold;
              border-bottom: 1px solid $color-grey;
              padding: 0 0 10px 0;
              margin: 0 0 10px 0;
            }

            &:nth-child(2) {
              letter-spacing: .5px;
              font-size: 28px;
              margin: 10px 0;
            }

            &:nth-child(n+3) {
              color: red;
            }
          }
        }
      }

      .contacts {
        // background-color: green;

        table tbody tr th {
          width: 225px;
        }

        .mayor {
          display: flex;
          // background-color: red;

          .img {
            position: relative;
            width: 300px;
            margin: 0 40px 0 0;

            img {
              width: 100%;
              position: relative;
              z-index: 1;
            }

            &:before {
              position: absolute;
              content: '';
              left: -25px;
              bottom: -22px;
              width: 100%;
              height: 100%;
              display: block;
              border-radius: $radius-default*3;
              background-color: $color-grey-lighter;
            }
          }

          .about {
            width: calc(100% - 300px);

            h2 {
              font-size: 24px;
              margin: 0 0 20px 0;

              &:after {
                background-color: $color-blue;
              }
            }

            h4 {
              color: lighten($text-color, 20%);
              // font-weight: $weight-semi-bold;
              font-size: 20px;
              letter-spacing: 1px;
              text-transform: uppercase;
              margin: 0 0 20px 20px;
              padding: 0 0 0 20px;
              border-left: 2px solid $color-grey;
            }
          }
        }

        .council {
          // background-color: red;
          display: flex;
          flex-wrap: wrap;
          // justify-content: space-between;

          .contact {
            display: flex;
            // background-color: green;
            width: 100%;
            margin: 0 0 80px 0;

            h4 {
              margin: 0 0 20px 20px;
              padding: 0 0 0 20px;
              border-left: 2px solid $color-grey;
            }

            .img {
              position: relative;
              display: block;
              margin: 0 40px 0 0;
              width: 225px;
              height: 225px;
              border-radius: 50%;
              background-position: top center;
              background-repeat: no-repeat;
              background-size: cover;

              &:after {
                z-index: -1;
                position: absolute;
                content: '';
                width: 225px;
                height: 225px;
                left: -10px;
                bottom: -15px;
                display: block;
                border-radius: 50%;
                background-color: $color-grey-lighter;
              }
            }

            // &:nth-child(odd) {
            //   h4 {
            //     margin: 0 0 20px 20px;
            //     padding: 0 0 0 20px;
            //     border-left: 2px solid $color-grey;
            //   }

            //   .img {
            //     margin: 0 40px 0 0;
            //   }
            // }

            // &:nth-child(even) {
            //   flex-direction: row-reverse;

            //   h2, h4 {
            //     text-align: right;
            //   }

            //   h2 {
            //     &:after {
            //       left: auto;
            //       right: 0;
            //     }
            //   }

            //   h4 {
            //     position: relative;
            //     right: 20px;
            //     margin: 0 0 20px 0;
            //     padding: 0 20px 0 0;
            //     border-right: 2px solid $color-grey;
            //   }

            //   .img {
            //     margin: 0 0 0 40px;
            //   }
            // }
          }

          .about {
            width: calc(100% - 265px);

            h2 {
              font-size: 24px;
              margin: 0 0 20px 0;

              &:after {
                background-color: $color-blue;
              }
            }

            h4 {
              color: lighten($text-color, 20%);
              // font-weight: $weight-semi-bold;
              font-size: 20px;
              letter-spacing: 1px;
              text-transform: uppercase;
            }
          }
        }
      }

      // strong {
      //   display: inline-block;
      //   min-width: 350px;
      //   letter-spacing: .5px;
      //   text-transform: uppercase;
      //   color: lighten($text-color, 20%);
      //   font-size: 16px;
      // }

      svg {
        color: $color-silver;
        width: 50px;
        height: 50px;
        margin: 0 40px 0 0;
      }

      table {
        width: 100%;


        tbody {
          tr {
            th, td {
              padding: 20px 15px;
              text-align: left;
              letter-spacing: .5px;
              font-weight: $weight-semi-bold;

              small {
                font-weight: $weight-normal;
              }
            }

            th {
              width: 450px;
              color: lighten($text-color, 20%);
            }

            td {
              color: lighten($text-color, 10%);
            }
          }
        }
      }

      // ul {
      //   // background-color: red;
      //   width: 100%;

      //   li {
      //     letter-spacing: .5px;
      //     font-weight: $weight-semi-bold;
      //     color: lighten($text-color, 10%);
      //     margin: 0;
      //     padding: 20px 15px;
      //     border-bottom: 1px solid lighten($color-grey, 5%);

      //     &:first-child {
      //       padding: 0 15px 20px 15px;
      //     }

      //     &:nth-child(even) {
      //       background-color: rgba($color-cloud, 0.3);
      //     }

      //     // &:last-of-type {
      //     //   border-bottom: none;
      //     // }
      //   }
      // }
    }
  }

  .overview {
    z-index: 1;
    position: relative;
    top: -40px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    color: white;
    letter-spacing: .5px;

    h4 {
      margin: 0 0 15px 0;
    }

    .badge {
      svg {
        width: 15px;
        margin: 0 10px 0 0;
      }

      &.inside {
        background-color: $color-green;
      }

      &.outside {
        background-color: $color-vermilion;
      }
    }

    .row {
      .container {
        display: flex;
        justify-content: space-between;
      }

      &:first-of-type {
        border-top: 1px solid $color-grey-dark;
        background-color: white;
        color: $text-color;

        div {
          display: flex;
          align-items: center;
        }
      }

      &:nth-of-type(2) {
        padding: 25px 0;
        background-color: $color-blue;
        // background-image: -webkit-linear-gradient(rgba($color-blue, 0), rgba($color-blue, 0.5));
        // background-image: linear-gradient(rgba($color-blue, 0), rgba($color-blue, 0.5));
        // -webkit-animation-duration: 7s;
        // -moz-animation-duration: 7s;
        // animation-duration: 7s;
        // -webkit-animation-iteration-count: infinite;
        // -moz-animation-iteration-count: infinite;
        // animation-iteration-count: infinite;
        // -webkit-animation-name: solidColor;
        // -moz-animation-name: solidColor;
        // animation-name: solidColor;
        // background-blend-mode: multiply;
        // background-repeat: no-repeat;
        // background-attachment: fixed;

        // @-webkit-keyframes solidColor {
        //   0%    { background-color: lighten($color-blue, 15%); }
        //   50%   { background-color: $color-blue; }
        //   100%  { background-color: lighten($color-blue, 15%); }
        // }

        // @-moz-keyframes solidColor {
        //   0%    { background-color: $color-blue-light; }
        //   50%   { background-color: $color-blue; }
        //   100%  { background-color: $color-blue-light; }
        // }

        // @keyframes solidColor {
        //   0%    { background-color: lighten($color-blue, 15%); }
        //   50%   { background-color: $color-blue; }
        //   100%  { background-color: lighten($color-blue, 15%); }
        // }
        p {
          color: white;

          strong {
            &:nth-child(2n) {
              margin: 0 0 0 10px;
            }
          }
        }
      }
    }

    .weather {
      display: flex;
      align-items: center;

      img {
        width: 50px;
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