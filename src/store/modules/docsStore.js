import { Api } from './../../API/Api'
import { store } from '../index'
const openpgp = require('openpgp')

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
    postVote (context, { id, vote, comment, author }) {
      if (vote === 'resolve') {
        const privKey = store.getters['privateKey']
        let fileContent = ''
        // load file
        return Api.documentsApi
          .getFileContent(context.state.document.versions[0].file,
            { ...store.getters['headerToken'], responseType: 'blob' })
          .then(blob => {
            // read file content
            return new Promise((resolve, reject) => {
              const fr = new FileReader()
              fr.onload = function (e) {
                fileContent = new Uint8Array(e.target.result)
                console.log(fileContent)
                resolve(fileContent)
              }
              fr.readAsArrayBuffer(blob)
            })
          })
          .then(fileContent => {
            // sign file with private key and create detached signature
            const signOptions = {
              data: fileContent,
              privateKeys: privKey,
              detached: true
            }
            return openpgp.sign(signOptions)
          })
          .then(signed => {
            // and send detached signature and other information
            return Api.documentsApi
              .postVote({
                id,
                vote,
                comment,
                author,
                signature: signed.signature,
                file: fileContent
              }, store.getters['headerToken'])
              .then(response => response)
          })
          .catch(e => { throw new Error(e.message || e) })
      } else {
        // if author reject sign
        return Api.documentsApi
          .postVote({
            id,
            vote,
            comment,
            author,
            signature: null
          }, store.getters['headerToken'])
          .then(response => response)
          .catch(e => { throw new Error(e.message) })
      }
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
