import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
//  Import modules
import usersStore from './modules/usersStore';
import docsStore from './modules/docsStore';
import groupsStore from './modules/groupsStore';

export const store = new Vuex.Store({
    data: {
        token: '',
    },
    modules: {
        usersStore,
        docsStore,
        groupsStore,
    },
    actions: {
        initApp(context) {
            context.state.token = localStorage.getItem('token');
            //return store.dispatch('usersStore/getCurrentUser');
        },
    },
});
