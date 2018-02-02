import { Api } from './../Api/Api';
const groupsStore = {
    namespaced: true,
    state: {
        data: [],
    },
    getters: {
        groups(state) {
            return state.data;
        },
    },
    actions: {
        getAllGroups(context) {
            return Api.groupsApi.getAllGroups()
                .then(response => { context.state.data = response; });
        },
        getCurrentGroup(context, token) {
            return Api.groupsApi.getGroupByToken(token)
                .then(response => { context.state.data = response; return; })
                .catch(e => { console.log(e); throw new Error(e); });
        },
        createNewGroup(context, group) {
            return Api.groupsApi.createNewGroup(group)
                .then(response => response.data)
                .catch(e => { console.log(e); throw new Error(e); });
        },
        createNewAdmin(context, admin) {
            return Api.groupsApi.createNewAdmin(admin)
                .then(response => response.data)
                .catch(e => { console.log(e); throw new Error(e); });
        },
        createNewUser(context, user) {
            return Api.usersApi.createNewUser(user)
                .then(response => response.data)
                .catch(e => { console.log(e); throw new Error(e); });
        },
    },
};

export default groupsStore;
