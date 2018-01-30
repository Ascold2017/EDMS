import { Api } from './../Api';
const usersStore = {
    namespaced: true,
    state: {
        data: [],
        token: '',
        user: {},
    },
    getters: {
        token(state) {
            console.log(state.token);
            return state.token;
        },
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
        getAllUsers(context) {
            Api.getAllUsers()
                .then(response => {
                    context.state.data = response;
                })
                .catch(e => console.log(e));
        },
        getCurrentUser(context) {
            return new Promise((resolve, reject) => {
                /*
                context.state.user = {
                    author: 'Аскольд Аскольдович Аскольдов',
                    login: 'someLogin',
                    role: 'Студент',
                    token: 'secretToken',
                    __v: 0,
                    _id: '5a6889013f42e641ae930e4f',
                };
                context.state.token = 'secretToken';
                */
                Api.getCurrentUser()
                    .then(response => {
                        context.state.user = response;
                        context.state.token = response.token;
                        console.log('state token: ', context.state.token);
                        resolve();
                    })
                    .catch(e => reject(e));
            });
        },
        logout() {
            Api.logout();
        },
        sendMail(context, data) {
            return Api.sendMail(data)
                .then(response => response)
                .catch(e => { throw new Error(e); });
        },
    },
};
export default usersStore;
