import Vue          from 'vue'
import {
  mapFields }       from 'vuex-map-fields'

Vue.mixin({
  data() { return {} },
  computed: {
    ...mapFields([
      'locationResDataNew',
      'HANDSHARDData',
      'consoleLog',
      'folks',
      'cityBoundary',
      'cityName',
      'coordsProjection',
      'cityHallLatLong',
      'weather',
      'sanitation',
      'locations'
    ]),
    isMobile() {
      if (process.client) {
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          return true
        } else {
          return false
        }
      }
    },
    currentYear() {
      return new Date().getFullYear();
    },
    showSearchEnteredWarning() {
      if(this.autoSuggestRes && this.addressSearchAuto){
        this.searchEnteredWarning = true;
        return true
      } else {
        this.searchEnteredWarning = false;
        return false
      }
    },
    hasLocationData() {
      if(!this.loading && this.locationResDataNew){
        if(this.locationResDataNew && this.addressMapped) {
          return true
        } else {
          return false
        }
      }
    },
    locationPurposes() {
      if(this.locationResDataNew.purposes){
        const groupBy = key => array =>
        array.reduce((objKeyValue, obj) => {
          const value = obj[key];
          objKeyValue[value] = (objKeyValue[value] || []).concat(obj);
          return objKeyValue;
        }, {});

        const groupByType = groupBy('purpose_type');
        const newNewnew = groupByType(this.locationResDataNew.purposes);

        return newNewnew;
      }
    },
  },
});