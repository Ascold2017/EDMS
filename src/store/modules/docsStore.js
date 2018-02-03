import { Api } from './../Api/Api';
const docsStore = {
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
        getPreviews(context) {
            Api.documentsApi.getPreviewsJSON()
                .then(response => { context.state.data = response; })
                .catch(e => { console.error(e); return []; });
        },
        getDocumentById(context, id) {
            return Api.documentsApi.getDocumentByIdJSON(id)
                .then(response => { context.state.data = response; return; })
                .catch(e => { console.error(e); throw new Error(e); });
        },
        postVote(context, data) {
            return Api.documentsApi.postVote(data)
                .then(response => response.data)
                .catch(e => { console.error(e); throw new Error(e); });
        },
        addNewDocument(context, document) {
            return new Promise((resolve, reject) => {
                Api.documentsApi.postNewDocument(document)
                    .then(() => resolve())
                    .catch(e => reject(e));
            }).catch(e => { console.error(e); return e; });
        },
    },
};
export default docsStore;
