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
                .then(response => { context.state.data = response; })
                .catch(e => { console.error(e); return []; });
        },
        getDocumentById(context, id) {
            Api.getDocumentByIdJSON(id)
                .then(response => { context.state.data = response; })
                .catch(e => { console.error(e); return []; });
        },
        postVote(context, data) {
            console.log(data);
        },
        addNewDocument(context, document) {
            return new Promise(resolve => {
                console.log(document);
                resolve();
            }).catch(e => { console.error(e); });
        },
    },
};
export default docksStore;
