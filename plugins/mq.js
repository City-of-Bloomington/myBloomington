// https://github.com/AlexandreBonaventure/vue-mq
import Vue from 'vue'
import VueMq from 'vue-mq'

Vue.use(VueMq, {
  // match via assets/mobile.scss
  breakpoints: {
    sm:  575,
    med: 767,
    lrg: 992
  }
})