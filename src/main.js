import Vue from 'vue';
import App from './App.vue';
import { store } from './store';
import router from './router';
import BootstrapVue from 'bootstrap-vue';
import { sync } from 'vuex-router-sync';
sync(store, router);
Vue.use(BootstrapVue);
store.dispatch('usersStore/getCurrentUser').then(() => {
    new Vue({
        el: '#app',
        store,
        router,
        render: h => h(App),
    });
});

