import axios from 'axios';

const documensApi = {
    getPreviewsJSON(config) {
        return axios.get('http://localhost:3000/api/getPreviews', config)
            .then(response => response.data)
            .catch(e => { console.error(e); throw new Error(e); });
    },
    getDocumentByIdJSON(id, config) {
        return axios.get(`http://localhost:3000/api/getDocument/${id}`, config)
            .then(response => response.data)
            .catch(e => { console.log(e); throw new Error(e); });
    },
    getMyDocumentByIdJSON(id, config) {
        return axios.get(`http://localhost:3000/api/getMyDocument/${id}`, config)
            .then(response => response.data)
            .catch(e => { console.log(e); throw new Error(e); });
    },
    getPresets(config) {
        return axios.get('http://localhost:3000/api/getDocPresets', config)
            .then(response => response.data)
            .catch(err => { throw new Error(err); });
    },
    getOurDocumentsPreview(config) {
        return axios.get('http://localhost:3000/api/getOurDocuments', config)
            .then(response => response.data)
            .catch(err => { throw new Error(err); });
    },
    getArchiveDocuments(config) {
        return axios.get('http://localhost:3000/api/getArchiveDocuments', config)
            .then(response => response.data)
            .catch(err => { throw new Error(err); });
    },
    postVote(data, config) {
        return axios.post('http://localhost:3000/api/postVote', data, config)
            .then(response => response.data)
            .catch(e => { console.error(e.response.data.message); throw new Error(e.response.data.message); });
    },
    postNewDocument(document, config) {
        return axios.post('http://localhost:3000/api/postNewDocument', document, config)
            .then(response => response.data)
            .catch(e => { console.log(e); throw new Error(e); });
    },
    postNewVersion(document, config) {
        return axios.put('http://localhost:3000/api/postNewVersion', document, config)
            .then(response => response.data)
            .catch(e => { console.log(e); throw new Error(e.response.data.message); });
    },
    createPreset(preset, config) {
        return axios.post('http://localhost:3000/api/createPreset', preset, config)
            .then(response => response.data)
            .catch(err => { throw new Error(err); });
    },
    closeDocumentById(id, config) {
        console.log(id);
        return axios.post('http://localhost:3000/api/closeDocument', { id }, config)
            .then(response => response.data)
            .catch(err => { throw new Error(err); });
    },
};

export default documensApi;
