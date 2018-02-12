import axios from 'axios';

const config = {
    headers: {
        token: localStorage.getItem('token'),
    },
};

const documensApi = {
    getPreviewsJSON() {
        return axios.get('http://localhost:3000/api/getPreviews', config)
            .then(response => response.data)
            .catch(e => { console.error(e); throw new Error(e); });
    },
    getDocumentByIdJSON(id) {
        return axios.get(`http://localhost:3000/api/getDocument/${id}`, config)
            .then(response => response.data)
            .catch(e => { console.log(e); throw new Error(e); });
    },
    getMyDocumentByIdJSON(id) {
        return axios.get(`http://localhost:3000/api/getMyDocument/${id}`, config)
            .then(response => response.data)
            .catch(e => { console.log(e); throw new Error(e); });
    },
    getPresets() {
        return axios.get('http://localhost:3000/api/getDocPresets', config)
            .then(response => response.data)
            .catch(err => { throw new Error(err); });
    },
    getOurDocumentsPreview() {
        return axios.get('http://localhost:3000/api/getOurDocuments', config)
            .then(response => response.data)
            .catch(err => { throw new Error(err); });
    },
    getArchiveDocuments() {
        return axios.get('http://localhost:3000/api/getArchiveDocuments', config)
            .then(response => response.data)
            .catch(err => { throw new Error(err); });
    },
    postVote(data) {
        return axios.post('http://localhost:3000/api/postVote', data, config)
            .then(response => response.data)
            .catch(e => { console.error(e.response.data.message); throw new Error(e.response.data.message); });
    },
    postNewDocument(document) {
        return axios.post('http://localhost:3000/api/postNewDocument', document, config)
            .catch(e => { console.log(e); throw new Error(e); });
    },
    postNewVersion(document) {
        return axios.put('http://localhost:3000/api/postNewVersion', document, config)
            .catch(e => { console.log(e); throw new Error(e); });
    },
    createPreset(preset) {
        return axios.post('http://localhost:3000/api/createPreset', preset, config)
            .then(response => response.data)
            .catch(err => { throw new Error(err); });
    },
};

export default documensApi;
