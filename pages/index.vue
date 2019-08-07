<template>
  <div>
    <fn1-header
      :logo="{
        url:      `${baseUrl}`,
        image:    `${headerLogo}`,
        imageAlt: `${cityName}`
      }"

      :logoHeadings="{
        topHeading:   `${logoHeading}`,
        subHeading:   `${logoSubHeading}`,
      }"

      :application="{
        name: `${appName}`,
        url:  `${baseUrl}${frontEndBase}`
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

                <tr v-if="locationResData.purposes"
                    v-for="p, i in locationResData.purposes">
                  <th scope="row">{{ p.purpose_type | capitalizeFirst }}:</th>
                  <td>
                    {{ p.name | capitalizeFirst }}

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

          <div class="row data" v-if="locationResData.locations[0].trash_day || locationResData.locations[0].recycle_week">
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
                <tr v-if="locationResData.locations[0].trash_day">
                  <th scope="row">Trash &amp; Recyling:</th>
                  <td>{{ locationResData.locations[0].trash_day | capitalizeFirst }}</td>
                </tr>

                <tr v-if="locationResData.locations[0].recycle_week">
                  <th scope="row">Yard Waste:</th>
                  <td>
                    <a :href="trashLink(locationResData.locations[0].recycle_week, locationResData.locations[0].trash_day)">
                      Week {{ locationResData.locations[0].recycle_week | capitalizeFirst }}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
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

          <div class="row data" v-if="districtRep">
            <header>
              <h2>District Representative</h2>
            </header>

            <GmapMap
              ref="districtMap"
              :center="latLong"
              :zoom="14"
              map-type-id="roadmap"
              style="width: 100%; height: 315px"
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

              <GmapPolygon
                :paths="[...testPaths]"
                :options="{
                  strokeColor:    'rgb(30, 90, 174)',
                  strokeOpacity:  0.8,
                  strokeWeight:   2,
                  fillColor:      'rgb(30, 90, 174)',
                  fillOpacity:    0.35
                }"
              />

              <GmapPolygon
                :paths="[...testPaths2]"
                :options="{
                  strokeColor:    'rgb(30, 90, 174)',
                  strokeOpacity:  0.8,
                  strokeWeight:   2,
                  fillColor:      'rgb(30, 90, 174)',
                  fillOpacity:    0.35
                }"
              />

              <GmapPolygon
                :paths="[[...testPaths3],[...testPaths4],[...testPaths5]]"
                :options="{
                  strokeColor:    'rgb(30, 90, 174)',
                  strokeOpacity:  0.8,
                  strokeWeight:   2,
                  fillColor:      'rgb(30, 90, 174)',
                  fillOpacity:    0.35
                }"/>

              <!-- <GmapPolygon
                :paths="[...testPaths4]"
                :options="{
                  strokeColor:    'rgb(30, 90, 174)',
                  strokeOpacity:  0.8,
                  strokeWeight:   2,
                  fillColor:      'purple',
                  fillOpacity:    0.35,
                  zIndex: 10000
                }"/> -->

             <!--  <GmapPolygon
                :paths="[...testPaths5]"
                :options="{
                  strokeColor:    'rgb(30, 90, 174)',
                  strokeOpacity:  0.8,
                  strokeWeight:   2,
                  fillColor:      'orange',
                  fillOpacity:    0.35
                }"/> -->
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

    <footer>
      <div class="container">
        <p>City staff strives to keep complete and accurate information and regrets any errors or omissions.</p>

        <p>The information reported comes from the <strong>City of Bloomington Geographic Information Systems (GIS)</strong> and related databases.</p>

        <p>To report missing City of Bloomington addresses or other profile errors, please contact the City of Bloomington GIS Staff at <strong>812-349-3454</strong> or <strong>email</strong> us at <a href="mailto: gis@bloomington.in.gov">gis@bloomington.in.gov</a>.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import axios          from 'axios'
