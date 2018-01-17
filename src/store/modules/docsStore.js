import { Api } from './../Api';
const docksStore = {
    namespaced: true,
    state: {
        data: [],
    },
    getters: {
        data(state) {
            return state.data;
        },
    },
    mutations: {},
    actions: {
        getPreviewsForUser(context, token) {
            Api.getPreviewsJSON(token)
                .then(response => { context.state.data = response; });
        },
        getDocumentById(context, id) {
            Api.getDocumentByIdJSON(id)
                .then(response => { context.state.data = response; });
        },
        postVote(context, data) {
            console.log(data);
        },
    },
};
export default docksStore;
