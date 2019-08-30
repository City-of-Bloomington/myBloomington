<template>
  <div :class="[{'no-location': !locationResData || !addressMapped}]">
    <template v-if="!locationResData || !addressMapped">
      <div class="container">
        <h1>Welcome,</h1>
        <h2><span class="hi-lite">myBloomington</span> provides information related to a given Street Address.</h2>
        <h3><strong>Enter an Address</strong> to learn more:</h3>

        <div class="form-wrapper">
          <form
            @submit.stop.prevent="searchSubmit(addressSearchAuto)">
            <exampleSearch
              v-model="addressSearchAuto"
              :buttonValue="searchIconEncoded"
              v-on:focusd="sFocus()"
              v-on:blurd="sBlur()"
              placeholder="Search an Address - eg: 401 N Morton St"
              ref="addressSearch"
              name="address-search"
              id="address-search" />
          </form>

          <ul v-if="autoSuggestRes && searchHasFocus">
            <template v-if="autoSuggestRes.length > 1">
              <li v-for="a, i in autoSuggestRes"
                  @click.prevent="addressChoice(a)">
                <a href="#">
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
              <li @click.prevent="addressChoice(autoSuggestRes)">
                <a href="#">
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
              v-if="bloomingtonBoundaryPaths"
              :paths="bloomingtonBoundaryPaths"
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
    </template>

    <template v-if="locationResData && addressMapped">
      <!-- <gmap-street-view-panorama
          style="width: 100%; height: 600px"
          ref="streetViewRef"
          :position="latLong"
          :pov="{heading: 0, pitch: 0}"
          :zoom="0"
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
              }
            ]
          }"
        >
      </gmap-street-view-panorama> -->

      <GmapMap
        :center="latLong"
        :zoom="zoom"
        ref="defaultMap"
        map-type-id="roadmap"
        :style="`width: 100vw; height: ${mapHeight};`"
        :options="{
          zoomControl:        true,
          mapTypeControl:     true,
          scaleControl:       true,
          streetViewControl:  false,
          rotateControl:      false,
          fullscreenControl:  false,
          disableDefaultUi:   true,
          draggable:          true,
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
                  visibility: 'on'
                }
              ]
            },
            {
              featureType:    'poi.government',
              stylers: [
                {
                  visibility: 'on'
                }
              ]
            }
          ]
        }">

        <GmapPolygon
          v-if="bloomingtonBoundaryPaths"
          :paths="bloomingtonBoundaryPaths"
          :options="{
            strokeColor:    'rgb(30, 90, 174)',
            strokeOpacity:  0.8,
            strokeWeight:   2,
            fillColor:      'rgb(30, 90, 174)',
            fillOpacity:    0.15
          }"
        />

        <GmapMarker
          :position="latLong"
          :clickable="false"
          :draggable="false"
        />

        <GmapCluster
          :minimumClusterSize="2">
          <template
            v-for="p, i in nearbyParkMarkers()"
            v-if="mapMarkerToggle.parks">
            <GmapMarker
              :animation="2"
              :label="{text: `${p.name}`, fontFamily: 'IBM Plex Sans,Helvetica,Arial,sans-serif', fontSize: '18px', color: '#337536', fontWeight: '600'}"
              :icon="{url: 'marker-park.svg', labelOrigin: {x: 28, y: 85}}"
              :position="{lat: Number(p.lat), lng: Number(p.lon)}"
              :clickable="false"
              :draggable="false"
            />
          </template>

          <template
            v-for="s, i in nearbySchoolMarkers()"
            v-if="mapMarkerToggle.schools">
            <GmapMarker
              :animation="2"
              :label="{text: `${s.name}`, fontFamily: 'IBM Plex Sans,Helvetica,Arial,sans-serif', fontSize: '18px', color: '#990000', fontWeight: '600'}"
              :icon="{url: 'marker-school.svg', labelOrigin: {x: 28, y: 85}}"
              :position="{lat: Number(s.lat), lng: Number(s.lon)}"
              :clickable="false"
              :draggable="false"
            />
          </template>

          <template
            v-for="p, i in nearbyPlaygroundMarkers()"
            v-if="mapMarkerToggle.playgrounds">
            <GmapMarker
              :animation="2"
              :label="{text: `${p.name}`, fontFamily: 'IBM Plex Sans,Helvetica,Arial,sans-serif', fontSize: '18px', color: '#1e5aae', fontWeight: '600'}"
              :icon="{url: 'marker-playground.svg', labelOrigin: {x: 28, y: 85}}"
              :position="{lat: Number(p.lat), lng: Number(p.lon)}"
              :clickable="false"
              :draggable="false"
            />
          </template>

          <template
            v-for="s, i in nearbySafePlaceMarkers()"
            v-if="mapMarkerToggle.safePlaces">
            <GmapMarker
              :animation="2"
              :label="{text: `${s.gsx$name.$t}`, fontFamily: 'IBM Plex Sans,Helvetica,Arial,sans-serif', fontSize: '18px', color: '#212121', fontWeight: '600'}"
              :icon="{url: 'marker-safe-place.svg', labelOrigin: {x: 28, y: 85}}"
              :position="{lat: Number(s.gsx$lat.$t), lng: Number(s.gsx$lon.$t)}"
              :clickable="false"
              :draggable="false"
            />
          </template>
        </GmapCluster>
      </GmapMap>

      <div class="overview">
        <div class="row">
          <div class="container">
            <div class="form-group inline">
              <fieldset>
                <span>Toggle Map Markers:</span>
                <legend class="sr-only">Toggle Map Markers:</legend>
                <div class="inner-wrapper">
                  <input v-model="mapMarkerToggle.parks"
                         id="parks"
                         value="parks"
                         type="checkbox"
                         name="parks">

                  <label for="parks">Parks</label>
                </div>

                <div class="inner-wrapper">
                  <input v-model="mapMarkerToggle.playgrounds"
                         id="playgrounds"
                         value="playgrounds"
                         type="checkbox"
                         name="playgrounds">

                  <label for="playgrounds">Playgrounds</label>
                </div>

                <div class="inner-wrapper">
                  <input v-model="mapMarkerToggle.safePlaces"
                         id="safePlaces"
                         value="safePlaces"
                         type="checkbox"
                         name="safePlaces">

                  <label for="safePlaces">Safe Places</label>
                </div>

                <div class="inner-wrapper">
                  <input v-model="mapMarkerToggle.schools"
                         id="schools"
                         value="schools"
                         type="checkbox"
                         name="schools">

                  <label for="schools">Schools</label>
                </div>
              </fieldset>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="container">
            <div class="weather" v-if="weather">
                <img :src="`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`"
                     :alt="weather.main">
                <p>
                  <strong>Weather:</strong>
                  {{ weather.weather[0].main }} ~ {{ weather.main.temp }} &#176;F
                </p>
            </div>

            <div>
              <fn1-badge :class="['jurisdiction-check', {'inside': locationResData.address.jurisdiction_name === 'Bloomington', 'outside': locationResData.address.jurisdiction_name != 'Bloomington'}]">
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

            <div v-if="distanceToCityHall">
              <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-pin" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 288 512" class="svg-inline--fa fa-map-pin fa-w-9 fa-3x"><path fill="currentColor" d="M112 316.94v156.69l22.02 33.02c4.75 7.12 15.22 7.12 19.97 0L176 473.63V316.94c-10.39 1.92-21.06 3.06-32 3.06s-21.61-1.14-32-3.06zM144 0C64.47 0 0 64.47 0 144s64.47 144 144 144 144-64.47 144-144S223.53 0 144 0zm0 76c-37.5 0-68 30.5-68 68 0 6.62-5.38 12-12 12s-12-5.38-12-12c0-50.73 41.28-92 92-92 6.62 0 12 5.38 12 12s-5.38 12-12 12z" class=""></path></svg>
              <p>Approx. <strong>{{ distanceToCityHall }} mi</strong> from <strong>City Hall</strong></p>
              <!-- <p>
                <strong>Lat:</strong>
                {{ locationResData.address.latitude }}
                <strong>Lon:</strong>
                {{ locationResData.address.longitude }}
              </p>-->
            </div>
          </div>
        </div>

        <div class="row">
          <div class="container">
            <div class="form-wrapper">
              <form
                @submit.stop.prevent="searchSubmit(addressSearchAuto)">
                <exampleSearch
                  v-model="addressSearchAuto"
                  :buttonValue="searchIconEncoded"
                  v-on:focusd="sFocus()"
                  v-on:blurd="sBlur()"
                  placeholder="Search - eg: 401 N Morton St"
                  ref="addressSearch"
                  name="address-search"
                  id="address-search" />
              </form>

              <ul v-if="autoSuggestRes && searchHasFocus">
                <template v-if="autoSuggestRes.length > 1">
                  <li v-for="a, i in autoSuggestRes"
                      @click.prevent="addressChoice(a)">
                    <a href="#">
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
                  <li @click.prevent="addressChoice(autoSuggestRes)">
                    <a href="#">
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

          <div v-if="addressResChoices" class="row data">
            <header>
              <h2>Select an Address:</h2>

              <blockquote>
                <p><strong>"{{ addressSearch }}"</strong> returned <strong>~{{ addressResChoices.length }} results</strong>.</p>
              </blockquote>
            </header>

            <table class="address-choices">
              <caption class="sr-only">
                Address Search Results
              </caption>
              <thead>
                <tr>
                  <th scope="col">Street</th>
                  <th scope="col">City</th>
                  <th scope="col">State</th>
                  <th scope="col">Zip</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="a, i in addressResChoices"
                    :key="i"
                    @click="addressChoice(a)">
                  <th scope="row">{{a.streetAddress}}</th>
                  <td>{{a.city}}</td>
                  <td>{{ a.state }}</td>
                  <td>{{ a.zip }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- <template v-for="c, i in JSON.parse(folks)">
            {{ c }}
          </template> -->

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
                  <tr v-if="locationResData.address.township_name">
                    <th scope="row">Township:</th>
                    <td>{{ locationResData.address.township_name | capitalizeFirst }}</td>
                  </tr>

                  <template v-if="locationPurposes"
                      v-for="p, i in locationPurposes">
                      <template v-if="p.length > 1">
                        <tr>
                          <th scope="row">
                            {{p[0].purpose_type | capitalizeFirst}}:
                          </th>

                          <td>
                            <ul>
                              <li v-for="e, i in p">
                                {{ e.name | capitalizeFirst }}
                              </li>
                            </ul>
                          </td>
                        </tr>
                      </template>

                      <template v-else>
                        <tr v-for="e, i in p">
                          <th scope="row">
                            {{e.purpose_type | capitalizeFirst}}:
                          </th>
                          <td>
                            <template v-if="e.purpose_type === 'CITY COUNCIL DISTRICT'">
                              <nuxt-link :to="{path: `/?address=${locationResData.address.streetAddress}`, hash: 'districtRep'}">
                                {{e.name | capitalizeFirst}}
                              </nuxt-link>
                            </template>

                            <template v-else-if="e.purpose_type === 'RESIDENTIAL PARKING ZONE'">
                              {{e.name | capitalizeFirst}}<br>
                              <small>
                                - Permit required Monday – Friday, 8:00am – 5:00pm
                              </small>
                            </template>

                            <template v-else>
                              {{e.name | capitalizeFirst}}
                            </template>
                          </td>
                        </tr>
                      </template>
                  </template>
                </tbody>
              </table>
            </div>

            <div class="row data">
              <header>
                <h2>Sanitation Pickup</h2>

                <div>
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-trash fa-w-14 fa-3x"><path fill="currentColor" d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z" class=""></path></svg>

                  <blockquote>
                    <p>Yard waste pickups are between April and December only. Some conditions may cause delays to the schedule. Please see <a href="https://bloomington.in.gov/trash">Trash &amp; Recycling Pickup</a> for details.</p>
                  </blockquote>
                </div>
              </header>

              <template v-if="locationResData.locations[0].trash_day || locationResData.locations[0].recycle_week">
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
                    <tr v-if="locationResData.locations[0].trash_day">
                      <th scope="row">Trash &amp; Recyling:</th>
                      <td>{{ locationResData.locations[0].trash_day | capitalizeFirst }}</td>
                    </tr>

                    <tr v-if="locationResData.locations[0].recycle_week">
                      <th scope="row">Yard Waste:</th>
                      <td>
                        <a :href="trashLink(locationResData.locations[0].recycle_week, locationResData.locations[0].trash_day).url" target="_blank">
                          Week {{ locationResData.locations[0].recycle_week | capitalizeFirst }}
                        </a>

                        <div class="yard-waste-days">
                          <template v-for="d, i in trashLink(locationResData.locations[0].recycle_week, locationResData.locations[0].trash_day).dates">
                            <fn1-badge v-if="yardWasteMomentDate(d)">
                              {{ yardWasteMomentDate(d) }}
                            </fn1-badge>
                          </template>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </template>

              <template v-else>
                <p>Expecting a sanitation pickup? Contact us: <a href="mailto:sanitation@bloomington.in.gov">sanitation@bloomington.in.gov</a></p>
              </template>
            </div>

            <div class="row data">
              <header>
                <h2>Coordinate Details</h2>

                <div>
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="location-arrow" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-location-arrow fa-w-16 fa-3x"><path fill="currentColor" d="M444.52 3.52L28.74 195.42c-47.97 22.39-31.98 92.75 19.19 92.75h175.91v175.91c0 51.17 70.36 67.17 92.75 19.19l191.9-415.78c15.99-38.39-25.59-79.97-63.97-63.97z" class=""></path></svg>

                  <blockquote>
                    <p> The <a href="https://bloomington.in.gov/gis" alt="City of Bloomington GIS">City of Bloomington GIS</a> staff maintains spatial data and provides mapping and spatial analysis services to support operations of City Departments, Boards and Commissions.</p>
                  </blockquote>
                </div>
              </header>

              <table>
                <caption class="sr-only">
                    Address Location Coordinate Details
                  </caption>
                  <thead class="sr-only">
                    <tr>
                      <th scope="col">Type</th>
                      <th scope="col">Day/Week</th>
                    </tr>
                  </thead>

                <tbody>
                  <tr>
                    <th scope="row">Projection:</th>
                    <td>NAD83 / Indiana West (ftUS)</td>
                  </tr>

                  <tr>
                    <th scope="row">Authority:</th>
                    <td>EPSG:2966</td>
                  </tr>

                  <tr v-if="locationResData.address.state_plane_x">
                    <th scope="row">State Plane (x):</th>
                    <td>{{ locationResData.address.state_plane_x }}</td>
                  </tr>

                  <tr v-if="locationResData.address.state_plane_y">
                    <th scope="row">State Plane (y):</th>
                    <td>{{ locationResData.address.state_plane_y }}</td>
                  </tr>

                  <tr v-if="locationResData.address.latitude">
                    <th scope="row">Latitude:</th>
                    <td>{{ locationResData.address.latitude }}</td>
                  </tr>

                  <tr v-if="locationResData.address.longitude">
                    <th scope="row">Longitude:</th>
                    <td>{{ locationResData.address.longitude }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="row data parks" v-if="parksResData">
              <header>
                <h2>City Parks</h2>

                <div>
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="tree" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="svg-inline--fa fa-tree fa-w-12 fa-3x"><path fill="currentColor" d="M378.31 378.49L298.42 288h30.63c9.01 0 16.98-5 20.78-13.06 3.8-8.04 2.55-17.26-3.28-24.05L268.42 160h28.89c9.1 0 17.3-5.35 20.86-13.61 3.52-8.13 1.86-17.59-4.24-24.08L203.66 4.83c-6.03-6.45-17.28-6.45-23.32 0L70.06 122.31c-6.1 6.49-7.75 15.95-4.24 24.08C69.38 154.65 77.59 160 86.69 160h28.89l-78.14 90.91c-5.81 6.78-7.06 15.99-3.27 24.04C37.97 283 45.93 288 54.95 288h30.63L5.69 378.49c-6 6.79-7.36 16.09-3.56 24.26 3.75 8.05 12 13.25 21.01 13.25H160v24.45l-30.29 48.4c-5.32 10.64 2.42 23.16 14.31 23.16h95.96c11.89 0 19.63-12.52 14.31-23.16L224 440.45V416h136.86c9.01 0 17.26-5.2 21.01-13.25 3.8-8.17 2.44-17.47-3.56-24.26z" class=""></path></svg>

                  <blockquote>
                    <p>The <a href="https://bloomington.in.gov/parks" alt="City of Bloomington Parks and Recreation">City of Bloomington Parks and Recreation</a> Department provides essential services, facilities and programs necessary for the positive development and well-being of the community through the provision of parks, greenways, trails and recreational facilities while working in cooperation with other service providers in the community in order to maximize all available resources.</p>
                    <p><small>* Approximate distance.</small></p>
                  </blockquote>
                </div>
              </header>

              <table>
                <caption class="sr-only">
                    City of Bloomington Parks
                  </caption>
                  <thead class="sr-only">
                    <tr>
                      <th scope="col">Distance</th>
                      <th scope="col">Park Name</th>
                      <th scope="col">Directions Link</th>
                    </tr>
                  </thead>

                <tbody>
                  <tr v-for="p, i in viaDistance(parksResData.features)"
                      :class="[{'clickable': p.address}]"
                      v-if="i <= 10">
                    <template v-if="p.address">
                      <td>
                        <a :href="`https://www.google.com/maps/dir/?api=1&origin=${latLong.lat},${latLong.lng}&destination=${p.lat},${p.lon}`"
                           :alt="`Get Directions to ${p.name}`"
                           :title="`Get Directions to ${p.name}`">
                          {{ p.dist }} mi *
                        </a>
                      </td>
                      <td @click="goToAddress(p.lat, p.lon)">
                        {{ p.name }}
                        <!-- <small>{{ p.address }}</small> -->
                      </td>
                      <td @click="goToAddress(p.lat, p.lon)">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="directions" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-directions fa-w-16 fa-3x"><path fill="currentColor" d="M502.61 233.32L278.68 9.39c-12.52-12.52-32.83-12.52-45.36 0L9.39 233.32c-12.52 12.53-12.52 32.83 0 45.36l223.93 223.93c12.52 12.53 32.83 12.53 45.36 0l223.93-223.93c12.52-12.53 12.52-32.83 0-45.36zm-100.98 12.56l-84.21 77.73c-5.12 4.73-13.43 1.1-13.43-5.88V264h-96v64c0 4.42-3.58 8-8 8h-32c-4.42 0-8-3.58-8-8v-80c0-17.67 14.33-32 32-32h112v-53.73c0-6.97 8.3-10.61 13.43-5.88l84.21 77.73c3.43 3.17 3.43 8.59 0 11.76z" class=""></path></svg>directions
                      </td>
                    </template>

                    <template v-else>
                      <td>{{ p.dist }} mi *</td>
                      <td>{{ p.name }}</td>
                      <td>- - -</td>
                    </template>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="row data playgrounds" v-if="playgroundsResData">
              <header>
                <h2>Nearby Playgrounds</h2>

                <div>
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="shapes" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-shapes fa-w-16 fa-3x"><path fill="currentColor" d="M512 320v160c0 17.67-14.33 32-32 32H320c-17.67 0-32-14.33-32-32V320c0-17.67 14.33-32 32-32h160c17.67 0 32 14.33 32 32zm-384-64C57.31 256 0 313.31 0 384s57.31 128 128 128 128-57.31 128-128-57.31-128-128-128zm351.03-32c25.34 0 41.18-26.67 28.51-48L412.51 16c-12.67-21.33-44.35-21.33-57.02 0l-95.03 160c-12.67 21.33 3.17 48 28.51 48h190.06z" class=""></path></svg>

                  <blockquote>
                    <p>Playgrounds located nearby.</p>
                    <p><small>* Approximate distance.</small></p>
                  </blockquote>
                </div>
              </header>

              <table>
                <caption class="sr-only">
                    City Playgrounds
                  </caption>
                  <thead class="sr-only">
                    <tr>
                      <th scope="col">Distance</th>
                      <th scope="col">Playground Name</th>
                      <th scope="col">Directions Link</th>
                    </tr>
                  </thead>

                <tbody>
                  <!-- <tr v-for="p, i in viaDistance(parksResData.features)"
                      v-if="i < 10"> -->
                  <tr v-for="p, i in viaDistance(playgroundsResData.features)"
                      :class="[{'clickable': p.address}]"
                      v-if="i <= 10">
                    <template v-if="p.address">
                      <td>
                        <a :href="`https://www.google.com/maps/dir/?api=1&origin=${latLong.lat},${latLong.lng}&destination=${p.lat},${p.lon}`"
                           :alt="`Get Directions to ${p.name}`"
                           :title="`Get Directions to ${p.name}`">
                          {{ p.dist }} mi *
                        </a>
                      </td>
                      <td @click="goToAddress(p.lat, p.lon)">
                        {{ p.name }}
                      </td>
                      <td @click="goToAddress(p.lat, p.lon)">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="directions" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-directions fa-w-16 fa-3x"><path fill="currentColor" d="M502.61 233.32L278.68 9.39c-12.52-12.52-32.83-12.52-45.36 0L9.39 233.32c-12.52 12.53-12.52 32.83 0 45.36l223.93 223.93c12.52 12.53 32.83 12.53 45.36 0l223.93-223.93c12.52-12.53 12.52-32.83 0-45.36zm-100.98 12.56l-84.21 77.73c-5.12 4.73-13.43 1.1-13.43-5.88V264h-96v64c0 4.42-3.58 8-8 8h-32c-4.42 0-8-3.58-8-8v-80c0-17.67 14.33-32 32-32h112v-53.73c0-6.97 8.3-10.61 13.43-5.88l84.21 77.73c3.43 3.17 3.43 8.59 0 11.76z" class=""></path></svg>directions
                      </td>
                    </template>

                    <template v-else>
                      <td>{{ p.dist }} mi *</td>
                      <td>{{ p.name }}</td>
                      <td>- - -</td>
                    </template>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="row data safe-places" v-if="safePlaceResData">
              <header>
                <h2>Safe Places</h2>

                <div>
                  <svg enable-background="new 0 0 580 580" version="1.1" viewBox="0 0 580 580" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m563.85 252.15l-236.43-236.45c-20.916-20.912-54.822-20.912-75.738 0l-236.45 236.45c-20.913 20.922-20.913 54.834 0 75.757l236.45 236.44c20.916 20.91 54.822 20.91 75.738 0l236.44-236.44c20.916-20.924 20.91-54.841-0.01258-75.757zm-13.314 63.973l-234.89 234.9c-14.419 14.403-37.779 14.403-52.198 0l-234.9-234.9c-14.389-14.42-14.389-37.767 0-52.187l234.9-234.91c6.9074-6.9452 16.306-10.838 26.102-10.812 9.7933-0.022503 19.189 3.8701 26.097 10.812l234.89 234.91c14.385 14.421 14.385 37.765-3.9e-6 52.187z" fill="currentColor"/><path d="m134.62 286.75h-12.426v25.843h12.426c7.6785 0 12.559-5.6115 12.559-12.923 0-7.3198-4.8808-12.921-12.559-12.921z" fill="currentColor"/><polygon points="260.03 184.45 259.79 184.45 248.2 219.8 271.36 219.8" fill="currentColor"/><path d="m482.2 357.11c1.8473-0.040375 3.3233-1.5501 3.3227-3.3981-0.039734-1.8361-1.5607-3.2929-3.3975-3.2525-1.8361 0.039703-3.2922 1.5607-3.2525 3.3975 0.039062 1.8089 1.5177 3.2545 3.3273 3.2532zm-1.7593-1.296v-4.2427c0-0.16879 0.076111-0.25351 0.27466-0.25351h1.5581c1.1815 0 1.7831 0.35809 1.7831 1.4244 0.068848 0.67645-0.42361 1.2801-1.1001 1.3489-0.035065 0.0039673-0.07016 0.0059509-0.10522 0.0066223l1.0458 1.613c0.062897 0.084717 0.10526 0.18335 0.12247 0.28726 0 0.12906-0.24823 0.22372-0.4415 0.22372-0.19327 0.013245-0.37595-0.090668-0.46265-0.2641l-1.1345-1.8341h-0.76843v1.6905c0 0.26144-0.12842 0.40771-0.38455 0.40771-0.19528 0.019196-0.36935-0.12311-0.38919-0.31836-0.0033265-0.029785-0.0020142-0.05957 0.0019836-0.089356z" fill="currentColor"/><path d="m483.28 352.67c0-0.58047-0.57516-0.64603-1.0848-0.64603h-0.98026v1.4012h0.89883c0.61224 0 1.1662-0.031097 1.1662-0.75519z" fill="currentColor"/><path d="m543.38 308.97c0.0040283-0.0039673 0.0073242-0.0072937 0.011292-0.011261 10.456-10.462 10.452-27.421-0.011292-37.878l-234.89-234.9c-5.0224-5.0164-11.833-7.8334-18.931-7.8308-7.1054-0.0066185-13.921 2.8124-18.946 7.8361l-234.9 234.9c-10.458 10.465-10.458 27.424 0 37.889l234.9 234.9 6.714e-4 6.714e-4c10.46 10.459 27.417 10.459 37.876-6.714e-4l234.89-234.9zm-65.478 44.747c0.0032959-2.3742 1.9307-4.2957 4.3049-4.2923 2.3748 0.0039673 4.2963 1.9314 4.293 4.3056-0.0039978 2.3722-1.9287 4.293-4.301 4.2923-2.3729 0-4.297-1.9234-4.297-4.2963 1e-7 -0.0033263 1e-7 -0.0059509 1e-7 -0.0092773zm-53.396-72.454c0-6.0973 3.0453-10.605 9.5054-10.605h30.24c0.28394-0.018555 0.56921-0.022522 0.85449-0.011932 4.4816 0.1741 7.9744 3.9475 7.8004 8.4291 0.0039673 0.19263 0.0013123 0.38455-0.008606 0.57651-0.22638 4.5492-4.0977 8.0532-8.6462 7.8268h-21.468v17.798h20.004c5.9755 0 8.9037 4.1606 8.9037 8.4139 6.714e-4 0.18268-0.0046387 0.36536-0.015869 0.54807-0.28464 4.6239-4.2639 8.1419-8.8878 7.8572h-20.004v18.547h22.56c0.28925-0.019867 0.5798-0.023834 0.86905-0.012573 4.479 0.17407 7.9685 3.9462 7.7944 8.4252 0.0032959 0.19327 6.714e-4 0.38718-0.0092773 0.58047-0.23364 4.5465-4.1077 8.0426-8.6542 7.8089h-31.445c-5.3719 0-9.3929-3.6324-9.3929-9.1096v-67.072zm-64.122-103.76c0-6.1105 3.0486-10.626 9.508-10.626h30.238c0.28195-0.019196 0.56461-0.023163 0.84723-0.011902 4.4889 0.17076 7.989 3.9482 7.8182 8.4371 0.0039673 0.19856 0.0013123 0.39713-0.0092773 0.5957-0.23563 4.5452-4.111 8.0393-8.6562 7.8036h-21.46v17.813h20c5.9709 0 8.9044 4.1494 8.9044 8.404 6.714e-4 0.18401-0.0046387 0.36801-0.0159 0.55202-0.27997 4.6286-4.2592 8.1538-8.8885 7.8732h-20v18.524h22.565c0.2919-0.019852 0.58511-0.023163 0.87766-0.011246 4.477 0.18268 7.9579 3.9601 7.7752 8.4371 0.0039673 0.18864 0.0013123 0.37727-0.0079346 0.56592-0.22174 4.5531-4.0918 8.0644-8.6449 7.8434h-31.461c-0.24756 0.013229-0.49509 0.01654-0.74265 0.0092621-4.9185-0.1423-8.7899-4.2453-8.6476-9.1638v-67.045zm26.27 91.708c8.8984 0 26.214 2.9149 26.214 13.645 0 4.3996-3.0374 8.1664-7.5548 8.1664-4.9926 0-8.4066-4.2665-18.659-4.2665-15.104 0-22.921 12.798-22.921 27.685 0 14.491 7.9254 26.928 22.921 26.928 10.253 0 14.393-5.1223 19.399-5.1223 5.4818 0 8.0433 5.4883 8.0433 8.302 0 11.698-18.408 14.383-27.443 14.383-24.74 0-41.931-19.63-41.931-44.87 0-25.358 17.065-44.851 41.931-44.851zm-73.964-102.33h31.205c4.4637 0.12444 8.0525 3.7132 8.1776 8.177 0.12973 4.6458-3.5312 8.5178-8.1776 8.6476h-22.437v17.813h18.905c5.8531 0 8.7707 4.1494 8.7707 8.2848 0.0072632 0.24159 0.0039673 0.48318-0.0099487 0.72411-0.25943 4.5789-4.1818 8.0803-8.7607 7.8202h-18.906v26.585c0 6.0781-3.9025 9.4987-9.1387 9.4987-5.2388 0-9.144-3.4206-9.144-9.4987v-68.516c-0.01059-0.25085-0.01123-0.50237-6.409e-4 -0.75322 0.20187-5.0529 4.4624-8.9851 9.516-8.7826zm-90.333 74.992l24.503-66.32c2.077-5.6062 6.8307-10.122 13.047-10.122 6.4647 0 10.977 4.2553 13.048 10.122l23.893 66.32c0.5712 1.4403 0.9028 2.9639 0.98288 4.5108-0.039703 4.4955-3.7158 8.1075-8.2107 8.0684-0.070831-6.561e-4 -0.14166-0.0026398-0.21182-0.0046387-4.1064 0.30382-7.8447-2.3643-8.8918-6.3462l-3.6523-11.468h-33.901l-3.6636 11.343c-0.9637 4.0051-4.6696 6.736-8.7806 6.4713-4.8417 0.14165-8.8819-3.6682-9.0242-8.5099 0-0.013901-6.561e-4 -0.028473-0.0013275-0.042374 0.012573-1.3853 0.30646-2.7534 0.8631-4.0223zm-63.144-48.778c0-17.063 14.021-27.669 30.236-27.669 6.8307 0 23.899 2.5628 23.899 12.199 0 4.7563-3.1777 9.0149-8.167 9.0149-5.0019 0-8.9011-3.649-16.22-3.649-5.2362 0-9.9912 2.8216-9.9912 7.9215 0 12.548 40.719 4.4988 40.719 35.968 0 17.434-14.389 28.284-31.217 28.284-9.3842 0-29.617-2.1935-29.617-13.659 0-4.749 3.1625-8.6555 8.1544-8.6555 5.7366 0 12.567 4.7709 20.487 4.7709 8.0466 0 12.432-4.532 12.432-10.491 0-14.402-40.713-5.7432-40.713-34.034zm-23.493 135.61h-13.522v19.977c0 6.1132-3.9091 9.5259-9.1532 9.5259-5.2388 0-9.1427-3.4127-9.1427-9.5259v-68.499c0-5.7531 3.4067-9.5186 9.5087-9.5186h21.58c17.923 0 31.207 11.698 31.207 29.13 1e-7 17.803-13.773 28.91-30.477 28.91zm79.801 28.747h-30.487c-5.9676 0-9.4954-3.882-9.4954-9.966v-68.047c0-6.0973 3.9058-9.506 9.1367-9.506 5.2415 0 9.1493 3.4087 9.1493 9.506v61.211h21.696c0.35477-0.023163 0.71021-0.022522 1.0656 0 4.5531 0.29651 8.0042 4.2275 7.7083 8.7806-0.26608 4.6107-4.1586 8.169-8.774 8.0214zm72.996 1.1411v-44.583h-28.278v44.583h-19.098c-4.2387-0.0059814-7.6706-3.4465-7.6666-7.6852v-26.389h-1.6587c-2.4523-0.0053101-4.7391-1.2364-6.0933-3.2803-0.038391-0.062897-0.071487-0.12842-0.099945-0.19592-0.22505-0.33493-0.41302-0.69366-0.56062-1.0696-0.054276-0.13766-0.099289-0.27866-0.13568-0.42163-0.11517-0.30447-0.20518-0.61755-0.26807-0.93591-0.06752-0.32101-0.10393-0.64731-0.10722-0.97562-0.0052948-0.14362-0.039062-0.27798-0.039062-0.42825v-0.022492c6.714e-4 -0.47986 0.049652-0.9584 0.14629-1.4283 0.030441-0.1304 0.068832-0.25815 0.11649-0.38324 0.068832-0.33624 0.16812-0.66519 0.29652-0.98291 0.046997-0.10458 0.10062-0.18002 0.15819-0.28329 0.35081-0.7724 0.832-1.4786 1.4217-2.0876l49.977-49.964c0.0046387-0.0046082 0.0092468-0.0092468 0.013886-0.013886 2.8514-2.8435 7.4681-2.8375 10.312 0.013886l49.974 49.964c0.58643 0.61224 1.0676 1.3178 1.4244 2.0876 0.052277 0.10327 0.10721 0.17871 0.14893 0.28329 0.13104 0.33624 0.23761 0.68176 0.31903 1.0339 0.023834 0.12576 0.08075 0.21048 0.10721 0.33228 0.090698 0.47855 0.13901 0.96368 0.14365 1.4508 0 0.092682-0.023163 0.15027-0.023163 0.24558-0.0066223 0.39713-0.045013 0.79294-0.11517 1.1841-0.073486 0.27469-0.16217 0.56461-0.25879 0.84589-0.044373 0.16879-0.098633 0.33493-0.16217 0.49774-0.15027 0.35278-0.32831 0.69299-0.53348 1.0173-0.044342 0.068817-0.07016 0.16415-0.12509 0.2363-1.3536 2.0452-3.6411 3.277-6.094 3.2803h-1.6514v26.389c6.714e-4 4.2407-3.4345 7.6805-7.6752 7.6852h-33.916z" fill="currentColor"/></svg>

                  <blockquote>
                    <p><strong>Safe Places</strong> are identified by the bright yellow Safe Place sign. A youth can enter a Safe Place at any time and ask for help. Within a few minutes a trained volunteer arrives to meet the youth and assist in defusing the crisis.</p>

                    <p><strong>Please Note:</strong> If you are seeking <strong>Safe Place Services</strong>, or are a <strong>youth in crisis</strong>, please contact the <strong>Binkley House Youth Shelter</strong> directly at <strong>812-349-2507</strong>.</p>

                    <p><small>* Approximate distance.</small></p>
                  </blockquote>
                </div>
              </header>

              <table>
                <caption class="sr-only">
                  Safe Places
                </caption>
                <thead class="sr-only">
                  <tr>
                    <th scope="col">Distance</th>
                    <th scope="col">Name</th>
                    <th scope="col">Directions Link</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="p, i in viaDistance(safePlaceResData.feed.entry)"
                      :class="[{'clickable': p}]"
                      v-if="i <= 10">
                    <td @click="goToAddress(p.gsx$lat.$t, p.gsx$lon.$t)">
                      {{ p.dist }} mi *
                    </td>
                    <td @click="goToAddress(p.gsx$lat.$t, p.gsx$lon.$t)">
                      {{ p.gsx$name.$t }}
                    </td>
                    <td @click="goToAddress(p.gsx$lat.$t, p.gsx$lon.$t)">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="directions" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-directions fa-w-16 fa-3x"><path fill="currentColor" d="M502.61 233.32L278.68 9.39c-12.52-12.52-32.83-12.52-45.36 0L9.39 233.32c-12.52 12.53-12.52 32.83 0 45.36l223.93 223.93c12.52 12.53 32.83 12.53 45.36 0l223.93-223.93c12.52-12.53 12.52-32.83 0-45.36zm-100.98 12.56l-84.21 77.73c-5.12 4.73-13.43 1.1-13.43-5.88V264h-96v64c0 4.42-3.58 8-8 8h-32c-4.42 0-8-3.58-8-8v-80c0-17.67 14.33-32 32-32h112v-53.73c0-6.97 8.3-10.61 13.43-5.88l84.21 77.73c3.43 3.17 3.43 8.59 0 11.76z" class=""></path></svg>directions
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="row data schools" v-if="schoolsResData">
              <header>
                <h2>Nearby Schools</h2>

                <div>
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="graduation-cap" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="svg-inline--fa fa-graduation-cap fa-w-20 fa-3x"><path fill="currentColor" d="M622.34 153.2L343.4 67.5c-15.2-4.67-31.6-4.67-46.79 0L17.66 153.2c-23.54 7.23-23.54 38.36 0 45.59l48.63 14.94c-10.67 13.19-17.23 29.28-17.88 46.9C38.78 266.15 32 276.11 32 288c0 10.78 5.68 19.85 13.86 25.65L20.33 428.53C18.11 438.52 25.71 448 35.94 448h56.11c10.24 0 17.84-9.48 15.62-19.47L82.14 313.65C90.32 307.85 96 298.78 96 288c0-11.57-6.47-21.25-15.66-26.87.76-15.02 8.44-28.3 20.69-36.72L296.6 284.5c9.06 2.78 26.44 6.25 46.79 0l278.95-85.7c23.55-7.24 23.55-38.36 0-45.6zM352.79 315.09c-28.53 8.76-52.84 3.92-65.59 0l-145.02-44.55L128 384c0 35.35 85.96 64 192 64s192-28.65 192-64l-14.18-113.47-145.03 44.56z" class=""></path></svg>

                  <blockquote>
                    <p>Local <strong>Schools</strong> nearby the requested Address.</p>
                    <p><strong>Please Note:</strong> This <strong>does not</strong> indicate the appropriate <strong>School District</strong> nor any <strong>Higher Educational</strong> institutions.</p>

                    <p>External <strong>School District</strong> information may by found <a @click.prevent="openSchoolDistrictModal()" href="#" alt="MCCSC School Districts">here</a>.</p>
                    <p><small>* Approximate distance.</small></p>
                  </blockquote>
                </div>
              </header>

              <fn1-button-group>
                <fn1-button
                  @click.native="changeSchoolType('elm')"
                  :class="[{'active': schoolType == 'elm'}]">
                  Elementary
                </fn1-button>

                <fn1-button
                  @click.native="changeSchoolType('middle')"
                  :class="[{'active': schoolType == 'middle'}]">
                  Middle
                </fn1-button>

                <fn1-button
                  @click.native="changeSchoolType('high')"
                  :class="[{'active': schoolType == 'high'}]">
                  High
                </fn1-button>

                <fn1-button
                  @click.native="changeSchoolType('all')"
                  :class="[{'active': schoolType == 'all'}]">
                  All
                </fn1-button>
              </fn1-button-group>

              <table>
                <caption class="sr-only">
                    Local Schools
                  </caption>
                  <thead class="sr-only">
                    <tr>
                      <th scope="col">Distance</th>
                      <th scope="col">School Name</th>
                      <th scope="col">Directions Link</th>
                    </tr>
                  </thead>

                <tbody>
                  <!-- <tr v-for="p, i in viaDistance(parksResData.features)"
                      v-if="i < 10"> -->
                  <tr v-for="p, i in viaDistance(schoolsResData.features)"
                      :class="[{'clickable': p.address}]"
                      v-if="i <= 10 && schoolTypeToggle.includes(p.type)">
                    <template v-if="p.address">
                      <td>
                        <a :href="`https://www.google.com/maps/dir/?api=1&origin=${latLong.lat},${latLong.lng}&destination=${p.lat},${p.lon}`"
                           :alt="`Get Directions to ${p.name}`"
                           :title="`Get Directions to ${p.name}`">
                          {{ p.dist }} mi *
                        </a>
                      </td>
                      <td @click="goToAddress(p.lat, p.lon)">
                        {{ p.name }}
                      </td>
                      <td @click="goToAddress(p.lat, p.lon)">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="directions" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-directions fa-w-16 fa-3x"><path fill="currentColor" d="M502.61 233.32L278.68 9.39c-12.52-12.52-32.83-12.52-45.36 0L9.39 233.32c-12.52 12.53-12.52 32.83 0 45.36l223.93 223.93c12.52 12.53 32.83 12.53 45.36 0l223.93-223.93c12.52-12.53 12.52-32.83 0-45.36zm-100.98 12.56l-84.21 77.73c-5.12 4.73-13.43 1.1-13.43-5.88V264h-96v64c0 4.42-3.58 8-8 8h-32c-4.42 0-8-3.58-8-8v-80c0-17.67 14.33-32 32-32h112v-53.73c0-6.97 8.3-10.61 13.43-5.88l84.21 77.73c3.43 3.17 3.43 8.59 0 11.76z" class=""></path></svg>directions
                      </td>
                    </template>

                    <template v-else>
                      <td>{{ p.dist }} mi *</td>
                      <td>{{ p.name }}</td>
                      <td>- - -</td>
                    </template>
                  </tr>
                </tbody>
              </table>

              <exampleModal
                ref="schoolDistrictModal"
                title="School District Information">

                <fn1-alert
                  slot="body"
                  v-if="gradeLevelError"
                  variant="warning">
                  <p>Select a <strong>Grade Level</strong> to continue.</p>
                </fn1-alert>

                <p slot="body">Please select a Grade Level.</p>

                <div slot="body" class="field-group">
                  <label for="schoolDistrictGradeLevel">
                    Grade Level:
                  </label>

                  <select name="schoolDistrictGradeLevel"
                          id="schoolDistrictGradeLevel"
                          type="select"
                          v-model="schoolDistrictGradeLevel">
                    <option :value="{val: 3, lvl: 'PA'}">PA</option>
                    <option :value="{val: 1, lvl: 'PP'}">PP</option>
                    <option :value="{val: 2, lvl: 'PK'}">PK</option>
                    <option :value="{val: 6, lvl: 'K'}">K</option>
                    <option :value="{val: 7, lvl: '01'}">01</option>
                    <option :value="{val: 8, lvl: '02'}">02</option>
                    <option :value="{val: 9, lvl: '03'}">03</option>
                    <option :value="{val: 10, lvl: '04'}">04</option>
                    <option :value="{val: 11, lvl: '05'}">05</option>
                    <option :value="{val: 12, lvl: '06'}">06</option>
                    <option :value="{val: 13, lvl: '07'}">07</option>
                    <option :value="{val: 14, lvl: '08'}">08</option>
                    <option :value="{val: 15, lvl: '09'}">09</option>
                    <option :value="{val: 16, lvl: '10'}">10</option>
                    <option :value="{val: 17, lvl: '11'}">11</option>
                    <option :value="{val: 18, lvl: '12'}">12</option>
                    <option :value="{val: 20, lvl: '13'}">13</option>
                    <option :value="{val: 19, lvl: '99'}">99</option>
                    <option :value="{val: 23, lvl: 'PW'}">PW</option>
                  </select>
                </div>

                <fn1-button slot="footer"
                            title="Confirm - Remove Service"
                            @click.native="confirmModal('schoolDistrictModal')">
                  Confirm
                </fn1-button>

                <fn1-button slot="footer"
                            title="Cancel - Remove Service"
                            @click.native="closeModal('schoolDistrictModal')">
                  Cancel
                </fn1-button>
              </exampleModal>
            </div>

            <div class="row data">
              <header>
                <h2>Elected City Officials</h2>
              </header>

              <div class="contacts">
                <div class="row contact mayor">
                  <div class="img">
                    <img :src="folks.officials.mayor.image"
                         :title="`Mayor - ${folks.officials.mayor.name}`"
                         :alt="`Mayor - ${folks.officials.mayor.name}`">
                  </div>

                  <div class="about">

                    <h2>{{ folks.officials.mayor.name }}</h2>
                    <h4>{{ folks.officials.mayor.title }}</h4>

                    <p>John has worked extensively as a public servant in Democratic government, leading two state agencies, advising a Governor and Lieutenant Governor, and serving as an elected official. As the Secretary of the Indiana Family and Social Services Administration, he oversaw the implementation of Medicaid and welfare programs, services for the elderly, disabled, mentally ill, and children at risk, and state-wide community development and housing programs – all executed by a staff of 10,000 Hoosiers with an annual budget of $6 billion. Earlier he served as Commissioner of the Indiana Department of Environmental Management, the agency tasked with the statewide protection of Indiana’s air, water and land. John served as an elected member of the Board of Trustees for the Monroe County Community School Corporation.</p>

                    <p>Throughout his time in Bloomington, John has served on many state and local commissions and boards, including chairing the Bloomington Commission on Sustainability and the Shalom Community Center board, as well as national boards such as the National Community Land Trust Network.</p>

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
                          <td>{{ folks.officials.mayor.email }}</td>
                        </tr>

                        <tr>
                          <th scope="row">Telephone:</th>
                          <td>{{ folks.officials.mayor.phone.office }}</td>
                        </tr>

                        <tr>
                          <th scope="row">Mailing Address:</th>
                          <td>
                            Office of the Mayor<br>
                            {{ folks.officials.mayor.streetAddress }} - Suite {{ folks.officials.mayor.suite }}<br>
                            {{ folks.officials.mayor.cityStateZip }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div class="row contact clerk">
                  <div class="img">
                    <img :src="folks.officials.clerk.image"
                         :title="`Clerk - ${folks.officials.clerk.name}`"
                         :alt="`Clerk ${folks.officials.clerk.name}`">
                  </div>

                  <div class="about">
                    <h2>{{ folks.officials.clerk.name }}</h2>
                    <h4>{{ folks.officials.clerk.title }}</h4>

                    <p>The City of Bloomington Clerk's Office strives to make city government as accessible and responsive to the community as possible. The office serves as an educational liaison between citizens and their government. We respond to inquiries by telephone, in writing, or in person from a variety of interested persons regarding matters pertaining to City Council actions, or related City information retained in the City Clerk's office. We work closely with the City Council to supply combined constituent services.</p>

                    <p>For election information contact the <a href="https://www.co.monroe.in.us/department/?structureid=18" alt="Monroe County Clerk's Office">Monroe County Clerk's Office</a> or <a href="https://www.co.monroe.in.us/department/division.php?structureid=89" alt="Voter Registration">Voter Registration</a>.</p>

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
                          <td>{{ folks.officials.clerk.email}}</td>
                        </tr>

                        <tr>
                          <th scope="row">Telephone:</th>
                          <td>{{ folks.officials.clerk.phone.office }}</td>
                        </tr>

                        <tr>
                          <th scope="row">Mailing Address:</th>
                          <td>
                            City Clerk<br>
                            {{ folks.officials.clerk.streetAddress }} - Suite {{ folks.officials.clerk.suite }}<br>
                           {{ folks.officials.clerk.cityStateZip }}
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
                    <div class="img"
                         :style="`background-image: url(${folks.council[1].image});`"></div>

                    <div class="about">
                      <h2>{{ folks.council[1].name }}</h2>
                      <h4>{{ folks.council[1].title }}</h4>

                      <table>
                        <caption class="sr-only">
                          City Council Member {{ folks.council[1].name }} {{ folks.council[1].title }}
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
                            <td>{{ folks.council[1].email }}</td>
                          </tr>

                          <tr>
                            <th scope="row">Address:</th>
                            <td>
                              {{ folks.council[1].streetAddress }}<br>
                              {{ folks.council[1].cityStateZip }}
                            </td>
                          </tr>

                          <tr>
                            <th scope="row">Phone (Office):</th>
                            <td>{{ folks.council[1].phone.office }}</td>
                          </tr>

                          <tr>
                            <th scope="row">Phone (Cell):</th>
                            <td>{{ folks.council[1].phone.home }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div class="contact">
                    <div class="img"
                         :style="`background-image: url(${folks.council[2].image});`"></div>

                    <div class="about">
                      <h2>{{ folks.council[2].name }}</h2>
                      <h4>{{ folks.council[2].title }}</h4>

                      <table>
                        <caption class="sr-only">
                          City Council Member {{ folks.council[2].title }} {{ folks.council[2].name }}
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
                            <td>{{ folks.council[2].email }}</td>
                          </tr>

                          <tr>
                            <th scope="row">Address:</th>
                            <td>
                              {{ folks.council[2].streetAddress }}<br>
                              {{ folks.council[2].cityStateZip }}
                            </td>
                          </tr>

                          <tr>
                            <th scope="row">Phone:</th>
                            <td>{{ folks.council[2].phone.office }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div class="contact">
                    <div class="img"
                         :style="`background-image: url(${folks.council[3].image});`"></div>

                    <div class="about">
                      <h2>{{ folks.council[3].name }}</h2>
                      <h4>{{ folks.council[3].title }}</h4>

                      <table>
                        <caption class="sr-only">
                          City Council Member {{ folks.council[3].name }} {{ folks.council[3].title }}
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
                            <td>{{ folks.council[3].email }}</td>
                          </tr>

                          <tr>
                            <th scope="row">Address:</th>
                            <td>
                              {{ folks.council[3].streetAddress }}<br>
                              {{ folks.council[3].cityStateZip }}
                            </td>
                          </tr>

                          <tr>
                            <th scope="row">Phone:</th>
                            <td>{{ folks.council[3].phone.office }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row data"
                 id="districtRep"
                 ref="districtRep">
              <header>
                <h2>District Representative</h2>
              </header>

              <GmapMap
                ref="districtMap"
                :center="latLong"
                :zoom="14"
                map-type-id="roadmap"
                style="width: 100%; height: 550px"
                :options="{
                  zoomControl:        10,
                  mapTypeControl:     false,
                  scaleControl:       false,
                  streetViewControl:  false,
                  rotateControl:      false,
                  fullscreenControl:  false,
                  disableDefaultUi:   true,
                  draggable:          true,
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
                          visibility: 'on'
                        }
                      ]
                    },
                  ]

                }">
                <GmapMarker
                  :position="latLong"
                  :clickable="false"
                  :draggable="false"
                />

                <GmapPolygon
                    :paths="districtRepGeoCoords"
                    :options="{
                      strokeColor:    'rgb(30, 90, 174)',
                      strokeOpacity:  0.8,
                      strokeWeight:   2,
                      fillColor:      'rgb(30, 90, 174)',
                      fillOpacity:    0.35
                    }"
                />
              </GmapMap>

              <div class="contacts" v-if="districtRep">
                <div class="row council">
                  <div class="contact">
                    <div class="img"
                         :style="`background-image: url( ${districtRep.image} );`"></div>

                    <div class="about">
                      <h2>{{ districtRep.name }}</h2>
                      <h4>{{ districtRep.title }}</h4>

                      <table>
                        <caption class="sr-only">
                          City Council District Representative {{ districtRep.name }} {{ districtRep.title }}
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
                            <td>{{ districtRep.email }}</td>
                          </tr>

                          <tr>
                            <th scope="row">Address:</th>
                            <td>
                              {{ districtRep.streetAddress }}<br>
                              {{ districtRep.cityStateZip }}
                            </td>
                          </tr>

                          <tr>
                            <th scope="row">Phone:</th>
                            <td>{{ districtRep.phone.office }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row data" v-if="locations">
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
                          Web:

                          <a :href="l.website.url"
                             :alt="l.website.text">{{ l.website.text }}</a>
                        </th>
                      </tr>

                      <tr>
                        <th scope="row">
                          Socials:
                          <template v-for="s, i in l.socials">
                            <a :href="s.url"
                               :alt="s.text">
                              <template v-if="s.type === 'instagram'">
                                <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="instagram" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-instagram fa-w-14 fa-3x"><path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" class=""></path></svg>
                              </template>
                              <template v-if="s.type === 'twitter'">
                                <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="twitter" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-twitter fa-w-16 fa-3x"><path fill="currentColor" d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" class=""></path></svg>
                              </template>
                              <template v-if="s.type === 'facebook'">
                                <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook-f" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="svg-inline--fa fa-facebook-f fa-w-10 fa-3x"><path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" class=""></path></svg>
                              </template>
                              <template v-if="s.type === 'youtube'">
                                <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="youtube" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-youtube fa-w-18 fa-3x"><path fill="currentColor" d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" class=""></path></svg>
                              </template>
                            </a>
                          </template>
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <footerComponent />
    </template>

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
        <p>We are actively updating records, so check back soon.</p>
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
import moment          from 'moment'
import debounce        from 'lodash.debounce'
import exampleSearch   from '~/components/exampleSearch'
import exampleModal    from '~/components/exampleModal'
import footerComponent from '~/components/footerComponent'

export default {
  components: {
    exampleSearch,
    exampleModal,
    footerComponent
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      let addressQueryParam = to.query.address;
      if(addressQueryParam){
        // vm.addressSearch = addressQueryParam;
        vm.addressSearchAuto = addressQueryParam;
        vm.searchSubmit(addressQueryParam);
      }
    });
  },
  data() {
    return {
      cityName:       process.env.cityName,
      folks:          JSON.parse(process.env.folks),
      searchHasFocus: false,
      mapMarkerToggle: {
        parks:       true,
        playgrounds: true,
        schools:     true,
        safePlaces:  true,
      },
      deInput: null,
      debouncedInput: '',
      cityHallLatLong:    { lat: 39.16992723, lng: -86.53680559 },
      latLong:            {},
      mapHeight:          null,
      mapHeightDefault:   'calc(100vh - 90px)',
      mapHeightResult:    '450px',
      coordsProjection:   '+proj=tmerc +lat_0=37.5 +lon_0=-87.08333333333333 +k=0.999966667 +x_0=900000 +y_0=249999.9998983998 +datum=NAD83 +units=us-ft +no_defs',
      bloomingtonBoundaryGeoJson: null,
      weather:            null,
      distanceToCityHall: null,
      zoom:               13,
      addressSearch:      null,
      addressSearchAuto:  null,
      addressResData:     null,
      addressMapped:      null,
      addressResChoices:  null,
      locationResData:    null,
      councilDistrict:    null,
      districtRep:        null,
      councilDistrictsGeoJson: null,
      districtRepGeoCoords:    null,
      parksResData:       null,
      schoolsResData:     null,
      playgroundsResData: null,
      safePlaceResData:   null,
      schoolTypeToggle:   null,
      schoolType:         'all',
      schoolTypes: {
        "pre":            ['Preschool'],
        "elm":            ['Elementary School','P-6','P-12','K-8'],
        "middle":         ['Middle School','K-8','P-12'],
        "high":           ['High School','P-12'],
        "admin":          ['School Adminstration'],
        "all":            ['All','Preschool','Elementary School','P-6','P-12','K-8','Middle School','High School','School Adminstration','Continuing Education']
      },
      schoolDistrictGradeLevel: null,
      gradeLevelError: false,
      searchIconEncoded:  '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-search fa-w-16 fa-3x"><path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" class=""></path></svg>',
      autoSuggestRes: null,
      errors: {
        addressRes:       null,
        locationRes:      null,
        addressNotMapped: null,
      }
    }
  },
  created() {
    axios.get(`https://bloomington.in.gov/geoserver/publicgis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=publicgis:BloomingtonMunicipalBoundary&maxFeatures=50&outputFormat=application%2Fjson`)
    .then((res) => {
      this.bloomingtonBoundaryGeoJson = res.data.features
    })
    .catch((e) => {
      console.log(`Bloomington Boundary Failed 🛑 `,
                  `\n\n ${e} \n\n`);
    });

    axios.get(`${process.env.weatherUrl}weather?lat=${this.cityHallLatLong.lat}&lon=${this.cityHallLatLong.lng}&units=imperial&appid=${process.env.weatherApiKey}`)
    .then((res) => {
      this.weather = res.data
    })
    .catch((e) => {
      console.log(`Weather Failed 🛑 `,
                  `\n\n ${e} \n\n`);
    });


    this.getSafePlaces()
    .then((res) => {
      this.safePlaceResData = res;
      console.log(`getSafePlaces 👌`);
    })
    .catch((e)  => {
      console.log(`getSafePlaces 🛑`,
                  `\n\n ${e} \n\n`);
    });

    this.getLocalSchools()
    .then((res) => {
      this.schoolsResData = res;
      this.schoolTypeToggle = this.schoolTypes.all;

      console.log(`%c getLocalSchools 👌 `,
                  this.consoleLog.success);
    })
    .catch((e)  => {
      console.log(`%c getLocalSchools 🛑 `,
                  this.consoleLog.error,
                  `\n\n ${e} \n\n`);
    });

    this.getPlaygrounds()
    .then((res) => {
      this.playgroundsResData = res;
      console.log(`%c getPlaygrounds 👌 `,
                  this.consoleLog.success);
    })
    .catch((e)  => {
      console.log(`%c getPlaygrounds 🛑 `,
                  this.consoleLog.error,
                  `\n\n ${e} \n\n`);
    });

    this.getCityOfBloomingtonParks()
    .then((res) => {
      this.parksResData = res;
      console.log(`%c getCityOfBloomingtonParks 👌 `,
                  this.consoleLog.success);
    })
    .catch((e) => {
      console.log(`%c getCityOfBloomingtonParks 🛑 `,
                  this.consoleLog.error,
                  `\n\n ${e} \n\n`);
    });

    this.getCouncilDistrictsGeoJson()
    .then((res) => {
      this.councilDistrictsGeoJson = res;
      console.log(`%c getCouncilDistrictsGeoJson 👌 `,
                  this.consoleLog.success);
    })
    .catch((e) => {
      console.log(`%c getCouncilDistrictsGeoJson 🛑 `,
                  this.consoleLog.error,
                  `\n\n ${e} \n\n`);
    });
  },
  // async asyncData() {
  //   let cityHallLatLong = { lat: 39.16992723, lng: -86.53680559 };

  //   const boundary = await axios.get(`https://bloomington.in.gov/geoserver/publicgis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=publicgis:BloomingtonMunicipalBoundary&maxFeatures=50&outputFormat=application%2Fjson`);

  //   const weather = await axios.get(`${process.env.weatherUrl}weather?lat=${cityHallLatLong.lat}&lon=${cityHallLatLong.lng}&units=imperial&appid=${process.env.weatherApiKey}`);

  //   return {
  //           bloomingtonBoundaryGeoJson: boundary.data.features,
  //           weather: weather.data
  //         };
  // },
  mounted() {
    let searchInputElement = document.getElementById('address-search');
    if(searchInputElement)
      searchInputElement.focus();

    // if(!this.locationResData) {
    //   this.$refs.defaultMap.$mapPromise
    //   .then(() => this.$refs.defaultMap.panBy(0,50));
    //   this.mapHeight = this.mapHeightDefault;
    // }
  },
  watch: {
    addressSearchAuto: debounce(function(val){
      let regExTest   = /\d+\s+\w+/,
        addressTest = regExTest.test(val),
        searchValue = this.addressSearchAuto;

      if(searchValue.length > 3 &&
         addressTest) {
        this.getAddress(val)
        .then((res) => {
          this.autoSuggestRes = res;
          console.log(`%c getAutoAddress 👌 `,
                      this.consoleLog.success);

        })
        .catch((e)  => {
          console.log(`%c getAutoAddress 🛑 `,
                      this.consoleLog.error,
                      `\n\n ${e} \n\n`);
        })
      } else {
        console.dir('search no val');
        this.autoSuggestRes = null;
      }
    }, 500),
    $route: function (to, from) {
      let addressToQueryParam   = to.query.address,
          addressFromQueryParam = from.query.address;

      if(addressToQueryParam !== addressFromQueryParam){
        this.addressSearchAuto = addressToQueryParam;
        this.searchSubmit(addressToQueryParam);
      }
    }
  },
  computed: {
    ...mapFields([
      'consoleLog',
      'locations',
      'sanitation'
    ]),
    currentYear() {
      return new Date().getFullYear();
    },
    bloomingtonBoundaryPaths() {
      let lngLat  = [],
        geoCoords = [];


      if(this.bloomingtonBoundaryGeoJson) {
        let raw = [];
        this.bloomingtonBoundaryGeoJson.forEach((r) => {
          raw.push(r.geometry.coordinates)
        })
        var repJson = [].concat.apply([],[].concat.apply([], raw));

        let projCoords = repJson.map((p) => {
          return p.map((e) => {
            return proj4(this.coordsProjection).inverse(e);
          })
        });

        let projCoordsLatLng = projCoords.map((p) => {
          return p.map((e) => {
            return {lat: e[1], lng: e[0]}
          })
        });

        // remove 2, 3, 4 as they are n/a areas
        let setOrder = [0, 1, 5, 6, 7, 8],
              output = setOrder.map(i => projCoordsLatLng[i]);

        return output;
      }
    },
    districtRepImage() {
      let rep = this.councilDistrict.id;
      switch(rep) {
        case 1:
          return this.folks.district[1].image;
          break;
        case 2:
          return this.folks.district[2].image;
          break;
        case 3:  this.folks.district[3].image;
          break;
        case 4:
          return this.folks.district[4].image;
          break;
        case 5:
          return this.folks.district[5].image;
          break;
        case 6:
          return this.folks.district[6].image;
          break;
      }
    },
    locationPurposes() {
      if(this.locationResData.purposes){
        const groupBy = key => array =>
        array.reduce((objKeyValue, obj) => {
          const value = obj[key];
          objKeyValue[value] = (objKeyValue[value] || []).concat(obj);
          return objKeyValue;
        }, {});

        const groupByType = groupBy('purpose_type');
        const newNewnew = groupByType(this.locationResData.purposes);

        return newNewnew;
      }
    },
    gMapPanHeading () {
      // this was only a generic test,
      // we dont have support via master address
      if(this.locationResData) {
        let direction    = this.locationResData.address.street_direction,
          quarterSection = this.locationResData.address.quarter_section;

        switch(direction) {
          case 'N':
            return -90;
            break;
          case 'NE':
            return -45;
            break;
          case 'NW':
            return -145;
            break;
          case 'E':
            if(quarterSection === 'NE') {
              return 180;
            } else if(quarterSection === 'SE') {
              return 185;
            } else if(quarterSection === 'SW') {
              return 190;
            } else if(quarterSection === 'NW') {
              return 199;
            } else {
              return 0
            }
            break;
          case 'S':
            return 90;
            break;
          case 'SE':
            return -45;
            break;
          case 'SW':
            return -45;
            break;
        }
      } else {
        return 0
      }
    },
  },
  methods: {
    sFocus(){
      this.searchHasFocus = true;
    },
    sBlur() {
      setTimeout(() => {
        this.searchHasFocus = false;
      }, 500);
    },
    openSchoolDistrictModal() {
      this.$refs.schoolDistrictModal.showModal = true;
    },
    confirmModal(modalRef, i) {
      if(modalRef === 'schoolDistrictModal') {
        if(this.schoolDistrictGradeLevel) {
          this.$refs.schoolDistrictModal.showModal = false;

          let stDirection   = this.locationResData.address.street_direction,
              stName        = this.locationResData.address.street_name,
              stNameEncode  = stName.replace(/ /g, "+"),
              stSuffix      = this.locationResData.address.street_suffix_code,
              houseNumber   = this.locationResData.address.street_number,
              zip           = this.locationResData.address.zip,
              gradeID       = this.schoolDistrictGradeLevel.val,
              gradeLvl      = this.schoolDistrictGradeLevel.lvl;

          if(stSuffix) {
            var street = `${stDirection}+${stNameEncode}+${stSuffix}`;
          } else {
            var street = `${stDirection}+${stNameEncode}`;
          }

          let preppedSt     = street.toUpperCase(),
              url           = `http://versalookup.mccsc.edu/elinkrp/Students/BasicTransBoundaryResults.aspx?BasicTB=Y&GradeID=${gradeID}&HHouseNumber=${houseNumber}&HStreet=${preppedSt}&HZip=${zip}&GradeDesc=${gradeLvl}`;

          console.dir(url);
          return window.open(url, '_blank');
        } else {
          this.gradeLevelError = true;
        }
      }
    },
    closeModal(modalRef, i) {
      if(modalRef === 'schoolDistrictModal') {
        this.$refs.schoolDistrictModal.showModal = false;
      } else if(modalRef == 'addressMappedErrorModal') {
        this.$refs.addressMappedErrorModal.showModal = false;
        this.errors.addressNotMapped = null;
        this.autoSuggestRes = null;
      }
    },
    nearbyParkMarkers(){
      let parksData     = this.parksResData,
          parkMarkers   = [];
      if(parksData){
        parksData.features.filter((p) => {
          var addDist = {dist: this.nearbyDistance(p.properties.lat,p.properties.lon)};
          parkMarkers.push({...p.properties, ...addDist})
        })
        return parkMarkers
      }
    },
    nearbySchoolMarkers(){
      let schoolsData    = this.schoolsResData,
          schoolsMarkers = [];
      if(schoolsData){
        schoolsData.features.filter((p) => {
          var addDist = {dist: this.nearbyDistance(p.properties.lat,p.properties.lon)};
          schoolsMarkers.push({...p.properties, ...addDist})
        })
        return schoolsMarkers
      }
    },
    nearbyPlaygroundMarkers(){
      let playgroundsData    = this.playgroundsResData,
          playgroundsMarkers = [];
      if(playgroundsData){
        playgroundsData.features.filter((p) => {
          var addDist = {dist: this.nearbyDistance(p.properties.lat,p.properties.lon)};
          playgroundsMarkers.push({...p.properties, ...addDist})
        })
        return playgroundsMarkers
      }
    },
    nearbySafePlaceMarkers(){
      let safePlacesData     = this.safePlaceResData,
          safePlacesMarkers  = [];
      if(safePlacesData){
        safePlacesData.feed.entry.filter((p) => {
          var addDist = {dist: this.nearbyDistance(p.gsx$lat.$t,p.gsx$lon.$t)};
          safePlacesMarkers.push({...p, ...addDist})
        })
        return safePlacesMarkers
      }
    },
    yardWasteMomentDate(d) {
      let dateFormat = moment(new Date(d));

      if(dateFormat.isAfter()) {
        return dateFormat.format('MMMM Do');
      }
    },
    cityHallDistance() {
      let points1 = this.cityHallLatLong,
          points2 = {lat: this.locationResData.address.latitude, lng: this.locationResData.address.longitude};
      if(this.latLong && this.locationResData.address) {
        this.distanceToCityHall = this.pointsToDistance(points1, points2);
      }
    },
    changeSchoolType(schoolType) {
      switch(schoolType) {
        case 'pre':
          this.schoolType = 'pre';
          this.schoolTypeToggle = this.schoolTypes.pre;
          break;
        case 'elm':
          this.schoolType = 'elm';
          this.schoolTypeToggle = this.schoolTypes.elm;
          break;
        case 'middle':
          this.schoolType = 'middle';
          this.schoolTypeToggle = this.schoolTypes.middle;
          break;
        case 'high':
          this.schoolType = 'high';
          this.schoolTypeToggle = this.schoolTypes.high;
          break;
        case 'admin':
          this.schoolType = 'admin';
          this.schoolTypeToggle = this.schoolTypes.admin;
          break;
        default:
          this.schoolType = 'all';
          this.schoolTypeToggle = this.schoolTypes.all;
          break;
      }
    },
    goToAddress(lat, lon) {
      let url = `https://www.google.com/maps/dir/?api=1&origin=${this.latLong.lat},${this.latLong.lng}&destination=${lat},${lon}`;

      return window.open(url, '_blank');
    },
    viaDistance(places) {
      if(this.latLong) {
        let newArray = [],
                self = this;

        let locationMapped = places.map((p) => {
          if(p.properties) {
            var addDist = {dist: self.nearbyDistance(p.properties.lat,p.properties.lon)};
            newArray.push({...p.properties, ...addDist})
          } else if(p.gsx$lat.$t && p.gsx$lon.$t) {
            var addDist = {dist: self.nearbyDistance(p.gsx$lat.$t,p.gsx$lon.$t)};
            newArray.push({...p, ...addDist})
          } else {
            console.log(`%c viaDistance 🛑 `,
                        this.consoleLog.error,
                        `\n\n Distance of the wrong format \n\n`);
          }
        });

        let newArraySorted = newArray.sort((a, b) => parseFloat(a.dist) - parseFloat(b.dist));

        return newArraySorted;
      }
    },
    nearbyDistance(lat, lon) {
      if(this.latLong) {
        let points1 = this.latLong,
            points2 = {lat: lat, lng: lon};
        return this.pointsToDistance(points1, points2);
      }
    },
    roundUp(num, precision) {
      precision = Math.pow(10, precision)
      return Math.ceil(num * precision) / precision
    },
    deg2Rad(deg) {
      return deg * Math.PI / 180;
    },
    pointsToDistance( points1, points2 ) {
      var self = this;
      function PythagorasEquirectangular(points1, points2) {
        let lat1 = self.deg2Rad(points1.lat),
            lat2 = self.deg2Rad(points2.lat),
            lon1 = self.deg2Rad(points1.lng),
            lon2 = self.deg2Rad(points2.lng);

        const  R = 3959,
               x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2),
               y = (lat2 - lat1),
               d = Math.sqrt(x * x + y * y) * R;
        return self.roundUp(d, 1);
      }
      return PythagorasEquirectangular( points1, points2 );
    },
    trashLink(week, day) {
      if(week === 'A'){
        switch(day) {
          case 'Monday':
            return this.sanitation.a.monday;
            break;
          case 'Tuesday':
            return this.sanitation.a.tuesday;
            break;
          case 'Wednesday':
            return this.sanitation.a.wednesday;
            break;
          case 'Thursday':
            return this.sanitation.a.thursday;
            break;
        }
      } else if(week === 'B'){
        switch(day) {
          case 'Monday':
            return this.sanitation.b.monday;
            break;
          case 'Tuesday':
            return this.sanitation.b.tuesday;
            break;
          case 'Wednesday':
            return this.sanitation.b.wednesday;
            break;
          case 'Thursday':
            return this.sanitation.b.thursday;
            break;
        }
      }
    },
    addressChoice(address) {
      this.addressSearchAuto  = address.streetAddress;
      this.addressResData = address;
      let canWeMapAddress = this.isAddressMapped(address.latitude, address.longitude);
      if(this.addressResData && canWeMapAddress){
        this.locationLookup();
      } else {
        this.addressResData = null;
        this.$refs.addressMappedErrorModal.showModal = true;

        this.$nextTick(() => {
          this.$refs.addressMappedErrorModalCloseBtn.$el.focus();
          this.errors.addressNotMapped = address;
        });

        if(this.locationResData) {
          this.addressSearchAuto = this.locationResData.address.streetAddress
        } else {
          this.addressSearchAuto = null;
        }
      }
    },
    searchSubmit(input) {
      this.addressResChoices  = null;
      this.locationResData    = null;
      this.councilDistrict    = null;
      this.districtRep        = null;
      this.errors.addressRes  = null;
      this.addressLookup(input);
    },
    isAddressMapped(lat, lon) {
      return lat !== null && lon !== null
    },
    addressLookup(address) {
      this.getAddress(address)
      .then((res) => {
        if(this.isAddressMapped(res.latitude, res.longitude)) {
          this.$router.push({query : { address: address}});
          this.addressMapped      = true;
          this.addressResData     = res;
          this.errors.addressRes  = null;
          this.locationLookup();
          console.log(`%c getAddress 👌 `,
                      this.consoleLog.success);
        } else {
          this.$router.replace({query : { }});
          this.addressSearch      = null;
          this.addressResData     = null;
          this.locationResData    = null;

          this.addressMapped      = false;
          this.latLong            = this.cityHallLatLong;
          this.mapHeight          = '100%';
          this.errors.addressRes  = 'This Address has not yet been Mapped.';
          alert(this.errors.addressRes)
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
          this.districtRepGeoCoords = null;

          this.locationResData   = res;
          this.$router.push({query : { address: this.locationResData.address.streetAddress}});

          this.mapHeight         = this.mapHeightResult;

          this.errors.locationRes = null;

          this.cityHallDistance();

          console.log(`%c getLocation 👌 `,
                      this.consoleLog.success);

          this.setLatLong(this.locationResData.address.latitude,this.locationResData.address.longitude);

          this.getCouncilDistrict()
          .then((res) => {
            this.councilDistrict = res;
            console.log(`%c getCouncilDistrict 👌 `,
                        this.consoleLog.success);

            this.districtRepInfo(this.councilDistrict.id);
            this.getCouncilDistrictRepFeature(this.councilDistrict.id);
            this.districtPaths();
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
    districtRepInfo(id) {
      switch(id) {
        case 1:
          return this.districtRep = this.folks.district[1];
          break;
        case 2:
          return this.districtRep = this.folks.district[2];
          break;
        case 3:
          return this.districtRep = this.folks.district[3];
          break;
        case 4:
          return this.districtRep = this.folks.district[4];
          break;
        case 5:
          return this.districtRep = this.folks.district[5];
          break;
        case 6:
          return this.districtRep = this.folks.district[6];
          break;
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
    getCouncilDistrictRepFeature(district) {
      this.councilDistrictRepGeoJson = this.councilDistrictsGeoJson.features.filter((d) => {
          return d.properties.DISTRICT === district;
        })
    },
    districtPaths() {
      let lngLat  = [],
        geoCoords = [];

      if(this.councilDistrictRepGeoJson.length > 1) {
        let raw = [];
        this.councilDistrictRepGeoJson.forEach((r) => {
          raw.push(r.geometry.coordinates)
        })
        var repJson = [].concat.apply([],[].concat.apply([], raw));

      } else {
        var repJson = this.councilDistrictRepGeoJson[0].geometry.coordinates[0][0];
      }

      // to-do: use the data and not the district
      //        to make this distinction
      if(this.councilDistrict.id === 1) {
        let projCoords = repJson.map((p) => {
          return p.map((e) => {
            return proj4(this.coordsProjection).inverse(e);
          })
        });

        let projCoordsLatLng = projCoords.map((p) => {
          return p.map((e) => {
            return {lat: e[1], lng: e[0]}
          })
        });

        this.districtRepGeoCoords = projCoordsLatLng;
      } else {
        repJson.forEach((p) => {
          let pair = proj4(this.coordsProjection).inverse(p);
          lngLat.push(pair)
        });

        lngLat.forEach((p) => {
          geoCoords.push({lat: p[1], lng: p[0]})
        });

        this.districtRepGeoCoords = geoCoords;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @-webkit-keyframes solidColor {
    0%    { background-color: $color-blue-dark }
    50%   { background-color: $color-blue-light; }
    100%  { background-color: $color-blue-dark }
  }

  @-moz-keyframes solidColor {
    0%    { background-color: $color-blue-dark }
    50%   { background-color: $color-blue-light; }
    100%  { background-color: $color-blue-dark }
  }

  @keyframes solidColor {
    0%    { background-color: $color-blue-dark }
    50%   { background-color: $color-blue-light; }
    100%  { background-color: $color-blue-dark }
  }

  #address-mapped-error-modal {
    ::v-deep .modal-wrapper {
      .modal-container {
        width: 500px;

        .modal-body {
          max-height: 100%;

          .badge {
            margin: 5px 0 0 0;
          }

          .alert {
            margin: 0;
          }

          p, blockquote {
            font-weight: $weight-semi-bold;
          }

          blockquote {
            color: $text-color;
            border-left: 3px solid shade($color-ucla-gold-lighter, 40%);
            margin: 0px 0px 15px 10px;
            padding: 0 0 0 15px;
            font-style: italic;
          }
        }
      }
    }
  }

  .modal-wrapper .modal-container .modal-body {
    .alert {
      margin: 0 0 20px 0;
    }

    .field-group {
      label {
        font-weight: $weight-semi-bold;
        margin: 0 10px 0 0;
      }
    }
  }

  .button-group {
    margin: 0 0 20px 0;

    button {
      padding: 5px 20px;
      font-size: 18px;
      border: 1px solid $color-grey;
      background: rgba($color-cloud, 0.4);
      color: lighten($text-color, 5%);
      // color: white;
      letter-spacing: 1px;
      font-weight: 500;

      &:hover,
      &.active {
        background: darken($color-cloud, 3%);
      }
    }
  }


  .badge {
    padding: 2px 8px 0 8px;

    &.jurisdiction-check {
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
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      color: lighten($text-color, 15%);
      margin: 0 0 10px 0;
    }
  }

  .yard-waste-days {
    display: flex;
    flex-wrap: wrap;
    margin: 0;

    .badge {
      background-color: $color-silver;
      margin: 10px 10px 0 0;
    }
  }

  a {
    color: $color-blue;

    &:hover,
    &:focus {
      color: darken($color-blue, 5%);
    }
  }

  .parks,
  .schools,
  .playgrounds,
  .safe-places {
    table {
      tr {
        &.clickable {
          cursor: pointer;

          td {
            &:first-child  {
              a {
                color: lighten($text-color, 20%);
                text-decoration: none;

                &:hover,
                &:focus {
                  color: $color-blue;
                }
              }
            }

            &:last-child {
              color: lighten($text-color, 30%);
            }
          }

          &:hover,
          &:focus {

            td {
              color: $color-blue;

              a {
                color: $color-blue;
              }
            }

            svg {
              color: $color-blue;
            }
          }
        }

        td, th {
          &:nth-of-type(1) {
            width: 115px;
          }
        }

        td {
          vertical-align: middle;

          svg {
            color: lighten($text-color, 40%);
            width: 25px;
            height: 25px;
            margin: 0 10px 0 0;
          }

          &:nth-of-type(3) {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: flex-end;

            small {
              width: 100%;
            }
          }
        }
      }
    }
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

        svg {
          color: $color-silver;
          width: 50px;
          height: 50px;
          margin: 0 40px 0 0;
        }

        blockquote {
          width: calc(100% - 90px);
          margin: 0;
          padding: 0 0 0 40px;
          font-size: 18px;

          p {
            width: 100%;
            color: lighten($text-color, 5%);
            margin: 0 0 10px 0;

            &:last-of-type {
              margin: 0;
            }
          }
        }
      }

      .vue-map-container {
        margin: 0 0 40px 0;

        &:before {display: none;}
      }

      .locations {
        // background-color: red;
        display: flex;
        justify-content: space-between;

        .location {
          padding: 0 20px;
          width: 33.33333337%;
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
              padding: 0 0 0 15px;
            }

            &:nth-child(n+3) {
              color: red;
            }
          }
        }

        table {
          tbody {
            tr {
              display: flex;
              align-items: center;

              th {
                display: flex;
                align-items: center;
                width: 100%;
              }
            }
          }
          a {
            margin: 0 0 0 20px;
            text-decoration: none;
            border-bottom: none;

            &:hover,
            &:focus {
              svg {
                color: $color-blue;
              }
            }
          }
          svg {
            width: 20px;
            height: 20px;
            margin: 0;
          }
        }
      }

      .contacts {
        // background-color: green;

        table tbody tr th {
          width: 225px;
        }

        .mayor,
        .clerk {
          display: flex;
          margin: 0 0 70px 0;
          // background-color: red;

          .img {
            position: relative;
            width: 300px;
            margin: 0 40px 0 0;
            display: table;

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

            p {
              letter-spacing: .5px;
              font-weight: 500;
              font-style: italic;
              margin: 0 0 20px 0;
              line-height: 25px;
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

      table {
        tbody {
          tr {
            th {
              width: 400px;
            }
          }
        }
      }
    }
  }

  .overview {
    z-index: 1;
    position: relative;
    top: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    color: white;
    letter-spacing: .5px;

    h4 {
      margin: 0 0 15px 0;
    }

    .row {
      .container {
        display: flex;
        justify-content: space-between;
      }

      &:first-of-type {
        background-color: white;
        border-top: 1px solid $color-grey-dark;
        padding: 4px 0 0 0;

        .form-group {
          font-size: 16px;
          width: 100%;

          fieldset {
            span {
              color: $text-color;
              margin: 0 10px 0 0;
              font-weight: $weight-semi-bold;
            }

            div {
              margin: 0 10px 0 0;
              padding: 0 10px 0 0;
              border-right: 1px solid $color-grey;

              &:last-child {
                border: none;
                padding: 0;
                margin: 0;
              }
            }
          }

          legend {
            background-color: black;
          }

          input {
            font-size: 16px;
            font-weight: $weight-semi-bold;
            color: $text-color;
            margin: 0 5px 0 0;
            border-radius: $radius-default;
          }
        }
      }

      &:nth-of-type(2) {
        border-top: 1px solid $color-grey;
        background-color: rgba($color-cloud, 0.3);
        color: $text-color;

        .container {
          align-items: center;
        }

        div {
          display: flex;
          align-items: center;
        }
      }

      &:nth-of-type(3) {
        padding: 25px 0;
        background-color: $color-blue;

        div {
          display: flex;
          align-items: center;
        }

        svg {
          width: 20px;
          height: 20px;
          margin: 0 10px 0 0;
        }

        p {
          font-size: 18px;
          color: white;
        }
      }

      &:nth-child(4) {
        position: relative;
        background-color: $color-blue;
        padding: 0 0 25px 0;

        h2 {
          position: absolute;
          top: -41px;
          z-index: 1;
          display: flex;
          width: fit-content;
          color: white;
          background-color: $color-blue;
          padding: 0 15px;
          font-size: 22px;
          letter-spacing: 1px;
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

  .no-location {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    background-color: $color-blue;
    height: calc(100vh - 89px); // 89 = header height
    padding: 100px 0 0 0;

    // background-color: rgba(255, 0, 0, 0);
    // background-image: -webkit-linear-gradient(rgba(255, 0, 0, 0), rgba(255, 0, 0, 0.5));
    // background-image: linear-gradient(rgba(255, 0, 0, 0), rgba(255, 0, 0, 0.5));
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

  .form-wrapper {
    position: relative;
    top: 0;
    z-index: 1;
    width: 100%;
    padding: 0;
    border: none;
    background-color: transparent;

    form {
      z-index: 1;
      width: 100%;

      label {
        @include visuallyHidden;
      }

      ::v-deep input {
        box-shadow: none;
        border: 1px solid $color-grey-dark;
        color: $text-color;
        font-size: 18px;
        border-radius: $radius-default;
        caret-color: $color-blue; //no IE support
      }

      ::v-deep button[type=submit] {
        display: none;
        background-color: $color-green;
        border-color: $color-green;
        margin: 0;

        svg {}

        &:hover,
        &:focus {
          background-color: darken($color-green, 5%);
        }
      }
    }

    ul {
      position: absolute;
      top: 40px;
      border: 1px solid $color-grey-dark;
      border-top: none;
      overflow: scroll;
      max-height: 300px;
      width: 100%;
      background-color: white;
      box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.10);
      -webkit-border-bottom-right-radius: $radius-default;
      -webkit-border-bottom-left-radius: $radius-default;
      -moz-border-radius-bottomright: $radius-default;
      -moz-border-radius-bottomleft: $radius-default;
      border-bottom-right-radius: $radius-default;
      border-bottom-left-radius: $radius-default;

      li {
        display: flex;
        padding: 15px 20px;
        margin: 0;
        cursor: pointer;
        color: $text-color;

        a {
          color: $text-color;
          font-weight: $weight-semi-bold;
          text-decoration: none;
          width: 100%;
          display: flex;
          align-items: center;
        }

        .badge {
          margin-left: auto;
        }

        &:hover {
          background-color: rgba($color-cloud, 0.5);
        }

        &:nth-child(even) {
          background-color: rgba($color-cloud, 0.3);

          &:hover {
            background-color: rgba($color-cloud, 0.5);
          }
        }
      }
    }

    // #no-location-search {
    //   // position: absolute;
    //   width: 100%;

    //   label {
    //     @include visuallyHidden;
    //   }

    //   ::v-deep input {
    //     box-shadow: none;
    //     border: 1px solid $color-grey-dark;
    //     color: $text-color;
    //     font-size: 30px;
    //     z-index: 1;
    //   }

    //   ::v-deep button[type=submit] {
    //     background-color: $color-green;
    //     border-color: $color-green;
    //     padding: 0 20px;
    //     margin: 0;
    //     z-index: 1;

    //     svg {
    //       width: 30px;
    //       height: 30px;
    //     }

    //     &:hover,
    //     &:focus {
    //       background-color: darken($color-green, 5%);
    //     }
    //   }
    // }
  }

  .vue-map-container,
  .vue-street-view-pano-container {
    position: relative;

    &:before {
      display: none;
      pointer-events: none;
      z-index: 1;
      position: absolute;
      content: '';
      height: 100%;
      width: 100%;
      background-color: rgba($color-blue-darker, 0.15);
    }
  }

  .address-choices {
    margin: 40px 0 0 0;

    tr {
      cursor: pointer;

      &:hover {
        background-color: rgba($color-cloud, 0.5);
      }

      &:nth-child(even) {
        background-color: rgba($color-cloud, 0.3);

        &:hover {
          background-color: rgba($color-cloud, 0.5);
        }
      }
    }
  }
</style>