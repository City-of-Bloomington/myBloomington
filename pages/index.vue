<template>
  <div class="homepage">
    <div v-if="!loading" class="container">
      <template v-if="!isMobile">
        <h1>Welcome,</h1>
      </template>

      <template v-else>
        <template v-if="!autoSuggestRes">
          <h1>Welcome,</h1>
          <h2><span class="hi-lite">myBloomington</span> provides information related to a given Street Address.</h2>
        </template>
      </template>

      <h3><strong>Enter an Address</strong> to learn more:</h3>

      <fn1-alert
        v-if="searchEnteredWarning"
        variant="warning" >
        <p>Please select an <strong>Address</strong> below.</p>
      </fn1-alert>

      <div class="form-wrapper">
        <form
          @submit.prevent
          @keyup.enter="searchEntered()">
          <exampleSearch
            v-model="addressSearchAuto"
            v-on:focusd="sFocus()"
            v-on:blurd="sBlur()"
            placeholder="401 N Morton St"
            ref="addressSearch"
            name="address-search"
            id="address-search" />
        </form>

        <template v-if="!isMobile">
          <ul v-if="(autoSuggestRes && searchHasFocus) || (autoSuggestRes && searchResultsFocus) || keyDownFocus"
            v-click-outside="suggestionBlur"
            ref="addressSearchResults"
            tabindex="-1">
            <template v-if="autoSuggestRes.length > 1">
              <li v-for="a, i in autoSuggestRes"
                  :key="i"
                  tabindex="-1"
                  @click.prevent="addressChoice(a)">
                <a
                  href="#"
                  tabindex="0"
                  v-on:focus="suggestionFocus(i)">
                  {{ a.streetAddress }}

                  <fn1-badge :class="['jurisdiction-check', {'inside': a.jurisdiction_name === 'Bloomington', 'outside': a.jurisdiction_name != 'Bloomington'}]">
                    <template v-if="a.jurisdiction_name === 'Bloomington'">
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-check fa-w-16 fa-3x"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" class=""></path></svg>
                      Inside
                    </template>

                    <template v-else>
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" class="svg-inline--fa fa-times fa-w-11 fa-3x"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" class=""></path></svg>
                      Outside
                    </template>
                    Bloomington City Limits
                  </fn1-badge>
                </a>
              </li>
            </template>

            <template v-else>
              <li @click.prevent="addressChoice(autoSuggestRes)"
                  tabindex="-1">
                <a
                  href="#"
                  tabindex="0"
                  v-on:focus="suggestionFocus()">
                  {{ autoSuggestRes.streetAddress }}
                  <fn1-badge :class="['jurisdiction-check', {'inside': autoSuggestRes.jurisdiction_name === 'Bloomington', 'outside': autoSuggestRes.jurisdiction_name != 'Bloomington'}]">
                    <template v-if="autoSuggestRes.jurisdiction_name === 'Bloomington'">
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-check fa-w-16 fa-3x"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" class=""></path></svg>
                      Inside
                    </template>

                    <template v-else>
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" class="svg-inline--fa fa-times fa-w-11 fa-3x"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" class=""></path></svg>
                      Outside
                    </template>
                    Bloomington City Limits
                  </fn1-badge>
                </a>
              </li>
            </template>
          </ul>
        </template>

        <template v-else>
          <ul v-if="autoSuggestRes"
            v-click-outside="suggestionBlur"
            ref="addressSearchResults"
            tabindex="-1">
            <template v-if="autoSuggestRes.length > 1">
              <li v-for="a, i in autoSuggestRes"
                  :key="i"
                  tabindex="-1"
                  @click.prevent="addressChoice(a)">
                <a
                  href="#"
                  tabindex="0"
                  v-on:focus="suggestionFocus(i)">
                  {{ a.streetAddress }}

                  <fn1-badge :class="['jurisdiction-check', {'inside': a.jurisdiction_name === 'Bloomington', 'outside': a.jurisdiction_name != 'Bloomington'}]">
                    <template v-if="a.jurisdiction_name === 'Bloomington'">
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-check fa-w-16 fa-3x"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" class=""></path></svg>
                    </template>

                    <template v-else>
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" class="svg-inline--fa fa-times fa-w-11 fa-3x"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" class=""></path></svg>
                    </template>
                  </fn1-badge>
                </a>
              </li>
            </template>

            <template v-else>
              <li @click.prevent="addressChoice(autoSuggestRes)"
                  tabindex="-1">
                <a
                  href="#"
                  tabindex="0"
                  v-on:focus="suggestionFocus()">
                  {{ autoSuggestRes.streetAddress }}
                  <fn1-badge :class="['jurisdiction-check', {'inside': autoSuggestRes.jurisdiction_name === 'Bloomington', 'outside': autoSuggestRes.jurisdiction_name != 'Bloomington'}]">
                    <template v-if="autoSuggestRes.jurisdiction_name === 'Bloomington'">
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-check fa-w-16 fa-3x"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" class=""></path></svg>
                    </template>

                    <template v-else>
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" class="svg-inline--fa fa-times fa-w-11 fa-3x"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" class=""></path></svg>
                    </template>
                  </fn1-badge>
                </a>
              </li>
            </template>
          </ul>
        </template>
      </div>

      <div class="disclaimer">
        <div class="folks">
          <div class="row">
            <h4>Mayor &amp; Clerk</h4>
            <a :href="folks.officials.mayor.url"
               :alt="`Mayor - ${folks.officials.mayor.name}`"
               :title="`Mayor - ${folks.officials.mayor.name}`"
               target="_blank">
              <div
                class="headshot"
                :style="`background-image: url(${folks.officials.mayor.image});`"></div>
            </a>

            <a :href="folks.officials.clerk.url"
               :alt="`Clerk - ${folks.officials.clerk.name}`"
               :title="`Clerk - ${folks.officials.clerk.name}`"
               target="_blank">
              <div
                class="headshot"
                :style="`background-image: url(${folks.officials.clerk.image});`"></div>
            </a>
          </div>

          <div class="row">
            <h4>City Council</h4>

            <a :href="folks.district[4].url"
               :alt="`Council Member - ${folks.district[4].name}`"
               :title="`Council Member - ${folks.district[4].name}`"
               target="_blank">
              <div
                class="headshot"
                :style="`background-image: url(${folks.district[4].image});`"></div>
            </a>

            <a :href="folks.district[2].url"
               :alt="`Council Member - ${folks.district[2].name}`"
               :title="`Council Member - ${folks.district[2].name}`"
               target="_blank">
              <div
                class="headshot"
                :style="`background-image: url(${folks.district[2].image});`"></div>
            </a>


            <a :href="folks.district[6].url"
               :alt="`Council Member - ${folks.district[6].name}`"
               :title="`Council Member - ${folks.district[6].name}`"
               target="_blank">
              <div
                class="headshot"
                :style="`background-image: url(${folks.district[6].image});`"></div>
            </a>

            <a :href="folks.council[2].url"
               :alt="`Council Member - ${folks.council[2].name}`"
               :title="`Council Member - ${folks.council[2].name}`"
               target="_blank">
              <div
                class="headshot"
                :style="`background-image: url(${folks.council[2].image});`"></div>
            </a>

            <a :href="folks.council[1].url"
               :alt="`Council Member - ${folks.council[1].name}`"
               :title="`Council Member - ${folks.council[1].name}`"
               target="_blank">
              <div
                class="headshot"
                :style="`background-image: url(${folks.council[1].image});`"></div>
            </a>

            <a :href="folks.council[3].url"
               :alt="`Council Member - ${folks.council[3].name}`"
               :title="`Council Member - ${folks.council[3].name}`"
               target="_blank">
              <div
                class="headshot"
                :style="`background-image: url(${folks.council[3].image});`"></div>
            </a>

            <a :href="folks.district[1].url"
               :alt="`Council Member - ${folks.district[1].name}`"
               :title="`Council Member - ${folks.district[1].name}`"
               target="_blank">
              <div
                class="headshot"
                :style="`background-image: url(${folks.district[1].image});`"></div>
            </a>

            <a :href="folks.district[3].url"
               :alt="`Council Member - ${folks.district[3].name}`"
               :title="`Council Member - ${folks.district[3].name}`"
               target="_blank">
              <div
                class="headshot"
                :style="`background-image: url(${folks.district[3].image});`"></div>
            </a>

            <a :href="folks.district[5].url"
               :alt="`Council Member - ${folks.district[5].name}`"
               :title="`Council Member - ${folks.district[5].name}`"
               target="_blank">
              <div
                class="headshot"
                :style="`background-image: url(${folks.district[5].image});`"></div>
            </a>
          </div>
        </div>
        <p>&#9426; {{ currentYear }} - {{ cityName }}</p>
      </div>

      <div class="map-container-wrapper">
        <svg id="map-shape" xmlns="http://www.w3.org/2000/svg" width="650" height="705" viewBox="0 0 650 705">
          <path id="path-fill" d="M655.255,51.46305a146.64783,146.64783,0,0,0-243.52691,110.089l-.483,36.59674a88.5,88.5,0,0,1-88.5,88.5h-79a88.5,88.5,0,0,0-88.5,88.5c0,19.56328,7.66667,32,16.375,52.3125l2.12827,4.4403a192.72059,192.72059,0,0,1,19.49673,84.7472c0,106.8671-86.6329,193.5-193.5,193.5V-.93848H652.25048V48.89573Z" fill="#1e5aae"/>
          <path id="path-stroke" d="M652.25048,48.89573l3.00448,2.56732a146.64783,146.64783,0,0,0-243.52691,110.089l-.483,36.59674a88.5,88.5,0,0,1-88.5,88.5h-79a88.5,88.5,0,0,0-88.5,88.5c0,19.56328,7.66667,32,16.375,52.3125l2.12827,4.4403a192.72059,192.72059,0,0,1,19.49673,84.7472c0,106.8671-86.6329,193.5-193.5,193.5" fill="none" stroke="" stroke-miterlimit="" stroke-width=""/>
        </svg>


        <GmapMap
          :center="cityHallLatLong"
          :zoom="13"
          ref="placeholderMap"
          map-type-id="roadmap"
          :style="`width: 650px; height: 705px;`"
          :options="{
            zoomControl:        false,
            mapTypeControl:     false,
            scaleControl:       false,
            streetViewControl:  false,
            rotateControl:      false,
            fullscreenControl:  false,
            disableDefaultUi:   false,
            draggable:          false,
            styles: [
              {
                featureType:    'poi',
                stylers: [
                  {
                    visibility: 'off'
                  }
                ]
              },
              {
                featureType:    'poi.medical',
                stylers: [
                  {
                    visibility: 'off'
                  }
                ]
              },
              {
                featureType:    'poi.government',
                stylers: [
                  {
                    visibility: 'off'
                  }
                ]
              }
            ]
          }">

          <GmapPolygon
            v-if="cityBoundary"
            :paths="cityBoundary"
            :options="{
              strokeColor:    'rgb(30, 90, 174)',
              strokeOpacity:  0.8,
              strokeWeight:   2,
              fillColor:      'rgb(30, 90, 174)',
              fillOpacity:    0.15
            }"
          />
        </GmapMap>
      </div>
    </div>

    <!-- <div v-else>
      <h1>Loading</h1>
    </div> -->

    <exampleModal
      id="address-mapped-error-modal"
      ref="addressMappedErrorModal"
      title="Address Not Mapped">

      <fn1-alert
        slot="body"
        variant="warning">
        <p><strong>We Apologize -</strong></p>

        <template v-if="errors.addressNotMapped != null">
          <p><strong>Address:</strong></p>
          <blockquote>
            {{ errors.addressNotMapped.streetAddress }}<br>
            {{ errors.addressNotMapped.city }}
            {{ errors.addressNotMapped.state }},
            {{ errors.addressNotMapped.zip }}

            <fn1-badge :class="['jurisdiction-check', {'inside': errors.addressNotMapped.jurisdiction_name === 'Bloomington', 'outside': errors.addressNotMapped.jurisdiction_name != 'Bloomington'}]">
              <template v-if="errors.addressNotMapped.jurisdiction_name === 'Bloomington'">
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-check fa-w-16 fa-3x"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" class=""></path></svg>
                Inside
              </template>

              <template v-else>
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" class="svg-inline--fa fa-times fa-w-11 fa-3x"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" class=""></path></svg>
                Outside
              </template>
              Bloomington City Limits
            </fn1-badge>
          </blockquote>
        </template>

        <p>Is in our database, but has yet to be mapped.</p>
      </fn1-alert>

      <fn1-button
        slot="footer"
        title="Ok"
        ref="addressMappedErrorModalCloseBtn"
        @click.native="closeModal('addressMappedErrorModal')">
        Close
      </fn1-button>
    </exampleModal>
  </div>
