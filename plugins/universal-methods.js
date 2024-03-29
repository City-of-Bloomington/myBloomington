import Vue          from 'vue'
import proj4        from 'proj4'
import moment       from 'moment'
import debounce     from 'lodash.debounce'
import {
  mapFields }       from 'vuex-map-fields'

Vue.mixin({
  data() { return {
    loading:                true,
    keyDownFocus:           false,

    appName:                process.env.appName,
    baseUrl:                process.env.baseUrl,
    frontEndBase:           process.env.frontEndBase,
    voterPrecinctsPath:     process.env.voterPrecinctsPath,

    searchEnteredWarning:   false,
    searchHasFocus:         false,
    searchResultsFocus:     false,
    autoSuggestRes:         null,

    latLong:                {},
    mapHeight:              null,
    mapHeightResult:        '450px',
    distanceToCityHall:      null,
    // zoom:                 13,
    addressSearch:           null,
    addressSearchAuto:       null,
    addressResData:          null,
    addressMapped:           null,
    addressResChoices:       null,
    councilDistrict:         null,
    districtRep:             null,
    councilDistrictsGeoJson: null,
    districtRepGeoCoords:    null,
    districtRepGeoCoordsCenter: null,

    parksResData:            null,
    schoolsResData:          null,
    playgroundsResData:      null,
    safePlaceResData:        null,
    schoolTypeToggle:        null,
    schoolType:              'all',
    schoolTypes: {
      "pre":            ['Preschool'],
      "elm":            ['Elementary School','P-6','P-12','K-8'],
      "middle":         ['Middle School','K-8','P-12'],
      "high":           ['High School','P-12'],
      "admin":          ['School Adminstration'],
      "all":            ['All','Preschool','Elementary School','P-6','P-12','K-8','Middle School','High School','School Adminstration','Continuing Education']
    },
    districtLookupPath:       process.env.districtLookupPath,
    schoolDistrictGradeLevel: null,
    gradeLevelError:          false,

    mapMarkerToggle: {
      parks:       true,
      playgrounds: true,
      schools:     true,
      safePlaces:  true,
      inRoads:     true,
    },

    errors: {
      addressRes:       null,
      locationRes:      null,
      addressNotMapped: null,
    },

    modals: {
      addressRetiredError: false,
      addressMappedError: false,
      schoolDistrict:     false,
    },
  }},
  watch: {
    addressSearchAuto: debounce(function(val, oldVal){
      if(this.addressSearchAuto) {
        let regExTest   = /\d+\s+\w+/,
          addressTest = regExTest.test(val),
          searchValue = this.addressSearchAuto;

        if(searchValue.length > 3 &&
           addressTest) {
          this.getAddress(val)
          .then((res) => {
            this.autoSuggestRes = res;
            console.log(`%c getAutoAddress 🔌 `,
                        this.consoleLog.success);

          })
          .catch((e)  => {
            this.errors.addressRes = e;
            console.log(`%c getAutoAddress 🛑 `,
                        this.consoleLog.error,
                        `\n\n ${e} \n\n`);
          })
        } else {
          this.autoSuggestRes = null;
          this.searchEnteredWarning = false;
        }
      } else {
        this.autoSuggestRes = null;
      }
    }, 500),
  },
  methods: {
    cityHallDistance() {
      let points1 = this.cityHallLatLong,
          points2 = {lat: this.locationResDataNew.address.latitude, lng: this.locationResDataNew.address.longitude};

      if(this.latLong && this.locationResDataNew.address) {
        this.distanceToCityHall = this.pointsToDistance(points1, points2);
      }
    },
    sFocus(){
      this.searchHasFocus = true;
    },
    sBlur() {
      setTimeout(() => {
        this.searchHasFocus = false;
      }, 500);
    },
    searchEntered() {
      return this.showSearchEnteredWarning
    },
    suggestionFocus() {
      this.searchResultsFocus = true;
    },
    suggestionBlur() {
      this.searchResultsFocus   = false;
      this.keyDownFocus         = false;
      this.addressSearchAuto    = null;
      this.autoSuggestRes       = null;
      this.searchEnteredWarning = false;

      console.log('%c Hiding Address Search Suggestions via click-away ',
                  this.consoleLog.info);
    },
    isAddressMapped(lat, lon) {
      return lat !== null && lon !== null
    },
    setCityBoundary(res) {
      let lngLat  = [],
        geoCoords = [],
        boundary  = res;

      if(boundary) {
        let raw = [];
        boundary.forEach((r) => {
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

        return this.$store.dispatch('setCityBoundaryData', output);
      }
    },
    openModal(modalRef, i) {
      if(modalRef === 'schoolDistrictModal') {
        this.$refs.schoolDistrictModal.showModal = true;
      } else if (modalRef === 'addressMappedErrorModal') {
        this.modals.addressMappedError = true;
        this.$refs.addressMappedErrorModal.showModal = true;
      } else if (modalRef === 'addressRetiredErrorModal') {
        this.modals.addressRetiredError = true;
        this.$refs.addressRetiredErrorModal.showModal = true;
      }
    },
    confirmModal(modalRef, i) {
      if(modalRef === 'schoolDistrictModal') {
        if(this.schoolDistrictGradeLevel) {
          this.$refs.schoolDistrictModal.showModal = false;

          let stDirection   = this.locationResDataNew.address.street_direction,
              stName        = this.locationResDataNew.address.street_name,
              stNameEncode  = stName.replace(/ /g, "+"),
              stSuffix      = this.locationResDataNew.address.street_suffix_code,
              houseNumber   = this.locationResDataNew.address.street_number,
              zip           = this.locationResDataNew.address.zip,
              gradeID       = this.schoolDistrictGradeLevel.val,
              gradeLvl      = this.schoolDistrictGradeLevel.lvl;

          if(stSuffix) {
            var street = `${stDirection}+${stNameEncode}+${stSuffix}`;
          } else {
            var street = `${stDirection}+${stNameEncode}`;
          }

          let preppedSt     = street.toUpperCase(),
              url           = `http://versalookup.mccsc.edu/elinkrp/Students/BasicTransBoundaryResults.aspx?BasicTB=Y&GradeID=${gradeID}&HHouseNumber=${houseNumber}&HStreet=${preppedSt}&HZip=${zip}&GradeDesc=${gradeLvl}`;

          return window.open(url, '_blank');
        } else {
          this.gradeLevelError = true;
        }
      }
    },
    closeModal(modalRef, i) {
      if(modalRef === 'schoolDistrictModal') {
        this.$refs.schoolDistrictModal.showModal = false;
      } else if (modalRef == 'addressMappedErrorModal') {
        this.modals.addressMappedError = false;
        this.$refs.addressMappedErrorModal.showModal = false;
        this.errors.addressNotMapped = null;
        this.autoSuggestRes = null;
      } else if (modalRef == 'addressRetiredErrorModal') {
        this.modals.addressRetiredError = false;
        this.$refs.addressRetiredErrorModal.showModal = false;
      }
    },
    isObjEmpty(obj) {
      return !obj || Object.keys(obj).length === 0;
    },
    addressChoice(address) {

      this.autoSuggestRes       = null;
      this.searchEnteredWarning = false;
      this.addressSearchAuto    = address.streetAddress;
      this.addressResData       = address;
      let canWeMapAddress       = this.isAddressMapped(address.latitude, address.longitude);

      if(this.addressResData && canWeMapAddress){
        this.locationLookup();
      } else {
        this.openModal('addressMappedErrorModal');
        this.$nextTick(() => {
          this.$refs.addressMappedErrorModalCloseBtn.$el.focus();
          this.errors.addressNotMapped = address;
          this.addressSearchAuto = null;
        });
      }
    },
    searchSubmit(input) {
      this.locationResDataNew = null;
      this.councilDistrict    = null;
      this.districtRep        = null;
      this.errors.addressRes  = null;
      this.addressLookup(input);
    },
    addressLookup(address) {
      this.getAddress(address)
      .then((res) => {
        if(this.isAddressMapped(res.latitude, res.longitude)) {
          this.addressMapped      = true;
          this.addressResData     = res;
          this.errors.addressRes  = null;
          this.locationLookup();
          console.log(`%c getAddress 🔌 `,
                      this.consoleLog.success);
        } else {
          this.$router.replace('index');
          this.addressSearch      = null;
          this.addressResData     = null;
          this.locationResDataNew    = null;

          this.addressMapped      = false;
          this.latLong            = this.cityHallLatLong;
          this.mapHeight          = '100%';
          this.errors.addressRes  = 'This Address has not yet been Mapped.';
          console.log(`%c getAddress 🛑 `,
                      this.consoleLog.success);
        }
      })
      .catch((e)  => {
        this.$router.replace('index');

        this.addressSearch      = null;
        this.addressResData     = null;
        this.locationResDataNew = null;
        this.errors.addressRes  = e;
        console.log(`%c getAddress 🛑 `,
                    this.consoleLog.error,
                    `\n\n ${e} \n\n`);
      })
    },
    locationLookup(id) {
      let lookupID = this.addressResData.id || id;

      if(lookupID) {
        this.getLocation(lookupID)
        .then((res) => {
          
          this.addressMapped      = true;
          this.addressResChoices = null;
          this.districtRepGeoCoords = null;

          // this.locationResDataNew   = res;
          this.$store.dispatch('setLocationData', res);

          let addressUrlEncoded = encodeURIComponent(this.locationResDataNew.address.streetAddress).replace(/%20/g, "+");

          this.getHANDSHARDData(res.address.location_id)


          // this.findCurrentLocation();
          // .then((res) => { console.log('getHANDSHARDData Data') })
          // .catch((e) => {console.log('getHANDSHARDData Error', e) })

          this.$router.push({
            path: '/search',
            query: { address: this.locationResDataNew.address.streetAddress}
          });

          this.mapHeight         = this.mapHeightResult;
          this.errors.locationRes = null;
          this.cityHallDistance();

          console.log(`%c getLocation 🔌 `,
                      this.consoleLog.success);

          this.setLatLong(this.locationResDataNew.address.latitude,this.locationResDataNew.address.longitude);

          this.addressSearchAuto = null;

          this.getCouncilDistrict()
          .then((res) => {
            this.councilDistrict = res;
            console.log(`%c getCouncilDistrict 🔌 `,
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
          this.$router.replace('index');
          this.locationResDataNew    = null;
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

      console.log(`%c updated latLng (gMap) 🔌 `,
                  this.consoleLog.success);
    },
    getCouncilDistrict() {
      return new Promise((resolve, reject) => {
        let locationPurposes = this.locationResDataNew.purposes,
          districtID         = locationPurposes
          .find((item) => item.purpose_type === 'CITY COUNCIL DISTRICT');

        if(districtID){
          resolve(districtID)
        } else {
          this.districtRep = null;
          reject(`Couldn't determine the Council District`)
        }
      })
    },
    getCouncilDistrictRepFeature(district) {
      this.councilDistrictRepGeoJson = this.councilDistrictsGeoJson.features.filter((d) => {
          return d.properties.DISTRICT === district;
        })
    },
    polygonCenter(coords) {
      let lat = coords.map(function (p) { return p.lat }),
          lng = coords.map(function (p) { return p.lng }),

      min_coords = {
        lat: Math.min.apply(null, lat),
        lng: Math.min.apply(null, lng)
      },

      max_coords = {
        lat: Math.max.apply(null, lat),
        lng: Math.max.apply(null, lng)
      },

      centerX = min_coords.lng + ((max_coords.lng - min_coords.lng) / 2),
      centerY = min_coords.lat + ((max_coords.lat - min_coords.lat) / 2);

      return { lat: centerY, lng: centerX };
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
        this.districtRepGeoCoordsCenter = this.latLong;
      } else {
        repJson.forEach((p) => {
          let pair = proj4(this.coordsProjection).inverse(p);
          lngLat.push(pair)
        });

        lngLat.forEach((p) => {
          geoCoords.push({lat: p[1], lng: p[0]})
        });

        this.districtRepGeoCoords = geoCoords;

        if (this.districtRepGeoCoordsCenter != null) {
          this.districtRepGeoCoordsCenter = null;
          this.polygonCenter(this.districtRepGeoCoords)
        }
      }
    },
    nearbyMarkers(data){
      if(data === this.safePlaceResData) {
        if(data.features) {
          let markerData  = data.features,
          arrayName   = [];

          if(markerData.length){
            markerData.filter((p) => {
              var addDist = {dist: this.nearbyDistance(p.attributes.Latitude,p.attributes.Longitude)};
              arrayName.push({...p, ...addDist})
            })
            return arrayName
          }
        }
        
      } else {
        let markerData  = data,
          arrayName   = [];

        if(markerData){
          markerData.features.filter((p) => {
            var addDist = {dist: this.nearbyDistance(p.properties.lat,p.properties.lon)};
            arrayName.push({...p.properties, ...addDist})
          })
          return arrayName
        }
      }
    },
    viaDistance(places) {
      if(this.latLong) {
        let newArray = [],
                self = this;

        let locationMapped = places.map((p) => {
          if(p.properties) {

            if(p.properties.lat) {
              var addDist = { dist: self.nearbyDistance(p.properties.lat,p.properties.lon)}
            } else if (p.properties.latitude) {
              var addDist = { dist: self.nearbyDistance(p.properties.latitude, p.properties.longitude)}
            }
            
            newArray.push({...p.properties, ...addDist})
          } else if(p.attributes.Latitude,p.attributes.Longitude) {
            var addDist = { dist: self.nearbyDistance(p.attributes.Latitude,p.attributes.Longitude)}
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
    yardWasteMomentDate(d) {
      let dateFormat = moment(new Date(d));

      if(dateFormat.isAfter()) {
        return dateFormat.format('MMMM Do');
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
  }
});