import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
Vue.http.options.root = '/src/components';
//  Import modules
//  import someModule from './modules/someModule'

export const store = new Vuex.Store({
    modules: {
    //  someModule,
    },
});
