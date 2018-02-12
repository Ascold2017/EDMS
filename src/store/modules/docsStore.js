import { Api } from './../../Api/Api';
import { store } from '../index';

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
            return Api.documentsApi.getPreviewsJSON(store.getters['headerToken'])
                .then(response => { console.log('response: ', response); context.state.documents = response; })
                .catch(e => { console.error(e); throw new Error(e); });
        },
        getDocumentById(context, id) {
            return Api.documentsApi.getDocumentByIdJSON(id, store.getters['headerToken'])
                .then(response => { context.state.documents = response; return; })
                .catch(e => { console.error(e); throw new Error(e); });
        },
        getMyDocumentById(context, id) {
            return Api.documentsApi.getMyDocumentByIdJSON(id, store.getters['headerToken'])
                .then(response => { context.state.documents = response; return; })
                .catch(e => { console.error(e); throw new Error(e); });
        },
        postVote(context, data) {
            return Api.documentsApi.postVote(data, store.getters['headerToken'])
                .then(response => response.data)
                .catch(e => { console.error(e); throw new Error(e); });
        },
        addNewDocument(context, document) {
            return new Promise((resolve, reject) => {
                Api.documentsApi.postNewDocument(document, store.getters['headerToken'])
                    .then(() => resolve())
                    .catch(e => reject(e));
            }).catch(e => { console.error(e); return e; });
        },
        addNewDocumentVersion(context, data) {
            return new Promise((resolve, reject) => {
                Api.documentsApi.postNewVersion(data, store.getters['headerToken'])
                    .then(() => resolve())
                    .catch(e => reject(e));
            }).catch(e => { console.error(e); return e; });
        },
        getPresets(context) {
            Api.documentsApi.getPresets(store.getters['headerToken'])
                .then(response => { context.state.presets = response; })
                .catch(e => console.log(e));
        },
        createPreset(context, preset) {
            return Api.documentsApi.createPreset(preset, store.getters['headerToken'])
                .then(response => response)
                .catch(e => { console.log(e); throw new Error(e); });
        },
        getOurDocuments(context) {
            return Api.documentsApi.getOurDocumentsPreview(store.getters['headerToken'])
                .then(response => { context.state.documents = response; return; })
                .catch(e => { console.log(e); throw new Error(e); });
        },
        getArchiveDocuments(context) {
            return Api.documentsApi.getArchiveDocuments(store.getters['headerToken'])
                .then(response => { context.state.documents = response; return; })
                .catch(e => { console.log(e); throw new Error(e); });
        },
        closeDocumentById(context, id) {
            return Api.documentsApi.closeDocumentById(id, store.getters['headerToken'])
                .catch(e => { throw new Error(e); });
        },
    },
};
export default docsStore;
