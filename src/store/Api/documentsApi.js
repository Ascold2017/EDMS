import axios from 'axios';

const documensApi = {
    getPreviewsJSON() {
        return axios.get('http://localhost:3000/api/getPreviews')
            .then(response => { return response.data; })
            .catch(e => { console.error(e); throw new Error(e); });
    },
    getDocumentByIdJSON(id) {
        return axios.get(`http://localhost:3000/api/getDocument/${id}`)
            .then(response => { return response.data; })
            .catch(e => { console.log(e); throw new Error(e); });
    },
    postVote(data) {
        return axios.post('http://localhost:3000/api/postVote', data)
            .then(response => { return response.data; })
            .catch(e => { console.error(e.response.data.message); throw new Error(e.response.data.message); });
    },
    postNewDocument(document) {
        return axios.post('http://localhost:3000/api/postNewDocument', document)
            .catch(e => { console.log(e); throw new Error(e); });
    },
    getPresets() {
        return axios.get('http://localhost:3000/api/getDocPresets')
            .then(response => response.data)
            .catch(err => { throw new Error(err); });
    },
    createPreset(preset) {
        return axios.post('http://localhost:3000/api//createPreset', preset)
            .then(response => response.data)
            .catch(err => { throw new Error(err); });
    },
};

export default documensApi;
