import { Api } from './../Api';
const authStore = {
    namespaced: true,
    state: {
        data: [],
    },
    getters: {},
    mutations: {},
    actions: {
        logout() {
            Api.logout();
        },
    },
};
export default authStore;
