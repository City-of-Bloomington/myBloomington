import Vue                from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import GmapCluster        from 'vue2-google-maps/src/components/cluster'

Vue.component('GmapCluster', GmapCluster)
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.googleApiKey,
    libraries: 'places',
    // v: '3.26',
  },
  installComponents: true
})