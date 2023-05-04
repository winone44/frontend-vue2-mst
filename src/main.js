// import '@babel/polyfill'
// import 'mutationobserver-shim'
import Vue from 'vue'
// import './plugins/bootstrap-vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'
import router from './router'
import store from './store'

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Vuelidate from 'vuelidate'


Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons)
Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(Vuelidate)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
