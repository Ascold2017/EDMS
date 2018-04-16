import Vue from 'vue'
import App from './App.vue'
import { store } from './store'
import router from './router'
import Vuetify from 'vuetify'
import { sync } from 'vuex-router-sync'
sync(store, router)
Vue.use(Vuetify)

store.dispatch('initApp')
  .then(() => {
    new Vue({
      el: '#app',
      store,
      router: router,
      render: h => h(App)
    })
  })