</template>

<script>
import axios           from 'axios'
import { mapFields }   from 'vuex-map-fields'
import proj4           from 'proj4'
import debounce        from 'lodash.debounce'
import exampleSearch   from '~/components/exampleSearch'
import exampleModal    from '~/components/exampleModal'

export default {
  components: {
    exampleSearch,
    exampleModal,
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      let addressQueryParam = to.query.address;
      if(addressQueryParam){
        vm.addressSearchAuto = addressQueryParam;
        vm.searchSubmit(addressQueryParam);
      } else {
        vm.$router.push('Home')
      }
    });
  },
  data() {
    // data shared via: universal-methods.js
    return {}
  },
  created() {
    this.$nextTick(() => {
      this.loading = true;
    });

    this.getCityBoundaryGeoJson()
    .then((res) => {
      this.setCityBoundary(res);
      console.log(`%c getCityBoundaryGeoJson 👌`,
                  this.consoleLog.success);
    })
    .catch((e) => {
      console.log(`City Boundary Failed 🛑`,
                  this.consoleLog.error
                  `\n\n ${e} \n\n`);
    });

    this.getWeather()
    .then((res) => {
      this.$store.dispatch('setWeatherData', res);
      console.log(`%c getWeather 👌`,
                  this.consoleLog.success);
    })
    .catch((e) => {
      console.log(`getWeather Failed 🛑`,
                  this.consoleLog.error
                  `\n\n ${e} \n\n`);
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.loading = false;
    });
  },
  updated() {
    // this.$nextTick(() => {
    // // this causes woes for tab-accessibility result selection
    //   this.$refs.addressSearch.$el.children[0].focus();
    // });
  },
  watch:    {
    $route: function (to, from) {
      let addressToQueryParam   = to.query.address,
          addressFromQueryParam = from.query.address;

      if(addressToQueryParam !== addressFromQueryParam){
        this.addressSearchAuto = addressToQueryParam;
        this.searchSubmit(addressToQueryParam);
      }
    }
  },
  computed: {},
  methods:  {}
}
</script>

