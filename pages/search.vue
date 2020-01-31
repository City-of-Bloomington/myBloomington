<template>
  <div class="top-wrapper">
    <div
      v-if="!loading && locationResDataNew && addressMapped"
      class="content-wrapper">

      <GmapMap
        :center="latLong"
        :zoom="zoom"
        ref="defaultMap"
        map-type-id="satellite"
        :options="{
          zoomControl:        true,
          mapTypeControl:     true,
          scaleControl:       true,
          streetViewControl:  true,
          rotateControl:      true,
          fullscreenControl:  true,
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
        
        <template v-if="inRoadsDataNew.length && mapMarkerToggle.inRoads && !isMobile">
          <template v-for="c, i in inRoadsDataNew">
            <GmapPolyline
              :path="c.coords"
              :options="{
                strokeColor:    'rgb(239, 101, 82)',
                strokeOpacity:  0.8,
                strokeWeight:   4
              }"/>
            
            <GmapMarker
              @click="markerToWindowClick('inRoads', c.id)"
              :animation="2"
              :icon="{url: 'marker-roads.svg', labelOrigin: {x: 28, y: 85}, size: {width: 50, height: 50, f: 'px', b: 'px'}, scaledSize: {width: 50, height: 50, f: 'px', b: 'px'}}"
              :position="c.center"
              :clickable="true"
              :draggable="false"
            />
            
            <GmapInfoWindow
              v-if="infoWindowVisible.inRoads.id == c.id"
              :opened="infoWindowVisible.inRoads.opened"
              @closeclick="infoWindowVisible.inRoads.opened=false"
              :position="c.center"
              :options="{
                borderColor: '#f02f02',
              }">

              <div class="type-tag roads">
                <span>Road Work</span>
              </div>
              
              <div class="info-window">
                <h1>{{ c.title }}</h1>

                <ul>
                  <li v-if="c.type != ''">
                    <strong>Type:</strong>&nbsp;
                    {{ c.type }}
                  </li>

                  <li v-if="c.end != ''">
                    <strong>Days Remaining:</strong>&nbsp;
                    <template v-if="dateDifference(c.end) != 0">
                      {{ dateDifference(c.end) }}
                    </template>

                    <template v-else>
                      Last Day Today
                    </template>
                  </li>

                  <li v-if="c.start != '' && c.end != ''">
                    <strong>Start / End:</strong>&nbsp;
                    {{ $moment(c.start).format('MM/DD/YYYY')}} - {{ $moment(c.end).format('MM/DD/YYYY')}}
                  </li>

                  <li v-if="c.geography_description != ''">
                    <strong>Geography Description:</strong>&nbsp;
                    {{ c.geography_description }}
                  </li>

                  <li v-if="c.description != ''">
                    <strong>Description:</strong>&nbsp;
                    {{ c.description }}
                  </li>
                </ul>
              </div>
            </GmapInfoWindow>
          </template>
        </template>
        
        <GmapMarker
          :position="latLong"
          :animation="2"
          :clickable="false"
          :draggable="false"
          :icon="{url: 'map-crosshair.svg', labelOrigin: {x: 18, y: 85}, size: {width: 60, height: 60, f: 'px', b: 'px'}, scaledSize: {width: 60, height: 60, f: 'px', b: 'px'}}"
        />
        
        <GmapCluster
          v-if="!isMobile"
          class="map-cluster"
          :minimumClusterSize="4">
          <template
            v-for="p, i in nearbyParkMarkers()"
            v-if="mapMarkerToggle.parks">
            <GmapMarker
              @click="markerToWindowClick('parks', p.id)"
              :animation="2"
              :label="{text: `${p.name}`, fontFamily: 'IBM Plex Sans,Helvetica,Arial,sans-serif', fontSize: '18px', color: 'white', fontWeight: '600'}"
              :icon="{url: 'marker-park-alt.svg', labelOrigin: {x: 28, y: 65}, size: {width: 50, height: 50, f: 'px', b: 'px'}, scaledSize: {width: 50, height: 50, f: 'px', b: 'px'}}"
              :position="{lat: Number(p.lat), lng: Number(p.lon)}"
              :clickable="true"
              :draggable="false"
            />

            <GmapInfoWindow
              v-if="infoWindowVisible.parks.id == p.id"
              :opened="infoWindowVisible.parks.opened"
              @closeclick="infoWindowVisible.parks.opened=false"
              :position="{lat: Number(p.lat), lng: Number(p.lon)}"
              :options="{
                borderColor: '#f02f02',
              }">

              <div class="type-tag parks">
                <span>Park</span>
              </div>
              
              <div class="info-window">
                <h1>{{ p.name }}</h1>
                <ul>
                  <li v-if="p.address != ''">
                    <strong>Address:</strong>&nbsp;
                    {{ p.address }}
                  </li>

                  <li v-if="p.location != ''">
                    <strong>Location:</strong>&nbsp;
                    {{ p.location }}
                  </li>

                  <li v-if="p.size != '' && p.size != '0 Acres'">
                    <strong>Park Size:</strong>&nbsp;
                    {{ p.size }}
                  </li>
                </ul>
              </div>
            </GmapInfoWindow>
          </template>

          <template
            v-for="s, i in nearbySchoolMarkers()"
            v-if="mapMarkerToggle.schools">
            <GmapMarker
              @click="markerToWindowClick('schools', s.id)"
              :animation="2"
              :label="{text: `${s.name}`, fontFamily: 'IBM Plex Sans,Helvetica,Arial,sans-serif', fontSize: '18px', color: 'white', fontWeight: '600'}"
              :icon="{url: 'marker-school-alt.svg', labelOrigin: {x: 28, y: 65}, size: {width: 50, height: 50, f: 'px', b: 'px'}, scaledSize: {width: 50, height: 50, f: 'px', b: 'px'}}"
              :position="{lat: Number(s.lat), lng: Number(s.lon)}"
              :clickable="true"
              :draggable="false"
            />

            <GmapInfoWindow
              v-if="infoWindowVisible.schools.id == s.id"
              :opened="infoWindowVisible.schools.opened"
              @closeclick="infoWindowVisible.schools.opened=false"
              :position="{lat: Number(s.lat), lng: Number(s.lon)}"
              :options="{
                borderColor: '#f02f02',
              }">

              <div class="type-tag schools">
                <span>School</span>
              </div>
              
              <div class="info-window">
                <h1>{{ s.name }}</h1>
                <ul>
                  <li v-if="s.type != ''">
                    <strong>Type:</strong>&nbsp;
                    {{ s.type }}
                  </li>

                  <li v-if="s.address != ''">
                    <strong>Address:</strong>&nbsp;
                    {{ s.address }}
                  </li>

                  <li v-if="s.pubcorp != ''">
                    <strong>Corporation:</strong>&nbsp;
                    {{ s.pubcorp }}
                  </li>
                </ul>
              </div>
            </GmapInfoWindow>
          </template>

          <template
            v-for="p, i in nearbyPlaygroundMarkers()"
            v-if="mapMarkerToggle.playgrounds">
            <GmapMarker
              @click="markerToWindowClick('playgrounds', p.id)"
              :animation="2"
              :label="{text: `${p.name}`, fontFamily: 'IBM Plex Sans,Helvetica,Arial,sans-serif', fontSize: '18px', color: 'white', fontWeight: '600'}"
              :icon="{url: 'marker-playground-alt.svg', labelOrigin: {x: 28, y: 65}, size: {width: 50, height: 50, f: 'px', b: 'px'}, scaledSize: {width: 50, height: 50, f: 'px', b: 'px'}}"
              :position="{lat: Number(p.lat), lng: Number(p.lon)}"
              :clickable="true"
              :draggable="false"
            />

            <GmapInfoWindow
              v-if="infoWindowVisible.playgrounds.id == p.id"
              :opened="infoWindowVisible.playgrounds.opened"
              @closeclick="infoWindowVisible.playgrounds.opened=false"
              :position="{lat: Number(p.lat), lng: Number(p.lon)}"
              :options="{
                borderColor: '#f02f02',
              }">

              <div class="type-tag playgrounds">
                <span>Playground</span>
              </div>
              
              <div class="info-window">
                <h1>{{ p.name }}</h1>
                <ul>
                  <li v-if="p.type != ''">
                    <strong>Type:</strong>&nbsp;
                    {{ p.type }}
                  </li>

                  <li v-if="p.address != ''">
                    <strong>Address:</strong>&nbsp;
                    {{ p.address }}
                  </li>
                </ul>
              </div>
            </GmapInfoWindow>
          </template>

          <template
            v-for="s, i in nearbySafePlaceMarkers()"
            v-if="mapMarkerToggle.safePlaces">
            <GmapMarker
              @click="markerToWindowClick('safeplaces', s.id)"
              :animation="2"
              :label="{text: `${s.gsx$name.$t}`, fontFamily: 'IBM Plex Sans,Helvetica,Arial,sans-serif', fontSize: '18px', color: 'white', fontWeight: '600'}"
              :icon="{url: 'marker-safe-place-alt.svg', labelOrigin: {x: 28, y: 65}, size: {width: 50, height: 50, f: 'px', b: 'px'}, scaledSize: {width: 50, height: 50, f: 'px', b: 'px'}}"
              :position="{lat: Number(s.gsx$lat.$t), lng: Number(s.gsx$lon.$t)}"
              :clickable="true"
              :draggable="false"
            />

            <GmapInfoWindow
              v-if="infoWindowVisible.safeplaces.id == s.id"
              :opened="infoWindowVisible.safeplaces.opened"
              @closeclick="infoWindowVisible.safeplaces.opened=false"
              :position="{lat: Number(s.gsx$lat.$t), lng: Number(s.gsx$lon.$t)}"
              :options="{
                borderColor: '#f02f02',
              }">

              <div class="type-tag safeplaces">
                <span>Safeplace</span>
              </div>
              
              <div class="info-window">
                <h1>{{ s.gsx$name.$t }}</h1>
                <ul>
                  <li v-if="s.gsx$address.$t != ''">
                    <strong>Address:</strong>&nbsp;
                    {{ s.gsx$address.$t }}
                  </li>
                </ul>
              </div>
            </GmapInfoWindow>
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
                <div
                  class="inner-wrapper"
                  @click="mapMarkerToggle.parks = !mapMarkerToggle.parks">
                  <input v-model="mapMarkerToggle.parks"
                         value="parks"
                         type="checkbox"
                         name="parks">

                  <label for="parks">Parks</label>
                </div>

                <div
                  class="inner-wrapper"
                  @click="mapMarkerToggle.playgrounds = !mapMarkerToggle.playgrounds">
                  <input v-model="mapMarkerToggle.playgrounds"
                         value="playgrounds"
                         type="checkbox"
                         name="playgrounds">

                  <label for="playgrounds">Playgrounds</label>
                </div>

                <div
                  class="inner-wrapper"
                  @click="mapMarkerToggle.safePlaces = !mapMarkerToggle.safePlaces">
                  <input v-model="mapMarkerToggle.safePlaces"
                         value="safePlaces"
                         type="checkbox"
                         name="safePlaces">

                  <label for="safePlaces">Safe Places</label>
                </div>

                <div
                  class="inner-wrapper"
                  @click="mapMarkerToggle.schools = !mapMarkerToggle.schools">
                  <input v-model="mapMarkerToggle.schools"
                         value="schools"
                         type="checkbox"
                         name="schools">

                  <label for="schools">Schools</label>
                </div>

                <div 
                  lass="inner-wrapper"
                  @click="mapMarkerToggle.inRoads = !mapMarkerToggle.inRoads">
                  <input v-model="mapMarkerToggle.inRoads"
                         value="inroads"
                         type="checkbox"
                         name="inroads">

                  <label for="inroads">Road Work</label>
                </div>
              </fieldset>
            </div>

            <fn1-button
              @click.native="expandMap()"
              class="expand-map"
              title="Expand Map"
              alt="Expand Map">
              <span></span>
            </fn1-button>
          </div>
        </div>

        <div class="row">
          <div class="container">
            <div class="weather" v-if="weather">
                <img :src="`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`"
                     :alt="weather.main">

                <p>
                  <span class="hide-viewport-small hide-viewport-medium">
                    <strong>Weather:</strong> {{ weather.weather[0].main }} ~
                  </span>
                  {{ weather.main.temp }} &#176;F
                </p>
            </div>

            <div>
              <fn1-badge :class="['jurisdiction-check', {'inside': locationResDataNew.address.jurisdiction_name === 'Bloomington', 'outside': locationResDataNew.address.jurisdiction_name != 'Bloomington'}]">
                <template v-if="locationResDataNew.address.jurisdiction_name === 'Bloomington'">
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-check fa-w-16 fa-3x"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" class=""></path></svg>
                  Inside&nbsp;
                </template>

                <template v-else>
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" class="svg-inline--fa fa-times fa-w-11 fa-3x"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" class=""></path></svg>
                  Outside&nbsp;
                </template>

                <span>
                  <span
                    class="hide-viewport-small">Bloomington</span>
                    City Limits
                </span>
              </fn1-badge>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="container">
            <div>
              <p>
                <strong>Address:</strong>
                {{ locationResDataNew.address.streetAddress }}
                {{ locationResDataNew.address.city }}, {{ locationResDataNew.address.state }} {{ locationResDataNew.address.zip }}
              </p>
            </div>

            <div
              v-if="distanceToCityHall"
              class="hide-viewport-small hide-viewport-medium">
              <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-pin" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 288 512" class="svg-inline--fa fa-map-pin fa-w-9 fa-3x"><path fill="currentColor" d="M112 316.94v156.69l22.02 33.02c4.75 7.12 15.22 7.12 19.97 0L176 473.63V316.94c-10.39 1.92-21.06 3.06-32 3.06s-21.61-1.14-32-3.06zM144 0C64.47 0 0 64.47 0 144s64.47 144 144 144 144-64.47 144-144S223.53 0 144 0zm0 76c-37.5 0-68 30.5-68 68 0 6.62-5.38 12-12 12s-12-5.38-12-12c0-50.73 41.28-92 92-92 6.62 0 12 5.38 12 12s-5.38 12-12 12z" class=""></path></svg>

              <p>
                Approx. <strong>{{ distanceToCityHall }} mi</strong> from <strong>City Hall</strong>
              </p>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="container">
            <fn1-alert
              v-if="searchEnteredWarning && searchHasFocus"
              variant="warning">
              <p>Please select an <strong>Address</strong> below.</p>
            </fn1-alert>

            <fn1-alert
              v-if="errors.addressRes && addressSearchAuto"
              variant="warning" >
              <p>{{errors.addressRes}}</p>
            </fn1-alert>

            <div class="form-wrapper">
              <form
                @submit.prevent
                @keyup.enter="searchEntered()">
                <exampleSearch
                  v-model="addressSearchAuto"
                  v-on:focusd="sFocus()"
                  v-on:blurd="sBlur()"
                  :placeholder="locationResDataNew.address.streetAddress"
                  ref="addressSearch"
                  name="address-search"
                  id="address-search" />
              </form>

              <mq-layout :mq="['med', 'lrg']">
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
              </mq-layout>

              <mq-layout mq="sm">
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

                        <fn1-badge :class="['jurisdiction-check mobile-result', {'inside': a.jurisdiction_name === 'Bloomington', 'outside': a.jurisdiction_name != 'Bloomington'}]">
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
                        <fn1-badge :class="['jurisdiction-check mobile-result', {'inside': autoSuggestRes.jurisdiction_name === 'Bloomington', 'outside': autoSuggestRes.jurisdiction_name != 'Bloomington'}]">
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
              </mq-layout>
            </div>
          </div>
        </div>
      </div>

      <div class="wrapper">
        <div class="container">
          <template v-if="!addressResChoices && locationResDataNew">
            <div class="scroll-to-wrapper">
              <span>Jump to Section:</span>
              <select @change="anchorHashClick($event)">
                <option disabled selected>--- Select a Section ---</option>

                <option
                  v-if="locationResDataNew.purposes"
                  value="about">About</option>
                <option
                  v-if="locationResDataNew.locations"
                  value="sanitation">Sanitation</option>
                <option
                  v-if="locations"
                  value="govt-online">Govt. Online</option>

                <optgroup
                  v-if="folks.officials.mayor || districtRep || folks.council || folks.officials.clerk"
                  label="Elected Officials">
                  <option
                    v-if="folks.officials.mayor"
                    value="mayor">Mayor</option>
                  <option
                    v-if="districtRep"
                    value="districtRep">District Representative</option>
                  <option
                    v-if="folks.council"
                    value="council">Council At-Large</option>
                  <option
                    v-if="folks.officials.clerk"
                    value="clerk">Clerk</option>
                </optgroup>

                <optgroup
                  v-if="parksResData || playgroundsResData || safePlaceResData || schoolsResData"
                  label="Nearby Amenities">
                  <option
                    v-if="parksResData"
                    value="parks">Parks</option>
                  <option
                    v-if="playgroundsResData"
                    value="playgrounds">Playgrounds</option>
                  <option
                    v-if="safePlaceResData"
                    value="safe-places">Safe Places</option>
                  <option
                    v-if="schoolsResData"
                    value="schools">Schools</option>
                </optgroup>

                <option
                  v-if="locationResDataNew.address"
                  value="coords">Coordinates</option>
              </select>
            </div>

            <!-- about -->
            <dataSectionComponent
              v-if="locationResDataNew.purposes"
              id="about"
              :title="locationResDataNew.address.streetAddress">

              <svg slot="icon" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-marked-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-map-marked-alt fa-w-18 fa-3x"><path fill="currentColor" d="M288 0c-69.59 0-126 56.41-126 126 0 56.26 82.35 158.8 113.9 196.02 6.39 7.54 17.82 7.54 24.2 0C331.65 284.8 414 182.26 414 126 414 56.41 357.59 0 288 0zm0 168c-23.2 0-42-18.8-42-42s18.8-42 42-42 42 18.8 42 42-18.8 42-42 42zM20.12 215.95A32.006 32.006 0 0 0 0 245.66v250.32c0 11.32 11.43 19.06 21.94 14.86L160 448V214.92c-8.84-15.98-16.07-31.54-21.25-46.42L20.12 215.95zM288 359.67c-14.07 0-27.38-6.18-36.51-16.96-19.66-23.2-40.57-49.62-59.49-76.72v182l192 64V266c-18.92 27.09-39.82 53.52-59.49 76.72-9.13 10.77-22.44 16.95-36.51 16.95zm266.06-198.51L416 224v288l139.88-55.95A31.996 31.996 0 0 0 576 426.34V176.02c0-11.32-11.43-19.06-21.94-14.86z"></path></svg>

              <blockquote slot="excerpt">
                <p>Information about this address.</p>
              </blockquote>

              <table slot="table">
                <caption class="sr-only">
                  Address Location Purposes
                </caption>
                <thead class="sr-only">
                  <tr>
                    <th scope="col">Key</th>
                    <th scope="col">Value</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-if="locationResDataNew.address.township_name">
                    <th scope="row">Township:</th>
                    <td>{{ locationResDataNew.address.township_name | capitalizeFirst }}</td>
                  </tr>

                  <template
                    v-if="locationPurposes"
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
                          <!-- {{e}} -->
                          {{e.purpose_type | capitalizeFirst}}:
                        </th>

                        <td>
                          <template
                            v-if="e.purpose_type === 'NEIGHBORHOOD ASSOCIATION'">
                             <a
                              class="external"
                              target="_blank"
                              href="https://bloomington.in.gov/neighborhoods/associations"
                              :alt="e.name | capitalizeFirst">{{e.name | capitalizeFirst}}</a>
                          </template>

                          <template
                            v-else-if="e.purpose_type === 'CITY COUNCIL DISTRICT'">
                            <a
                              href="#"
                              :alt="e.name | capitalizeFirst"
                              data-jump="districtRep"
                              @click.prevent="anchorHashClick($event)">{{e.name | capitalizeFirst}}</a>
                          </template>

                          <template
                            v-else-if="e.purpose_type === 'RESIDENTIAL PARKING ZONE'">
                            <a
                              href="https://bloomington.in.gov/transportation/parking/neighborhood-parking"
                              target="_blank"
                              class="external"
                              :alt="e.name | capitalizeFirst">
                              {{e.name | capitalizeFirst}}
                            </a><br>
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

                  <tr>
                    <th scope="row">Voter Registration:</th>
                    <td>
                      <a
                        :href="voterPrecinctsPath"
                        class="external"
                        target="_blank"
                        alt="Monroe Co. Voter Precincts">Monroe Co. Voter Precincts</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </dataSectionComponent>

            <!-- sanitation -->
            <dataSectionComponent
              v-if="locationResDataNew.locations"
              id="sanitation"
              title="Sanitation Pickup">

              <svg slot=icon aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-trash fa-w-14 fa-3x"><path fill="currentColor" d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z" class=""></path></svg>

              <blockquote slot="excerpt">
                <p>Please see <a class="external" target="_blank" alt="Trash &amp; Recycling Pickup" href="https://bloomington.in.gov/trash">Trash &amp; Recycling Pickup</a> for details.</p>

                <template v-if="locationResDataNew.locations[0].trash_day || locationResDataNew.locations[0].recycle_week">
                  <p><strong>Note:</strong> Some conditions <strong>may cause delays to the schedule below.</strong></p>
                </template>

                <template v-else>
                  <p><strong>Note: No sanitation pickup scheduled</strong>.</p>
                  <p>If you were expecting one, contact: <a class="external" href="mailto:sanitation@bloomington.in.gov">sanitation@bloomington.in.gov</a></p>
                </template>
              </blockquote>

              <template
                slot="table"
                v-if="locationResDataNew.locations[0].trash_day || locationResDataNew.locations[0].recycle_week">
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
                    <tr v-if="locationResDataNew.locations[0].trash_day">
                      <th scope="row">Trash &amp; Recyling:</th>
                      <td>{{ locationResDataNew.locations[0].trash_day | capitalizeFirst }}</td>
                    </tr>

                    <tr v-if="locationResDataNew.locations[0].recycle_week">
                      <th scope="row">Yard Waste:</th>
                      <td>
                         <a
                          class="external"
                          :alt="'Week ' + locationResDataNew.locations[0].recycle_week | capitalizeFirst"
                          :href="trashLink(locationResDataNew.locations[0].recycle_week, locationResDataNew.locations[0].trash_day).url" target="_blank">
                          Week {{ locationResDataNew.locations[0].recycle_week | capitalizeFirst }}
                        </a>

                        <p><strong>Yard waste</strong> pickups are <strong>between April - December only</strong>.</p>

                        <div class="yard-waste-days">
                          <template v-for="d, i in trashLink(locationResDataNew.locations[0].recycle_week, locationResDataNew.locations[0].trash_day).dates">
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
            </dataSectionComponent>

            <!-- govt online -->
            <dataSectionComponent
              v-if="locations"
              id="locations"
              title="Government Online">

              <div
                slot="locations"
                class="locations">
                <div class="location" v-for="l, i in locations">
                  <ul>
                    <li>{{ l.type }}</li>
                    <li>{{ l.location }}</li>
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

                          <a
                            class="external"
                            :href="l.website.url"
                            target="_blank"
                            :alt="l.website.text">
                           {{ l.website.text }}
                         </a>
                        </th>
                      </tr>

                      <tr>
                        <th scope="row">
                          Socials:
                          <template v-for="s, i in l.socials">
                            <a
                              class="external"
                              target="_blank"
                              :href="s.url"
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
            </dataSectionComponent>

            <!-- officials -->
            <dataSectionComponent
              v-if="folks"
              id="officials"
              title="Elected City Officials">

              <div
                slot="officials"
                class="contacts">
                <div class="row">

                  <!-- Mayor -->
                  <section
                    v-if="folks.officials.mayor"
                    id="mayor">
                    <personComponent
                      :map="false"
                      :imagePath="folks.officials.mayor.image"
                      :name="folks.officials.mayor.name"
                      :title="folks.officials.mayor.title"
                      :about="['The Office of the Mayor provides leadership, management, communication and strategic direction to the City of Bloomington government. This is accomplished through public engagement, in cooperation with City Council and the City Clerk, to determine and implement the priorities of our community’s residents.']"
                      :tableInfo="{
                        website: {
                          ahref: folks.officials.mayor.url,
                          alt:   `Mayor - ${folks.officials.mayor.name}`,
                          text:   folks.officials.mayor.url
                        },
                        email: {
                          ahref: folks.officials.mayor.email,
                          text:  folks.officials.mayor.email
                        },
                        telephone: [
                          {
                            label: 'Office',
                            number: folks.officials.mayor.phone.office
                          }
                        ],
                        address: {
                          addressTitle: 'Office of the Mayor',
                          streetAddress: folks.officials.mayor.streetAddress,
                          suite: folks.officials.mayor.suite,
                          cityStateZip: folks.officials.mayor.cityStateZip,
                        }
                      }" />
                  </section>

                  <!-- District Rep. -->
                  <section
                    v-if="districtRep"
                    ref="districtRep"
                    id="districtRep">

                    <personComponent
                      :map="true"
                      :imagePath="districtRep.image"
                      :name="districtRep.name"
                      :title="districtRep.title"
                      :tableInfo="{
                        website: {
                          ahref: districtRep.url,
                          alt:   `Council District Representative - ${districtRep.name}`,
                          text:   districtRep.url
                        },
                        email: {
                          ahref: districtRep.email,
                          text:  districtRep.email
                        },
                        telephone: [
                          {
                            label:  'Office',
                            number: districtRep.phone.office
                          }
                        ],
                        address: {
                          streetAddress: districtRep.streetAddress,
                          cityStateZip:  districtRep.cityStateZip,
                        }
                      }">

                      <GmapMap
                        slot="map"
                        ref="districtMap"
                        map-type-id="roadmap"
                        :center="districtRepGeoCoordsCenter || latLong"
                        :zoom="13"
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
                          :draggable="false"/>

                        <GmapPolygon
                          :paths="districtRepGeoCoords"
                          :options="{
                            strokeColor:    'rgb(30, 90, 174)',
                            strokeOpacity:  0.8,
                            strokeWeight:   2,
                            fillColor:      'rgb(30, 90, 174)',
                            fillOpacity:    0.35
                          }"/>
                      </GmapMap>
                    </personComponent>
                  </section>

                  <!-- Council -->
                  <section
                    v-if="folks.council"
                    id="council">
                    <personComponent
                      v-for="person, i in folks.council"
                      :key="i"
                      :map="false"
                      :imagePath="person.image"
                      :name="person.name"
                      :title="person.title"
                      :tableInfo="{
                        website: {
                          ahref: person.url,
                          alt:   `City Council At-Large Representative - ${person.name}`,
                          text:  person.url
                        },
                        email: {
                          ahref: person.email,
                          text:  person.email
                        },
                        telephone: [
                          {
                            label: 'Office',
                            number: person.phone.office
                          }
                        ],
                        address: {
                          streetAddress: person.streetAddress,
                          cityStateZip:  person.cityStateZip,
                        }
                      }" />
                  </section>

                  <!-- Clerk -->
                  <section
                    v-if="folks.officials.clerk"
                    id="clerk">
                    <personComponent
                      :map="false"
                      :imagePath="folks.officials.clerk.image"
                      :name="folks.officials.clerk.name"
                      :title="folks.officials.clerk.title"
                      :about="[`The City of Bloomington's Clerk's Office strives to make city government as accessible and responsive to the community as possible. The office serves as an educational liaison between citizens and their government. We respond to inquiries by telephone, in writing, or in person from a variety of interested persons regarding matters pertaining to City Council actions, or related City information retained in the City Clerk's office. We work closely with the City Council to supply combined constituent services.`,`We work closely with the City Council to supply combined constituent services. For election information contact the <a class=external href='https://www.co.monroe.in.us/department/?structureid=18' target='_blank' alt='Monroe County Clerk's Office'>Monroe County Clerk's Office</a> or <a class='external' href='https://www.co.monroe.in.us/department/division.php?structureid=89' target='_blank' alt='Voter Registration'>Voter Registration</a>.`]"
                      :tableInfo="{
                        website: {
                          ahref: folks.officials.clerk.url,
                          alt:   `Mayor - ${folks.officials.clerk.name}`,
                          text:   folks.officials.clerk.url
                        },
                        email: {
                          ahref: folks.officials.clerk.email,
                          text:  folks.officials.clerk.email
                        },
                        telephone: [
                          {
                            label: 'Office',
                            number: folks.officials.clerk.phone.office
                          }
                        ],
                        address: {
                          addressTitle: 'City Clerk',
                          streetAddress: folks.officials.clerk.streetAddress,
                          suite: folks.officials.clerk.suite,
                          cityStateZip: folks.officials.clerk.cityStateZip,
                        }
                      }" />
                  </section>
                </div>
              </div>
            </dataSectionComponent>

            <!-- TABs: require modification to anchorHashClick() -->
            <template v-if="parksResData || playgroundsResData || safePlaceResData || schoolsResData">
              <h2>Nearby Amenities</h2>

              <example-tabs
                class="nearby-amenities"
                ref="tabs"
                id="data-tabs">
                
                <!-- parks -->
                <fn1-tab
                  v-if="parksResData"
                  name="Parks"
                  id="parks"
                  :selected="true">
                  <section class="parks">
                    <header>
                      <div>
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="tree" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="svg-inline--fa fa-tree fa-w-12 fa-3x"><path fill="currentColor" d="M378.31 378.49L298.42 288h30.63c9.01 0 16.98-5 20.78-13.06 3.8-8.04 2.55-17.26-3.28-24.05L268.42 160h28.89c9.1 0 17.3-5.35 20.86-13.61 3.52-8.13 1.86-17.59-4.24-24.08L203.66 4.83c-6.03-6.45-17.28-6.45-23.32 0L70.06 122.31c-6.1 6.49-7.75 15.95-4.24 24.08C69.38 154.65 77.59 160 86.69 160h28.89l-78.14 90.91c-5.81 6.78-7.06 15.99-3.27 24.04C37.97 283 45.93 288 54.95 288h30.63L5.69 378.49c-6 6.79-7.36 16.09-3.56 24.26 3.75 8.05 12 13.25 21.01 13.25H160v24.45l-30.29 48.4c-5.32 10.64 2.42 23.16 14.31 23.16h95.96c11.89 0 19.63-12.52 14.31-23.16L224 440.45V416h136.86c9.01 0 17.26-5.2 21.01-13.25 3.8-8.17 2.44-17.47-3.56-24.26z" class=""></path></svg>

                        <blockquote>
                          <p>The <strong>{{ cityName }}</strong> <a class="external" href="https://bloomington.in.gov/parks" alt="City of Bloomington Parks and Recreation">Parks and Recreation</a> Department provides essential services, facilities and programs necessary for the positive development and well-being of the community through the provision of parks, greenways, trails and recreational facilities while working in cooperation with other service providers in the community in order to maximize all available resources.</p>

                          <p class="hide-viewport-small">
                            <small>* Approximate distance.</small>
                          </p>

                          <p>
                            <strong>Note: </strong>
                            Click a row for directions.
                          </p>
                        </blockquote>
                      </div>
                    </header>

                    <table>
                      <caption class="sr-only">
                          {{ cityName }} Parks
                        </caption>
                        <thead class="sr-only">
                          <tr>
                            <th scope="col">Distance</th>
                            <th scope="col">Park Name</th>
                            <th scope="col">Directions Link</th>
                          </tr>
                        </thead>

                      <tbody>
                        <template
                          v-for="p, i in viaDistance(parksResData.features)"
                          v-if="i <= 10">
                          <template v-if="p.lat && p.lon">
                            <tr
                              :class="[{'clickable': p.lat && p.lon}]"
                              @click="goToAddress(p.lat, p.lon)">
                              <td>
                                {{ p.dist }} mi *
                              </td>
                              <td>
                                <a
                                  href="#"
                                  class="external"
                                  @click.prevent>
                                  {{ p.name }}
                                </a>
                              </td>
                              <td >
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="directions" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-directions fa-w-16 fa-3x"><path fill="currentColor" d="M502.61 233.32L278.68 9.39c-12.52-12.52-32.83-12.52-45.36 0L9.39 233.32c-12.52 12.53-12.52 32.83 0 45.36l223.93 223.93c12.52 12.53 32.83 12.53 45.36 0l223.93-223.93c12.52-12.53 12.52-32.83 0-45.36zm-100.98 12.56l-84.21 77.73c-5.12 4.73-13.43 1.1-13.43-5.88V264h-96v64c0 4.42-3.58 8-8 8h-32c-4.42 0-8-3.58-8-8v-80c0-17.67 14.33-32 32-32h112v-53.73c0-6.97 8.3-10.61 13.43-5.88l84.21 77.73c3.43 3.17 3.43 8.59 0 11.76z" class=""></path></svg>directions
                              </td>
                            </tr>
                          </template>

                          <template v-else>
                            <tr>
                              <td>{{ p.dist }} mi *</td>
                              <td>{{ p.name }}</td>
                              <td>- - -</td>
                            </tr>
                          </template>
                        </template>
                      </tbody>
                    </table>
                  </section>
                </fn1-tab>

                <!-- playgrounds -->
                <fn1-tab
                  id="playgrounds"
                  v-if="playgroundsResData"
                  name="Playgrounds">
                  <section class="playgrounds">
                    <header>
                      <div>
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="shapes" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-shapes fa-w-16 fa-3x"><path fill="currentColor" d="M512 320v160c0 17.67-14.33 32-32 32H320c-17.67 0-32-14.33-32-32V320c0-17.67 14.33-32 32-32h160c17.67 0 32 14.33 32 32zm-384-64C57.31 256 0 313.31 0 384s57.31 128 128 128 128-57.31 128-128-57.31-128-128-128zm351.03-32c25.34 0 41.18-26.67 28.51-48L412.51 16c-12.67-21.33-44.35-21.33-57.02 0l-95.03 160c-12.67 21.33 3.17 48 28.51 48h190.06z" class=""></path></svg>

                        <blockquote>
                          <p><strong>Playgrounds</strong> located nearby.</p>

                          <p class="hide-viewport-small">
                            <small>* Approximate distance.</small>
                          </p>

                          <p>
                            <strong>Note: </strong>
                            Click a row for directions.
                          </p>
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
                        <template
                          v-for="p, i in viaDistance(playgroundsResData.features)"
                          v-if="i <= 10">
                          <template v-if="p.lat && p.lon">
                            <tr
                              :class="[{'clickable': p.lat && p.lon}]"
                              @click="goToAddress(p.lat, p.lon)">
                              <td>
                                {{ p.dist }} mi *
                              </td>
                              <td >
                                <a
                                  href="#"
                                  class="external"
                                  @click.prevent>
                                  {{ p.name }}
                                </a>
                              </td>
                              <td>
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="directions" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-directions fa-w-16 fa-3x"><path fill="currentColor" d="M502.61 233.32L278.68 9.39c-12.52-12.52-32.83-12.52-45.36 0L9.39 233.32c-12.52 12.53-12.52 32.83 0 45.36l223.93 223.93c12.52 12.53 32.83 12.53 45.36 0l223.93-223.93c12.52-12.53 12.52-32.83 0-45.36zm-100.98 12.56l-84.21 77.73c-5.12 4.73-13.43 1.1-13.43-5.88V264h-96v64c0 4.42-3.58 8-8 8h-32c-4.42 0-8-3.58-8-8v-80c0-17.67 14.33-32 32-32h112v-53.73c0-6.97 8.3-10.61 13.43-5.88l84.21 77.73c3.43 3.17 3.43 8.59 0 11.76z" class=""></path></svg>directions
                              </td>
                            </tr>
                          </template>

                          <template v-else>
                            <tr>
                              <td>{{ p.dist }} mi *</td>
                              <td>{{ p.name }}</td>
                              <td>- - -</td>
                            </tr>
                          </template>
                        </template>
                      </tbody>
                    </table>
                  </section>
                </fn1-tab>

                <!-- safe places -->
                <fn1-tab
                  id="safe-places"
                  v-if="safePlaceResData"
                  name="Safe Places">
                  <section class="safe-places">
                    <header>
                      <div>
                        <svg enable-background="new 0 0 580 580" version="1.1" viewBox="0 0 580 580" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m563.85 252.15l-236.43-236.45c-20.916-20.912-54.822-20.912-75.738 0l-236.45 236.45c-20.913 20.922-20.913 54.834 0 75.757l236.45 236.44c20.916 20.91 54.822 20.91 75.738 0l236.44-236.44c20.916-20.924 20.91-54.841-0.01258-75.757zm-13.314 63.973l-234.89 234.9c-14.419 14.403-37.779 14.403-52.198 0l-234.9-234.9c-14.389-14.42-14.389-37.767 0-52.187l234.9-234.91c6.9074-6.9452 16.306-10.838 26.102-10.812 9.7933-0.022503 19.189 3.8701 26.097 10.812l234.89 234.91c14.385 14.421 14.385 37.765-3.9e-6 52.187z" fill="currentColor"/><path d="m134.62 286.75h-12.426v25.843h12.426c7.6785 0 12.559-5.6115 12.559-12.923 0-7.3198-4.8808-12.921-12.559-12.921z" fill="currentColor"/><polygon points="260.03 184.45 259.79 184.45 248.2 219.8 271.36 219.8" fill="currentColor"/><path d="m482.2 357.11c1.8473-0.040375 3.3233-1.5501 3.3227-3.3981-0.039734-1.8361-1.5607-3.2929-3.3975-3.2525-1.8361 0.039703-3.2922 1.5607-3.2525 3.3975 0.039062 1.8089 1.5177 3.2545 3.3273 3.2532zm-1.7593-1.296v-4.2427c0-0.16879 0.076111-0.25351 0.27466-0.25351h1.5581c1.1815 0 1.7831 0.35809 1.7831 1.4244 0.068848 0.67645-0.42361 1.2801-1.1001 1.3489-0.035065 0.0039673-0.07016 0.0059509-0.10522 0.0066223l1.0458 1.613c0.062897 0.084717 0.10526 0.18335 0.12247 0.28726 0 0.12906-0.24823 0.22372-0.4415 0.22372-0.19327 0.013245-0.37595-0.090668-0.46265-0.2641l-1.1345-1.8341h-0.76843v1.6905c0 0.26144-0.12842 0.40771-0.38455 0.40771-0.19528 0.019196-0.36935-0.12311-0.38919-0.31836-0.0033265-0.029785-0.0020142-0.05957 0.0019836-0.089356z" fill="currentColor"/><path d="m483.28 352.67c0-0.58047-0.57516-0.64603-1.0848-0.64603h-0.98026v1.4012h0.89883c0.61224 0 1.1662-0.031097 1.1662-0.75519z" fill="currentColor"/><path d="m543.38 308.97c0.0040283-0.0039673 0.0073242-0.0072937 0.011292-0.011261 10.456-10.462 10.452-27.421-0.011292-37.878l-234.89-234.9c-5.0224-5.0164-11.833-7.8334-18.931-7.8308-7.1054-0.0066185-13.921 2.8124-18.946 7.8361l-234.9 234.9c-10.458 10.465-10.458 27.424 0 37.889l234.9 234.9 6.714e-4 6.714e-4c10.46 10.459 27.417 10.459 37.876-6.714e-4l234.89-234.9zm-65.478 44.747c0.0032959-2.3742 1.9307-4.2957 4.3049-4.2923 2.3748 0.0039673 4.2963 1.9314 4.293 4.3056-0.0039978 2.3722-1.9287 4.293-4.301 4.2923-2.3729 0-4.297-1.9234-4.297-4.2963 1e-7 -0.0033263 1e-7 -0.0059509 1e-7 -0.0092773zm-53.396-72.454c0-6.0973 3.0453-10.605 9.5054-10.605h30.24c0.28394-0.018555 0.56921-0.022522 0.85449-0.011932 4.4816 0.1741 7.9744 3.9475 7.8004 8.4291 0.0039673 0.19263 0.0013123 0.38455-0.008606 0.57651-0.22638 4.5492-4.0977 8.0532-8.6462 7.8268h-21.468v17.798h20.004c5.9755 0 8.9037 4.1606 8.9037 8.4139 6.714e-4 0.18268-0.0046387 0.36536-0.015869 0.54807-0.28464 4.6239-4.2639 8.1419-8.8878 7.8572h-20.004v18.547h22.56c0.28925-0.019867 0.5798-0.023834 0.86905-0.012573 4.479 0.17407 7.9685 3.9462 7.7944 8.4252 0.0032959 0.19327 6.714e-4 0.38718-0.0092773 0.58047-0.23364 4.5465-4.1077 8.0426-8.6542 7.8089h-31.445c-5.3719 0-9.3929-3.6324-9.3929-9.1096v-67.072zm-64.122-103.76c0-6.1105 3.0486-10.626 9.508-10.626h30.238c0.28195-0.019196 0.56461-0.023163 0.84723-0.011902 4.4889 0.17076 7.989 3.9482 7.8182 8.4371 0.0039673 0.19856 0.0013123 0.39713-0.0092773 0.5957-0.23563 4.5452-4.111 8.0393-8.6562 7.8036h-21.46v17.813h20c5.9709 0 8.9044 4.1494 8.9044 8.404 6.714e-4 0.18401-0.0046387 0.36801-0.0159 0.55202-0.27997 4.6286-4.2592 8.1538-8.8885 7.8732h-20v18.524h22.565c0.2919-0.019852 0.58511-0.023163 0.87766-0.011246 4.477 0.18268 7.9579 3.9601 7.7752 8.4371 0.0039673 0.18864 0.0013123 0.37727-0.0079346 0.56592-0.22174 4.5531-4.0918 8.0644-8.6449 7.8434h-31.461c-0.24756 0.013229-0.49509 0.01654-0.74265 0.0092621-4.9185-0.1423-8.7899-4.2453-8.6476-9.1638v-67.045zm26.27 91.708c8.8984 0 26.214 2.9149 26.214 13.645 0 4.3996-3.0374 8.1664-7.5548 8.1664-4.9926 0-8.4066-4.2665-18.659-4.2665-15.104 0-22.921 12.798-22.921 27.685 0 14.491 7.9254 26.928 22.921 26.928 10.253 0 14.393-5.1223 19.399-5.1223 5.4818 0 8.0433 5.4883 8.0433 8.302 0 11.698-18.408 14.383-27.443 14.383-24.74 0-41.931-19.63-41.931-44.87 0-25.358 17.065-44.851 41.931-44.851zm-73.964-102.33h31.205c4.4637 0.12444 8.0525 3.7132 8.1776 8.177 0.12973 4.6458-3.5312 8.5178-8.1776 8.6476h-22.437v17.813h18.905c5.8531 0 8.7707 4.1494 8.7707 8.2848 0.0072632 0.24159 0.0039673 0.48318-0.0099487 0.72411-0.25943 4.5789-4.1818 8.0803-8.7607 7.8202h-18.906v26.585c0 6.0781-3.9025 9.4987-9.1387 9.4987-5.2388 0-9.144-3.4206-9.144-9.4987v-68.516c-0.01059-0.25085-0.01123-0.50237-6.409e-4 -0.75322 0.20187-5.0529 4.4624-8.9851 9.516-8.7826zm-90.333 74.992l24.503-66.32c2.077-5.6062 6.8307-10.122 13.047-10.122 6.4647 0 10.977 4.2553 13.048 10.122l23.893 66.32c0.5712 1.4403 0.9028 2.9639 0.98288 4.5108-0.039703 4.4955-3.7158 8.1075-8.2107 8.0684-0.070831-6.561e-4 -0.14166-0.0026398-0.21182-0.0046387-4.1064 0.30382-7.8447-2.3643-8.8918-6.3462l-3.6523-11.468h-33.901l-3.6636 11.343c-0.9637 4.0051-4.6696 6.736-8.7806 6.4713-4.8417 0.14165-8.8819-3.6682-9.0242-8.5099 0-0.013901-6.561e-4 -0.028473-0.0013275-0.042374 0.012573-1.3853 0.30646-2.7534 0.8631-4.0223zm-63.144-48.778c0-17.063 14.021-27.669 30.236-27.669 6.8307 0 23.899 2.5628 23.899 12.199 0 4.7563-3.1777 9.0149-8.167 9.0149-5.0019 0-8.9011-3.649-16.22-3.649-5.2362 0-9.9912 2.8216-9.9912 7.9215 0 12.548 40.719 4.4988 40.719 35.968 0 17.434-14.389 28.284-31.217 28.284-9.3842 0-29.617-2.1935-29.617-13.659 0-4.749 3.1625-8.6555 8.1544-8.6555 5.7366 0 12.567 4.7709 20.487 4.7709 8.0466 0 12.432-4.532 12.432-10.491 0-14.402-40.713-5.7432-40.713-34.034zm-23.493 135.61h-13.522v19.977c0 6.1132-3.9091 9.5259-9.1532 9.5259-5.2388 0-9.1427-3.4127-9.1427-9.5259v-68.499c0-5.7531 3.4067-9.5186 9.5087-9.5186h21.58c17.923 0 31.207 11.698 31.207 29.13 1e-7 17.803-13.773 28.91-30.477 28.91zm79.801 28.747h-30.487c-5.9676 0-9.4954-3.882-9.4954-9.966v-68.047c0-6.0973 3.9058-9.506 9.1367-9.506 5.2415 0 9.1493 3.4087 9.1493 9.506v61.211h21.696c0.35477-0.023163 0.71021-0.022522 1.0656 0 4.5531 0.29651 8.0042 4.2275 7.7083 8.7806-0.26608 4.6107-4.1586 8.169-8.774 8.0214zm72.996 1.1411v-44.583h-28.278v44.583h-19.098c-4.2387-0.0059814-7.6706-3.4465-7.6666-7.6852v-26.389h-1.6587c-2.4523-0.0053101-4.7391-1.2364-6.0933-3.2803-0.038391-0.062897-0.071487-0.12842-0.099945-0.19592-0.22505-0.33493-0.41302-0.69366-0.56062-1.0696-0.054276-0.13766-0.099289-0.27866-0.13568-0.42163-0.11517-0.30447-0.20518-0.61755-0.26807-0.93591-0.06752-0.32101-0.10393-0.64731-0.10722-0.97562-0.0052948-0.14362-0.039062-0.27798-0.039062-0.42825v-0.022492c6.714e-4 -0.47986 0.049652-0.9584 0.14629-1.4283 0.030441-0.1304 0.068832-0.25815 0.11649-0.38324 0.068832-0.33624 0.16812-0.66519 0.29652-0.98291 0.046997-0.10458 0.10062-0.18002 0.15819-0.28329 0.35081-0.7724 0.832-1.4786 1.4217-2.0876l49.977-49.964c0.0046387-0.0046082 0.0092468-0.0092468 0.013886-0.013886 2.8514-2.8435 7.4681-2.8375 10.312 0.013886l49.974 49.964c0.58643 0.61224 1.0676 1.3178 1.4244 2.0876 0.052277 0.10327 0.10721 0.17871 0.14893 0.28329 0.13104 0.33624 0.23761 0.68176 0.31903 1.0339 0.023834 0.12576 0.08075 0.21048 0.10721 0.33228 0.090698 0.47855 0.13901 0.96368 0.14365 1.4508 0 0.092682-0.023163 0.15027-0.023163 0.24558-0.0066223 0.39713-0.045013 0.79294-0.11517 1.1841-0.073486 0.27469-0.16217 0.56461-0.25879 0.84589-0.044373 0.16879-0.098633 0.33493-0.16217 0.49774-0.15027 0.35278-0.32831 0.69299-0.53348 1.0173-0.044342 0.068817-0.07016 0.16415-0.12509 0.2363-1.3536 2.0452-3.6411 3.277-6.094 3.2803h-1.6514v26.389c6.714e-4 4.2407-3.4345 7.6805-7.6752 7.6852h-33.916z" fill="currentColor"/></svg>

                        <blockquote>
                          <p><strong>Safe Places</strong> are identified by the bright yellow Safe Place sign. A youth can enter a Safe Place at any time and ask for help. Within a few minutes a trained volunteer arrives to meet the youth and assist in defusing the crisis.</p>

                          <p><strong>Please Note:</strong> If you are seeking <strong>Safe Place Services</strong>, or are a <strong>youth in crisis</strong>, please contact the <strong>Binkley House Youth Shelter</strong> directly at <strong>812-349-2507</strong>.</p>

                          <p class="hide-viewport-small">
                            <small>* Approximate distance.</small>
                          </p>

                          <p>
                            <strong>Note: </strong>
                            Click a row for directions.
                          </p>
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
                        <template
                          v-for="p, i in viaDistance(safePlaceResData.feed.entry)"
                          v-if="i <= 10">
                          <template v-if="p.gsx$lat.$t && p.gsx$lon.$t">
                            <tr
                              :class="[{'clickable': p}]"
                              @click="goToAddress(p.gsx$lat.$t, p.gsx$lon.$t)">
                              <td>
                                {{ p.dist }} mi *
                              </td>
                              <td>
                                <a
                                  href="#"
                                  class="external"
                                  @click.prevent>
                                  {{ p.gsx$name.$t }}
                                </a>
                              </td>
                              <td>
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="directions" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-directions fa-w-16 fa-3x"><path fill="currentColor" d="M502.61 233.32L278.68 9.39c-12.52-12.52-32.83-12.52-45.36 0L9.39 233.32c-12.52 12.53-12.52 32.83 0 45.36l223.93 223.93c12.52 12.53 32.83 12.53 45.36 0l223.93-223.93c12.52-12.53 12.52-32.83 0-45.36zm-100.98 12.56l-84.21 77.73c-5.12 4.73-13.43 1.1-13.43-5.88V264h-96v64c0 4.42-3.58 8-8 8h-32c-4.42 0-8-3.58-8-8v-80c0-17.67 14.33-32 32-32h112v-53.73c0-6.97 8.3-10.61 13.43-5.88l84.21 77.73c3.43 3.17 3.43 8.59 0 11.76z" class=""></path></svg>directions
                              </td>
                            </tr>
                          </template>

                          <template v-else>
                            <tr>
                              <td>{{ p.dist }} mi *</td>
                              <td>{{ p.gsx$name.$t }}</td>
                              <td>- - -</td>
                            </tr>
                          </template>
                        </template>
                      </tbody>
                    </table>
                  </section>
                </fn1-tab>

                <!-- schools -->
                <fn1-tab
                  id="schools"
                  v-if="schoolsResData"
                  name="Schools">
                  <section class="schools">
                    <header>
                      <div>
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="graduation-cap" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="svg-inline--fa fa-graduation-cap fa-w-20 fa-3x"><path fill="currentColor" d="M622.34 153.2L343.4 67.5c-15.2-4.67-31.6-4.67-46.79 0L17.66 153.2c-23.54 7.23-23.54 38.36 0 45.59l48.63 14.94c-10.67 13.19-17.23 29.28-17.88 46.9C38.78 266.15 32 276.11 32 288c0 10.78 5.68 19.85 13.86 25.65L20.33 428.53C18.11 438.52 25.71 448 35.94 448h56.11c10.24 0 17.84-9.48 15.62-19.47L82.14 313.65C90.32 307.85 96 298.78 96 288c0-11.57-6.47-21.25-15.66-26.87.76-15.02 8.44-28.3 20.69-36.72L296.6 284.5c9.06 2.78 26.44 6.25 46.79 0l278.95-85.7c23.55-7.24 23.55-38.36 0-45.6zM352.79 315.09c-28.53 8.76-52.84 3.92-65.59 0l-145.02-44.55L128 384c0 35.35 85.96 64 192 64s192-28.65 192-64l-14.18-113.47-145.03 44.56z" class=""></path></svg>

                        <blockquote>
                          <p>Local <strong>Schools</strong> nearby the requested Address.</p>

                          <p><strong>Please Note:</strong> This <strong>does not</strong> indicate the appropriate <a class="external" :href="districtLookupPath" target="_blank" alt="Bloomington School Districts">School District</a></strong> nor any <strong>Higher Educational</strong> institutions.</p>

                          <p class="hide-viewport-small">
                            <small>* Approximate distance.</small>
                          </p>

                          <p>
                            <strong>Note: </strong>
                            Click a row for directions.
                          </p>
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
                        <template
                          v-for="p, i in viaDistance(schoolsResData.features)"
                          v-if="i <= 10 && schoolTypeToggle.includes(p.type)">
                          <template v-if="p.lat && p.lon">
                            <tr
                              :class="[{'clickable': p.lat && p.lon}]"
                              @click="goToAddress(p.lat, p.lon)">
                              <td>
                                {{ p.dist }} mi *
                              </td>
                              <td>
                                <a
                                  href="#"
                                  class="external"
                                  @click.prevent>
                                  {{ p.name }}
                                </a>
                              </td>
                              <td>
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="directions" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-directions fa-w-16 fa-3x"><path fill="currentColor" d="M502.61 233.32L278.68 9.39c-12.52-12.52-32.83-12.52-45.36 0L9.39 233.32c-12.52 12.53-12.52 32.83 0 45.36l223.93 223.93c12.52 12.53 32.83 12.53 45.36 0l223.93-223.93c12.52-12.53 12.52-32.83 0-45.36zm-100.98 12.56l-84.21 77.73c-5.12 4.73-13.43 1.1-13.43-5.88V264h-96v64c0 4.42-3.58 8-8 8h-32c-4.42 0-8-3.58-8-8v-80c0-17.67 14.33-32 32-32h112v-53.73c0-6.97 8.3-10.61 13.43-5.88l84.21 77.73c3.43 3.17 3.43 8.59 0 11.76z" class=""></path></svg>directions
                              </td>
                            </tr>
                          </template>

                          <template v-else>
                            <tr>
                              <td>{{ p.dist }} mi *</td>
                              <td>{{ p.name }}</td>
                              <td>- - -</td>
                            </tr>
                          </template>
                        </template>
                      </tbody>
                    </table>

                    <!-- NOTE: we need to set Data on this
                        if we plan to use the feature. -->
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
                  </section>
                </fn1-tab>
              </example-tabs>
            </template>

            <!-- coords -->
            <dataSectionComponent
              v-if="locationResDataNew.address"
              id="coords"
              title="Coordinate Details">

              <svg slot="icon" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="location-arrow" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-location-arrow fa-w-16 fa-3x"><path fill="currentColor" d="M444.52 3.52L28.74 195.42c-47.97 22.39-31.98 92.75 19.19 92.75h175.91v175.91c0 51.17 70.36 67.17 92.75 19.19l191.9-415.78c15.99-38.39-25.59-79.97-63.97-63.97z" class=""></path></svg>

              <blockquote slot="excerpt">
                <p>The <strong>{{ cityName }}</strong> <a class="external" href="https://bloomington.in.gov/gis" alt="City of Bloomington GIS" target="_blank">GIS Department</a> staff maintains spatial data and provides mapping and spatial analysis services to support operations of City Departments, Boards and Commissions.</p>

                <p>Native coordinate reference system is:<br><strong>NAD 83 State Plane Indiana West Zone (1302) US Survey Feet EPSG:2966</strong></p>
              </blockquote>

              <table slot="table">
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
                  <tr v-if="locationResDataNew.address.state_plane_x && locationResDataNew.address.state_plane_y">
                    <th scope="row">State Plane X / Y:</th>
                    <td>{{ locationResDataNew.address.state_plane_x }}, {{ locationResDataNew.address.state_plane_y }}</td>
                  </tr>

                  <tr v-if="locationResDataNew.address.latitude && locationResDataNew.address.longitude">
                    <th scope="row">Latitude / Longitude:</th>
                    <td>{{ locationResDataNew.address.latitude }}, {{ locationResDataNew.address.longitude }}</td>
                  </tr>
                </tbody>
              </table>
            </dataSectionComponent>
          </template>
        </div>
      </div>

      <!-- addressMappedErrorModal -->
      <exampleModal
        v-show="modals.addressMappedError"
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

      <a
        v-if="showToTopArrow"
        class="scroll-to-top"
        alt="Scroll to top of the page"
        @click="scrollToTop($event)">
        <span>scroll to top of the page</span>
      </a>
    </div>
  </div>
