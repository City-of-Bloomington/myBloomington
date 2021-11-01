<template>
  <div class="homepage">
    <div v-if="!loading" class="container">
      <span
        :class="[{'hide-viewport-small': autoSuggestRes }]">
        <h1>Welcome,</h1>
        <h2><span class="hi-lite">myBloomington</span> provides information related to a given Street Address.</h2>
      </span>

      <h3>
        <strong>
          <span v-if="!autoSuggestRes">
            Enter
          </span>
          <span v-if="autoSuggestRes">
            Select
          </span>an Address
        </strong> to learn more:
      </h3>

      <div
        :class="['badge-legend', {'show-viewport-small': autoSuggestRes }]">
        <fn1-badge class="jurisdiction-check inside">
          <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-check fa-w-16 fa-3x"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" class=""></path></svg>
            Inside City Limits
        </fn1-badge>

        <fn1-badge class="retired-check">
          <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="exclamation" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512" class="svg-inline--fa fa-exclamation fa-w-6 fa-3x"><path fill="currentColor" d="M176 432c0 44.112-35.888 80-80 80s-80-35.888-80-80 35.888-80 80-80 80 35.888 80 80zM25.26 25.199l13.6 272C39.499 309.972 50.041 320 62.83 320h66.34c12.789 0 23.331-10.028 23.97-22.801l13.6-272C167.425 11.49 156.496 0 142.77 0H49.23C35.504 0 24.575 11.49 25.26 25.199z" class=""></path></svg>
            Address Retired
        </fn1-badge>

        <fn1-badge class="jurisdiction-check outside">
          <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" class="svg-inline--fa fa-times fa-w-11 fa-3x"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" class=""></path></svg>
            Outside City Limits
        </fn1-badge>
      </div>

      <fn1-alert
        v-if="searchEnteredWarning"
        variant="warning">
        <p>Please select an <strong>Address</strong> below.</p>
      </fn1-alert>

      <fn1-alert
        v-if="errors.addressRes && addressSearchAuto"
        variant="warning">
        <p>{{errors.addressRes}}</p>
      </fn1-alert>

      <div class="form-wrapper">
        <form
          @submit.prevent
          @keyup.enter="searchEntered()">
          <label for="address-search" class="sr-only">Address Search</label>
          <exampleSearch
            v-model="addressSearchAuto"
            v-on:focusd="sFocus()"
            v-on:blurd="sBlur()"
            placeholder="401 N Morton St"
            ref="addressSearch"
            name="address-search"
            id="address-search" />
        </form>

        <mq-layout :mq="['med', 'lrg']">
          <ul
            v-if="(autoSuggestRes && searchHasFocus) || (autoSuggestRes && searchResultsFocus) || keyDownFocus"
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

                  <div class="badge-wrapper">
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

                    <fn1-badge
                      v-if="a.status === 'retired'"
                      class="retired-check">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="exclamation" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512" class="svg-inline--fa fa-exclamation fa-w-6 fa-3x"><path fill="currentColor" d="M176 432c0 44.112-35.888 80-80 80s-80-35.888-80-80 35.888-80 80-80 80 35.888 80 80zM25.26 25.199l13.6 272C39.499 309.972 50.041 320 62.83 320h66.34c12.789 0 23.331-10.028 23.97-22.801l13.6-272C167.425 11.49 156.496 0 142.77 0H49.23C35.504 0 24.575 11.49 25.26 25.199z" class=""></path></svg>
                        Address Retired
                    </fn1-badge>
                  </div>
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

                  <div class="badge-wrapper">
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

                    <fn1-badge
                      v-if="autoSuggestRes.status === 'retired'"
                      class="retired-check">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="exclamation" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512" class="svg-inline--fa fa-exclamation fa-w-6 fa-3x"><path fill="currentColor" d="M176 432c0 44.112-35.888 80-80 80s-80-35.888-80-80 35.888-80 80-80 80 35.888 80 80zM25.26 25.199l13.6 272C39.499 309.972 50.041 320 62.83 320h66.34c12.789 0 23.331-10.028 23.97-22.801l13.6-272C167.425 11.49 156.496 0 142.77 0H49.23C35.504 0 24.575 11.49 25.26 25.199z" class=""></path></svg>
                        Address Retired
                    </fn1-badge>
                  </div>
                </a>
              </li>
            </template>
          </ul>
        </mq-layout>

        <mq-layout mq="sm">
          <ul
            v-if="autoSuggestRes"
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

                  <div class="badge-wrapper">
                    <fn1-badge :class="['jurisdiction-check mobile-result', {'inside': a.jurisdiction_name === 'Bloomington', 'outside': a.jurisdiction_name != 'Bloomington'}]">
                      <template v-if="a.jurisdiction_name === 'Bloomington'">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-check fa-w-16 fa-3x"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" class=""></path></svg>
                      </template>

                      <template v-else>
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" class="svg-inline--fa fa-times fa-w-11 fa-3x"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" class=""></path></svg>
                      </template>
                    </fn1-badge>

                    <fn1-badge
                      v-if="a.status === 'retired'"
                      class="retired-check mobile-result">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="exclamation" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512" class="svg-inline--fa fa-exclamation fa-w-6 fa-3x"><path fill="currentColor" d="M176 432c0 44.112-35.888 80-80 80s-80-35.888-80-80 35.888-80 80-80 80 35.888 80 80zM25.26 25.199l13.6 272C39.499 309.972 50.041 320 62.83 320h66.34c12.789 0 23.331-10.028 23.97-22.801l13.6-272C167.425 11.49 156.496 0 142.77 0H49.23C35.504 0 24.575 11.49 25.26 25.199z" class=""></path></svg>
                    </fn1-badge>
                  </div>
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

                  <div class="badge-wrapper">
                    <fn1-badge :class="['jurisdiction-check mobile-result', {'inside': autoSuggestRes.jurisdiction_name === 'Bloomington', 'outside': autoSuggestRes.jurisdiction_name != 'Bloomington'}]">
                      <template v-if="autoSuggestRes.jurisdiction_name === 'Bloomington'">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-check fa-w-16 fa-3x"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" class=""></path></svg>
                      </template>

                      <template v-else>
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" class="svg-inline--fa fa-times fa-w-11 fa-3x"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" class=""></path></svg>
                      </template>
                    </fn1-badge>

                    <fn1-badge
                      v-if="autoSuggestRes.status === 'retired'"
                      class="retired-check mobile-result">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="exclamation" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512" class="svg-inline--fa fa-exclamation fa-w-6 fa-3x"><path fill="currentColor" d="M176 432c0 44.112-35.888 80-80 80s-80-35.888-80-80 35.888-80 80-80 80 35.888 80 80zM25.26 25.199l13.6 272C39.499 309.972 50.041 320 62.83 320h66.34c12.789 0 23.331-10.028 23.97-22.801l13.6-272C167.425 11.49 156.496 0 142.77 0H49.23C35.504 0 24.575 11.49 25.26 25.199z" class=""></path></svg>
                    </fn1-badge>
                  </div>
                </a>
              </li>
            </template>
          </ul>
        </mq-layout>
      </div>

      <div class="disclaimer">
        <div class="folks">
          <div class="row">
            <h4>Mayor &amp; Clerk</h4>
            <homepageHeadshot 
              :title="folks.officials.mayor.title"
              :name="folks.officials.mayor.name"
              :href="folks.officials.mayor.url"
              :image="folks.officials.mayor.image" />

            <homepageHeadshot 
              :title="folks.officials.clerk.title"
              :name="folks.officials.clerk.name"
              :href="folks.officials.clerk.url"
              :image="folks.officials.clerk.image" />
          </div>

          <div class="row">
            <h4>City Council</h4>
            <homepageHeadshot 
              :title="folks.district[4].title"
              :name="folks.district[4].name"
              :href="folks.district[4].url"
              :image="folks.district[4].image" />
            
            <homepageHeadshot 
              :title="folks.district[2].title"
              :name="folks.district[2].name"
              :href="folks.district[2].url"
              :image="folks.district[2].image" />
            
            <homepageHeadshot 
              :title="folks.district[6].title"
              :name="folks.district[6].name"
              :href="folks.district[6].url"
              :image="folks.district[6].image" />

            <homepageHeadshot 
              :title="folks.council[2].title"
              :name="folks.council[2].name"
              :href="folks.council[2].url"
              :image="folks.council[2].image" />

            <homepageHeadshot 
              :title="folks.council[1].title"
              :name="folks.council[1].name"
              :href="folks.council[1].url"
              :image="folks.council[1].image" />

            <homepageHeadshot 
              :title="folks.council[3].title"
              :name="folks.council[3].name"
              :href="folks.council[3].url"
              :image="folks.council[3].image" />

            <homepageHeadshot 
              :title="folks.district[1].title"
              :name="folks.district[1].name"
              :href="folks.district[1].url"
              :image="folks.district[1].image" />

            <homepageHeadshot 
              :title="folks.district[3].title"
              :name="folks.district[3].name"
              :href="folks.district[3].url"
              :image="folks.district[3].image" />
            
            <homepageHeadshot 
              :title="folks.district[5].title"
              :name="folks.district[5].name"
              :href="folks.district[5].url"
              :image="folks.district[5].image" />
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
          :title="cityName"
          tabindex="-1"
          :center="cityHallLatLong"
          :zoom="12"
          ref="placeholderMap"
          map-type-id="roadmap"
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
            v-if="cityBoundary && cityBoundary.length"
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

    <exampleModal
      v-show="modals.addressMappedError"
      id="address-mapped-error-modal"
      ref="addressMappedErrorModal"
      title="Address Not Mapped">

      <fn1-alert
        v-if="errors.addressNotMapped != null"
        slot="body"
        variant="warning">

        <p><strong>We Apologize -</strong></p>
        <p><strong>Address:</strong></p>
        <blockquote>
          {{ errors.addressNotMapped.streetAddress }}<br>
          {{ errors.addressNotMapped.city }}
          {{ errors.addressNotMapped.state }},
          {{ errors.addressNotMapped.zip }}
        </blockquote>
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

    <exampleModal
      v-show="modals.addressRetiredError"
      id="address-retired-error-modal"
      ref="addressRetiredErrorModal"
      title="Address Retired">

      <div slot="body">
        <p>This address is currently retired.</p>
      </div>

      <fn1-button
        slot="footer"
        title="Ok"
        ref="addressRetiredErrorModalCloseBtn"
        @click.native="closeModal('addressRetiredErrorModal')">
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
import homepageHeadshot     from '~/components/homepageHeadshot'

