import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
//  Import modules
import usersStore from './modules/usersStore';
import docsStore from './modules/docsStore';
import groupsStore from './modules/groupsStore';

export const store = new Vuex.Store({
    modules: {
        usersStore,
        docsStore,
        groupsStore,
    },
});
