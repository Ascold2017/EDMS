import { Api } from './../Api/Api';
const docsStore = {
    namespaced: true,
    state: {
        documents: [],
        presets: [],
    },
    getters: {
        documents(state) {
            console.log(state.documents);
            return state.documents;
        },
        presets(state) {
            return state.presets;
        },
    },
    mutations: {},
    actions: {
        getPreviews(context) {
            Api.documentsApi.getPreviewsJSON()
                .then(response => { console.log('response: ', response); context.state.documents = response; })
                .catch(e => { console.error(e); return []; });
        },
        getDocumentById(context, id) {
            return Api.documentsApi.getDocumentByIdJSON(id)
                .then(response => { context.state.documents = response; return; })
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
        getPresets(context) {
            Api.documentsApi.getPresets()
                .then(response => { context.state.presets = response; })
                .catch(e => console.log(e));
        },
        createPreset(context, preset) {
            return Api.documentsApi.createPreset(preset)
                .then(response => response)
                .catch(e => { console.log(e); throw new Error(e); });
        },
        getOurDocuments(context) {
            return Api.documentsApi.getOurDocumentsPreview()
                .then(response =>  { context.state.documents = response; return; })
                .catch(e => { console.log(e); throw new Error(e); });
        },
    },
};
export default docsStore;