import { mapFields }  from 'vuex-map-fields'
import proj4          from 'proj4'
// require('proj4');

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
      appName:            process.env.appName,
      baseUrl:            process.env.baseUrl,
      frontEndBase:       process.env.frontEndBase,
      cityName:           process.env.cityName,
      logoHeading:        process.env.logoHeading,
      logoSubHeading:     process.env.logoSubHeading,
      headerLogo:         'city-of-bloomington-logo.svg',
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
      councilDistrictsGeoJson: null,
      errors: {
        addressRes:       null,
        locationRes:      null
      },
      testPaths: [{"lat":39.17406760093743,"lng":-86.58345942647988},{"lat":39.17408756359138,"lng":-86.58321102638783},{"lat":39.17408670454907,"lng":-86.58301091099081},{"lat":39.17404349685014,"lng":-86.58301121825183},{"lat":39.17366876839869,"lng":-86.58301388794595},{"lat":39.172747126546746,"lng":-86.58300496413806},{"lat":39.172170185538185,"lng":-86.58300712601512},{"lat":39.172145577778174,"lng":-86.58300721820983},{"lat":39.17204562599945,"lng":-86.58300759317812},{"lat":39.17202097238496,"lng":-86.58300768463882},{"lat":39.17194953248346,"lng":-86.58300795244291},{"lat":39.17192487685114,"lng":-86.58300782981586},{"lat":39.17194940763257,"lng":-86.58545927106391},{"lat":39.17197179377261,"lng":-86.58770077987418},{"lat":39.17197971060839,"lng":-86.58769549133113},{"lat":39.17200385279457,"lng":-86.58767869599419},{"lat":39.17202345242663,"lng":-86.58766421816942},{"lat":39.17202765283479,"lng":-86.58766111506847},{"lat":39.172051097593915,"lng":-86.58764275887461},{"lat":39.1720741687324,"lng":-86.58762364059154},{"lat":39.172096853119605,"lng":-86.58760377159814},{"lat":39.17211913516445,"lng":-86.58758316575958},{"lat":39.1721410006456,"lng":-86.58756183622616},{"lat":39.17216243561927,"lng":-86.5875397968516},{"lat":39.1721834258686,"lng":-86.58751706184441},{"lat":39.17220395745281,"lng":-86.5874936457639},{"lat":39.17222401698468,"lng":-86.58746956422374},{"lat":39.17224359272733,"lng":-86.5874448335315},{"lat":39.172262669368706,"lng":-86.58741946860907},{"lat":39.172281237093756,"lng":-86.58739348575064},{"lat":39.17229928170515,"lng":-86.5873669037503},{"lat":39.17231679338633,"lng":-86.5873397385497},{"lat":39.17233375930975,"lng":-86.587312008228},{"lat":39.172350169117244,"lng":-86.58728373049433},{"lat":39.17236601163458,"lng":-86.58725492482728},{"lat":39.17238127649914,"lng":-86.58722560787797},{"lat":39.17239595473755,"lng":-86.58719580016782},{"lat":39.172654811525526,"lng":-86.58665496404517},{"lat":39.17269810242289,"lng":-86.5865473487016},{"lat":39.17313130983676,"lng":-86.58545500315829},{"lat":39.17319299407867,"lng":-86.58545463765304},{"lat":39.17319136854511,"lng":-86.585332649312},{"lat":39.1734425398829,"lng":-86.58482732911955},{"lat":39.17382150513678,"lng":-86.584104535639},{"lat":39.173989255657965,"lng":-86.58373631522169},{"lat":39.17406760093743,"lng":-86.58345942647988}],
      testPaths2: [{"lat":39.149756125424226,"lng":-86.58334898121629},{"lat":39.149756196668314,"lng":-86.58326082822306},{"lat":39.14975660718205,"lng":-86.582755520795},{"lat":39.14975671775941,"lng":-86.58261834239887},{"lat":39.14958422679427,"lng":-86.58261671772746},{"lat":39.14947941297063,"lng":-86.5826157309065},{"lat":39.149479394547846,"lng":-86.5826384757001},{"lat":39.14947934918441,"lng":-86.58269521602921},{"lat":39.149477667536146,"lng":-86.58475058365694},{"lat":39.14947762108106,"lng":-86.58480730918521},{"lat":39.14947732062831,"lng":-86.58516975802026},{"lat":39.149475653870894,"lng":-86.58715645012279},{"lat":39.14975295934011,"lng":-86.58715878464976},{"lat":39.149756125424226,"lng":-86.58334898121629}],
      testPaths3: [{"lat":39.15939298466128,"lng":-86.53629717803346},{"lat":39.15939307957262,"lng":-86.53630488074928},{"lat":39.159422454910974,"lng":-86.53868511904916},{"lat":39.15943957627348,"lng":-86.54104966722001},{"lat":39.15943552136814,"lng":-86.54148818282006},{"lat":39.15945323026794,"lng":-86.54245258640016},{"lat":39.15945773732619,"lng":-86.54342455964216},{"lat":39.15948887205458,"lng":-86.546014294224},{"lat":39.16026770174343,"lng":-86.5460506866269},{"lat":39.16139883296693,"lng":-86.54614759206004},{"lat":39.16138395020864,"lng":-86.54648066999808},{"lat":39.16136614066525,"lng":-86.54663978081719},{"lat":39.161329855183034,"lng":-86.54684760900624},{"lat":39.16127468377368,"lng":-86.54705658124557},{"lat":39.161200325226595,"lng":-86.54729982139912},{"lat":39.161106966573136,"lng":-86.54755995081969},{"lat":39.16073065110973,"lng":-86.5485175724083},{"lat":39.16070688000368,"lng":-86.54849231507949},{"lat":39.1601834190013,"lng":-86.54793821395741},{"lat":39.15965354488867,"lng":-86.54737674479206},{"lat":39.15912478776609,"lng":-86.54681803718303},{"lat":39.1587441990407,"lng":-86.54641378871969},{"lat":39.15868704616191,"lng":-86.54635308384741},{"lat":39.15816868413703,"lng":-86.54580387276177},{"lat":39.15752259231318,"lng":-86.54508875183166},{"lat":39.156346584012034,"lng":-86.54383891058231},{"lat":39.156171299243056,"lng":-86.54366091369836},{"lat":39.155877362998204,"lng":-86.54336311852742},{"lat":39.15574823095221,"lng":-86.54329857913743},{"lat":39.15562730485662,"lng":-86.54330597797754},{"lat":39.155629350316346,"lng":-86.54336114749486},{"lat":39.15521647496854,"lng":-86.54310207900912},{"lat":39.15494826515579,"lng":-86.54287202147167},{"lat":39.15455797029582,"lng":-86.54257731125621},{"lat":39.1540415428443,"lng":-86.54219274168115},{"lat":39.15356846895533,"lng":-86.54183812278247},{"lat":39.153434363414156,"lng":-86.5417231007921},{"lat":39.15333958840857,"lng":-86.54161786668813},{"lat":39.1532763822154,"lng":-86.54154266767831},{"lat":39.153256483421075,"lng":-86.54148731961119},{"lat":39.15323658089871,"lng":-86.54143194304112},{"lat":39.15283523093525,"lng":-86.54114710037189},{"lat":39.15229642123664,"lng":-86.54075934884342},{"lat":39.15224705434668,"lng":-86.54074035454587},{"lat":39.15123941230078,"lng":-86.53999719814317},{"lat":39.15078496188694,"lng":-86.5396917286525},{"lat":39.15054166904882,"lng":-86.53952525232971},{"lat":39.15045202019551,"lng":-86.53945573000479},{"lat":39.15036658009131,"lng":-86.5393860562723},{"lat":39.15028728190248,"lng":-86.539305294077},{"lat":39.15028506849323,"lng":-86.53930277865871},{"lat":39.150246257843456,"lng":-86.5392659202916},{"lat":39.150096898462536,"lng":-86.53911052085716},{"lat":39.15003470699634,"lng":-86.53905494883777},{"lat":39.14983877712299,"lng":-86.53889485729196},{"lat":39.14971331165103,"lng":-86.53880339842192},{"lat":39.149274830283154,"lng":-86.53881192550075},{"lat":39.14836360184954,"lng":-86.53882713048617},{"lat":39.147914989442974,"lng":-86.53883058725536},{"lat":39.147391219892945,"lng":-86.53884444324464},{"lat":39.146972085525775,"lng":-86.53885397036824},{"lat":39.146354892721845,"lng":-86.53886974767812},{"lat":39.14626693065701,"lng":-86.53888328440293},{"lat":39.14617091947187,"lng":-86.53887937728484},{"lat":39.14625913874807,"lng":-86.53879477896585},{"lat":39.14626908341316,"lng":-86.5387951801001},{"lat":39.1466161069779,"lng":-86.53880488038942},{"lat":39.146619843246164,"lng":-86.53857294537426},{"lat":39.146647232830475,"lng":-86.53687173655942},{"lat":39.146123455434946,"lng":-86.53658039986821},{"lat":39.14486202657536,"lng":-86.53621136555725},{"lat":39.144755918547304,"lng":-86.53618250185797},{"lat":39.14451596564275,"lng":-86.53602934244836},{"lat":39.14420242572818,"lng":-86.53594682723178},{"lat":39.144020927575426,"lng":-86.53589906239418},{"lat":39.14344083069601,"lng":-86.53574876301245},{"lat":39.142579935536126,"lng":-86.53552132365408},{"lat":39.14214606615172,"lng":-86.53540431853833},{"lat":39.14213146412846,"lng":-86.53540174902169},{"lat":39.14208901769819,"lng":-86.53538832463114},{"lat":39.141876056171,"lng":-86.53533244603724},{"lat":39.14159576583763,"lng":-86.53526108427509},{"lat":39.14140918724475,"lng":-86.5352177059145},{"lat":39.14130096399313,"lng":-86.53519117500669},{"lat":39.14120145366441,"lng":-86.53516438339942},{"lat":39.14114738663664,"lng":-86.53514945196748},{"lat":39.14108742645973,"lng":-86.53513258131657},{"lat":39.14103015037186,"lng":-86.53511011228387},{"lat":39.14096817104705,"lng":-86.53508780246017},{"lat":39.14091061464498,"lng":-86.53506720497589},{"lat":39.140846259319495,"lng":-86.53505161203832},{"lat":39.140801042136,"lng":-86.53504031475008},{"lat":39.14062697334118,"lng":-86.53501304351869},{"lat":39.14039926772351,"lng":-86.53497883899342},{"lat":39.14023353801508,"lng":-86.53495576900718},{"lat":39.1401709510632,"lng":-86.53494705658265},{"lat":39.139984983845636,"lng":-86.53492744759707},{"lat":39.13974237389517,"lng":-86.53490573693078},{"lat":39.139529380816725,"lng":-86.53488995474625},{"lat":39.13931296109961,"lng":-86.53487705600823},{"lat":39.13915278488406,"lng":-86.53486952331828},{"lat":39.13898994963148,"lng":-86.53486293498572},{"lat":39.138808858566875,"lng":-86.53486026172155},{"lat":39.138636670034444,"lng":-86.53486080413539},{"lat":39.1384459716616,"lng":-86.53486262291086},{"lat":39.13822456149379,"lng":-86.53486919861513},{"lat":39.138040794208315,"lng":-86.5348789340399},{"lat":39.13783667350006,"lng":-86.53488978590113},{"lat":39.13768959381668,"lng":-86.53489968537328},{"lat":39.13755721393158,"lng":-86.53491209936149},{"lat":39.13740371823064,"lng":-86.53492686608054},{"lat":39.13725632060249,"lng":-86.53494406136377},{"lat":39.1370941335491,"lng":-86.5349644377424},{"lat":39.13698740034243,"lng":-86.53497738972622},{"lat":39.136847238573736,"lng":-86.53499702116002},{"lat":39.1367465594026,"lng":-86.53501132886232},{"lat":39.13662244771729,"lng":-86.53503254550931},{"lat":39.13644996816261,"lng":-86.53506187869588},{"lat":39.136304828977806,"lng":-86.53509214547005},{"lat":39.13615882484684,"lng":-86.53512297901226},{"lat":39.13595705563059,"lng":-86.53516261167698},{"lat":39.135958770532625,"lng":-86.53512367790113},{"lat":39.13590229459002,"lng":-86.53513614557687},{"lat":39.13575297130753,"lng":-86.53516989610837},{"lat":39.13557091924653,"lng":-86.5352097354688},{"lat":39.13557588021184,"lng":-86.53596984756756},{"lat":39.135577691375566,"lng":-86.53635624907487},{"lat":39.13548376549682,"lng":-86.53635907478885},{"lat":39.13548448648687,"lng":-86.53641103263861},{"lat":39.135490978950756,"lng":-86.53687840371371},{"lat":39.135495875064834,"lng":-86.53723099580992},{"lat":39.13549971542485,"lng":-86.53750757298616},{"lat":39.13560703196441,"lng":-86.5375115928942},{"lat":39.13560870128774,"lng":-86.5378429622957},{"lat":39.13594721925185,"lng":-86.53781969880903},{"lat":39.13595928673154,"lng":-86.53781890942399},{"lat":39.13595751823046,"lng":-86.53807355327045},{"lat":39.13595743372763,"lng":-86.53819970845925},{"lat":39.13595720868083,"lng":-86.53853497700804},{"lat":39.1359556472218,"lng":-86.5397864707997},{"lat":39.13591402146539,"lng":-86.54013892476412},{"lat":39.13591290457329,"lng":-86.54056840581771},{"lat":39.1359671863403,"lng":-86.54065665974713},{"lat":39.13601984524451,"lng":-86.54065676917531},{"lat":39.136037686700796,"lng":-86.54065651517575},{"lat":39.136048951838426,"lng":-86.54098786773433},{"lat":39.136107503316595,"lng":-86.54301214942512},{"lat":39.1361360322662,"lng":-86.5438642196138},{"lat":39.13616908367744,"lng":-86.5448107400627},{"lat":39.13619721338086,"lng":-86.54558322248451},{"lat":39.136225718332646,"lng":-86.54658731011537},{"lat":39.136239734076675,"lng":-86.54716557300321},{"lat":39.13625334773848,"lng":-86.54793519096872},{"lat":39.13626023199332,"lng":-86.5483245122009},{"lat":39.13626521429341,"lng":-86.54868398721558},{"lat":39.13610030538246,"lng":-86.54887621453776},{"lat":39.13561568429906,"lng":-86.54936168168778},{"lat":39.13561926863265,"lng":-86.54946986823747},{"lat":39.13562519688952,"lng":-86.54962257265834},{"lat":39.13564986407001,"lng":-86.55025803506719},{"lat":39.135678797267914,"lng":-86.55100352612402},{"lat":39.13570619236616,"lng":-86.55170948149326},{"lat":39.13572668401284,"lng":-86.55223762668915},{"lat":39.13572853445462,"lng":-86.55228533607662},{"lat":39.13409034235715,"lng":-86.55243864106552},{"lat":39.133730981005144,"lng":-86.55304753296298},{"lat":39.13294541712115,"lng":-86.55437852937322},{"lat":39.132895049941425,"lng":-86.55437885084032},{"lat":39.13289830850704,"lng":-86.55462493546625},{"lat":39.13289954117412,"lng":-86.55471801802128},{"lat":39.13296057068447,"lng":-86.55933433013145},{"lat":39.13297727212446,"lng":-86.56060005880133},{"lat":39.13297913500969,"lng":-86.5607413201793},{"lat":39.13298350434854,"lng":-86.5610726108874},{"lat":39.132984900380755,"lng":-86.56117854981014},{"lat":39.132987022990115,"lng":-86.56133952326583},{"lat":39.132991537828744,"lng":-86.56168204904466},{"lat":39.1313459126846,"lng":-86.56165225699087},{"lat":39.13135477041843,"lng":-86.56363837285355},{"lat":39.13184492717937,"lng":-86.56364139615587},{"lat":39.1327139769791,"lng":-86.56364675812046},{"lat":39.132719510423854,"lng":-86.56489139000269},{"lat":39.13161611480131,"lng":-86.56489947100296},{"lat":39.13161153798089,"lng":-86.567586659429},{"lat":39.129355726685915,"lng":-86.56765007213538},{"lat":39.12935002641377,"lng":-86.56683278021802},{"lat":39.122185027375764,"lng":-86.56688531266484},{"lat":39.12214294533091,"lng":-86.56688382514429},{"lat":39.122144046135496,"lng":-86.56696478980999},{"lat":39.122155548321224,"lng":-86.56752841592504},{"lat":39.1221520077585,"lng":-86.56788280839949},{"lat":39.12212889938409,"lng":-86.56866347777621},{"lat":39.122327654612086,"lng":-86.5686672051306},{"lat":39.12230345181679,"lng":-86.57181721548999},{"lat":39.12260266983286,"lng":-86.57198888981513},{"lat":39.12311213238033,"lng":-86.57224950929665},{"lat":39.12349300881505,"lng":-86.57243942903848},{"lat":39.12410135942609,"lng":-86.57267189994973},{"lat":39.12435375236816,"lng":-86.57274613569193},{"lat":39.12451377488557,"lng":-86.57280600668341},{"lat":39.12488389694384,"lng":-86.57292517727934},{"lat":39.125266758024175,"lng":-86.57304628187472},{"lat":39.12545899462171,"lng":-86.57310586443148},{"lat":39.125723305455885,"lng":-86.5731974015783},{"lat":39.125816490066306,"lng":-86.5732293266673},{"lat":39.126213596692324,"lng":-86.57329607256473},{"lat":39.12658523998007,"lng":-86.573376006322},{"lat":39.12713723503836,"lng":-86.57347748554349},{"lat":39.127387107923454,"lng":-86.57347925870864},{"lat":39.12846650830445,"lng":-86.573477192855},{"lat":39.129396141906085,"lng":-86.57346852511604},{"lat":39.129424251347544,"lng":-86.5734682635664},{"lat":39.129549085644484,"lng":-86.5734695352641},{"lat":39.12997554482069,"lng":-86.57347387852056},{"lat":39.130316479858294,"lng":-86.57347735192747},{"lat":39.1305870865544,"lng":-86.5734801078212},{"lat":39.13086252951136,"lng":-86.57348291310359},{"lat":39.13113154807572,"lng":-86.57348565402951},{"lat":39.13140181509259,"lng":-86.57348840676141},{"lat":39.13164214850425,"lng":-86.57349085573064},{"lat":39.13167635084965,"lng":-86.57349101838383},{"lat":39.13184110582844,"lng":-86.57349180238316},{"lat":39.13216835145045,"lng":-86.57349335991601},{"lat":39.132442905077916,"lng":-86.57349466708742},{"lat":39.13271745787041,"lng":-86.57349597461577},{"lat":39.13299201931201,"lng":-86.57349637503019},{"lat":39.133265997023706,"lng":-86.57349677365228},{"lat":39.13333062634109,"lng":-86.5734968674233},{"lat":39.133540550955495,"lng":-86.57349627903255},{"lat":39.133815106139494,"lng":-86.5734955087095},{"lat":39.133800692166666,"lng":-86.57244180984823},{"lat":39.13383715323442,"lng":-86.572441710657},{"lat":39.13478285354347,"lng":-86.57243912378127},{"lat":39.13488015523806,"lng":-86.57243885672905},{"lat":39.13533601029244,"lng":-86.57243760969317},{"lat":39.13574796674383,"lng":-86.57250699217934},{"lat":39.13588172069737,"lng":-86.57250662715121},{"lat":39.13596987423585,"lng":-86.5725063857308},{"lat":39.13643435514409,"lng":-86.57250511477909},{"lat":39.13662082837662,"lng":-86.57221249806128},{"lat":39.13665278444469,"lng":-86.57216405479964},{"lat":39.13679712095838,"lng":-86.57127128865785},{"lat":39.13685346538274,"lng":-86.57127511284015},{"lat":39.136866099696135,"lng":-86.57168294363431},{"lat":39.136982912219246,"lng":-86.57187992414748},{"lat":39.13700471956186,"lng":-86.571901342203},{"lat":39.13702644268531,"lng":-86.57192290225203},{"lat":39.13704807994066,"lng":-86.57194460395398},{"lat":39.13706963131855,"lng":-86.57196644519368},{"lat":39.13709109682357,"lng":-86.57198842702883},{"lat":39.13711247479748,"lng":-86.5720105470036},{"lat":39.137133764971885,"lng":-86.5720328065302},{"lat":39.137154967616596,"lng":-86.57205520454907},{"lat":39.13717608135106,"lng":-86.57207773930749},{"lat":39.137197106732025,"lng":-86.57210041256421},{"lat":39.13721804182211,"lng":-86.57212322080782},{"lat":39.13723888662897,"lng":-86.57214616580104},{"lat":39.137259640865615,"lng":-86.57216924472557},{"lat":39.13728030289394,"lng":-86.5721924597086},{"lat":39.13730087435033,"lng":-86.57221580827049},{"lat":39.13732135303989,"lng":-86.57223929077966},{"lat":39.137340659937585,"lng":-86.57226165150534},{"lat":39.13751913070226,"lng":-86.57246933840919},{"lat":39.13773507875469,"lng":-86.57246758004149},{"lat":39.13846499688386,"lng":-86.57246163412168},{"lat":39.13872113452282,"lng":-86.57245954820334},{"lat":39.13926990090803,"lng":-86.57238454006304},{"lat":39.140468979379136,"lng":-86.57241662286091},{"lat":39.14119523297863,"lng":-86.57241463524811},{"lat":39.14180732366689,"lng":-86.5722950186866},{"lat":39.1418446586279,"lng":-86.57364339245062},{"lat":39.141844573227466,"lng":-86.57418771060533},{"lat":39.14184451641471,"lng":-86.57454024825441},{"lat":39.14184445871247,"lng":-86.57489282645884},{"lat":39.141844400167486,"lng":-86.5752453930379},{"lat":39.141844341111224,"lng":-86.57559796103429},{"lat":39.141844279614176,"lng":-86.57595052869898},{"lat":39.14184424956006,"lng":-86.57612681164618},{"lat":39.14194033892918,"lng":-86.57612804538051},{"lat":39.14242078739699,"lng":-86.57613421371678},{"lat":39.1426132949454,"lng":-86.57613899526362},{"lat":39.142594467653005,"lng":-86.57658789343961},{"lat":39.1429436009014,"lng":-86.5765938079944},{"lat":39.14352014531608,"lng":-86.57660357365418},{"lat":39.14364048510708,"lng":-86.57660561222784},{"lat":39.143999784256785,"lng":-86.57693065596419},{"lat":39.144126445397305,"lng":-86.57704524292389},{"lat":39.14412697808611,"lng":-86.57711769290464},{"lat":39.14440018732361,"lng":-86.57711858876036},{"lat":39.144398913496474,"lng":-86.57706298987937},{"lat":39.14482579039583,"lng":-86.57705656793314},{"lat":39.14483813456056,"lng":-86.57708168089448},{"lat":39.144854282345314,"lng":-86.5771101874034},{"lat":39.14487197270213,"lng":-86.57713714066766},{"lat":39.14489111663186,"lng":-86.57716240416947},{"lat":39.1449116155522,"lng":-86.57718584745314},{"lat":39.14493336544813,"lng":-86.57720735349965},{"lat":39.14495625573379,"lng":-86.57722680956758},{"lat":39.14500906722548,"lng":-86.57727016545846},{"lat":39.145285554776734,"lng":-86.57674078159097},{"lat":39.14522110846827,"lng":-86.57713918269889},{"lat":39.14504282670748,"lng":-86.57746318089238},{"lat":39.14501302216231,"lng":-86.57751119222962},{"lat":39.14501048878293,"lng":-86.57751504156337},{"lat":39.145007787918594,"lng":-86.57751869993609},{"lat":39.14500492938882,"lng":-86.57752215246886},{"lat":39.14500192057276,"lng":-86.57752539135197},{"lat":39.1448527514622,"lng":-86.57778292007475},{"lat":39.144851464028285,"lng":-86.57778759575227},{"lat":39.144849972162746,"lng":-86.57779217099475},{"lat":39.14484828294569,"lng":-86.57779663235333},{"lat":39.14484640096955,"lng":-86.57780096251838},{"lat":39.144844333053705,"lng":-86.57780515121617},{"lat":39.144786237175,"lng":-86.5779157725378},{"lat":39.14462862617731,"lng":-86.57823524981923},{"lat":39.144576799484696,"lng":-86.57823475603482},{"lat":39.14448962352252,"lng":-86.5783784007375},{"lat":39.144162609659574,"lng":-86.5789459663069},{"lat":39.14408114687428,"lng":-86.57910598049442},{"lat":39.143967683573976,"lng":-86.57936266191821},{"lat":39.143925831071975,"lng":-86.57945731451187},{"lat":39.143811505270754,"lng":-86.57971522934318},{"lat":39.143756040619465,"lng":-86.57978461812444},{"lat":39.14369446496824,"lng":-86.57986560542324},{"lat":39.14338322456713,"lng":-86.58027495790681},{"lat":39.143060845411775,"lng":-86.58082696441139},{"lat":39.142974304715814,"lng":-86.58097064449878},{"lat":39.14285891632158,"lng":-86.58107244474547},{"lat":39.14258506749364,"lng":-86.58139166521009},{"lat":39.14239471542446,"lng":-86.58168247222622},{"lat":39.14238408713411,"lng":-86.581697994596},{"lat":39.14238047977992,"lng":-86.58170349283878},{"lat":39.1423688411423,"lng":-86.58171863842064},{"lat":39.1422257238068,"lng":-86.58190762631835},{"lat":39.14215453606894,"lng":-86.58200636108148},{"lat":39.14213965380118,"lng":-86.58202700289759},{"lat":39.142062981446195,"lng":-86.58213334461317},{"lat":39.14200059472713,"lng":-86.58211325043166},{"lat":39.141854734358205,"lng":-86.58206627031095},{"lat":39.14185448583354,"lng":-86.5820084868235},{"lat":39.14144714823126,"lng":-86.58201137348728},{"lat":39.141448723266,"lng":-86.58250534250877},{"lat":39.141448848380854,"lng":-86.58254449294374},{"lat":39.14143218801557,"lng":-86.58254462967028},{"lat":39.140517882858056,"lng":-86.58255049541489},{"lat":39.140517956870525,"lng":-86.58251193639197},{"lat":39.14024340851979,"lng":-86.58251406427186},{"lat":39.14009028578112,"lng":-86.58251432559351},{"lat":39.140090241354514,"lng":-86.58252622275101},{"lat":39.13990986765018,"lng":-86.58252864334621},{"lat":39.13991000793522,"lng":-86.58255861002223},{"lat":39.139663068085326,"lng":-86.58256192341518},{"lat":39.138442247323084,"lng":-86.58255626250113},{"lat":39.13844210675783,"lng":-86.58252629433402},{"lat":39.137610618304585,"lng":-86.58252243910184},{"lat":39.1376107596922,"lng":-86.58255240691061},{"lat":39.13733620537462,"lng":-86.58255113308287},{"lat":39.13733606399047,"lng":-86.58252116609556},{"lat":39.13686383402461,"lng":-86.58251897725792},{"lat":39.136662036597244,"lng":-86.5825330487429},{"lat":39.13603644113001,"lng":-86.58253210452102},{"lat":39.13578424196359,"lng":-86.58253030432148},{"lat":39.135665485209266,"lng":-86.58253114557657},{"lat":39.135243225912056,"lng":-86.5825313146948},{"lat":39.13436914006928,"lng":-86.58252595171138},{"lat":39.13199167005206,"lng":-86.58250899935561},{"lat":39.13198757138564,"lng":-86.5815066139571},{"lat":39.13288424694645,"lng":-86.58150977289114},{"lat":39.132883602738524,"lng":-86.581033908924},{"lat":39.13288333896562,"lng":-86.58084002233409},{"lat":39.132882679219385,"lng":-86.5803550192696},{"lat":39.132676765956525,"lng":-86.58035392901007},{"lat":39.132442503423135,"lng":-86.5803526893087},{"lat":39.13196865887645,"lng":-86.58034991531912},{"lat":39.131939300323,"lng":-86.58038469484983},{"lat":39.131866580384944,"lng":-86.58047084398103},{"lat":39.131573985002376,"lng":-86.58047290622285},{"lat":39.13157429477259,"lng":-86.5803511255472},{"lat":39.13143701798825,"lng":-86.58035089470359},{"lat":39.13106877012044,"lng":-86.58035027708466},{"lat":39.13106782585584,"lng":-86.58062087809155},{"lat":39.13106707927049,"lng":-86.58169916961408},{"lat":39.131059587920824,"lng":-86.58248666430013},{"lat":39.13032121567806,"lng":-86.58248873262058},{"lat":39.12951225927782,"lng":-86.58248308306196},{"lat":39.129512504658834,"lng":-86.58245111757292},{"lat":39.128353338376705,"lng":-86.58242935024765},{"lat":39.128161133403395,"lng":-86.58242584294815},{"lat":39.12719168323439,"lng":-86.58240763842464},{"lat":39.12719183895229,"lng":-86.58247697426575},{"lat":39.126746112595924,"lng":-86.5824827691387},{"lat":39.126581546690936,"lng":-86.582447551926},{"lat":39.12636316447873,"lng":-86.58244583139538},{"lat":39.126327193035735,"lng":-86.58244507204672},{"lat":39.126326402582016,"lng":-86.58248079048256},{"lat":39.124276653390325,"lng":-86.58246464006153},{"lat":39.12345699425782,"lng":-86.58244623396394},{"lat":39.12345644041571,"lng":-86.58254507857707},{"lat":39.12345083851389,"lng":-86.58254486480932},{"lat":39.123401539863636,"lng":-86.58254298550087},{"lat":39.12336663922901,"lng":-86.58254255726804},{"lat":39.12336394087625,"lng":-86.58260806931389},{"lat":39.12427514509561,"lng":-86.58262853306918},{"lat":39.1254079433775,"lng":-86.5826374621788},{"lat":39.126542342437304,"lng":-86.58264640295677},{"lat":39.126616665881514,"lng":-86.5871355823745},{"lat":39.12669205513674,"lng":-86.59169978631093},{"lat":39.12736303955006,"lng":-86.5917016068802},{"lat":39.12802849834368,"lng":-86.5917034118987},{"lat":39.12857760580797,"lng":-86.59170490271516},{"lat":39.1296143263336,"lng":-86.59170771502372},{"lat":39.12958904132952,"lng":-86.58881355355098},{"lat":39.129586893001786,"lng":-86.58856790547142},{"lat":39.12958452327589,"lng":-86.58837976945645},{"lat":39.129579982576196,"lng":-86.58801934137153},{"lat":39.12957380491484,"lng":-86.5875290159568},{"lat":39.12956864659735,"lng":-86.58711970280902},{"lat":39.12956456168314,"lng":-86.58679564219668},{"lat":39.12956056158806,"lng":-86.58647842288121},{"lat":39.129555767452004,"lng":-86.58609832118883},{"lat":39.129550254121824,"lng":-86.58566124361718},{"lat":39.12954687339695,"lng":-86.58539339110445},{"lat":39.12954376006843,"lng":-86.58514668340744},{"lat":39.12954067805971,"lng":-86.58490254248485},{"lat":39.129537563761936,"lng":-86.58465585105711},{"lat":39.12953681974885,"lng":-86.584596948858},{"lat":39.128190404273816,"lng":-86.58458692436378},{"lat":39.128183406943336,"lng":-86.58458687184181},{"lat":39.127338696792734,"lng":-86.58455137731949},{"lat":39.12735988747497,"lng":-86.58263870769554},{"lat":39.12754975749554,"lng":-86.58263623925072},{"lat":39.12827811362329,"lng":-86.58262079967909},{"lat":39.12922139612143,"lng":-86.58264496836412},{"lat":39.12951218235285,"lng":-86.58264699886851},{"lat":39.12951293963977,"lng":-86.58270690839966},{"lat":39.130256929806535,"lng":-86.58272276039895},{"lat":39.130260521911715,"lng":-86.58272290382133},{"lat":39.13026410324525,"lng":-86.58272328808617},{"lat":39.13050144297426,"lng":-86.58271701874578},{"lat":39.130814844704176,"lng":-86.58271584649634},{"lat":39.13081463212786,"lng":-86.58265126752048},{"lat":39.13152861786033,"lng":-86.58264926987023},{"lat":39.13291646018583,"lng":-86.58265484075059},{"lat":39.134071891385844,"lng":-86.58266308221056},{"lat":39.13407736349079,"lng":-86.58394071614292},{"lat":39.134077197988816,"lng":-86.58394713762014},{"lat":39.134470701634505,"lng":-86.58394921709211},{"lat":39.13487491954982,"lng":-86.58395135237875},{"lat":39.1348798175832,"lng":-86.58342868247782},{"lat":39.13492616061263,"lng":-86.58343090503418},{"lat":39.134924979740966,"lng":-86.58315564201868},{"lat":39.13488244416512,"lng":-86.58314834051585},{"lat":39.13488694777217,"lng":-86.58266737829202},{"lat":39.134887492487394,"lng":-86.58260921308245},{"lat":39.135098360295174,"lng":-86.5826682670922},{"lat":39.13571839196568,"lng":-86.5826708750924},{"lat":39.136787874441936,"lng":-86.58267249146057},{"lat":39.13678787664583,"lng":-86.5826927560986},{"lat":39.137992362708395,"lng":-86.58268256924117},{"lat":39.13823980167952,"lng":-86.58268255664564},{"lat":39.13830940271372,"lng":-86.58268254035805},{"lat":39.13861016043591,"lng":-86.58268253017759},{"lat":39.141728745435685,"lng":-86.58265851202411},{"lat":39.14223290715315,"lng":-86.58274214774076},{"lat":39.14250745771254,"lng":-86.58273991516812},{"lat":39.142781659257146,"lng":-86.58266716895096},{"lat":39.14399467874265,"lng":-86.58267137577045},{"lat":39.14399495499745,"lng":-86.5827273171677},{"lat":39.1443711663936,"lng":-86.58272869615092},{"lat":39.144377145525226,"lng":-86.58272910369533},{"lat":39.14438307453711,"lng":-86.5827301793873},{"lat":39.144388908365364,"lng":-86.58273191473157},{"lat":39.14439460164736,"lng":-86.58273429559372},{"lat":39.144672729195,"lng":-86.58272979928773},{"lat":39.14487353072227,"lng":-86.5827305340616},{"lat":39.145148085184985,"lng":-86.58273154043815},{"lat":39.14519014468555,"lng":-86.58273169488305},{"lat":39.14542264125442,"lng":-86.58273087835164},{"lat":39.14564228764799,"lng":-86.5827301080525},{"lat":39.14627364387005,"lng":-86.58271620530279},{"lat":39.14854458186876,"lng":-86.58270060318446},{"lat":39.14869352965655,"lng":-86.58269955286738},{"lat":39.14869293966283,"lng":-86.58261148910123},{"lat":39.14869317543317,"lng":-86.58252629215443},{"lat":39.14869554843017,"lng":-86.58166661603192},{"lat":39.14814644321212,"lng":-86.58166685744327},{"lat":39.14759733793782,"lng":-86.5816670977472},{"lat":39.14730082118647,"lng":-86.58166722818093},{"lat":39.14711978514304,"lng":-86.58166784447455},{"lat":39.146600090321805,"lng":-86.58166898057917},{"lat":39.14659812919048,"lng":-86.58253481525917},{"lat":39.14327689446514,"lng":-86.58254832279471},{"lat":39.14273417139602,"lng":-86.58252378170386},{"lat":39.142373568957886,"lng":-86.58251491308907},{"lat":39.14234950297139,"lng":-86.5823252495024},{"lat":39.142384895072084,"lng":-86.58222901199356},{"lat":39.14252634313274,"lng":-86.58193791137128},{"lat":39.14260816774495,"lng":-86.58177895384017},{"lat":39.143378170885,"lng":-86.5807369491095},{"lat":39.14366329967611,"lng":-86.58034646453704},{"lat":39.14380624550881,"lng":-86.58018805187875},{"lat":39.143774246851784,"lng":-86.58015475918576},{"lat":39.14401914969272,"lng":-86.57971617335951},{"lat":39.14417859841476,"lng":-86.57939241115406},{"lat":39.14432981344045,"lng":-86.57909728765682},{"lat":39.14449880570667,"lng":-86.57923317072174},{"lat":39.14456991783473,"lng":-86.57929473697365},{"lat":39.14464136752667,"lng":-86.57935659570217},{"lat":39.14495507566405,"lng":-86.57962820896384},{"lat":39.1451556676364,"lng":-86.57980188701558},{"lat":39.14580405718781,"lng":-86.5798007339264},{"lat":39.14716185587414,"lng":-86.57979831955821},{"lat":39.147326601914116,"lng":-86.57979802716376},{"lat":39.14734563350158,"lng":-86.57979799345563},{"lat":39.14734586977946,"lng":-86.57939712746503},{"lat":39.14734696037848,"lng":-86.57751890694135},{"lat":39.14734699051071,"lng":-86.57746543631656},{"lat":39.1473471283302,"lng":-86.57722397807255},{"lat":39.14739597460085,"lng":-86.57722451537713},{"lat":39.14748097998685,"lng":-86.57722460542611},{"lat":39.148038168731965,"lng":-86.57722519723613},{"lat":39.14834570781281,"lng":-86.57721584875829},{"lat":39.14855573679912,"lng":-86.57719274959395},{"lat":39.148615951647415,"lng":-86.57718172077647},{"lat":39.148614445631374,"lng":-86.57979573709993},{"lat":39.14979535798763,"lng":-86.57979363571626},{"lat":39.15010955584206,"lng":-86.57979307651858},{"lat":39.15046540251836,"lng":-86.5797924437015},{"lat":39.15125765945089,"lng":-86.57979103404219},{"lat":39.15144737180083,"lng":-86.57980196373616},{"lat":39.15144745095542,"lng":-86.57970164994904},{"lat":39.151447414021774,"lng":-86.5796816035061},{"lat":39.15144709938164,"lng":-86.57964634426602},{"lat":39.15144646792507,"lng":-86.57961109257421},{"lat":39.151445520219454,"lng":-86.57957585265851},{"lat":39.15144425545486,"lng":-86.57954062769873},{"lat":39.15144267366638,"lng":-86.57950542580534},{"lat":39.15144077595681,"lng":-86.57947024802876},{"lat":39.15143856208363,"lng":-86.5794351017762},{"lat":39.15143603233819,"lng":-86.57939999092484},{"lat":39.151433186459705,"lng":-86.57936491865058},{"lat":39.15143002640054,"lng":-86.57932989199234},{"lat":39.15142655025263,"lng":-86.57929491413773},{"lat":39.15142276106046,"lng":-86.57925999070738},{"lat":39.15141865773961,"lng":-86.57922512488307},{"lat":39.15141424086667,"lng":-86.57919032300825},{"lat":39.151409512105786,"lng":-86.57915558895031},{"lat":39.15140447010564,"lng":-86.57912092765598},{"lat":39.151399117627015,"lng":-86.57908634263218},{"lat":39.15132867273069,"lng":-86.57864379631978},{"lat":39.15132335000609,"lng":-86.5786092041048},{"lat":39.15131836160036,"lng":-86.57857452981516},{"lat":39.15131370808237,"lng":-86.57853977803033},{"lat":39.151309391404425,"lng":-86.57850495578828},{"lat":39.15130541103569,"lng":-86.5784700673237},{"lat":39.151301768094164,"lng":-86.57843511721215},{"lat":39.15129846371005,"lng":-86.57840011285005},{"lat":39.151295497077996,"lng":-86.57836505847405},{"lat":39.151294256788916,"lng":-86.57834849290148},{"lat":39.15129515907202,"lng":-86.57815237219071},{"lat":39.15130083613614,"lng":-86.57691627996611},{"lat":39.15130184438091,"lng":-86.57669645621829},{"lat":39.151301967317984,"lng":-86.57666959962795},{"lat":39.151315022004056,"lng":-86.57381507075159},{"lat":39.151315116115626,"lng":-86.573794395396},{"lat":39.151451526457166,"lng":-86.57379531475706},{"lat":39.151553352376425,"lng":-86.57364367897975},{"lat":39.15355363594492,"lng":-86.5736514049408},{"lat":39.15413567678282,"lng":-86.57366646745531},{"lat":39.15471526544268,"lng":-86.57366940029833},{"lat":39.15509890940415,"lng":-86.57369078717001},{"lat":39.15534520931942,"lng":-86.57368670483191},{"lat":39.156419612791964,"lng":-86.57367539710205},{"lat":39.15718926933286,"lng":-86.57367114490634},{"lat":39.157982935712475,"lng":-86.5736757425742},{"lat":39.158449258071585,"lng":-86.57367844301892},{"lat":39.15858383250227,"lng":-86.5736792226441},{"lat":39.15913991310021,"lng":-86.57368244312673},{"lat":39.15935874110273,"lng":-86.57372603267082},{"lat":39.15945844677289,"lng":-86.57374707094831},{"lat":39.1601426222838,"lng":-86.57360934101332},{"lat":39.16052424576346,"lng":-86.57361140373841},{"lat":39.16062107814991,"lng":-86.57361190260096},{"lat":39.16063855143196,"lng":-86.57356387871629},{"lat":39.1608622031223,"lng":-86.57356466447337},{"lat":39.16084421785636,"lng":-86.57362651280174},{"lat":39.161848034766315,"lng":-86.57362715308481},{"lat":39.161850043378934,"lng":-86.57379936121337},{"lat":39.16187326210494,"lng":-86.57578606017316},{"lat":39.161874147677025,"lng":-86.5758619333075},{"lat":39.161875276319634,"lng":-86.57595858509417},{"lat":39.161910889167444,"lng":-86.57901181982035},{"lat":39.16191388843897,"lng":-86.579269282153},{"lat":39.162093222787064,"lng":-86.5792701751069},{"lat":39.16209866090686,"lng":-86.58022035648412},{"lat":39.16210479839364,"lng":-86.58129451264097},{"lat":39.16291878693354,"lng":-86.58130045206734},{"lat":39.16382208021087,"lng":-86.58130734378459},{"lat":39.16381678599848,"lng":-86.58259067051495},{"lat":39.16381530473965,"lng":-86.58274071537929},{"lat":39.163740617268466,"lng":-86.58287010477916},{"lat":39.16374034938831,"lng":-86.58294448366559},{"lat":39.16373957994352,"lng":-86.58315742269767},{"lat":39.16373866333663,"lng":-86.58341134768334},{"lat":39.16373813767507,"lng":-86.58355674257712},{"lat":39.16373770318484,"lng":-86.58367701756119},{"lat":39.16373674214677,"lng":-86.58394268602956},{"lat":39.16373666726976,"lng":-86.58396346292352},{"lat":39.16373578160117,"lng":-86.58420835448942},{"lat":39.163734861880485,"lng":-86.5844622794781},{"lat":39.163734436554066,"lng":-86.58457965359874},{"lat":39.163733941606466,"lng":-86.58471620446609},{"lat":39.16373341300437,"lng":-86.58486212697599},{"lat":39.16373302077458,"lng":-86.58497012839536},{"lat":39.163732100492076,"lng":-86.58522405337418},{"lat":39.16373144302555,"lng":-86.58540531388732},{"lat":39.163731178558024,"lng":-86.58547797836003},{"lat":39.16373025643856,"lng":-86.58573192520869},{"lat":39.16373008412947,"lng":-86.58577953571945},{"lat":39.163747902122815,"lng":-86.58595907517537},{"lat":39.163372508671394,"lng":-86.58595258975544},{"lat":39.163372390734644,"lng":-86.58598381880869},{"lat":39.16337143118588,"lng":-86.58623774628872},{"lat":39.163370471079254,"lng":-86.58649167270973},{"lat":39.16336926428458,"lng":-86.58681084134427},{"lat":39.16336762873813,"lng":-86.5872428371283},{"lat":39.1633670109707,"lng":-86.58740584145637},{"lat":39.163221452910115,"lng":-86.5873974773845},{"lat":39.16296612127521,"lng":-86.58739570297118},{"lat":39.16274648106616,"lng":-86.58739417556566},{"lat":39.162526839755195,"lng":-86.58739264922808},{"lat":39.162329163028865,"lng":-86.58739127407696},{"lat":39.16213148602732,"lng":-86.58738990034027},{"lat":39.161933809842765,"lng":-86.58738852659958},{"lat":39.16173613310244,"lng":-86.58738715286457},{"lat":39.160747749017276,"lng":-86.58738028210263},{"lat":39.160525362258255,"lng":-86.58737873591633},{"lat":39.16030298422557,"lng":-86.5873763390487},{"lat":39.160077846370555,"lng":-86.58737562577637},{"lat":39.15985271394109,"lng":-86.58737406043527},{"lat":39.15962757326655,"lng":-86.58737249515436},{"lat":39.15957267492221,"lng":-86.58737211358151},{"lat":39.15943281347492,"lng":-86.58737760574147},{"lat":39.15939985969509,"lng":-86.58737737654609},{"lat":39.15917473712328,"lng":-86.58737581112207},{"lat":39.15894960548424,"lng":-86.58737424611665},{"lat":39.15873546438065,"lng":-86.58737275770504},{"lat":39.15871609000909,"lng":-86.58737262289617},{"lat":39.15850188492124,"lng":-86.58737113352544},{"lat":39.15850180083282,"lng":-86.58727345011137},{"lat":39.15806246090051,"lng":-86.58726797577677},{"lat":39.15784279119806,"lng":-86.58726523897484},{"lat":39.157753555892555,"lng":-86.58726412635272},{"lat":39.157623121205326,"lng":-86.5872625004214},{"lat":39.15740345149092,"lng":-86.5872597646969},{"lat":39.157112334534894,"lng":-86.58725613740374},{"lat":39.15698572621601,"lng":-86.58725461439283},{"lat":39.15665361448089,"lng":-86.58725062261082},{"lat":39.15662314154116,"lng":-86.58725025579683},{"lat":39.15531977065125,"lng":-86.58723458709244},{"lat":39.15518237771112,"lng":-86.5872329349742},{"lat":39.15505766087487,"lng":-86.58723143645913},{"lat":39.15502051201597,"lng":-86.58723098923231},{"lat":39.15451274634303,"lng":-86.58722488525248},{"lat":39.15443019619567,"lng":-86.58722390876117},{"lat":39.15443022613541,"lng":-86.58732234508666},{"lat":39.154422933857916,"lng":-86.58781414623533},{"lat":39.15441005550033,"lng":-86.5883041851801},{"lat":39.15441412772752,"lng":-86.58853435246539},{"lat":39.1544082871574,"lng":-86.58876270223139},{"lat":39.15440767779159,"lng":-86.58883960522621},{"lat":39.154383800082236,"lng":-86.58950543436235},{"lat":39.154369424113696,"lng":-86.59032508932836},{"lat":39.15436612592574,"lng":-86.59069369850654},{"lat":39.15434378286199,"lng":-86.59171523833615},{"lat":39.15445866171765,"lng":-86.5917221291741},{"lat":39.15452829591041,"lng":-86.59172357071047},{"lat":39.15492118408999,"lng":-86.59172874110766},{"lat":39.15502488987743,"lng":-86.59173010531165},{"lat":39.155053903613044,"lng":-86.59173048773751},{"lat":39.15544066467677,"lng":-86.59173674674197},{"lat":39.15546456815607,"lng":-86.59173708009762},{"lat":39.156234823556765,"lng":-86.59174784719028},{"lat":39.156865227988845,"lng":-86.59175665887226},{"lat":39.15696035052672,"lng":-86.59175599836136},{"lat":39.158165243785376,"lng":-86.59177009843701},{"lat":39.15849567611875,"lng":-86.59177701457266},{"lat":39.15851281022828,"lng":-86.59177737318699},{"lat":39.161210905634526,"lng":-86.59183384947414},{"lat":39.16170384575079,"lng":-86.59184135237658},{"lat":39.16243398564938,"lng":-86.59185887012949},{"lat":39.16245191488566,"lng":-86.59185929941808},{"lat":39.16317759193275,"lng":-86.59187060401473},{"lat":39.163278030479404,"lng":-86.59187154223457},{"lat":39.16335000411128,"lng":-86.59187221475945},{"lat":39.16335080070062,"lng":-86.59166388660367},{"lat":39.16335082327925,"lng":-86.5916581102876},{"lat":39.1633631812261,"lng":-86.58841554013506},{"lat":39.16455366488051,"lng":-86.58843258160924},{"lat":39.164583524405074,"lng":-86.58843301001865},{"lat":39.164605984736994,"lng":-86.5884333315709},{"lat":39.16468700062941,"lng":-86.58843679185404},{"lat":39.1647465927071,"lng":-86.58843968808526},{"lat":39.16479826413792,"lng":-86.58844233122535},{"lat":39.164797363508434,"lng":-86.58832614578196},{"lat":39.164794629997054,"lng":-86.58797347844387},{"lat":39.164791894588916,"lng":-86.58762080973946},{"lat":39.16478915811966,"lng":-86.58726814248445},{"lat":39.164786420581784,"lng":-86.58691547491541},{"lat":39.16478369459268,"lng":-86.5865643499406},{"lat":39.16478234370415,"lng":-86.5863880172919},{"lat":39.16477982700016,"lng":-86.58603535177245},{"lat":39.164777308959025,"lng":-86.58568268734949},{"lat":39.16477226994697,"lng":-86.58497735790588},{"lat":39.16476974870151,"lng":-86.58462469288722},{"lat":39.16476722666649,"lng":-86.58427202860855},{"lat":39.16476455877948,"lng":-86.58389909800044},{"lat":39.16471822445084,"lng":-86.58389942566875},{"lat":39.16470917642322,"lng":-86.58306325610694},{"lat":39.164707415347294,"lng":-86.58296884821463},{"lat":39.16522829283987,"lng":-86.58296466258076},{"lat":39.16522791196277,"lng":-86.58287641236286},{"lat":39.16531027841845,"lng":-86.58287594471149},{"lat":39.16530982158209,"lng":-86.58277002598682},{"lat":39.16535319388118,"lng":-86.58285136755869},{"lat":39.16549046063698,"lng":-86.58284925523405},{"lat":39.16554545674861,"lng":-86.5828589876504},{"lat":39.165616835500884,"lng":-86.58285788858224},{"lat":39.16561673707836,"lng":-86.58284730966376},{"lat":39.16568353379085,"lng":-86.58284628079251},{"lat":39.16636992798913,"lng":-86.58284858931852},{"lat":39.166727512349325,"lng":-86.58285911110559},{"lat":39.166727311759416,"lng":-86.58287448013986},{"lat":39.16676196012471,"lng":-86.58287555508174},{"lat":39.16677069085368,"lng":-86.58285934542526},{"lat":39.16684614483272,"lng":-86.58285952664835},{"lat":39.16686128784889,"lng":-86.58285956287551},{"lat":39.166978404756314,"lng":-86.58285984490581},{"lat":39.16698253355219,"lng":-86.58242595765009},{"lat":39.166985790514154,"lng":-86.58208362371414},{"lat":39.16698592265617,"lng":-86.58206972761324},{"lat":39.16698878154987,"lng":-86.58176904387469},{"lat":39.1669884271956,"lng":-86.58169947605262},{"lat":39.16698838262959,"lng":-86.58169084519335},{"lat":39.16702611504794,"lng":-86.58169229302132},{"lat":39.167011281952156,"lng":-86.58125490005895},{"lat":39.16701015371523,"lng":-86.58121467110134},{"lat":39.166991297925655,"lng":-86.58054259520712},{"lat":39.16698386374235,"lng":-86.58030191517393},{"lat":39.16677343814921,"lng":-86.58030258209126},{"lat":39.166773940844934,"lng":-86.58016050595656},{"lat":39.166774557167685,"lng":-86.57998616906744},{"lat":39.16675181922044,"lng":-86.57998584053944},{"lat":39.166599072821725,"lng":-86.57998363123237},{"lat":39.16659886697343,"lng":-86.57996909112563},{"lat":39.166583981338256,"lng":-86.5789170167199},{"lat":39.16658332640811,"lng":-86.5787652889474},{"lat":39.16763347294271,"lng":-86.57875780979442},{"lat":39.16763280536438,"lng":-86.57870521548084},{"lat":39.16763220486305,"lng":-86.57865784486883},{"lat":39.16761559888398,"lng":-86.5773495060962},{"lat":39.16749518621353,"lng":-86.57734782981149},{"lat":39.16749323394826,"lng":-86.57725832364399},{"lat":39.16749014106866,"lng":-86.57711659913218},{"lat":39.167475062814816,"lng":-86.57642563959897},{"lat":39.16746784664027,"lng":-86.57609506883142},{"lat":39.167482554717786,"lng":-86.57609572677472},{"lat":39.16750620579715,"lng":-86.57609806316368},{"lat":39.167529729248656,"lng":-86.57610198585118},{"lat":39.16755306078817,"lng":-86.5761074861303},{"lat":39.16757613582012,"lng":-86.57611454683162},{"lat":39.167598892489714,"lng":-86.57612314970784},{"lat":39.16762126671967,"lng":-86.57613327053163},{"lat":39.167643197165795,"lng":-86.57614488223436},{"lat":39.167664625760054,"lng":-86.57615795349129},{"lat":39.167685491115215,"lng":-86.57617244735825},{"lat":39.16802446573582,"lng":-86.57642162872122},{"lat":39.16804865839259,"lng":-86.57643851944277},{"lat":39.168079074864046,"lng":-86.57645740940511},{"lat":39.16811021923255,"lng":-86.5764742283861},{"lat":39.16814200563464,"lng":-86.57648892973776},{"lat":39.16817434850741,"lng":-86.57650147280565},{"lat":39.16820715820494,"lng":-86.57651182507651},{"lat":39.16824034371458,"lng":-86.5765199554575},{"lat":39.168273815992926,"lng":-86.57652584377526},{"lat":39.168307481895155,"lng":-86.57652947376545},{"lat":39.16834124967665,"lng":-86.57653083550224},{"lat":39.16866404968315,"lng":-86.576539616912},{"lat":39.16886584170918,"lng":-86.57655125047295},{"lat":39.170208273508464,"lng":-86.57656116149215},{"lat":39.170931376637846,"lng":-86.57656649979482},{"lat":39.171127031184454,"lng":-86.57653905869326},{"lat":39.17127866501057,"lng":-86.5764835061651},{"lat":39.171413081864316,"lng":-86.57639593133936},{"lat":39.17152741039249,"lng":-86.57628782301133},{"lat":39.17162572401936,"lng":-86.57616918783049},{"lat":39.171722600109554,"lng":-86.57599824481247},{"lat":39.17178845126991,"lng":-86.57583571307505},{"lat":39.17182990732432,"lng":-86.575677453988},{"lat":39.17185532372283,"lng":-86.57551298121915},{"lat":39.17186105359888,"lng":-86.57528380764614},{"lat":39.17185400251887,"lng":-86.57509569026564},{"lat":39.171864541780074,"lng":-86.57486569652296},{"lat":39.17189335395205,"lng":-86.57473855271797},{"lat":39.171947149092645,"lng":-86.57459088740156},{"lat":39.171948582551025,"lng":-86.57458780663931},{"lat":39.17193663309729,"lng":-86.57360181149244},{"lat":39.172635597231974,"lng":-86.57360465778753},{"lat":39.17329910241882,"lng":-86.57360687436984},{"lat":39.17338034323855,"lng":-86.57360714672008},{"lat":39.17337053367955,"lng":-86.57351420746411},{"lat":39.17335609845011,"lng":-86.57337743924892},{"lat":39.173353152496084,"lng":-86.57334952802299},{"lat":39.17332669852123,"lng":-86.57309890478516},{"lat":39.17328242397029,"lng":-86.5726436947095},{"lat":39.173040188356325,"lng":-86.57017367154519},{"lat":39.17298183787647,"lng":-86.56953234213618},{"lat":39.172884440126666,"lng":-86.56846194734777},{"lat":39.17291920663738,"lng":-86.5684173533999},{"lat":39.17293661507198,"lng":-86.56840541577488},{"lat":39.1729009998617,"lng":-86.56806700063184},{"lat":39.17288699904004,"lng":-86.56791399993212},{"lat":39.17286699895079,"lng":-86.56769100034718},{"lat":39.17283699934398,"lng":-86.56732400059241},{"lat":39.172827998972636,"lng":-86.56721200000207},{"lat":39.172784000114,"lng":-86.56676700063714},{"lat":39.17276899897523,"lng":-86.56660600092566},{"lat":39.17265699891179,"lng":-86.56543499986925},{"lat":39.17261499895489,"lng":-86.564991000709},{"lat":39.17254399932471,"lng":-86.56498900034137},{"lat":39.172482429717,"lng":-86.56498838890275},{"lat":39.17249197687607,"lng":-86.56508679280151},{"lat":39.17254847857357,"lng":-86.5656691705137},{"lat":39.17259168715814,"lng":-86.56611456359764},{"lat":39.17260313284629,"lng":-86.56622913898542},{"lat":39.172648642245925,"lng":-86.56668474563143},{"lat":39.17265864069938,"lng":-86.56678896805369},{"lat":39.1723577079061,"lng":-86.5672084321246},{"lat":39.172258637377205,"lng":-86.56734652327647},{"lat":39.172157863959086,"lng":-86.56748698724742},{"lat":39.1718228138867,"lng":-86.567902892093},{"lat":39.17168584954889,"lng":-86.56808589722294},{"lat":39.17135579131487,"lng":-86.56858641543906},{"lat":39.171074188776664,"lng":-86.56937909421522},{"lat":39.17097971596803,"lng":-86.56949573684733},{"lat":39.17066759515197,"lng":-86.56994395578059},{"lat":39.17034911384344,"lng":-86.56994271079932},{"lat":39.1697121525791,"lng":-86.56993954255265},{"lat":39.16939367247083,"lng":-86.56993795859938},{"lat":39.16920697705355,"lng":-86.5699370294067},{"lat":39.16907519124552,"lng":-86.56993637429991},{"lat":39.16892673102082,"lng":-86.56993563585742},{"lat":39.16875671110263,"lng":-86.56993479034364},{"lat":39.16867547209527,"lng":-86.5699353799417},{"lat":39.16839120315533,"lng":-86.56993396590363},{"lat":39.168072722700686,"lng":-86.56993238194163},{"lat":39.167821631481914,"lng":-86.5699323106605},{"lat":39.167766724914195,"lng":-86.56993229472536},{"lat":39.167754240019,"lng":-86.56993229061918},{"lat":39.16743027704266,"lng":-86.56994201344607},{"lat":39.16742985528619,"lng":-86.56991558144101},{"lat":39.16742160571341,"lng":-86.56939811141663},{"lat":39.167419947236525,"lng":-86.56929412060869},{"lat":39.167419824622975,"lng":-86.56926694717924},{"lat":39.16677518666859,"lng":-86.56928256178848},{"lat":39.166767776361915,"lng":-86.56900888934986},{"lat":39.16676742790801,"lng":-86.56892969534479},{"lat":39.16676572429951,"lng":-86.56854334338998},{"lat":39.166546084483244,"lng":-86.56854494451156},{"lat":39.16572242169607,"lng":-86.56854381269268},{"lat":39.16550277812194,"lng":-86.56854339111247},{"lat":39.165296858063684,"lng":-86.56854299681092},{"lat":39.16509918380926,"lng":-86.56854261893119},{"lat":39.16509712995717,"lng":-86.56807708400481},{"lat":39.165096228858964,"lng":-86.567893683792},{"lat":39.16523989339419,"lng":-86.56789396028871},{"lat":39.165401880559976,"lng":-86.56789426952182},{"lat":39.16587452402992,"lng":-86.56789517061544},{"lat":39.165923988192255,"lng":-86.56789533368669},{"lat":39.16598435046573,"lng":-86.56789553395564},{"lat":39.16636164075489,"lng":-86.56789733132105},{"lat":39.16647476400593,"lng":-86.56789650564984},{"lat":39.16647470092593,"lng":-86.5678822442532},{"lat":39.166473576639106,"lng":-86.5676283129698},{"lat":39.166468564873426,"lng":-86.56649723175106},{"lat":39.16625442229524,"lng":-86.56649760583012},{"lat":39.16597775668902,"lng":-86.56649809078345},{"lat":39.16592036534607,"lng":-86.56649819126716},{"lat":39.165868247081555,"lng":-86.56649828243228},{"lat":39.165557085142034,"lng":-86.56649882619674},{"lat":39.16539571122326,"lng":-86.56649910925361},{"lat":39.165005174384575,"lng":-86.56649979196044},{"lat":39.16500311265692,"lng":-86.56603425921222},{"lat":39.16500106581079,"lng":-86.5655687249783},{"lat":39.16499901738121,"lng":-86.5651031911427},{"lat":39.16499813352599,"lng":-86.56489157730414},{"lat":39.165102684367326,"lng":-86.56489193662206},{"lat":39.16518614144795,"lng":-86.56488682508366},{"lat":39.165190812514034,"lng":-86.56470616894627},{"lat":39.16520452944452,"lng":-86.56448174560776},{"lat":39.16520181499274,"lng":-86.56430524542664},{"lat":39.16519900400559,"lng":-86.56412254397173},{"lat":39.16519767749457,"lng":-86.56362268468571},{"lat":39.165203472878375,"lng":-86.56352063512347},{"lat":39.16520273372962,"lng":-86.563193458265},{"lat":39.16524309285237,"lng":-86.56318742032659},{"lat":39.16526362306164,"lng":-86.56318434886684},{"lat":39.165239198881146,"lng":-86.56149098741355},{"lat":39.1655055737863,"lng":-86.56148902155351},{"lat":39.16563928273506,"lng":-86.56148803458377},{"lat":39.16563899943644,"lng":-86.56112299967863},{"lat":39.165638999404415,"lng":-86.56069900084348},{"lat":39.16590399931837,"lng":-86.55986800017588},{"lat":39.16709100016201,"lng":-86.55616700029154},{"lat":39.1673599993208,"lng":-86.55532899989026},{"lat":39.16742899921395,"lng":-86.55491999987504},{"lat":39.16767599966605,"lng":-86.55488500033584},{"lat":39.16841899870705,"lng":-86.5547830001408},{"lat":39.16855499919939,"lng":-86.55476499948549},{"lat":39.16864899943048,"lng":-86.55482700027038},{"lat":39.16884499924603,"lng":-86.55483300040942},{"lat":39.1689289991437,"lng":-86.55483599963688},{"lat":39.16904599936461,"lng":-86.55483200073547},{"lat":39.16921200000222,"lng":-86.55481599962229},{"lat":39.16943499956109,"lng":-86.55481400071179},{"lat":39.16944699956061,"lng":-86.55481400012755},{"lat":39.16963199865413,"lng":-86.55480599965256},{"lat":39.169773999898055,"lng":-86.55480399960464},{"lat":39.1702019993557,"lng":-86.55479799997363},{"lat":39.170321998944104,"lng":-86.55479700014789},{"lat":39.17034500011138,"lng":-86.55479700009803},{"lat":39.17042699929252,"lng":-86.55479799960641},{"lat":39.17056599910908,"lng":-86.5548019997579},{"lat":39.170672999340425,"lng":-86.55480699990294},{"lat":39.170756000120406,"lng":-86.55481200017334},{"lat":39.17078399956111,"lng":-86.55481000056155},{"lat":39.17086999965946,"lng":-86.55480400013482},{"lat":39.170898998895076,"lng":-86.55480299968133},{"lat":39.17081699886767,"lng":-86.55452700008927},{"lat":39.17076299944382,"lng":-86.55429499985587},{"lat":39.170752999417125,"lng":-86.55425099958266},{"lat":39.17070499916898,"lng":-86.553899000924},{"lat":39.170675999399016,"lng":-86.5535369997083},{"lat":39.170663999161974,"lng":-86.55306599997817},{"lat":39.17066899901199,"lng":-86.55272199993765},{"lat":39.170677999963715,"lng":-86.55219700028803},{"lat":39.17068399924966,"lng":-86.552051000302},{"lat":39.170702999511875,"lng":-86.55161300076297},{"lat":39.17070999981274,"lng":-86.55146800013719},{"lat":39.17083400014324,"lng":-86.55168600006172},{"lat":39.171102999267916,"lng":-86.55216700036073},{"lat":39.17119799929573,"lng":-86.55233700090487},{"lat":39.1714869994259,"lng":-86.5528240009309},{"lat":39.17217599935305,"lng":-86.55396199910122},{"lat":39.172345999360225,"lng":-86.55422900021699},{"lat":39.17239299961178,"lng":-86.5543030008751},{"lat":39.172449999704675,"lng":-86.55438099995796},{"lat":39.17254599973339,"lng":-86.55450000071012},{"lat":39.172662999257874,"lng":-86.55461500089518},{"lat":39.17288599898814,"lng":-86.55481800038622},{"lat":39.17295599979705,"lng":-86.55487499990213},{"lat":39.17316599986291,"lng":-86.5550459998471},{"lat":39.173235999328995,"lng":-86.5551040001559},{"lat":39.17357199923001,"lng":-86.5553790000156},{"lat":39.17458099928664,"lng":-86.55620400033035},{"lat":39.17491763810318,"lng":-86.55648007744398},{"lat":39.17501999553692,"lng":-86.55648230159309},{"lat":39.17532799922005,"lng":-86.55648899639547},{"lat":39.175398193179134,"lng":-86.55649052336861},{"lat":39.17543100072522,"lng":-86.55649084996793},{"lat":39.176166998151515,"lng":-86.55649819177117},{"lat":39.17660496985556,"lng":-86.55650256116255},{"lat":39.17781180780268,"lng":-86.55652863141458},{"lat":39.177862989378006,"lng":-86.55652974370051},{"lat":39.17837698749279,"lng":-86.55654091559796},{"lat":39.17877098710782,"lng":-86.55654947817432},{"lat":39.17898448584524,"lng":-86.5565427275686},{"lat":39.179018821323965,"lng":-86.55654015089483},{"lat":39.17903688441337,"lng":-86.55653653015531},{"lat":39.179052762716836,"lng":-86.55653068995198},{"lat":39.179073840351855,"lng":-86.5565130257143},{"lat":39.17909419470808,"lng":-86.55648787079568},{"lat":39.17911332698197,"lng":-86.55645001835082},{"lat":39.179117437716215,"lng":-86.55643558815513},{"lat":39.17912393298944,"lng":-86.556396514239},{"lat":39.179125623409995,"lng":-86.55637095112615},{"lat":39.17911444896102,"lng":-86.55470216653868},{"lat":39.179111669209284,"lng":-86.55428877009857},{"lat":39.17910864214577,"lng":-86.55409328188529},{"lat":39.179102714466126,"lng":-86.55371046840037},{"lat":39.17908962872559,"lng":-86.5526223810042},{"lat":39.17907495100208,"lng":-86.54980392917099},{"lat":39.17907514101885,"lng":-86.54866232115155},{"lat":39.17907297242578,"lng":-86.54759971666081},{"lat":39.17907519694566,"lng":-86.54749404548285},{"lat":39.17907945166473,"lng":-86.54743594284531},{"lat":39.17908732978787,"lng":-86.54738013664553},{"lat":39.17910321444548,"lng":-86.5472963951995},{"lat":39.17912453283676,"lng":-86.54721493746172},{"lat":39.179137926993675,"lng":-86.54717883342416},{"lat":39.179155031388355,"lng":-86.54715177937419},{"lat":39.17905923700538,"lng":-86.54715251373871},{"lat":39.17903912305821,"lng":-86.54582537492468},{"lat":39.17903859539665,"lng":-86.54567547432016},{"lat":39.179033396396655,"lng":-86.54420051979041},{"lat":39.17903293652233,"lng":-86.54407058255777},{"lat":39.17902157138526,"lng":-86.54203406284397},{"lat":39.179022366442524,"lng":-86.54055107981495},{"lat":39.179022125058694,"lng":-86.53967367896583},{"lat":39.17901463598607,"lng":-86.53848241123882},{"lat":39.17901311459353,"lng":-86.53774587609288},{"lat":39.179019522161276,"lng":-86.53773596704826},{"lat":39.17900128076652,"lng":-86.53593773945657},{"lat":39.17899110359358,"lng":-86.53469850008979},{"lat":39.17898979102981,"lng":-86.53349738172714},{"lat":39.17866453286188,"lng":-86.53349691090462},{"lat":39.177766629178336,"lng":-86.53349561141428},{"lat":39.17685592240032,"lng":-86.53350835483735},{"lat":39.17514697425644,"lng":-86.53355475151038},{"lat":39.175130897541734,"lng":-86.53355518782304},{"lat":39.17510653025489,"lng":-86.53355566012752},{"lat":39.17328407632506,"lng":-86.53359094121639},{"lat":39.173274851103194,"lng":-86.53358299133606},{"lat":39.17327399923856,"lng":-86.53382899988215},{"lat":39.173273000199714,"lng":-86.53456800032816},{"lat":39.17327299957158,"lng":-86.53481500011493},{"lat":39.17327299979262,"lng":-86.53506199989717},{"lat":39.173275999457964,"lng":-86.5357210001611},{"lat":39.17327399861729,"lng":-86.53580299927539},{"lat":39.17327200021369,"lng":-86.53605100043382},{"lat":39.17327099947088,"lng":-86.53639900002098},{"lat":39.1732709996205,"lng":-86.53744499948017},{"lat":39.17327099987693,"lng":-86.53779399941769},{"lat":39.17326999957186,"lng":-86.53794899955746},{"lat":39.173269999689026,"lng":-86.53841499970044},{"lat":39.173269999594005,"lng":-86.53857099985542},{"lat":39.17326799982804,"lng":-86.53903400102253},{"lat":39.173263999204515,"lng":-86.54042399960301},{"lat":39.173260999716874,"lng":-86.54045299988343},{"lat":39.17324999967215,"lng":-86.54048300028346},{"lat":39.1730259994559,"lng":-86.54081599937136},{"lat":39.17293399979522,"lng":-86.54095099973257},{"lat":39.1729189999912,"lng":-86.54097400012402},{"lat":39.17286599917026,"lng":-86.54104400094599},{"lat":39.17283499958926,"lng":-86.54107000030025},{"lat":39.17279899910488,"lng":-86.54108699982578},{"lat":39.172749999132634,"lng":-86.54109300034769},{"lat":39.172504999920314,"lng":-86.54109499978446},{"lat":39.17234199940532,"lng":-86.5410970004669},{"lat":39.17233099907145,"lng":-86.541097000649},{"lat":39.1722979986155,"lng":-86.54109700048552},{"lat":39.17228799929635,"lng":-86.54109800070644},{"lat":39.17216699889178,"lng":-86.54109900052924},{"lat":39.17180499977741,"lng":-86.54110300033908},{"lat":39.17168499928091,"lng":-86.54110500052856},{"lat":39.17143600025838,"lng":-86.54111000009782},{"lat":39.17069299951697,"lng":-86.54112800012628},{"lat":39.17044499926998,"lng":-86.54113399988675},{"lat":39.17026499933398,"lng":-86.54113500010756},{"lat":39.16972799867604,"lng":-86.54114200032588},{"lat":39.16954899889522,"lng":-86.54114500078329},{"lat":39.16936299929713,"lng":-86.54114900022385},{"lat":39.1688079994312,"lng":-86.54116200067075},{"lat":39.16862299890095,"lng":-86.54116700000523},{"lat":39.1686189992871,"lng":-86.54090000054327},{"lat":39.16861000012995,"lng":-86.54009900043857},{"lat":39.16860699991428,"lng":-86.53983300001963},{"lat":39.16840799904877,"lng":-86.53983500044154},{"lat":39.16781200016171,"lng":-86.53984499948447},{"lat":39.16761399947224,"lng":-86.53984800013865},{"lat":39.16743999958645,"lng":-86.53985400020704},{"lat":39.167415999314116,"lng":-86.53985400081139},{"lat":39.16682099888805,"lng":-86.539861999399},{"lat":39.16671099982718,"lng":-86.53986399961053},{"lat":39.16662399863065,"lng":-86.53986900024243},{"lat":39.16642299949091,"lng":-86.53986800029703},{"lat":39.166118999147464,"lng":-86.53986800005003},{"lat":39.16582099975101,"lng":-86.53986799980898},{"lat":39.16562099968479,"lng":-86.53986900001907},{"lat":39.165421998994596,"lng":-86.5398700002853},{"lat":39.16482799941862,"lng":-86.53987400069126},{"lat":39.164700999832206,"lng":-86.53987600112067},{"lat":39.16463499893323,"lng":-86.53984999988987},{"lat":39.16463399908865,"lng":-86.53961999995099},{"lat":39.16463200005809,"lng":-86.53893000023078},{"lat":39.16463199998428,"lng":-86.53870100058182},{"lat":39.164628999411846,"lng":-86.5384419994157},{"lat":39.16462299927194,"lng":-86.537665000028},{"lat":39.16462099909468,"lng":-86.53740699953732},{"lat":39.16462099905949,"lng":-86.53716400121675},{"lat":39.16462499953103,"lng":-86.53643799990188},{"lat":39.16462699900466,"lng":-86.53619599969757},{"lat":39.164626999357516,"lng":-86.53617899963731},{"lat":39.1646269998846,"lng":-86.53612900037699},{"lat":39.16462699943667,"lng":-86.5361130012392},{"lat":39.164627999273065,"lng":-86.5359490005289},{"lat":39.16462599950346,"lng":-86.5358700000793},{"lat":39.164608999829696,"lng":-86.53514099951818},{"lat":39.1646039995642,"lng":-86.53489900044505},{"lat":39.16460299930709,"lng":-86.53476500046708},{"lat":39.164600998770815,"lng":-86.53436600046946},{"lat":39.16460099925068,"lng":-86.53423300069578},{"lat":39.162845175711155,"lng":-86.53426584751077},{"lat":39.161352012085096,"lng":-86.53426962521257},{"lat":39.16137954735956,"lng":-86.53628179497453},{"lat":39.15939298466128,"lng":-86.53629717803346}],
      testPaths4: [{"lat":39.16338025365123,"lng":-86.55881115582919},{"lat":39.163382874180236,"lng":-86.55939449175195},{"lat":39.16349250904948,"lng":-86.5593989534361},{"lat":39.16376691392493,"lng":-86.55941011892006},{"lat":39.1640413824977,"lng":-86.55942128753301},{"lat":39.16405058793006,"lng":-86.56002503883204},{"lat":39.16405193285625,"lng":-86.5601133063474},{"lat":39.16377746433836,"lng":-86.56010213645374},{"lat":39.16350305951142,"lng":-86.56009096827906},{"lat":39.16322871782638,"lng":-86.56007980182738},{"lat":39.162979066518986,"lng":-86.56006964104124},{"lat":39.16266520349147,"lng":-86.56005686662736},{"lat":39.16263635282126,"lng":-86.56005569295931},{"lat":39.16264134611862,"lng":-86.56117075057229},{"lat":39.16257257810246,"lng":-86.56116781441749},{"lat":39.16257280783781,"lng":-86.56167387301686},{"lat":39.16258017429978,"lng":-86.56235350448098},{"lat":39.162506672603506,"lng":-86.56235036474447},{"lat":39.162221319270444,"lng":-86.56233817545699},{"lat":39.16192642815912,"lng":-86.56232470517787},{"lat":39.16170165197994,"lng":-86.56231404274621},{"lat":39.161481607950655,"lng":-86.56230360608821},{"lat":39.16149461291903,"lng":-86.5644755355069},{"lat":39.160627830442934,"lng":-86.56446675479455},{"lat":39.1588037873412,"lng":-86.56444827592111},{"lat":39.15863299140611,"lng":-86.56444654637299},{"lat":39.15856795241879,"lng":-86.56444588681956},{"lat":39.1583919770562,"lng":-86.56444880061645},{"lat":39.15824857456059,"lng":-86.56445117537547},{"lat":39.15818360753317,"lng":-86.56445224927776},{"lat":39.157864215102244,"lng":-86.56445753786369},{"lat":39.157851889468176,"lng":-86.5638689036571},{"lat":39.15784819778147,"lng":-86.56369264453167},{"lat":39.1578422144239,"lng":-86.563406962622},{"lat":39.15784121429651,"lng":-86.56335922680344},{"lat":39.15783675023036,"lng":-86.56314609786223},{"lat":39.15783574972162,"lng":-86.56309836205426},{"lat":39.157828331266494,"lng":-86.562744226293},{"lat":39.15782733086461,"lng":-86.56269648979095},{"lat":39.15781961477888,"lng":-86.56232825348889},{"lat":39.157818614211415,"lng":-86.56228051805844},{"lat":39.15781429584605,"lng":-86.5620744397741},{"lat":39.157813294898546,"lng":-86.5620267040014},{"lat":39.157808976086145,"lng":-86.56182062610573},{"lat":39.15780797613291,"lng":-86.56177289033326},{"lat":39.15780365604665,"lng":-86.5615668121271},{"lat":39.157802655991084,"lng":-86.56151907671563},{"lat":39.15779848317607,"lng":-86.56132004939299},{"lat":39.15779748274335,"lng":-86.56127231363902},{"lat":39.15779301486234,"lng":-86.5610591850043},{"lat":39.15779201377371,"lng":-86.56101144926298},{"lat":39.157783697670816,"lng":-86.56061486968451},{"lat":39.15778269723024,"lng":-86.56056713536228},{"lat":39.15777901220374,"lng":-86.56026236640066},{"lat":39.15777780785631,"lng":-86.56020495865164},{"lat":39.15777170802615,"lng":-86.5599141365848},{"lat":39.1577698581972,"lng":-86.55982596141943},{"lat":39.157479494282335,"lng":-86.55980979705518},{"lat":39.15743895814652,"lng":-86.55980647295239},{"lat":39.15705293106146,"lng":-86.55977489155241},{"lat":39.15709765006539,"lng":-86.55969027835282},{"lat":39.157099271259206,"lng":-86.55968720959704},{"lat":39.15733213494388,"lng":-86.55920096411856},{"lat":39.157332532068295,"lng":-86.5592001352716},{"lat":39.157449610086964,"lng":-86.55895565976738},{"lat":39.157564996570166,"lng":-86.55871471580107},{"lat":39.157618278500316,"lng":-86.55858370246578},{"lat":39.157696656828264,"lng":-86.55839098137669},{"lat":39.157757993856606,"lng":-86.55824016035898},{"lat":39.15783985091233,"lng":-86.55804369006623},{"lat":39.15789814515108,"lng":-86.55790377386316},{"lat":39.15800411892318,"lng":-86.5576494152049},{"lat":39.15801930275886,"lng":-86.55761296929248},{"lat":39.15802123910765,"lng":-86.55760832245916},{"lat":39.158112753984646,"lng":-86.55761290681149},{"lat":39.158285648250335,"lng":-86.55719809230278},{"lat":39.15835442049577,"lng":-86.5570558758019},{"lat":39.15850656402832,"lng":-86.55674125287179},{"lat":39.158781214205675,"lng":-86.55626482241833},{"lat":39.15878141723593,"lng":-86.55626448764471},{"lat":39.15926904340155,"lng":-86.55545872556783},{"lat":39.15939029335458,"lng":-86.55526157212599},{"lat":39.159896276779385,"lng":-86.55528336642519},{"lat":39.160170358080514,"lng":-86.5552951714085},{"lat":39.16033846064724,"lng":-86.55530241212917},{"lat":39.16034282723513,"lng":-86.55626744286396},{"lat":39.160624778046326,"lng":-86.5562743960659},{"lat":39.16062510666446,"lng":-86.55634669782607},{"lat":39.16092265494851,"lng":-86.55633803887137},{"lat":39.161351242883875,"lng":-86.5563247932547},{"lat":39.161353603838286,"lng":-86.55683254672726},{"lat":39.16147314905468,"lng":-86.55683697455166},{"lat":39.16214592968228,"lng":-86.55686070287999},{"lat":39.1625053348512,"lng":-86.55687337818287},{"lat":39.16261621958912,"lng":-86.5568772898269},{"lat":39.162617931581956,"lng":-86.55698830867371},{"lat":39.16263118905101,"lng":-86.55784831847993},{"lat":39.162634251402565,"lng":-86.55804708531002},{"lat":39.163358874767816,"lng":-86.5580901993339},{"lat":39.16336278780817,"lng":-86.55822217534241},{"lat":39.16338025365123,"lng":-86.55881115582919}],
      testPaths5: [{"lat":39.15576360487523,"lng":-86.55050128331455},{"lat":39.155767468805784,"lng":-86.55050022446389},{"lat":39.1558505061487,"lng":-86.55055409620958},{"lat":39.15584845776911,"lng":-86.55127517334805},{"lat":39.15584666388031,"lng":-86.55190521488466},{"lat":39.15584760596669,"lng":-86.5519515972377},{"lat":39.155853915569715,"lng":-86.55226222529836},{"lat":39.15586448515118,"lng":-86.55278274347774},{"lat":39.15586560556732,"lng":-86.55283791936058},{"lat":39.155873794083014,"lng":-86.55324125880438},{"lat":39.155875739709586,"lng":-86.55333708862702},{"lat":39.15588744160593,"lng":-86.55391360921232},{"lat":39.15588804162287,"lng":-86.55394318911512},{"lat":39.15589822903077,"lng":-86.55444521682026},{"lat":39.15589823929864,"lng":-86.55444572489805},{"lat":39.155911167998276,"lng":-86.55508301355755},{"lat":39.15591253377108,"lng":-86.55516294338939},{"lat":39.15584382830642,"lng":-86.55515998390543},{"lat":39.1558493618757,"lng":-86.55548392635055},{"lat":39.15585164904874,"lng":-86.55560126258564},{"lat":39.15585336678575,"lng":-86.55568939319878},{"lat":39.15585589279579,"lng":-86.55581896110189},{"lat":39.15588299418686,"lng":-86.55684480674707},{"lat":39.155888579946605,"lng":-86.55705626676117},{"lat":39.15591300626522,"lng":-86.55798120513525},{"lat":39.15593290623448,"lng":-86.55873494647813},{"lat":39.15593438878644,"lng":-86.55879111357174},{"lat":39.15593591711291,"lng":-86.55885129619827},{"lat":39.155945463392804,"lng":-86.55922729005026},{"lat":39.15595441169955,"lng":-86.55957979058611},{"lat":39.15595719058957,"lng":-86.55968924233365},{"lat":39.15595872618181,"lng":-86.55974973985505},{"lat":39.15596037696099,"lng":-86.55980575446283},{"lat":39.15597340220297,"lng":-86.5602478958554},{"lat":39.155979437865014,"lng":-86.56042650355799},{"lat":39.15600332993286,"lng":-86.5610258902678},{"lat":39.15601872329297,"lng":-86.56141212355301},{"lat":39.15601906633295,"lng":-86.56142073321641},{"lat":39.15582880075871,"lng":-86.56170853686325},{"lat":39.155684294727166,"lng":-86.56192182676605},{"lat":39.155612200850484,"lng":-86.56202823623929},{"lat":39.155406496943264,"lng":-86.56233184988345},{"lat":39.15537096359078,"lng":-86.56240309755898},{"lat":39.155342439502476,"lng":-86.56244636846613},{"lat":39.15505681234201,"lng":-86.56287965219661},{"lat":39.15493706189034,"lng":-86.56306130843525},{"lat":39.15461348477251,"lng":-86.56356751466447},{"lat":39.15414340275821,"lng":-86.56430290091436},{"lat":39.15412572452184,"lng":-86.564361819052},{"lat":39.15390209767507,"lng":-86.56472390964},{"lat":39.15389805267025,"lng":-86.56473045770572},{"lat":39.15346330869396,"lng":-86.56543437093515},{"lat":39.15345877870221,"lng":-86.56544170425126},{"lat":39.15327508543975,"lng":-86.5657391254738},{"lat":39.15317725585424,"lng":-86.56589019872537},{"lat":39.153086097024094,"lng":-86.56601815037267},{"lat":39.15302429113959,"lng":-86.56610025418597},{"lat":39.153012350487884,"lng":-86.56611487331915},{"lat":39.1528517311207,"lng":-86.56631152552},{"lat":39.15264013421594,"lng":-86.56654513694612},{"lat":39.15237689418634,"lng":-86.56684777455919},{"lat":39.152238241659624,"lng":-86.56696064233013},{"lat":39.152223980575066,"lng":-86.56693051132758},{"lat":39.152048125410026,"lng":-86.56706070082936},{"lat":39.151749941002585,"lng":-86.56726972177893},{"lat":39.151756517613116,"lng":-86.56728519677101},{"lat":39.15167968748985,"lng":-86.56733905210122},{"lat":39.15163568768626,"lng":-86.56729721322331},{"lat":39.15163829366861,"lng":-86.5673546115227},{"lat":39.151314248261926,"lng":-86.56754831735769},{"lat":39.150952411640176,"lng":-86.56771625049609},{"lat":39.15086719778829,"lng":-86.56763998667691},{"lat":39.15053420268514,"lng":-86.56763646171015},{"lat":39.14969618116936,"lng":-86.56762759048965},{"lat":39.14957552928384,"lng":-86.5676263134284},{"lat":39.1492547691996,"lng":-86.56762291784482},{"lat":39.14780835593115,"lng":-86.56760760597025},{"lat":39.14778452263777,"lng":-86.56649998319455},{"lat":39.14677680485808,"lng":-86.56648660125353},{"lat":39.14650235710673,"lng":-86.56647688896369},{"lat":39.146167529486725,"lng":-86.56646503878265},{"lat":39.14606881164567,"lng":-86.56646154555784},{"lat":39.14600011498453,"lng":-86.56645911408525},{"lat":39.14583267921667,"lng":-86.56645433865847},{"lat":39.145497798966424,"lng":-86.56644536440545},{"lat":39.145162917320995,"lng":-86.5664363895248},{"lat":39.14482803592921,"lng":-86.56642741435705},{"lat":39.144493155622534,"lng":-86.566418440659},{"lat":39.14416673869237,"lng":-86.56640969318568},{"lat":39.144110115582556,"lng":-86.56640817553779},{"lat":39.144032942320884,"lng":-86.56406500056464},{"lat":39.14404089056053,"lng":-86.56395275152751},{"lat":39.144188491160996,"lng":-86.56400054667807},{"lat":39.1458929305005,"lng":-86.56404616657572},{"lat":39.1483243347074,"lng":-86.5641321321821},{"lat":39.14832422214179,"lng":-86.56404394533725},{"lat":39.14832712901409,"lng":-86.5639558660581},{"lat":39.14832804203532,"lng":-86.56383490360547},{"lat":39.14833377316376,"lng":-86.56307530497453},{"lat":39.148853108775626,"lng":-86.5627044038294},{"lat":39.14902770956182,"lng":-86.56250599261966},{"lat":39.14877343918058,"lng":-86.56169417718297},{"lat":39.15042408823293,"lng":-86.5602988848587},{"lat":39.15068713132787,"lng":-86.56083541017252},{"lat":39.150821569437326,"lng":-86.56110962783234},{"lat":39.15133875397126,"lng":-86.56076169358505},{"lat":39.15130308414761,"lng":-86.55997715761319},{"lat":39.151283156552395,"lng":-86.55953889681896},{"lat":39.151277716989966,"lng":-86.5594192856373},{"lat":39.15122933483615,"lng":-86.55835542784477},{"lat":39.15122387203222,"lng":-86.55823531524867},{"lat":39.15107460497903,"lng":-86.55495458858255},{"lat":39.15107227195318,"lng":-86.55490333104908},{"lat":39.15099678897122,"lng":-86.55232101754588},{"lat":39.1509513391424,"lng":-86.55076708191343},{"lat":39.150947949612956,"lng":-86.55065122459766},{"lat":39.15340174954151,"lng":-86.55081572489517},{"lat":39.1533939524652,"lng":-86.550309913429},{"lat":39.15365272585629,"lng":-86.55032725028558},{"lat":39.153798288479884,"lng":-86.55033637697612},{"lat":39.155026974250134,"lng":-86.55041341283285},{"lat":39.155028583127475,"lng":-86.55041304770795},{"lat":39.155030190922744,"lng":-86.55041268611755},{"lat":39.15503180091438,"lng":-86.55041232451056},{"lat":39.155033408995486,"lng":-86.55041196538642},{"lat":39.1550350187287,"lng":-86.5504116073077},{"lat":39.15503662764956,"lng":-86.55041125170355},{"lat":39.15503823849064,"lng":-86.55041089573227},{"lat":39.155039847427624,"lng":-86.55041054365431},{"lat":39.15504145718179,"lng":-86.55041019015964},{"lat":39.15504306805027,"lng":-86.55040984018292},{"lat":39.15504467809994,"lng":-86.55040949127024},{"lat":39.155046288710004,"lng":-86.55040914482178},{"lat":39.155047900418246,"lng":-86.55040879836503},{"lat":39.15504951131251,"lng":-86.55040845403022},{"lat":39.15505273477092,"lng":-86.55040777028483},{"lat":39.1550543456926,"lng":-86.55040743194458},{"lat":39.15505595826156,"lng":-86.55040709359189},{"lat":39.155057570011714,"lng":-86.55040675630325},{"lat":39.15505918177799,"lng":-86.55040642254083},{"lat":39.15506079519155,"lng":-86.55040608876598},{"lat":39.1550624069675,"lng":-86.55040575711928},{"lat":39.15506401984809,"lng":-86.55040542687479},{"lat":39.155065633282604,"lng":-86.55040509768399},{"lat":39.15506724700296,"lng":-86.55040477095949},{"lat":39.15506885962996,"lng":-86.55040444530113},{"lat":39.15507047309027,"lng":-86.55040412175228},{"lat":39.15507208682513,"lng":-86.55040379820133},{"lat":39.15507370139491,"lng":-86.55040347711254},{"lat":39.15507531597598,"lng":-86.55040315849209},{"lat":39.15507692945885,"lng":-86.55040283987991},{"lat":39.155078544873234,"lng":-86.55040252336897},{"lat":39.155080159473655,"lng":-86.55040220897997},{"lat":39.155081774075676,"lng":-86.55040189494358},{"lat":39.15508338951102,"lng":-86.5504015830167},{"lat":39.15508500495765,"lng":-86.55040127355818},{"lat":39.15508661958547,"lng":-86.55040096516372},{"lat":39.15508823586701,"lng":-86.55040065816732},{"lat":39.15508985132815,"lng":-86.55040035188237},{"lat":39.15509146790037,"lng":-86.55040004841011},{"lat":39.15509308337763,"lng":-86.55039974565138},{"lat":39.15509469968497,"lng":-86.55039944429691},{"lat":39.15509631710019,"lng":-86.55039914504988},{"lat":39.15509793342365,"lng":-86.55039884722162},{"lat":39.1550995500265,"lng":-86.55039855044916},{"lat":39.15510116718812,"lng":-86.55039825578827},{"lat":39.155102783811934,"lng":-86.55039796359989},{"lat":39.15510440098483,"lng":-86.55039767140735},{"lat":39.15510601926238,"lng":-86.55039738061701},{"lat":39.15510763673078,"lng":-86.55039709300648},{"lat":39.155109255022836,"lng":-86.55039680538972},{"lat":39.15511087332617,"lng":-86.55039652024134},{"lat":39.155112491634334,"lng":-86.55039623615079},{"lat":39.15511410884916,"lng":-86.5503959531264},{"lat":39.15511572827164,"lng":-86.55039567255379},{"lat":39.15511734632622,"lng":-86.5503953930494},{"lat":39.155118965758376,"lng":-86.5503951145925},{"lat":39.155120584103635,"lng":-86.55039483861225},{"lat":39.15512220410262,"lng":-86.55039456403007},{"lat":39.15512382328602,"lng":-86.55039429121719},{"lat":39.15512544275202,"lng":-86.55039402016536},{"lat":39.15512706194672,"lng":-86.55039374982083},{"lat":39.155128681969884,"lng":-86.55039348052794},{"lat":39.1551303022805,"lng":-86.55039321405398},{"lat":39.15513192231979,"lng":-86.55039294828732},{"lat":39.15513354264491,"lng":-86.55039268498693},{"lat":39.15513516270193,"lng":-86.55039242309913},{"lat":39.15513678385553,"lng":-86.55039216085038},{"lat":39.15513840420161,"lng":-86.55039190213408},{"lat":39.15514002620143,"lng":-86.55039164481583},{"lat":39.15514164628264,"lng":-86.55039138821734},{"lat":39.155143266644835,"lng":-86.55039113302723},{"lat":39.15514488867044,"lng":-86.55039088135095},{"lat":39.15514650987241,"lng":-86.55039062968086},{"lat":39.155148131902855,"lng":-86.55039037906242},{"lat":39.155149753944585,"lng":-86.55039013091235},{"lat":39.15515137599599,"lng":-86.550389884878},{"lat":39.15515299695082,"lng":-86.55038963920454},{"lat":39.15515462010525,"lng":-86.55038939421978},{"lat":39.15515624135397,"lng":-86.55038915277571},{"lat":39.155157864251585,"lng":-86.55038891167186},{"lat":39.155159486335236,"lng":-86.55038867268995},{"lat":39.155161110345546,"lng":-86.55038843475138},{"lat":39.15516273245015,"lng":-86.55038820035357},{"lat":39.15516435619721,"lng":-86.55038796488542},{"lat":39.15516597940485,"lng":-86.55038773153717},{"lat":39.15516760234922,"lng":-86.55038750065934},{"lat":39.15516922529843,"lng":-86.55038727083938},{"lat":39.15517084852863,"lng":-86.55038704242784},{"lat":39.1551724723176,"lng":-86.55038681612788},{"lat":39.15517409638597,"lng":-86.55038659088372},{"lat":39.15517572046561,"lng":-86.55038636810792},{"lat":39.155177345094344,"lng":-86.55038614532796},{"lat":39.155178968360026,"lng":-86.55038592467409},{"lat":39.155180592186085,"lng":-86.55038570648445},{"lat":39.15518221711193,"lng":-86.55038548863914},{"lat":39.15518384204585,"lng":-86.55038527255694},{"lat":39.15518709193627,"lng":-86.55038484532925},{"lat":39.15518871607395,"lng":-86.55038463524784},{"lat":39.15519034103528,"lng":-86.55038442516022},{"lat":39.1551919668267,"lng":-86.55038421647686},{"lat":39.15519359180898,"lng":-86.55038401097333},{"lat":39.15519521761492,"lng":-86.55038380546358},{"lat":39.15519684343213,"lng":-86.5503836024222},{"lat":39.155198468428935,"lng":-86.55038340009226},{"lat":39.15520009425743,"lng":-86.55038319951922},{"lat":39.15520172009399,"lng":-86.5503830007093},{"lat":39.1552033470352,"lng":-86.55038280330159},{"lat":39.15520497206585,"lng":-86.55038260837672},{"lat":39.155206598743796,"lng":-86.55038241343944},{"lat":39.155208225710794,"lng":-86.55038222167367},{"lat":39.155211477461314,"lng":-86.55038184097971},{"lat":39.155213105272914,"lng":-86.55038165379183},{"lat":39.15521473198793,"lng":-86.55038146696486},{"lat":39.15521635788899,"lng":-86.55038128225985},{"lat":39.15521798489308,"lng":-86.5503810986044},{"lat":39.15521961273208,"lng":-86.55038091741112},{"lat":39.15522123947935,"lng":-86.5503807376366},{"lat":39.155222866504396,"lng":-86.55038055856527},{"lat":39.15522449408498,"lng":-86.55038038090025},{"lat":39.15522612195141,"lng":-86.55038020570154},{"lat":39.155227748997405,"lng":-86.5503800312143},{"lat":39.155229376605405,"lng":-86.5503798595439},{"lat":39.15523100449117,"lng":-86.55037968857667},{"lat":39.15523263321186,"lng":-86.55037952007159},{"lat":39.15523426110892,"lng":-86.55037935157272},{"lat":39.15523588984575,"lng":-86.55037918659386},{"lat":39.15523751747954,"lng":-86.55037902056542},{"lat":39.15523914540239,"lng":-86.55037885770851},{"lat":39.15524077415533,"lng":-86.55037869625588},{"lat":39.15524240291795,"lng":-86.550378536919},{"lat":39.15524403086338,"lng":-86.55037837899881},{"lat":39.15524565963729,"lng":-86.55037822213029},{"lat":39.15524728841602,"lng":-86.55037806631962},{"lat":39.15524891720605,"lng":-86.55037791297732},{"lat":39.15525054600575,"lng":-86.55037776175077},{"lat":39.15525217590365,"lng":-86.55037761051594},{"lat":39.155253804430416,"lng":-86.55037745964405},{"lat":39.155255434349264,"lng":-86.55037731299332},{"lat":39.15525706317637,"lng":-86.55037716776135},{"lat":39.15525869283197,"lng":-86.55037702358106},{"lat":39.15526032166877,"lng":-86.55037688046484},{"lat":39.15526195134048,"lng":-86.55037673981077},{"lat":39.15526358129157,"lng":-86.5503766002125},{"lat":39.15526521014933,"lng":-86.55037646168037},{"lat":39.15526684066565,"lng":-86.55037632560419},{"lat":39.15526847063287,"lng":-86.55037618953214},{"lat":39.155270100336836,"lng":-86.55037605593053},{"lat":39.15527173005047,"lng":-86.55037592444468},{"lat":39.15527336086714,"lng":-86.55037579400839},{"lat":39.15527499059206,"lng":-86.5503756649909},{"lat":39.15527662060121,"lng":-86.55037553808707},{"lat":39.1552782511659,"lng":-86.55037541258959},{"lat":39.155279882008365,"lng":-86.55037528779528},{"lat":39.15528151176554,"lng":-86.55037516583026},{"lat":39.15528314262412,"lng":-86.55037504456219},{"lat":39.15528477321461,"lng":-86.55037492470669},{"lat":39.15528640409094,"lng":-86.55037480731748},{"lat":39.15528803387229,"lng":-86.5503746906418},{"lat":39.1552896647583,"lng":-86.55037457536834},{"lat":39.15529129538587,"lng":-86.55037446362319},{"lat":39.15529292711163,"lng":-86.55037435186975},{"lat":39.15529455801859,"lng":-86.55037424118039},{"lat":39.15529618866229,"lng":-86.55037413296148},{"lat":39.15529781959021,"lng":-86.55037402685623},{"lat":39.155299451341776,"lng":-86.55037392074478},{"lat":39.15530108309978,"lng":-86.5503738160438},{"lat":39.15530271376929,"lng":-86.55037371346687},{"lat":39.15530434554826,"lng":-86.55037361335002},{"lat":39.15530597650843,"lng":-86.55037351429725},{"lat":39.155309239822465,"lng":-86.55037332076547},{"lat":39.155310870803596,"lng":-86.55037322629683},{"lat":39.155312502618045,"lng":-86.55037313393771},{"lat":39.15531331838558,"lng":-86.55037308723023},{"lat":39.15540981421737,"lng":-86.55049215984336},{"lat":39.15543164193486,"lng":-86.55049118766973},{"lat":39.15545347973882,"lng":-86.55049049999826},{"lat":39.15547531887117,"lng":-86.55049010289008},{"lat":39.15549716205482,"lng":-86.55048999138799},{"lat":39.15551900407338,"lng":-86.55049016553158},{"lat":39.15554084438905,"lng":-86.55049062779369},{"lat":39.1555626808006,"lng":-86.55049137713324},{"lat":39.15558474289685,"lng":-86.55049242662966},{"lat":39.15574788168806,"lng":-86.55050262591571},{"lat":39.155751827521335,"lng":-86.55050272663162},{"lat":39.15575577475873,"lng":-86.55050253394086},{"lat":39.155759704479074,"lng":-86.55050205292304},{"lat":39.15576360487523,"lng":-86.55050128331455}],
      councilDistrictRepGeoJson: null,
      bloomingtonShape: [ [ -86.5921624379486, 39.1215992854931 ], [ -86.4705193608094, 39.1215992854931 ], [ -86.4705193608094, 39.2209825999752 ], [ -86.5921624379486, 39.2209825999752 ], [ -86.5921624379486, 39.1215992854931 ] ],
      districRepGeoCoords: [[3111480.1717,1428308.6424],[3111415.2401,1428308.9701],[3111220.4406,1428310.6831],[3111155.2232,1428311.374],[3111090.0101,1428311.3366],[3110894.3714,1428311.2257],[3110829.1586,1428311.189],[3110762.5301,1428310.7795],[3110562.6431,1428309.9163],[3110496.0123,1428309.872],[3110497.5868,1428238.1265],[3110502.3092,1428022.8907],[3110502.7334,1427999.9461],[3110502.7492,1427951.1382],[3110504.0356,1427880.1193],[3110507.8942,1427667.0633],[3110509.1779,1427596.4089],[3110510.1897,1427523.9317],[3110513.2203,1427307.2281],[3110514.2298,1427235.1147],[3110519.5605,1426782.0345],[3110812.5192,1426773.9988],[3110996.5447,1426774.0375],[3110999.947,1426774.0585],[3111548.6408,1426770.8836],[3111732.3874,1426770.1973],[3111821.7029,1426770.7495],[3112088.7995,1426772.4027],[3112177.5457,1426773.317],[3112233.1177,1426774.0257],[3112399.5455,1426776.8794],[3112454.8292,1426778.3151],[3112508.7025,1426778.6494],[3112670.3163,1426780.3823],[3112723.9038,1426781.0798],[3112803.0142,1426781.2074],[3113040.3454,1426781.5929],[3113119.4536,1426782.0861],[3113169.069,1426783.1235],[3113194.5718,1426785.8324],[3113207.8868,1426787.737],[3113419.9854,1426787.6038],[3113494.8426,1426787.7071],[3113560.0685,1426786.2937],[3113650.2465,1426785.0365],[3113754.8709,1426786.0555],[3113819.7996,1426786.8259],[3113880.1945,1426787.2041],[3114000.1326,1426787.9558],[3114060.8172,1426787.2438],[3114120.9329,1426786.8921],[3114176.5092,1426786.8767],[3114342.667,1426787.5559],[3114397.9579,1426787.9033],[3114456.9345,1426788.274],[3114633.2953,1426789.7474],[3114691.9862,1426790.4811],[3114763.7223,1426790.9328],[3114978.0755,1426793.0122],[3115049.5232,1426794.1913],[3115118.9912,1426794.63],[3115326.5436,1426795.941],[3115395.7279,1426796.3783],[3115412.7406,1426796.486],[3115464.0617,1426796.8104],[3115480.7884,1426797.2803],[3115571.0002,1426797.8902],[3115743.1521,1426799.8199],[3115745.3154,1426370.744],[3115750.426,1426053.724],[3115749.6504,1426051.8779],[3115402.7938,1426058.3857],[3115045.0987,1426058.3857],[3114722.0878,1426038.8635],[3114407.7489,1426030.1866],[3114119.4247,1426036.6935],[3113818.0929,1426023.6788],[3113508.0607,1426028.1807],[3113127.4306,1426028.1807],[3112727.4179,1426029.9425],[3112427.8477,1426033.4649],[3111735.3143,1426033.4649],[3111341.5762,1426033.8369],[3111120.032,1426036.7529],[3110805.2052,1426036.7529],[3110802.2899,1425701.4199],[3110802.2899,1424969.5175],[3110528.5066,1424969.3682],[3110464.1807,1424965.9814],[3110068.0712,1424962.5946],[3109692.275,1424969.3682],[3109687.7541,1424969.2908],[3109296.165,1424962.5946],[3108967.766,1424972.755],[3108615.6689,1424979.5293],[3108243.2583,1424976.1415],[3107867.2797,1424976.0332],[3107867.279,1425699.6145],[3108437.897,1425693.0321],[3108435.6768,1426236.8857],[3108441.1197,1426876.4566],[3108403.4089,1426876.2282],[3108290.2719,1426876.2725],[3108252.2753,1426876.4071],[3108183.6478,1426877.8136],[3107976.9094,1426882.7571],[3107954.5052,1426883.3503],[3107908.0066,1426882.7056],[3107903.4702,1426882.6784],[3107889.2934,1426882.5927],[3107884.4732,1426882.5635],[3107815.8608,1426881.4215],[3107610.019,1426878.7243],[3107541.1192,1426878.3096],[3107467.9613,1426878.598],[3107247.6376,1426879.4592],[3107174.1938,1426880.1111],[3107109.2632,1426879.7214],[3106913.6162,1426879.2762],[3106848.3998,1426879.2496],[3106840.8834,1426903.2446],[3106841.1735,1426949.5044],[3106841.0117,1427165.8606],[3106840.8611,1427238.3433],[3106840.7083,1427311.19],[3106840.058,1427419.7288],[3106839.3946,1427530.4533],[3106838.6725,1427603.6605],[3106839.9005,1427635.357],[3106840.2276,1427675.4248],[3106841.1971,1427892.1524],[3106841.1449,1427900.8939],[3106842.4664,1427964.2792],[3106842.8851,1428036.4011],[3106844.4195,1428253.4958],[3106844.5524,1428325.9803],[3106769.1283,1428326.6213],[3106542.0058,1428328.54],[3106466.2963,1428329.5442],[3106467.311,1428396.9345],[3106469.7887,1428599.1014],[3106470.5177,1428666.8539],[3106470.9787,1428732.0552],[3106471.7943,1428927.6562],[3106471.686,1428993.2184],[3106472.8471,1429083.5565],[3106476.3327,1429354.2066],[3106477.208,1429444.9068],[3106477.5138,1429488.6174],[3106477.8596,1429620.4734],[3106477.8796,1429664.5465],[3106478.1414,1429668.1902],[3106478.0695,1429680.2098],[3106478.0456,1429684.2164],[3106478.2579,1429743.5887],[3106478.2913,1429832.827],[3106479.8858,1429850.6842],[3106484.6269,1429863.8253],[3106491.9304,1429875.1602],[3106511.6607,1429894.5831],[3106518.1488,1429900.0854],[3106556.2219,1429933.8229],[3106650.141,1430015.9743],[3106658.6223,1430020.0317],[3106666.8375,1430021.1734],[3107060.901,1430024.9923],[3107192.16,1430026.5087],[3107236.3869,1430026.7744],[3107368.5005,1430027.5684],[3107412.4417,1430028.197],[3107511.3851,1430028.7922],[3107807.9317,1430030.5786],[3107906.5893,1430031.5382],[3107976.8946,1430032.6904],[3108000.1374,1430033.5595],[3108186.9742,1430033.5956],[3108257,1430034.0189],[3108327.0258,1430034.4427],[3108536.5343,1430036.075],[3108606.2772,1430036.8079],[3108604.003,1430040.1543],[3108609.9819,1430703.9991],[3108610.062,1430712.8751],[3108610.1502,1430718.7314],[3108619.5302,1431341.2538],[3108621.1319,1431672.9785],[3108618.7808,1432000.0159],[3108617.9291,1432118.4825],[3108977.6,1432115.1981],[3109334.0599,1432115.1981],[3109695.465,1432118.7338],[3109957.85,1432120.1479],[3109984.7249,1432120.8549],[3110005.235,1432122.2699],[3110083.6338,1432132.6036],[3110159.4608,1432132.9494],[3110208.2757,1432133.1721],[3110247.8832,1432133.3526],[3110298.787,1432133.5849],[3110343.3259,1432133.788],[3110375.1513,1432133.9333],[3110442.7155,1432134.2414],[3110740.7218,1432134.2414],[3111422.599,1432149.3926],[3111735.7578,1432149.3926],[3112139.8335,1432154.4431],[3112139.8338,1432152.0474],[3112732.6141,1432159.968],[3112735.5449,1432136.7161],[3112753.5291,1432000.0002],[3112762.0452,1431927.6151],[3112773.6229,1431802.3519],[3112777.8338,1431687.6169],[3112779.9391,1431571.8301],[3112779.9391,1431509.7259],[3112774.676,1431347.6238],[3112769.3181,1431209.756],[3112763.097,1431165.5149],[3112734.6771,1430901.3091],[3112727.309,1430827.6268],[3112725.203,1430774.996],[3112724.2792,1430730.859],[3112730.4662,1430637.1029],[3112734.6771,1430587.6299],[3112740.992,1430531.842],[3112748.3611,1430473.9481],[3112753.6239,1430437.107],[3112762.533,1430328.6141],[3112764.1501,1430286.584],[3112766.2551,1430231.8479],[3112769.4129,1430097.1139],[3112768.1531,1429999.9999],[3112768.5891,1429988.433],[3112758.2181,1429824.89],[3112738.6125,1429464.9278],[3112736.4405,1429464.9941],[3112529.0978,1429455.1056],[3112433.328,1429455.1056],[3112177.6074,1429459.0948],[3111788.2118,1429460.4239],[3111464.9893,1429456.4357],[3111471.6396,1429017.703],[3111473.9539,1428672.0298],[3111473.9841,1428670.5961],[3111480.1717,1428308.6424]]
    }
  },
  created() {
    this.latLong = this.cityHallLatLong;
  },
  mounted() {
    if(this.cityHallLatLong) {
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
      });
    }


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
  computed: {
    ...mapFields([
      'consoleLog',
      'locations',
      'sanitation',
      'contacts'
    ]),
    paths() {
      let firstProjection  = "EPSG:2966",
          secondProjection = "+proj=tmerc +lat_0=37.5 +lon_0=-87.08333333333333 +k=0.999966667 +x_0=900000 +y_0=249999.9998983998 +datum=NAD83 +units=us-ft +no_defs";

      let lngLat  = [],
        geoCoords = [],
          repJson = this.councilDistrictRepGeoJson[2].geometry.coordinates[0][2]

      // this.districRepGeoCoords.forEach((p) => {
      repJson.forEach((p) => {
        let pair = proj4(secondProjection).inverse(p)
        lngLat.push(pair)
      });

      lngLat.forEach((p) => {
        geoCoords.push({lat: p[1], lng: p[0]})
      });

      return geoCoords;
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
    getCouncilDistrictRepFeature(district) {
      this.councilDistrictRepGeoJson = this.councilDistrictsGeoJson.features.filter((e) => {
          return e.properties.DISTRICT === district;
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

  header {
    padding: 15px 20px;
  }

  footer {
    margin: 60px 0;
    .container {
      padding: 60px 0 0 0;
      border-top: 1px solid $color-grey;
    }

    p {
      color: $text-color;
      margin: 0 0 20px 0;
    }
  }

  table {
    thead {
      tr {
        th {
          text-transform: uppercase;
          font-weight: $weight-semi-bold;
          letter-spacing: 1px;
          font-size: 20px;
          color: lighten($text-color, 15%);
        }
      }
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