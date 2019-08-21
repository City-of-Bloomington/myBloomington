<template>
  <div :class="[{'no-location': !locationResData}]">
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


    <template v-if="!locationResData">
      <div class="form-wrapper">
        <form
          @submit.stop.prevent="searchSubmit(addressSearchAuto)"
          id="no-location-search">
          <exampleSearch
            v-model="addressSearchAuto"
            :buttonValue="searchIconEncoded"
            placeholder="Search - eg: 401 N Morton St"
            ref="addressSearch"
            name="address-search"
            id="address-search" />
        </form>

        <ul v-if="testRes">
          <template v-if="testRes.length > 1">
            <li v-for="a, i in testRes"
                @click="addressChoice(a)">
              <a href="#">{{ a.streetAddress }}</a>
            </li>
          </template>

          <template v-else>
            <li @click="addressChoice(testRes)">
              <a href="#">{{ testRes.streetAddress }}</a>
            </li>
          </template>
        </ul>
      </div>

    </template>

    <template v-if="locationResData">
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
            <div class="weather" v-if="weather.weather[0]">
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
            <!-- <h2>Address Search</h2> -->

            <form @submit.stop.prevent="searchSubmit(addressSearch)">
              <exampleSearch v-model="addressSearch"
                          :buttonValue="searchIconEncoded"
                          placeholder="Search Address"
                          ref="addressSearch"
                          name="address-search"
                          id="address-search" />
            </form>
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


                        <!-- <pre>
                          {{ wastePickup(locationResData.locations[0].recycle_week, locationResData.locations[0].trash_day) }}
                        </pre>
 -->
                        <!-- {{ sanitation.a }}<br><br>
                        {{ sanitation.b }} -->
                        <!-- <template v-for="s, i in sanitation">
                          <template v-if="true">{{ s.a }}<br></template>
                        </template> -->
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
                  <svg id="safe-place-logo" xmlns="http://www.w3.org/2000/svg" width="429.43395" height="429.44174" viewBox="0 0 429.43395 429.44174"><path id="background" d="M417.81241,186.68018a39.66256,39.66256,0,0,1,.00971,56.09082L242.7581,417.83008a39.65809,39.65809,0,0,1-56.07715,0L11.613,242.771a39.67135,39.67135,0,0,1,0-56.09082l175.068-175.068a39.65683,39.65683,0,0,1,56.07715,0Z" transform="translate(0.00004)" fill="#ffcd00"/><path id="outline" d="M214.71843,20.97334a19.82437,19.82437,0,0,1,14.017,5.7978l173.91628,173.924a19.83082,19.83082,0,0,1,0,28.05315L228.73539,402.66557a19.83011,19.83011,0,0,1-28.04442,0L26.77172,228.7483a19.84341,19.84341,0,0,1,0-28.05315L200.691,26.77491a19.81036,19.81036,0,0,1,14.02746-5.80157m0-7.49713h0a27.15274,27.15274,0,0,0-19.32581,8.0051L21.47535,195.40731a27.35112,27.35112,0,0,0,0,38.63934l173.91727,173.923a27.34451,27.34451,0,0,0,38.64806,0L407.955,234.04665a27.35633,27.35633,0,0,0,0-38.63934L234.04068,21.48131a27.17111,27.17111,0,0,0-19.32225-8.0051" transform="translate(0.00004)" fill="#231f20"/><path id="text" d="M354.17134,261.8792a3.18292,3.18292,0,1,1,3.18183,3.18777,3.18147,3.18147,0,0,1-3.18183-3.18777m5.642,0a2.46256,2.46256,0,1,0-2.46019,2.51609,2.51582,2.51582,0,0,0,2.46019-2.51609m-3.19173.30482v1.25141c0,.19344-.09474.30185-.28461.30185a.26313.26313,0,0,1-.28639-.30185V260.294c0-.12486.05609-.18769.20335-.18769h1.15349c.87484,0,1.32.26519,1.32,1.0548a.91123.91123,0,0,1-.89227,1.00346l.77415,1.19433a.49526.49526,0,0,1,.091.21286c0,.09573-.18374.16549-.327.16549a.35537.35537,0,0,1-.34269-.19542l-.83995-1.35784Zm.66574-.51768c.45307,0,.86333-.02319.86333-.55931,0-.42969-.42592-.47824-.80328-.47824h-.72579v1.03755Zm-198.99352-130.173c0-7.13423-12.63693-9.03215-17.69428-9.03215-12.00586,0-22.38693,7.85249-22.38693,20.48645,0,20.94685,30.14429,14.53563,30.14429,25.19913,0,4.412-3.24663,7.76727-9.20418,7.76727-5.8636,0-10.92115-3.53244-15.16847-3.53244-3.69595,0-6.03782,2.89266-6.03782,6.40845,0,8.48929,14.98078,10.11311,21.92911,10.11311,12.45894,0,23.11293-8.03325,23.11293-20.94111,0-23.29963-30.14847-17.3403-30.14847-26.6307,0-3.776,3.52074-5.86538,7.39765-5.86538,5.41924,0,8.30615,2.702,12.00963,2.702,3.694,0,6.04654-3.15309,6.04654-6.67462m24.813-1.53383c1.5378-4.1508,5.05755-7.49436,9.66023-7.49436,4.78642,0,8.127,3.15091,9.661,7.49436l17.69051,49.10345a10.533,10.533,0,0,1,.72757,3.33979,6.02657,6.02657,0,0,1-6.236,5.97,6.32463,6.32463,0,0,1-6.58365-4.69841l-2.704-8.49108H180.22216l-2.7127,8.39813a6.27213,6.27213,0,0,1-6.50139,4.79136,6.49376,6.49376,0,0,1-6.68215-6.33194,7.58489,7.58489,0,0,1,.63859-2.97788Zm.99494,32.766h17.14944L192.8581,136.5584h-.18016Zm40.70057,18.603c0,4.5,2.89167,7.03256,6.77055,7.03256,3.8767,0,6.76638-2.53254,6.76638-7.03256V161.64456h13.99755a6.14837,6.14837,0,0,0,6.49366-6.32619c0-3.06192-2.16013-6.13454-6.49366-6.13454H238.33933V135.99532h16.61253a6.23093,6.23093,0,0,0,0-12.457H231.84765a6.77987,6.77987,0,0,0-7.04525,7.0607Zm42.35848-.28263a6.59668,6.59668,0,0,0,6.95229,6.77828h23.29388a6.11105,6.11105,0,0,0,6.40646-6.2265,6.00681,6.00681,0,0,0-6.40646-6.23819H280.69979V161.64456h14.80835a6.21661,6.21661,0,0,0,6.59237-6.2382c0-3.14991-2.17163-6.22253-6.59237-6.22253H280.69979V135.99532h15.88852a6.10161,6.10161,0,0,0,6.41617-6.21877,6.02211,6.02211,0,0,0-6.41617-6.23819H274.20037c-4.78264,0-7.03949,3.34355-7.03949,7.86775Zm-189.90052,26.383c0-4.25922,2.52283-7.04723,7.04029-7.04723h15.97751c13.27074,0,23.106,8.66133,23.106,21.5682,0,13.18176-10.19813,21.40468-22.5659,21.40468H90.8068V258.1456c0,4.52618-2.89444,7.053-6.77708,7.053-3.87868,0-6.76936-2.52679-6.76936-7.053Zm13.54644,24.003h9.20042c5.68563,0,9.29912-4.15457,9.29912-9.56807,0-5.41945-3.61349-9.56629-9.29912-9.56629H90.8068Zm39.494,25.8282c0,4.505,2.612,7.37921,7.03058,7.37921h22.57185a6.30621,6.30621,0,0,0,6.49664-5.93912,6.11726,6.11726,0,0,0-6.49664-6.5014H143.83947v-45.3207c0-4.51449-2.89345-7.03831-6.77411-7.03831-3.87293,0-6.7646,2.52382-6.7646,7.03831Zm156.31-57.95267c-18.41056,0-31.0455,14.432-31.0455,33.20741,0,18.68822,12.7279,33.22187,31.0455,33.22187,6.68909,0,20.31877-1.98869,20.31877-10.64922,0-2.08343-1.89673-6.147-5.95537-6.147-3.70665,0-6.77233,3.79267-14.3634,3.79267-11.10211,0-16.97047-9.20914-16.97047-19.93765,0-11.02262,5.7871-20.49794,16.97047-20.49794,7.59107,0,10.11885,3.15864,13.81558,3.15864,3.34455,0,5.59368-2.789,5.59368-6.04634,0-7.94426-12.82086-10.10241-19.40926-10.10241m28.026,58.5867c0,4.05567,2.97689,6.74518,6.95427,6.74518h23.28219a6.10255,6.10255,0,0,0,6.41419-6.212,6.00885,6.00885,0,0,0-6.41419-6.22848H328.16972V238.4664h14.81053a6.211,6.211,0,0,0,6.59237-6.22353c0-3.14912-2.16786-6.22947-6.59237-6.22947H328.16972V212.8356h15.89446a6.10613,6.10613,0,0,0,6.40844-6.22174,6.01283,6.01283,0,0,0-6.40844-6.23225H321.67427c-4.78265,0-7.03752,3.33781-7.03752,7.8523ZM251.27434,233.771c-.01942-.09-.062-.153-.07947-.246a5.55941,5.55941,0,0,0-.23605-.76543c-.03092-.0773-.07155-.13358-.11039-.20989a5.69233,5.69233,0,0,0-1.0548-1.54553l-37.00086-36.99333a5.39866,5.39866,0,0,0-7.64538,0l-37.00285,36.99333a5.47824,5.47824,0,0,0-1.05281,1.54553c-.04261.07631-.08225.13259-.11713.20989a4.14689,4.14689,0,0,0-.2196.72777,2.19214,2.19214,0,0,0-.08622.28362,5.27639,5.27639,0,0,0-.10841,1.05777v.01645c0,.11118.02517.21088.02913.31731a3.67629,3.67629,0,0,0,.07928.722,4.32814,4.32814,0,0,0,.1984.69289,2.537,2.537,0,0,0,.10068.31256,4.09928,4.09928,0,0,0,.415.79159,1.13082,1.13082,0,0,0,.07373.14528,5.428,5.428,0,0,0,4.51152,2.42888h1.22821v19.53808a5.68468,5.68468,0,0,0,5.67671,5.69018h14.13984v-33.0098h20.93734V265.484h25.11113a5.68925,5.68925,0,0,0,5.68266-5.69018V240.25571h1.22305a5.419,5.419,0,0,0,4.51172-2.42888c.04064-.05332.06-.12388.093-.17521a5.31232,5.31232,0,0,0,.39481-.75294,3.45635,3.45635,0,0,0,.1201-.36865c.07155-.2081.13735-.42294.19146-.62629a5.49807,5.49807,0,0,0,.08522-.87662c0-.07076.01745-.11337.01745-.18194h0a6.11665,6.11665,0,0,0-.10644-1.07422" transform="translate(0.00004)" fill="#231f20"/>
                </svg>

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

            <!-- <div class="row data">
              <header>
                <h2>Google Civil Datas</h2>

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
                  <tr v-for="r, i in electedReps.officials">
                    <th scope="row">Name:</th>
                    <td>{{r.name}}</td>
                  </tr>
                </tbody>
              </table>
            </div> -->

            <div class="row data">
              <header>
                <h2>Elected City Officials</h2>
              </header>

              <div class="contacts" v-if="contacts.mayor">
                <div class="row contact mayor">
                  <div class="img">
                    <img src="contacts/mayor/john-hamilton.jpg" :alt="`Mayor ${contacts.mayor.displayname}`">
                  </div>

                  <div class="about">

                    <h2>{{ contacts.mayor.displayname }}</h2>
                    <h4>{{ contacts.mayor.name }}</h4>

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

                <div class="row contact clerk">
                  <div class="img">
                    <img src="contacts/clerk/nicole-bolden.jpg" :alt="`Clerk ${contacts.clerk.displayname}`">
                  </div>

                  <div class="about">

                    <h2>{{ contacts.clerk.displayname }}</h2>
                    <h4>{{ contacts.clerk.lastname }}</h4>

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
                          <td>{{ contacts.clerk.email }}</td>
                        </tr>

                        <tr>
                          <th scope="row">Telephone:</th>
                          <td>{{ contacts.clerk.pager }}</td>
                        </tr>

                        <tr>
                          <th scope="row">Hours:</th>
                          <td>Monday - Friday, 8am - 5pm</td>
                        </tr>

                        <tr>
                          <th scope="row">Mailing Address:</th>
                          <td>
                            {{ contacts.clerk.department }}<br>
                            401 N Morton St, Suite 110<br>
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
                            <td>
                              1414 E University<br>
                              Bloomington, IN 47404
                            </td>
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
                            <td>
                              2201 N Fritz Dr<br>
                              Bloomington, IN 47404
                            </td>
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
                            <th scope="row">Address:</th>
                            <td>
                              401 N Morton St<br>
                              Bloomington, IN 47404
                            </td>
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

            <div v-if="districtRep"
                class="row data"
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
                    :paths="districtPaths"
                    :options="{
                      strokeColor:    'rgb(30, 90, 174)',
                      strokeOpacity:  0.8,
                      strokeWeight:   2,
                      fillColor:      'rgb(30, 90, 174)',
                      fillOpacity:    0.35
                    }"
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
                          <tr v-if="districtRepInfo.email">
                            <th scope="row">Email:</th>
                            <td>{{ districtRepInfo.email }}</td>
                          </tr>

                          <tr>
                            <th scope="row">Address:</th>
                            <td>
                              <template v-if="districtRepInfo.address">
                                {{ districtRepInfo.address }}<br>
                              </template>
                              <template v-else>
                                401 N Morton St<br>
                              </template>
                              Bloomington, IN 47404
                            </td>
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
        vm.addressSearch = addressQueryParam;
        vm.searchSubmit(addressQueryParam);
      }
    });
  },
  // beforeRouteUpdate (to, from, next) {
  //   let addressQueryParam   = to.query.address,
  //     addressFromQueryParam = from.query.address;

  //     if(addressQueryParam != addressFromQueryParam){
  //       console.dir('changed');
  //       // this.addressSearch = addressQueryParam;
  //       // this.searchSubmit(addressQueryParam);
  //     }

  //   next();
  // },
  data() {
    return {
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
      addressResChoices:  null,
      locationResData:    null,
      councilDistrict:    null,
      councilAtLargeReps: null,
      districtRep:        null,
      councilDistrictsGeoJson: null,
      electedReps:        null,
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
      testRes: null,
      errors: {
        addressRes:       null,
        locationRes:      null
      }
    }
  },
  created() {
    this.latLong = this.cityHallLatLong;
  },
  // async asyncData({ query, error }) {
  //   let cityHallLatLong = { lat: 39.16992723, lng: -86.53680559 };

  //   let {data} = await Promise.all([
  //     axios.get(`${process.env.weatherUrl}weather?lat=${cityHallLatLong.lat}&lon=${cityHallLatLong.lng}&units=imperial&appid=${process.env.weatherApiKey}`)
  //   ])
  //   return {
  //     weather: data
  //   }
  // },
  async asyncData () {
    let cityHallLatLong = { lat: 39.16992723, lng: -86.53680559 },
               { data } = await axios.get(`${process.env.weatherUrl}weather?lat=${cityHallLatLong.lat}&lon=${cityHallLatLong.lng}&units=imperial&appid=${process.env.weatherApiKey}`)
    return { weather: data }
  },
  updated() {
    this.$nextTick(() => {
      // console.dir(this.$refs);
    });
  },
  mounted() {
    let searchInputElement = document.getElementById('address-search');
    if(searchInputElement)
      searchInputElement.focus();

    if(!this.locationResData) {
      this.$refs.defaultMap.$mapPromise
      .then(() => this.$refs.defaultMap.panBy(0,50));
      this.mapHeight = this.mapHeightDefault;
    }

    axios.get(`https://bloomington.in.gov/geoserver/publicgis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=publicgis:BloomingtonMunicipalBoundary&maxFeatures=50&outputFormat=application%2Fjson`)
    .then((res) => {
      this.bloomingtonBoundaryGeoJson = res.data.features;
      console.log(`%c getBloomingtonBoundary 👌 `,
                  this.consoleLog.success);
    })
    .catch((e)  => {
      console.log(`%c getBloomingtonBoundary 🛑 `,
                  this.consoleLog.error,
                  `\n\n ${e} \n\n`);
    });

    this.getSafePlaces()
    .then((res) => {
      this.safePlaceResData = res;
      console.log(`%c getSafePlaces 👌 `,
                  this.consoleLog.success);
    })
    .catch((e)  => {
      console.log(`%c getSafePlaces 🛑 `,
                  this.consoleLog.error,
                  `\n\n ${e} \n\n`);
    })

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

    // if(this.cityHallLatLong) {
    //   this.getWeather(this.cityHallLatLong.lat, this.cityHallLatLong.lng)
    //   .then((res) => {
    //     this.weather = res;
    //     console.log(`%c getWeather 👌 `,
    //                 this.consoleLog.success);
    //   })
    //   .catch((e)  => {
    //     console.log(`%c getWeather 🛑 `,
    //                 this.consoleLog.error,
    //                 `\n\n ${e} \n\n`);
    //   });
    // }


    this.getCouncilDistrictsGeoJson()
    .then((res) => {
      console.dir(res);
      this.councilDistrictsGeoJson = res;
      console.log(`%c getCouncilDistrictsGeoJson 👌 `,
                  this.consoleLog.success);
    })
    .catch((e) => {
      console.log(`%c getCouncilDistrictsGeoJson 🛑 `,
                  this.consoleLog.error,
                  `\n\n ${e} \n\n`);
    });

    // this.$refs.districtMap.$mapPromise.then((map) => {
    //   map.data.loadGeoJson(this.councilDistrictsGeoJson)
    // })

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
  watch: {
    addressSearchAuto: debounce(function(val){
      console.dir('BOUNCED');
      let regExTest   = /\d+\s+\w+/,
        addressTest = regExTest.test(val),
        searchValue = this.addressSearchAuto;

      if(searchValue.length > 3 &&
         addressTest &&
         !this.locationResData) {
        this.getAddress(val)
        .then((res) => {
          this.testRes = res;
          console.dir(res.length);
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
        this.testRes = null;
      }
    }, 500)
  },
  computed: {
    ...mapFields([
      'consoleLog',
      'locations',
      'sanitation',
      'contacts'
    ]),
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

        return projCoordsLatLng;
      } else {
        repJson.forEach((p) => {
          let pair = proj4(this.coordsProjection).inverse(p);
          lngLat.push(pair)
        });

        lngLat.forEach((p) => {
          geoCoords.push({lat: p[1], lng: p[0]})
        });

        return geoCoords;
      }
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
    districtRepInfo() {
      switch(this.councilDistrict.id) {
        case 1:
          return this.contacts.district[1];
          break;
        case 2:
          return this.contacts.district[2];
          break;
        case 3:
          return this.contacts.district[3];
          break;
        case 4:
          return this.contacts.district[4];
          break;
        case 5:
          return this.contacts.district[5];
          break;
        case 6:
          return this.contacts.district[6];
          break;
      }
    },
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
    }
  },
  methods: {
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
      let points1 = this.latLong,
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
      this.electedRepsLookup(input);
    },
    electedRepsLookup(address) {
      this.getElectedReps(address)
      .then((res) => {
        console.dir(res);
        this.electedReps = res;
        console.log(`%c getElectedReps 👌 `,
                      this.consoleLog.success);
      })
      .catch((e)  => {
        console.log(`%c getElectedReps 🛑 `,
                    this.consoleLog.error,
                    `\n\n ${e} \n\n`);
      })
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

          this.locationResData   = res;
          this.mapHeight         = this.mapHeightResult;

          this.errors.locationRes = null;
          this.cityHallDistance();

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
            this.getCouncilDistrictRepFeature(this.councilDistrict.id);
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
    getCouncilDistrictRepFeature(district) {
      this.councilDistrictRepGeoJson = this.councilDistrictsGeoJson.features.filter((d) => {
          return d.properties.DISTRICT === district;
      })

      // if(this.councilDistrictRepGeoJson.length > 1) {
      //   alert('more than one')
      // }
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
  @-webkit-keyframes solidColor {
    0%    { background-color: $color-blue-darker }
    50%   { background-color: $color-blue; }
    100%  { background-color: $color-blue-darker }
  }

  @-moz-keyframes solidColor {
    0%    { background-color: $color-blue-darker }
    50%   { background-color: $color-blue; }
    100%  { background-color: $color-blue-darker }
  }

  @keyframes solidColor {
    0%    { background-color: $color-blue-darker }
    50%   { background-color: $color-blue; }
    100%  { background-color: $color-blue-darker }
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
          }

          ::v-deep button[type=submit] {
            background-color: $color-green;
            border-color: $color-green;

            svg {}

            &:hover,
            &:focus {
              background-color: darken($color-green, 5%);
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

  .no-location {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .form-wrapper {
    position: absolute;
    top: 0;
    z-index: 1;
    border-top: 1px solid $color-grey-dark;
    border-bottom: 1px solid $color-grey-dark;
    background-color: rgba($color-grey-light, 0.75);
    padding: 20px;
    // height: 100%;
    width: 100%;

    ul {
      position: relative;
      top: -1px;
      border: 1px solid $color-grey-dark;
      border-top: none;
      overflow: scroll;
      max-height: 300px;
      background-color: white;
      -webkit-border-bottom-right-radius: $radius-default;
      -webkit-border-bottom-left-radius: $radius-default;
      -moz-border-radius-bottomright: $radius-default;
      -moz-border-radius-bottomleft: $radius-default;
      border-bottom-right-radius: $radius-default;
      border-bottom-left-radius: $radius-default;

      li {
        padding: 15px 20px;
        margin: 0;
        cursor: pointer;
        color: $text-color;

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

    #no-location-search {
      // position: absolute;
      width: 100%;

      label {
        @include visuallyHidden;
      }

      ::v-deep input {
        box-shadow: none;
        border: 1px solid $color-grey-dark;
        color: $text-color;
        font-size: 30px;
        z-index: 1;
      }

      ::v-deep button[type=submit] {
        background-color: $color-green;
        border-color: $color-green;
        padding: 0 20px;
        margin: 0;
        z-index: 1;

        svg {
          width: 30px;
          height: 30px;
        }

        &:hover,
        &:focus {
          background-color: darken($color-green, 5%);
        }
      }
    }
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