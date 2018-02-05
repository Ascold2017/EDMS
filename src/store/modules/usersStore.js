import { Api } from './../Api/Api';
const usersStore = {
    namespaced: true,
    state: {
        data: [],
        user: {},
    },
    getters: {
        users(state) {
            return state.data;
        },
        currentUser(state) {
            console.log(state.user);
            return state.user;
        },
    },
    mutations: {},
    actions: {
        getAllUsersFromGroup(context) {
            Api.usersApi
                .getAllUsersFromGroup()
                .then(response => {
                    context.state.data = response;
                })
                .catch(e => {
                    console.log(e);
                    return [];
                });
        },
        getCurrentUser(context) {
            return new Promise((resolve, reject) => {
                Api.usersApi
                    .getCurrentUser()
                    .then(response => {
                        context.state.user = response;
                        resolve();
                    })
                    .catch(e => reject(e));
            });
        },
        logout() {
            Api.logout();
        },
        sendMail(context, data) {
            return Api.sendMail(data).then(response => response);
        },
    },
};
export default usersStore;