</template>

<script>
import axios                from 'axios'
import { mapFields }        from 'vuex-map-fields'
import proj4                from 'proj4'
import moment               from 'moment'
import debounce             from 'lodash.debounce'
import smoothscroll         from 'smoothscroll-polyfill'
import exampleSearch        from '~/components/exampleSearch'
import exampleModal         from '~/components/exampleModal'
import exampleTabs          from '~/components/exampleTabs'
import personComponent      from '~/components/personComponent'
import dataSectionComponent from '~/components/dataSectionComponent'
import footerComponent      from '~/components/footerComponent'
import loader               from '~/components/loader'

import parksResData         from '~/static/data/cob-parks.json'

export default {
  layout: 'result',
  components: {
    loader,
    exampleSearch,
    exampleModal,
    exampleTabs,
    personComponent,
    dataSectionComponent,
    footerComponent
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      let addressQueryParam = to.query.address;

      if(addressQueryParam){
        vm.addressSearchAuto = addressQueryParam;
        vm.searchSubmit(addressQueryParam);
      } else {
        vm.$router.replace('index')
      }
    });
  },
  data() {
    // data shared via: universal-methods.js
    return {
      todaysDate:            null,
      tomorrowsDate:         null,
      mapRef:                this.$vm0,
      inRoadsData:           null,
      inRoadsDataNew:        [],
      infoWindowVisible:     {
        inRoads: {
          id:                  null,
          opened:              false,
        },
        parks: {
          id:                  null,
          opened:              false,
        },
        schools: {
          id:                  null,
          opened:              false,
        },
        playgrounds: {
          id:                  null,
          opened:              false,
        },
        safeplaces: {
          id:                  null,
          opened:              false,
        }
      },
      titleAddress:          null,
      expandedMap:           false,
      showScrollToTopArrow:  false,
      topSectionPixels:      680,
      scrolledFromTopAmount: null,
      viewingHeight:         null,
    }
  },
  asyncData ({ params }) {
    return { parksResData }
  },
  beforeCreate: function() {
    this.loading = true;
  },
  created: function() {
    this.todaysDate     = moment().format('YYYY-MM-DD');
    this.tomorrowsDate  = moment().add(1, 'days').format('YYYY-MM-DD');

    this.getInRoadsData(this.todaysDate, this.tomorrowsDate)
    .then((res) => {
      this.inRoadsData = res;

      if(res) {
        let betweenParentheses  = /\(([^)]+)\)/g,
            geoCollectionTest   = /^[^\(]*/g,
            startParantheses    = /\(([^)]+)/g,
            geoCollection       = "GEOMETRYCOLLECTION",
            lineType            = "LINESTRING",
            pointType           = "POINT",
            closeParan          = ")",
            newData             = [],
            newTest             = [];

        res.map((e, i) => {
          let isGeoCollection   = e.geography.startsWith(geoCollection);

          if(isGeoCollection) {
            let rmGeoCollection = e.geography.split(geoCollection).pop().slice(0, -1),
                newNew          = rmGeoCollection.split("','");

            let newArray = newNew.map(function (v, i, a) {
              return v.split(",");
            });

            newArray = newArray[0];

            let coords = newArray.map((e, i) => {
              let isLineType  = e.includes(lineType),
                  isPointType = e.includes(pointType),
                  commaEnd    = e.endsWith(closeParan),
                  p           = e.replace(/\(|\)/g, '');

              if (isLineType) {
                p = p.replace(lineType, '')
              } else if (isPointType) {
                p = p.replace(pointType, '')
              } else if (commaEnd) {
                p = p.replace(commaEnd, '')
              } else {
                p = p
              }

              p = p.replace(/ /g, ',').split(',');
              return { lat: parseFloat(p[1]), lng: parseFloat(p[0]) };
            });

            let center = this.polygonCenter(coords);

            this.inRoadsDataNew.push({ ...e, coords, center })
          } else {
            let coordString = e.geography.match(/\((.*?)\)/)[1];
                coordString = coordString.split(",");

            let coords = coordString.map((e, i) => {
              e = e.replace(/ /g, ',').split(',');
              return { lat: parseFloat(e[1]), lng: parseFloat(e[0]) };
            });

            let center = this.polygonCenter(coords);
            
            this.inRoadsDataNew.push({ ...e, coords, center})
          }
        })
      }
      console.log(`%c getInRoadsData 🔌 `,
                  this.consoleLog.success);
    })
    .catch((e)  => {
      console.log(`getInRoadsData Failed 🛑`,
                  `\n\n ${e} \n\n`);
    });
    
    this.$nextTick(() => {
      this.loading = false;
      if (process.client) {
        smoothscroll.polyfill();
        window.addEventListener("resize", this.calcViewingHeight);
        window.addEventListener("scroll", this.scrolledFromTop);
      }
    });
    
    if(!this.cityBoundary) {
      this.getCityBoundaryGeoJson()
      .then((res) => {
        this.setCityBoundary(res);
        console.log(`%c getCityBoundaryGeoJson 🔌 `,
                    this.consoleLog.success);
      })
      .catch((e) => {
        console.log(`City Boundary Failed 🛑`,
                    `\n\n ${e} \n\n`);
      });
    }

    if(!this.weather) {
      this.getWeather()
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
    }

    this.getSafePlaces()
    .then((res) => {
      this.safePlaceResData = res;
      console.log(`getSafePlaces 🔌`);
    })
    .catch((e)  => {
      console.log(`getSafePlaces 🛑`,
                  `\n\n ${e} \n\n`);
    });

    this.getLocalSchools()
    .then((res) => {
      this.schoolsResData = res;
      this.schoolTypeToggle = this.schoolTypes.all;

      console.log(`getLocalSchools 🔌`);
    })
    .catch((e)  => {
      console.log(`getLocalSchools 🛑`,
                  `\n\n ${e} \n\n`);
    });

    this.getPlaygrounds()
    .then((res) => {
      this.playgroundsResData = res;
      console.log(`getPlaygrounds 🔌`);
    })
    .catch((e)  => {
      console.log(`getPlaygrounds 🛑`,
                  `\n\n ${e} \n\n`);
    });

    // We are waiting for GIS to update, so ref
    // this data statically.
    //
    // this.getCityOfBloomingtonParks()
    // .then((res) => {
    //   this.parksResData = res;
    //   console.log(`getCityOfBloomingtonParks 🔌`);
    // })
    // .catch((e) => {
    //   console.log(`getCityOfBloomingtonParks 🛑`,
    //               `\n\n ${e} \n\n`);
    // });

    this.getCouncilDistrictsGeoJson()
    .then((res) => {
      this.councilDistrictsGeoJson = res;
      console.log(`getCouncilDistrictsGeoJson 🔌`);
    })
    .catch((e) => {
      console.log(`getCouncilDistrictsGeoJson 🛑`,
                  `\n\n ${e} \n\n`);
    });
  },
  mounted: function() {
    this.$nextTick(() => {
      console.dir('RESULT mounted');
      this.calcViewingHeight();
    });
  },
  destroyed: function() {
    window.removeEventListener("resize", this.calcViewingHeight);
    window.removeEventListener("scroll", this.scrolledFromTop);
  },
  // watch: {
  //   defaultMap: {
  //     immediate: true,
  //     deep: true,
  //     handler(newValue, oldValue) {
  //       console.log(newValue);
  //       console.log(oldValue);
  //     }
  //   }
  // },
  computed: {
    // computed shared via: universal-computed.js
    showToTopArrow() {
      if(this.scrolledFromTopAmount >= this.topSectionPixels) {
        return true;
      }
    }
  },
  methods: {
    // methods shared via: universal-methods.js
    markerToWindowClick(type, id) {
      console.log(type);

      if(type == 'inRoads') {
        this.infoWindowVisible.inRoads.id = null;
        this.infoWindowVisible.inRoads.id = id;

        if(this.infoWindowVisible.inRoads.opened == false) {
          this.infoWindowVisible.inRoads.opened = true;
        } else {
          this.infoWindowVisible.inRoads.opened = false;
        }
      } else if(type == 'parks') {
        this.infoWindowVisible.parks.id = null;
        this.infoWindowVisible.parks.id = id;

        if(this.infoWindowVisible.parks.opened == false) {
          this.infoWindowVisible.parks.opened = true;
        } else {
          this.infoWindowVisible.parks.opened = false;
        }
      } else if(type == 'schools') {
        this.infoWindowVisible.schools.id = null;
        this.infoWindowVisible.schools.id = id;

        if(this.infoWindowVisible.schools.opened == false) {
          this.infoWindowVisible.schools.opened = true;
        } else {
          this.infoWindowVisible.schools.opened = false;
        }
      } else if(type == 'playgrounds') {
        this.infoWindowVisible.playgrounds.id = null;
        this.infoWindowVisible.playgrounds.id = id;

        if(this.infoWindowVisible.playgrounds.opened == false) {
          this.infoWindowVisible.playgrounds.opened = true;
        } else {
          this.infoWindowVisible.playgrounds.opened = false;
        }
      } else if(type == 'safeplaces') {
        this.infoWindowVisible.safeplaces.id = null;
        this.infoWindowVisible.safeplaces.id = id;

        if(this.infoWindowVisible.safeplaces.opened == false) {
          this.infoWindowVisible.safeplaces.opened = true;
        } else {
          this.infoWindowVisible.safeplaces.opened = false;
        }
      }

      
    },
    dateDifference(end) {
      let startDate = moment(this.todaysDate),
            endDate = moment(end);
      return endDate.diff(startDate, 'days')
    },
    expandMap() {
      let headerHeight    = 90,
          expandRowHeight = 45,
          newInnerHeight  = window.innerHeight - headerHeight - expandRowHeight;
      if(!this.expandedMap) {
        this.expandedMap = true;
        this.$refs.defaultMap.$el.style.height = `${newInnerHeight}px`
      } else {
        this.expandedMap = false;
        this.$refs.defaultMap.$el.style.height = '450px'
      }
    },
    scrolledFromTop() {
      this.scrolledFromTopAmount = window.scrollY || window.scrollTop || document.getElementsByTagName("html")[0].scrollTop;
    },
    calcViewingHeight() {
      this.viewingHeight = window.innerHeight;
    },
    scrollToTop(e) {
      e.preventDefault();
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    },
    anchorHashClick(e) {
      let jumpToRef       = e.target.value || e.target.dataset.jump,
          parksRef        = 'parks',
          playgroundsRef  = 'playgrounds',
          schoolsRef      = 'schools',
          safePlacesRef   = 'safe-places';

      // we care about these bc they are tabs
      if(jumpToRef == parksRef ||
         jumpToRef == playgroundsRef ||
         jumpToRef == schoolsRef ||
         jumpToRef == safePlacesRef) {

        var yOffset = -30;

        this.$refs.tabs.$children.forEach(tab => {
          switch(jumpToRef) {
            case parksRef:
              tab.isActive = tab.name == 'Parks';
              break;
            case playgroundsRef:
              tab.isActive = tab.name == 'Playgrounds'
              break;
            case schoolsRef:
              tab.isActive = tab.name == 'Schools'
              break;
            case safePlacesRef:
              tab.isActive = tab.name == 'Safe Places'
              break;
          }
        });

        var yCoordinate = document.getElementById('data-tabs').getBoundingClientRect().top + window.pageYOffset;
      } else {
        var yCoordinate = document.getElementById(jumpToRef).getBoundingClientRect().top + window.pageYOffset,
            yOffset = 0;
      }
      window.scrollTo({
        top: yCoordinate + yOffset,
        behavior: 'smooth'
      });
    },
    nearbyParkMarkers(){
      return this.nearbyMarkers(this.parksResData)
    },
    nearbySchoolMarkers(){
      return this.nearbyMarkers(this.schoolsResData)
    },
    nearbyPlaygroundMarkers(){
      return this.nearbyMarkers(this.playgroundsResData)
    },
    nearbySafePlaceMarkers(){
      return this.nearbyMarkers(this.safePlaceResData)
    },
  }
}
</script>

