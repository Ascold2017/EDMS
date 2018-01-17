import { Api } from './../Api';
const usersStore = {
    namespaced: true,
    state: {
        data: [],
    },
    getters: {
        token(state) {
            return '';
        },
    },
    mutations: {},
    actions: {},
};
export default usersStore;
