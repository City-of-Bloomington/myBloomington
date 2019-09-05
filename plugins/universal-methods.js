import Vue          from 'vue'
import {
  mapFields }       from 'vuex-map-fields'

Vue.mixin({
  data() { return {} },
  computed: {
    ...mapFields(['consoleLog'])
  },
  methods: {
    suggestionFocus() {
      this.searchResultsFocus = true;
    },
    suggestionBlur() {
      this.searchResultsFocus = false;

      console.log('%c Hiding Address Search Suggestions via click-away ',
                  this.consoleLog.info);
    }
  }
});