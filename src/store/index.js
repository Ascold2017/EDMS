import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
//  Import modules
import usersStore from './modules/usersStore';
import docsStore from './modules/docsStore';
import authStore from './modules/authStore';

export const store = new Vuex.Store({
    modules: {
        usersStore,
        docsStore,
        authStore,
    },
});
