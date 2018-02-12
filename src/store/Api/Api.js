import axios from 'axios';
import usersApi from './usersApi';
import documentsApi from './documentsApi';
import groupsApi from './groupsApi';

const config = {
    token: localStorage.getItem('token'),
};

export const Api = {
    usersApi,
    documentsApi,
    groupsApi,
    logIn(data) {
        return axios.post('http://localhost:3000/api/signIn', data)
            .then(response => response.data)
            .catch(e => { console.error(e.response.data.error); throw new Error(e.response.data.error); });
    },
    logout() {
        return axios.post('http://localhost:3000/api/logout')
            .then(response => response.data)
            .catch(e => { console.error(e); throw new Error(e); });
    },
    sendMail(body) {
        return axios.post('http://localhost:3000/api/mail', body, config)
            .then(response => response.data)
            .catch(e => e.response);
    },
};
