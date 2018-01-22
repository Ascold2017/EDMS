import { Api } from './../Api';
const authStore = {
    namespaced: true,
    state: {
        data: [],
    },
    getters: {
        currentUser(state) {
            return 'someUser';
        },
    },
    mutations: {},
    actions: {
        logout() {
            Api.logout();
        },
    },
};
export default authStore;
