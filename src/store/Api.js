import axios from 'axios';

export const Api = {
    // TODO Api
    logout() {
        return axios.post('/api/logout')
            .then(response => console.log(response.data))
            .catch(e => console.error(e));
    },
    getPreviewsJSON(token) {
        // return axios.get('/api/getPreviewByToken', token)
        return axios.get('./src/store/data-preview.json', token)
            .then(response => { return response.data; })
            .catch(e => { console.error(e); return []; });
    },
    getDocumentByIdJSON(id) {
        // return axios.get('/api/getDocById', id)
        return axios.get('./src/store/data-doc.json', id)
            .then(response => { return response.data; })
            .catch(e => { console.log(e); return []; });
    },
    postVote(data) {
        return axios.post('/api/postVote', data)
            .catch(e => { console.log(e); return []; });
    },
    getAllUsers() {
        return axios.get('./src/store/data-users.json')
            .then(response => { return response.data; })
            .catch(e => { console.log(e); return []; });
    },
};
