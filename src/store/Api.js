import axios from 'axios';

export const Api = {
    // TODO Api
    logout() {
        return axios.post('http://localhost:3000/logout')
            .then(response => { window.location.href = response.data; })
            .catch(e => { console.error(e); throw new Error(e); });
    },
    getCurrentUser() {
        return axios.get('http://localhost:3000/api/getCurrentUser')
            .then(response => response.data)
            .catch(e => { console.error(e); throw new Error(e); });
    },
    getPreviewsJSON(token) {
        return axios.get(`http://localhost:3000/api/getPreviews/${token}`)
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
    getAllUsers() {
        return axios.get('http://localhost:3000/api/getAllUsers')
            .then(response => { return response.data; })
            .catch(e => { console.log(e); return []; });
    },
    postNewDocument(document) {
        return axios.post('http://localhost:3000/api/postNewDocument', document)
            .catch(e => { console.log(e); throw new Error(e); });
    },

    getAllGroups() {
        return axios.get('http://localhost:3000/api/getAllGroups')
            .then(response => { return response.data; })
            .catch(e => { console.log(e); return []; });
    },
    createNewGroup(group) {
        return axios.post('http://localhost:3000/api/createNewGroup', group)
            .catch(e => { console.log(e); throw new Error(e); });
    },
    createNewAdmin(admin) {
        return axios.post('http://localhost:3000/api/createNewUser', admin)
            .catch(e => { console.log(e); throw new Error(e); });
    },
    sendMail(body) {
        return axios.post('http://localhost:3000/api/mail', body)
            .then(response => response.data)
            .catch(e => { console.log(e); throw new Error(e); });
    },
};
