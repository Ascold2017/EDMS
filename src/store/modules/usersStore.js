import { Api } from "./../Api/Api";
const usersStore = {
    namespaced: true,
    state: {
        data: [],
        user: {
            author: "Шестопалов Сергей Викторович",
            groupInvite: "hgundefined3f",
            login: "fle6e",
            role: "Доцент",
            token: "c23b2",
            _id: "5a721c536ba3e60ae446d66c"
        },
    },
    getters: {
        users(state) {
            return state.data;
        },
        currentUser(state) {
            console.log(state.user);
            return state.user;
        }
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
        }
    }
};
export default usersStore;
