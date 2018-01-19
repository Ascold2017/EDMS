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
        users(state) {
            return state.data;
        },
    },
    mutations: {},
    actions: {
        getAllUsers(context) {
            Api.getAllUsers()
                .then(response => {
                    context.state.data = response;
                })
                .catch(e => console.log(e));
        },
    },
};
export default usersStore;
