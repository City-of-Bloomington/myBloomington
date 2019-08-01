import Vue from 'vue'

Vue.filter('capitalize', val => val.toUpperCase());
Vue.filter('capitalizeFirst', val => val.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' '));