import axios from 'axios';

const documensApi = {
    getPreviewsJSON(config) {
        return axios.get('/api/getPreviews', config)
            .then(response => response.data)
            .catch(e => { console.error(e); throw new Error(e); });
    },
    getDocumentByIdJSON(id, config) {
        return axios.get(`/api/getDocument/${id}`, config)
            .then(response => response.data)
            .catch(e => { console.log(e); throw new Error(e); });
    },
    getMyDocumentByIdJSON(id, config) {
        return axios.get(`/api/getMyDocument/${id}`, config)
            .then(response => response.data)
            .catch(e => { console.log(e); throw new Error(e); });
    },
    getPresets(config) {
        return axios.get('/api/getDocPresets', config)
            .then(response => response.data)
            .catch(err => { throw new Error(err); });
    },
    getOurDocumentsPreview(config) {
        return axios.get('/api/getOurDocuments', config)
            .then(response => response.data)
            .catch(err => { throw new Error(err); });
    },
    getArchiveDocuments(config) {
        return axios.get('/api/getArchiveDocuments', config)
            .then(response => response.data)
            .catch(err => { throw new Error(err); });
    },
    getArchiveDocument(id, config) {
        return axios.get(`/api/getArchiveDocument/${id}`, config)
            .then(response => response.data)
            .catch(err => { throw new Error(err); });
    },
    postVote(data, config) {
        return axios.post('/api/postVote', data, config)
            .then(response => response.data)
            .catch(e => { console.error(e.response.data.message); throw new Error(e.response.data.message); });
    },
    postNewDocument(document, config) {
        return axios.post('/api/postNewDocument', document, config)
            .then(response => response.data)
            .catch(e => { console.log(e); throw new Error(e); });
    },
    postNewVersion(document, config) {
        return axios.put('/api/postNewVersion', document, config)
            .then(response => response.data)
            .catch(e => { console.log(e); throw new Error(e.response.data.message); });
    },
    createPreset(preset, config) {
        return axios.post('/api/createPreset', preset, config)
            .then(response => response.data)
            .catch(err => { throw new Error(err); });
    },
    closeDocumentById(id, config) {
        console.log(id);
        return axios.post('/api/closeDocument', { id }, config)
            .then(response => response.data)
            .catch(err => { throw new Error(err); });
    },
};

export default documensApi;