export default {
  components: {
    exampleSearch,
    exampleModal,
    homepageHeadshot
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      let addressQueryParam = to.query.address;
      if(addressQueryParam){
        vm.addressSearchAuto = addressQueryParam;
        vm.searchSubmit(addressQueryParam);
      }
    });
  },
  async fetch(){
    await this.getCityBoundaryGeoJson()
    .then((res) => {
      this.setCityBoundary(res);
      console.log(`%c getCityBoundaryGeoJson 🔌`,
                  this.consoleLog.success);
    })
    .catch((e) => {
      console.log(`City Boundary Failed 🛑`,
                  this.consoleLog.error
                  `\n\n ${e} \n\n`);
    });

    await this.getWeather()
    .then((res) => {
      this.$store.dispatch('setWeatherData', res);
      console.log(`%c getWeather 🔌`,
                  this.consoleLog.success);
    })
    .catch((e) => {
      console.log(`getWeather Failed 🛑`,
                  this.consoleLog.error
                  `\n\n ${e} \n\n`);
    });
  },
  data() {
    // data shared via: universal-methods.js
    return {}
  },
  created: function() {
    this.$nextTick(() => {
      this.loading = true;
    });
  },
  mounted: function() {
    this.$nextTick(() => {
      this.loading = false;
    });
  },
  // watch:    {
  //   $route: function (to, from) {
  //     let addressToQueryParam   = to.query.address,
  //         addressFromQueryParam = from.query.address;

  //     if(addressToQueryParam !== addressFromQueryParam){
  //       this.addressSearchAuto = addressToQueryParam;
  //       this.searchSubmit(addressToQueryParam);
  //     } else {
  //       this.$router.replace('index');
  //     }
  //   }
  // },
}
</script>