<style lang="scss" scoped>
  .homepage {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    background-color: $color-blue;
    height: calc(100vh - 89px); // 89 = header height
    padding: 100px 0 0 0;

    .container {
      z-index: 100;
    }

    h1, h2, h3 {
      color: white;
    }

    h1, h2 {

    }

    h1 {
      font-size: 80px;
      font-weight: 600;
      margin: 0 0 30px 0;
    }

    h2 {
      line-height: 55px;
      font-weight: 500;
      font-style: italic;
      margin: 0 0 15px 0;

      .hi-lite {
        z-index: 1;
        position: relative;
        background-color: white;
        color: $color-blue;
        font-weight: 600;
        padding: 5px 15px;
      }
    }

    .alert {
      margin: 15px 0 0 0;
    }

    .disclaimer {
      z-index: 1;
      position: absolute;
      bottom: 20px;

      p {
        font-weight: $weight-semi-bold;
        color: rgba(white, 0.6);
      }
    }

    .folks {
      margin: 0 0 10px 0;

      h4 {
        text-transform: uppercase;
        font-size: 18px;
        letter-spacing: .5px;
        font-weight: $weight-semi-bold;
        color: rgba(white, 0.6);
        margin: 0;
      }

      .row {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;

        &:hover {
          h4 {
            color: white;
          }
        }

        &:nth-of-type(1) {
          margin: 0 0 20px 0;

          .headshot {
            width: 65px;
            height: 65px;

            &:after {
              width: 65px;
              height: 65px;
            }
          }
        }

        &:nth-of-type(2) {
          margin: 0 0 40px 0;

          .headshot {
            width: 50px;
            height: 50px;

            &:after {
              width: 50px;
              height: 50px;
            }
          }
        }
      }

      a {
        border-radius: 50%;
        margin: 0 20px 0 0;

        &:focus {
          outline: none;
          box-shadow: 0 2px 1px 2px white;
        }

        &:last-of-type {
          margin: 0;
        }
      }

      .headshot {
        position: relative;
        display: block;
        margin: 0;
        border-radius: 50%;
        border: 1px solid $color-blue-darker;
        background-position: top center;
        background-repeat: no-repeat;
        background-size: cover;

        &:after {
          z-index: -1;
          position: absolute;
          content: '';
          left: -2px;
          bottom: -5px;
          display: block;
          border-radius: 50%;
          background-color: darken($color-blue-darker, 5%);
        }
      }
    }

    .map-container-wrapper {
      z-index: 0;
      position: absolute;
      bottom: 0;
      right: 0;
      width: 650px;
      height: 705px;
      background-color: white;
      overflow: hidden;

      svg {
        z-index: 1;
        position: absolute;
        content: '';
        width: 650px;
        height: 705px;

        #path-stroke {
          fill: none;
          // stroke: $color-blue-darker;
          stroke: white;
          stroke-width: 10px;
          // stroke-dasharray: 50;
          // stroke-dashoffset: 150;
          // animation-fill-mode: forwards;
          // animation: move 1s infinite;

          // @keyframes move {
          //   0% {
          //     stroke-dashoffset: 0;
          //   }
          //   100% {
          //     stroke-dashoffset: 150;
          //   }
          // }
        }
      }
    }

    .form-wrapper {
      margin: 15px 0 0 0;

      form {
        ::v-deep input {
          padding: 10px 20px;
          font-size: 30px;
        }
      }

      ul {
        z-index: 100;
        position: relative;
        top: 0;
        width: 100%;
        box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.40);
      }
    }
  }

  @media (max-width: 575px) {
    .homepage {
      padding: 20px 0 0 0;

      .container {
        padding: 0 20px;
      }

      h1 {
        font-size: 40px;
        margin: 0 0 15px 0;
      }

      h2 {
        font-size: 20px;
        line-height: 40px;

        .hi-lite {
          padding: 5px;
        }
      }

      h3 {
        font-size: 20px;
      }

      .form-wrapper {
        ::v-deep form {
          input {
            font-size: 18px;
          }
        }
      }
    }

    .folks,
    .map-container-wrapper {
      display: none;
    }
  }

  @media (min-width: 576px) and (max-width: 767px) {

  }

  @media (min-width: 768px) and (max-width: 991px) {

  }
</style>