<style lang="scss" scoped>
  .top-wrapper {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }

  .content-wrapper {
    flex: 1;
  }

  .scroll-to-top {
    cursor: pointer;
    display: block;
    position: fixed;
    bottom: 20px;
    right: 20px;
    height: 40px;
    width: 30px;
    background-repeat: no-repeat;
    background-image: url("data:image/svg+xml,%3Csvg version='1.1' id='arrow-top' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 332.1 448' style='enable-background:new 0 0 332.1 448;' xml:space='preserve'%3E%3Cpath fill='%238c8c8c' d='M292.4,291.3l-95.4-98c-1.9-1.9-5.1-0.6-5.1,2.1V445c0,1.7-1.3,3-3,3h-46c-1.7,0-3-1.3-3-3V195.9c0-2.7-3.3-4-5.1-2.1 l-94.9,97.5c-1.2,1.2-3.1,1.2-4.3,0L2.1,258c-1.2-1.2-1.2-3.1,0-4.2L163.9,91.9c1.2-1.2,3.1-1.2,4.2,0L330,253.7 c1.2,1.2,1.2,3.1,0,4.2l-33.3,33.3C295.5,292.5,293.6,292.5,292.4,291.3z'/%3E%3Cpath fill='%238c8c8c' d='M332.1,3v46c0,1.7-1.3,3-3,3H3c-1.7,0-3-1.3-3-3V3c0-1.7,1.3-3,3-3h326.1C330.8,0,332.1,1.3,332.1,3z'/%3E%3C/svg%3E");

    &:hover,
    &:focus {
      background-image: url("data:image/svg+xml,%3Csvg version='1.1' id='arrow-top' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 332.1 448' style='enable-background:new 0 0 332.1 448;' xml:space='preserve'%3E%3Cpath fill='%231e5aae' d='M292.4,291.3l-95.4-98c-1.9-1.9-5.1-0.6-5.1,2.1V445c0,1.7-1.3,3-3,3h-46c-1.7,0-3-1.3-3-3V195.9c0-2.7-3.3-4-5.1-2.1 l-94.9,97.5c-1.2,1.2-3.1,1.2-4.3,0L2.1,258c-1.2-1.2-1.2-3.1,0-4.2L163.9,91.9c1.2-1.2,3.1-1.2,4.2,0L330,253.7 c1.2,1.2,1.2,3.1,0,4.2l-33.3,33.3C295.5,292.5,293.6,292.5,292.4,291.3z'/%3E%3Cpath fill='%231e5aae' d='M332.1,3v46c0,1.7-1.3,3-3,3H3c-1.7,0-3-1.3-3-3V3c0-1.7,1.3-3,3-3h326.1C330.8,0,332.1,1.3,332.1,3z'/%3E%3C/svg%3E");
    }

    span {
      @include visuallyHidden;
    }
  }

  .loading-wrapper {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: white;
    width: 100%;
    height: 100vh;

    h1 {
      color: $text-color;
      font-size: 20px;
      font-weight: bold;
      letter-spacing: 1px;
      text-align: center;
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

  .nearby-amenities {
    ::v-deep .tabs {
      ul {
        li {
          font-size: 24px;

          &.active,
          &:hover,
          &:focus {
            &:after {
              background-color: $color-blue;
            }
          }
        }
      }
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

  .vue-map-container {
    width: 100%;
    height: 450px;
  }

  .scroll-to-wrapper {
    // background-color: red;
    display: flex;
    align-items: center;
    padding: 0 0 15px 0;
    margin: 0 0 40px 0;
    border-bottom: 1px solid $color-grey;

    span {
      color: $text-color;
      font-weight: $weight-semi-bold;
      margin: 0 15px 0 0;
    }

    button {
      background-color: red;
      padding: 2px 15px 0 15px;
      font-size: 16px;
    }
  }

  section {
    // background-color: red;
    width: 100%;
    padding: 0;
    margin: 0 0 60px 0;

    &:last-of-type {
      margin: 0;
    }

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
      table tbody tr {
        th {
          width: 225px;
        }
      }
      .row {
        display: flex;
        flex-wrap: wrap;

        section {
          .contact {
            padding: 60px 0 0 0;
            margin: 0 0 60px 0 !important;
          }

          &#mayor {
            .contact {
              margin: 0 !important;
              border-top: none;
            }
          }

          &#districtRep {
            .contact {
              margin: 0 !important;
            }
          }

          &#council {
            .contact {
              margin: 0 0 60px 0;

              &:last-child {
                margin: 0 !important;
              }
            }
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

  .overview {
    z-index: 1;
    position: relative;
    top: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    color: white;
    letter-spacing: .5px;

    label {

      &[for="parks"],
      &[for="playgrounds"],
      &[for="schools"],
      &[for="safePlaces"],
      &[for="inroads"] {
        font-size: $size-m;
        letter-spacing: .5px;
        padding: 4px 10px;
        border-radius: $radius-default;
        font-weight: $weight-semi-bold;
      }

      &[for="parks"] {
        background-color: #2D6326;
        color: white;
      }

      &[for="playgrounds"] {
        background-color: #1947A0;
        color: white;
      }

      &[for="schools"] {
        background-color: #800080;
        color: white;
      }

      &[for="safePlaces"] {
        background-color: #FCC324;
        color: darken(#FCC324, 45%);
      }

      &[for="inroads"] {
        background-color: $color-vermilion-light;
        color: darken($color-vermilion, 45%);
      }
    }

    h4 {
      margin: 0 0 15px 0;
    }

    .row {
      width: 100%;

      .container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }

      &:first-of-type {
        background-color: white;
        border-top: 1px solid $color-grey-dark;
        padding: 4px 0 0 0;

        .container {
          align-items: center;
          flex-wrap: nowrap;
        }

        .expand-map {
          margin-left: auto;
          background-color: lighten($text-color, 25%);
          padding: 5px 10px;
          border-radius: 50%;
          cursor: pointer;

          &:hover,
          &:focus,
          &.active,
          &:active {
            background-color: $text-color;
          }

          span {
            width: 10px;
            height: 20px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 512'%3E%3Cpath fill='white' d='M227.03 388.97H156V123.03h71.03c10.691 0 16.045-12.926 8.485-20.485l-99.029-99.03c-4.686-4.686-12.284-4.686-16.971 0l-99.029 99.03c-7.56 7.56-2.206 20.485 8.485 20.485H100v265.94H28.97c-10.691 0-16.045 12.926-8.485 20.485l99.029 99.03c4.686 4.686 12.284 4.686 16.971 0l99.029-99.03c7.56-7.559 2.206-20.485-8.484-20.485z' class=''%3E%3C/path%3E%3C/svg%3E");
          }
        }

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
        border-bottom: 1px solid $color-grey;

        .alert {
          margin: 0 0 20px 0;
        }

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

  .type-tag {
    position: absolute;
    top: -30px;
    left: 0;
    padding: 15px 20px 10px 20px;
    background-color: white;
    -webkit-border-top-left-radius: $radius-default + 5px;
    -webkit-border-top-right-radius: $radius-default + 5px;
    -moz-border-radius-topleft: $radius-default + 5px;
    -moz-border-radius-topright: $radius-default + 5px;
    border-top-left-radius: $radius-default + 5px;
    border-top-right-radius: $radius-default + 5px;
    overflow: inherit;
    font-family: $font-text;
    font-size: 16px;
    letter-spacing: .25px;
    color: $text-color;
    font-weight: $weight-semi-bold;

    &.parks {
      span {
        border-left: 4px solid #2D6326;
      }
    }

    &.playgrounds {
      span {
        border-left: 4px solid #1947A0;
      }
    }

    &.schools {
      span {
        border-left: 4px solid #800080;
      }
    }

    &.safeplaces {
      span {
        border-left: 4px solid #FCC324;
      }
    }

    &.roads {
      span {
        border-left: 4px solid $color-vermilion-light;
      }
    }

    span {
      padding: 0 0 0 10px;
    }
  }

  .info-window {
    h1 {
      font-size: $size-m + 4px;
      line-height: $size-m + 4px;
      font-weight: $weight-semi-bold;
      letter-spacing: .25px;
      margin: 0 0 10px 0;
      padding: 0 0 8px 0;
      border-bottom: 1px solid $color-grey;
    }

    ul {
      li {
        color: $text-color;
        font-size: 16px;
        font-weight: $weight-normal;

        // &:nth-child(1) {
        //   margin: 0 20px 0 0;
        // }

        // &:nth-child(-n+2){
        //   display: inline-flex;
        //   background-color: red;
        // }

        &:last-child {
          margin: 0;
        }
      }
    }
  }
  
  ::v-deep .gm-style-iw-a {}

  ::v-deep .gm-style-iw {
    &.gm-style-iw-c {
      padding: 20px 20px 10px 20px!important;
      overflow: inherit;

      button,
      button.gm-ui-hover-effect {
        top: 5px !important;
        right: 5px !important;
        height: 25px !important;
        width: 25px !important;

        &:hover {
          opacity: 1 !important;
        }

        img {
          margin: 0 !important;
          height: 100% !important;
          width: 100% !important;
        }
      }
    }
  }

  @media (max-width: 575px) {
    .vue-map-container {
      height: 200px;

      .vue-map-hidden {
        display: none;
      }
    }

    .container {
      width: 100%;
    }

    .overview {
      .row {
        &:first-of-type {
          display: none;
          padding: 0;

          .container {
            padding: 0 20px 0 0;
            align-items: center;
          }
        }

        &:nth-of-type(2) {
          padding: 5px 20px;
          // background-color: $color-blue;

          strong {
            display: block;
            margin: 0 0 5px 0;
          }

          // p {
          //   color: white;
          // }
        }

        &:nth-of-type(3) {
          margin: -1px 0 0 0;
          padding: 15px 20px;
        }

         &:nth-of-type(4) {
          margin: -1px 0 0 0;
          padding: 0 20px 15px 20px;
        }
      }
    }

    .scroll-to-wrapper {
      margin: 0 0 20px 0;
    }

    .wrapper {
      // background-color: green;
      padding: 20px;
    }

    section {
      &:last-child {
        padding: 0;
      }

      header {
        // background-color: red;
        //
        div {
          margin: 0 0 10px 0;
        }

        h2 {
          font-size: 24px;
          margin: 0 0 20px 0;
          padding: 0;
        }

        svg {
          display: none;
          // width: 35px;
          // height: 35px;
          // margin: 0 15px 0 0;
        }

        blockquote {
          border-left: none !important;
          width: 100%;
          font-size: 16px;
          padding: 0;
        }
      }
    }


    .locations {
      flex-wrap: wrap;

      .location {
        padding: 0 !important;
        width: 100% !important;
        margin: 0 0 40px 0 !important;
      }

      ul {
        li {
          &:nth-child(2) {
            font-size: 24px !important;
          }
        }
      }
    }

    .contacts {
      .row {
        flex-wrap: wrap;
        margin: 0;

        section {
          .contact {
            padding: 40px 0 0 0 !important;
            margin: 0 0 40px 0 !important;
          }

          &#mayor {
            .contact {
              margin: 0 !important;
              border-top: none;
            }
          }

          &#districtRep {
            .contact {
              margin: 0 !important;
            }
          }

          &#council {
            .contact {
              margin: 0 0 40px 0 !important;

              &:last-child {
                margin: 0 !important;
              }
            }
          }
        }
      }
    }

    .button-group {
      margin: 0 0 10px 0;

      button {
        padding: 5px 10px;
        font-size: 16px;
      }
    }

    .tabs-group {

      ::v-deep .tabs {
        ul {
          li {
            font-size: 24px;
            width: 100%;
            text-align: left;
            margin: 0;
            padding: 5px 0;
          }
        }
      }

      ::v-deep .tab-content {
        padding: 20px 0 0 0;
      }
    }

    table {
      display: block;

      tbody {
        display: block;
        // background-color: green;
        width: 100%;

        tr {
          display: flex;
          flex-wrap: wrap;
          width: 100%;

          &:first-child {
            // background-color: pink;

            th {
              border: none;
            }
          }

          th, td {
            width: 100% !important;
          }

          th {
            padding: 15px 0 10px 5px;
            color: lighten($text-color, 10%);
          }

          td {
            padding: 0 15px 15px 30px;
            border: none;
          }
        }
      }
    }

    .parks,
    .playgrounds,
    .safe-places,
    .schools {
      table {
        tbody {
          tr {
            border-top: 1px solid #ddd;

            &:nth-child(1) {
              border: none;
            }

            td {
              padding: 15px 0 15px 5px;

              &:nth-child(odd) {
                display: none;
              }
            }
          }
        }
      }
    }

    #districtRep {
      .vue-map-container {
        display: none;
      }
    }
  }

  @media (min-width: 576px) and (max-width: 767px) {
    .vue-map-container {
      height: 200px;

      .vue-map-hidden {
        display: none;
      }
    }

    .container {
      width: 100%;
    }

    .overview {
      .row {
        &:first-of-type {
          display: none;
          padding: 0;

          .container {
            padding: 0 20px 0 0;
            align-items: center;
          }
        }

        &:nth-of-type(2) {
          padding: 5px 20px;
          // background-color: $color-blue;

          strong {
            display: block;
            margin: 0 0 5px 0;
          }

          // p {
          //   color: white;
          // }
        }

        &:nth-of-type(3) {
          margin: -1px 0 0 0;
          padding: 15px 20px;
        }

         &:nth-of-type(4) {
          margin: -1px 0 0 0;
          padding: 0 20px 15px 20px;
        }
      }
    }

    .wrapper {
      // background-color: green;
      padding: 20px;
    }

    .row {
      &.data {
        &:last-child {
          padding: 0;
        }

        header {
          // background-color: red;
          //
          div {
            margin: 0 0 10px 0;
          }

          h2 {
            font-size: 24px;
            margin: 0 0 20px 0;
            padding: 0;
          }

          svg {
            display: none;
            // width: 35px;
            // height: 35px;
            // margin: 0 15px 0 0;
          }

          blockquote {
            border-left: none;
            width: 100%;
            font-size: 16px;
            padding: 0;
          }
        }
      }
    }


    .locations {
      flex-wrap: wrap;

      .location {
        padding: 0 !important;
        width: 100% !important;
        margin: 0 0 40px 0 !important;
      }

      ul {
        li {
          &:nth-child(2) {
            font-size: 24px !important;
          }
        }
      }
    }

    .contacts {
      .row {
        flex-wrap: wrap;
        margin: 0;
      }
    }

    .button-group {
      margin: 0 0 10px 0;

      button {
        padding: 5px 10px;
        font-size: 16px;
      }
    }

    table {
      display: block;

      tbody {
        display: block;
        width: 100%;

        tr {
          display: flex;
          flex-wrap: wrap;
          width: 100%;

          &:first-child {

            th {
              border: none;
            }
          }

          th, td {
            width: 100% !important;
          }

          th {
            padding: 15px 0 10px 5px;
            color: lighten($text-color, 10%);
          }

          td {
            padding: 0 0 15px 30px;
            border: none;
          }
        }
      }
    }

    .parks,
    .playgrounds,
    .safe-places,
    .schools {
      table {
        tbody {
          tr {
            border-top: 1px solid #ddd;

            &:nth-child(1) {
              border: none;
            }

            td {
              padding: 15px 0 15px 5px;

              &:nth-child(odd) {
                display: none;
              }
            }
          }
        }
      }
    }

    #districtRep {
      .vue-map-container {
        display: none;
      }
    }
  }

  @media (min-width: 768px) and (max-width: 991px) {
    .vue-map-container {
      height: 200px;

      .vue-map-hidden {
        display: none;
      }
    }

    .container {
      width: 100%;
    }

    .overview {
      .row {
        &:first-of-type {
          display: none;
          padding: 0;

          .container {
            padding: 0 20px 0 0;
            align-items: center;
          }
        }

        &:nth-of-type(2) {
          padding: 5px 20px;
          // background-color: $color-blue;

          strong {
            display: block;
            margin: 0 0 5px 0;
          }

          // p {
          //   color: white;
          // }
        }

        &:nth-of-type(3) {
          margin: -1px 0 0 0;
          padding: 15px 20px;
        }

         &:nth-of-type(4) {
          margin: -1px 0 0 0;
          padding: 0 20px 15px 20px;
        }
      }
    }

    .wrapper {
      // background-color: green;
      padding: 20px;
    }

    .row {
      &.data {
        &:last-child {
          padding: 0;
        }

        header {
          // background-color: red;
          //
          div {
            margin: 0 0 10px 0;
          }

          h2 {
            font-size: 24px;
            margin: 0 0 20px 0;
            padding: 0;
          }

          svg {
            display: none;
            // width: 35px;
            // height: 35px;
            // margin: 0 15px 0 0;
          }

          blockquote {
            border-left: none;
            width: 100%;
            font-size: 16px;
            padding: 0;
          }
        }
      }
    }


    .locations {
      flex-wrap: wrap;

      .location {
        padding: 0 !important;
        width: 100% !important;
        margin: 0 0 40px 0 !important;
      }

      ul {
        li {
          &:nth-child(2) {
            font-size: 24px !important;
          }
        }
      }
    }

    .contacts {
      .row {
        flex-wrap: wrap;
        margin: 0;
      }
    }

    .button-group {
      margin: 0 0 10px 0;

      button {
        padding: 5px 10px;
        font-size: 16px;
      }
    }
  }
</style>