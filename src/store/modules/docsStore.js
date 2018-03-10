import { Api } from './../../API-dev/Api'
import { store } from '../index'

const docsStore = {
  namespaced: true,
  state: {
    documents: [],
    presets: [],
    document: {}
  },
  getters: {
    documents (state) {
      return state.documents
    },
    document (state) {
      return state.document
    },
    presets (state) {
      return state.presets
    }
  },
  mutations: {},
  actions: {
    getPreviews (context) {
      return Api.documentsApi.getPreviewsJSON(store.getters['headerToken'])
        .then(response => { context.state.documents = response })
        .catch(e => { throw new Error(e) })
    },
    getDocumentById (context, id) {
      return Api.documentsApi.getDocumentByIdJSON(id, store.getters['headerToken'])
        .then(response => { context.state.document = response; return null })
        .catch(e => { throw new Error(e) })
    },
    getMyDocumentById (context, id) {
      return Api.documentsApi.getMyDocumentByIdJSON(id, store.getters['headerToken'])
        .then(response => { context.state.document = response; return null })
        .catch(e => { throw new Error(e) })
    },
    postVote (context, data) {
      return Api.documentsApi.postVote(data, store.getters['headerToken'])
        .then(response => response)
        .catch(e => { throw new Error(e.message) })
    },
    addNewDocument (context, document) {
      return Api.documentsApi.postNewDocument(document, store.getters['headerToken'])
        .then(response => response)
        .catch(e => { throw new Error(e.message) })
    },
    addNewDocumentVersion (context, data) {
      return Api.documentsApi.postNewVersion(data, store.getters['headerToken'])
        .then(response => response)
        .catch(e => { throw new Error(e.message) })
    },
    getPresets (context) {
      Api.documentsApi.getPresets(store.getters['headerToken'])
        .then(response => { context.state.presets = response })
        .catch(e => { throw new Error(e) })
    },
    createPreset (context, preset) {
      return Api.documentsApi.createPreset(preset, store.getters['headerToken'])
        .then(response => response)
        .catch(e => { throw new Error(e) })
    },
    getOurDocuments (context) {
      return Api.documentsApi.getOurDocumentsPreview(store.getters['headerToken'])
        .then(response => { context.state.documents = response; return null })
        .catch(e => { throw new Error(e) })
    },
    getArchiveDocuments (context) {
      return Api.documentsApi.getArchiveDocuments(store.getters['headerToken'])
        .then(response => { context.state.documents = response; return null })
        .catch(e => { throw new Error(e) })
    },
    getArchiveDocumentById (context, id) {
      return Api.documentsApi.getArchiveDocument(id, store.getters['headerToken'])
        .then(response => { context.state.document = response; return null })
        .catch(e => { throw new Error(e) })
    },
    closeDocumentById (context, id) {
      return Api.documentsApi.closeDocumentById(id, store.getters['headerToken'])
        .catch(e => { throw new Error(e) })
    }
  }
}
export default docsStore
