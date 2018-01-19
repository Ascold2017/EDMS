import { Api } from './../Api';
const usersStore = {
    namespaced: true,
    state: {
        data: [],
        token: 'secretToken',
    },
    getters: {
        token(state) {
            return state.token;
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
