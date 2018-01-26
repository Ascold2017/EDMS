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
            console.log('get previews, token:', token);
            Api.getPreviewsJSON(token)
                .then(response => { context.state.data = response; })
                .catch(e => { console.error(e); return []; });
        },
        getDocumentById(context, id) {
            return new Promise((resolve, reject) => {
                Api.getDocumentByIdJSON(id)
                    .then(response => { context.state.data = response; resolve(); })
                    .catch(e => { console.error(e); reject(); });
            });
        },
        postVote(context, data) {
            return Api.postVote(data)
                .then(response => response.data)
                .catch(e => { console.error(e); throw new Error(e); });
        },
        addNewDocument(context, document) {
            return new Promise((resolve, reject) => {
                Api.postNewDocument(document)
                    .then(() => resolve())
                    .catch(e => reject(e));
            }).catch(e => { console.error(e); return e; });
        },
    },
};
export default docksStore;
