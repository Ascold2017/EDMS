import { Api } from './../Api';
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
            return Api.getAllGroups()
                .then(response => { context.state.data = response; });
        },
        getCurrentGroup(context, token) {
            return Api.getGroupByToken(token)
                .then(response => { context.state.data = response; return; })
                .catch(e => { console.log(e); throw new Error(e); });
        },
        createNewGroup(context, group) {
            return Api.createNewGroup(group)
                .then(response => response.data)
                .catch(e => { console.log(e); throw new Error(e); });
        },
        createNewAdmin(context, admin) {
            return Api.createNewAdmin(admin)
                .then(response => response.data)
                .catch(e => { console.log(e); throw new Error(e); });
        },
        createNewUser(context, user) {
            return Api.createNewUser(user)
                .then(response => response.data)
                .catch(e => { console.log(e); throw new Error(e); });
        },
    },
};

export default groupsStore;