<style lang="scss" scoped>
  .homepage {
    top: 94px;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    background-color: $color-blue;
    height: calc(100vh - 94px); // 100 = header height
    padding: 50px 20px 0 20px;

    .container {
      z-index: 100;
    }

    h1, h2, h3 {
      color: white;
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
        }

        &:nth-of-type(2) {
          margin: 0 0 40px 0;
          max-width: 700px;
        }

        ::v-deep span {
          &:last-child {
            a {
              margin: 0 0 0 0;
            }
          }
        }
      } 
    }

    .map-container-wrapper {
      z-index: 0;
      position: absolute;
      bottom: 0;
      right: 0;
      width: 350px;
      height: 380px;
      background-color: white;
      overflow: hidden;

      .vue-map-container {
        width: 350px;
        height: 380px;
      }

      svg {
        z-index: 1;
        position: absolute;
        content: '';
        width: 350px;
        height: 380px;

        #path-stroke {
          fill: none;
          stroke: white;
          stroke-width: 10px;
        }
      }
    }

    .form-wrapper {
      margin: 15px 0 0 0;

      form {
        ::v-deep input {
          padding: 10px 20px 10px 50px;
          font-size: 30px;
          background-size: 30px;
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

  @media (max-height: 777px) {
    .homepage {
      padding: 20px 0 0 0;
      height: calc(100vh - 65px) !important; // 65 = header height

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
        margin: 10px 0 0 0;

        ::v-deep form {
          input {
            font-size: 18px;
            padding: 10px;
            padding-left: 40px;
            background-size: 20px;
          }
        }

        ul {
          li {
            a {
              padding: 10px;
            }
          }
        }
      }
    }

    .folks,
    .map-container-wrapper {
      display: none;
    }
  }

  @media (max-width: 575px) {
    .homepage {
      top: 65px;
      padding: 20px 0 0 0;
      max-height: calc(100vh - 65px) !important; // 65 = header height

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
        margin: 10px 0 0 0;

        ::v-deep form {
          input {
            font-size: 18px;
            padding: 10px;
            padding-left: 40px;
            background-size: 20px;
          }
        }

        ul {
          li {
            a {
              padding: 10px;
            }
          }
        }
      }
    }

    .folks,
    .map-container-wrapper {
      display: none;
    }
  }

  @media (max-device-width: 575px) {
    .homepage {
      top: 65px;
      max-height: calc(100vh - 65px) !important; // 69 = header height
    }
  }

  @media (min-width: 576px) and (max-width: 767px) {
    .homepage {
      top: 65px;
      padding: 20px 0 0 0;
      height: calc(100vh - 65px); // 65 = header height

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
        margin: 10px 0 0 0;

        ::v-deep form {
          input {
            font-size: 18px;
            padding: 10px;
            padding-left: 40px;
            background-size: 20px;
          }
        }

        ul {
          li {
            a {
              padding: 10px;
            }
          }
        }
      }
    }

    .folks,
    .map-container-wrapper {
      display: none;
    }
  }

  @media (min-width: 768px) and (max-width: 991px) {
    .homepage {
      top: 94px;
      padding: 20px 0 0 0;
      height: calc(100vh - 94px); 

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
        margin: 10px 0 0 0;

        ::v-deep form {
          input {
            font-size: 18px;
            padding: 10px;
            padding-left: 40px;
            background-size: 20px;
          }
        }

        ul {
          li {
            a {
              padding: 10px;
            }
          }
        }
      }
    }

    .folks,
    .map-container-wrapper {
      display: none;
    }
  }

  @media (min-width: 992px) and (max-width: 1300px) {
    .homepage {
      .folks {
        .row {
          &:nth-of-type(2) {
            max-width: 600px;

            a {
              margin: 0 10px 10px 0;

              &:nth-child(n+9) {
                margin: 0 10px 0 0;
              }
            }
          }
        }
      }

      .map-container-wrapper {
        z-index: 0;
        position: absolute;
        bottom: 0;
        right: 0;
        width: 350px;
        height: 380px;
        background-color: white;
        overflow: hidden;

        .vue-map-container {
          width: 350px;
          height: 380px;
        }

        svg {
          z-index: 1;
          position: absolute;
          content: '';
          width: 350px;
          height: 380px;
        }
      }
    }
  }
</style>