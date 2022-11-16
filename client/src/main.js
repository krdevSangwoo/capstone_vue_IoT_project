import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import mixins from './mixins'
import store from './store'
import BootstrapVue3 from 'bootstrap-vue-3'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import VCalendar from 'v-calendar'
import 'v-calendar/dist/style.css'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

import VueApexCharts from 'vue3-apexcharts'

createApp(App).use(store).mixin(mixins).use(router).use(BootstrapVue3).use(VCalendar).use(VueApexCharts).component('Datepicker', Datepicker).mount('#app')

const firebaseConfig = {
  apiKey: 'AIzaSyBVJRMsHQ-0Wy-5MNB1_RqMyFWxNZq_fpA',
  authDomain: 'vue-firebase-tutorial-882b7.firebaseapp.com',
  projectId: 'vue-firebase-tutorial-882b7',
  storageBucket: 'vue-firebase-tutorial-882b7.appspot.com',
  messagingSenderId: '257531640478',
  appId: '1:257531640478:web:7d7edddfe47a14c11ed98f',
  measurementId: 'G-YBTWTV21LE'
}
const app = initializeApp(firebaseConfig)
getAnalytics(app)
