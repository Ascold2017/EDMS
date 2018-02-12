import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
//  Import modules
import usersStore from './modules/usersStore';
import docsStore from './modules/docsStore';
import groupsStore from './modules/groupsStore';
import { Api } from '../Api/Api';

export const store = new Vuex.Store({
    state: {
        token: '',
    },
    getters: {
        headerToken(state) {
            return {
                headers: {
                    token: state.token,
                },
            };
        },
    },
    modules: {
        usersStore,
        docsStore,
        groupsStore,
    },
    actions: {
        initApp(context) {
            return new Promise(resolve => {
                const token = sessionStorage.getItem('token');
                if (token) {
                    context.state.token = token;
                    store.dispatch('usersStore/getCurrentUser')
                        .then(() => resolve());
                } else {
                    resolve();
                }
            });
        },
        logout(context) {
            return Api.logout().then(response => {
                store.state.usersStore.user = {};
                context.state.token = '';
                sessionStorage.removeItem('token');
            });
        },
        logIn(context, data) {
            return Api.logIn(data)
                .then(response => {
                    console.log(' get token : ', response.token);
                    context.state.token = response.token;
                    sessionStorage.setItem('token', response.token);
                    return response.message;
                })
                .catch(error => { console.error(error); throw new Error(error); });
        },
        signUp(context, data) {
            return Api.signUp(data)
                .then(response => response)
                .catch(e => { throw new Error(e); });
        },
    },
});
