import axios from 'axios';
import usersApi from './usersApi';
import documentsApi from './documentsApi';
import groupsApi from './groupsApi';

const config = {
    token: sessionStorage.getItem('token'),
};

export const Api = {
    usersApi,
    documentsApi,
    groupsApi,
    logIn(data) {
        return axios.post('/api/signIn', data)
            .then(response => response.data)
            .catch(e => { console.error(e.response.error); throw new Error(e.response.data.error); });
    },
    logout() {
        return axios.post('/api/logout')
            .then(response => response.data)
            .catch(e => { console.error(e); throw new Error(e); });
    },
    sendMail(body) {
        return axios.post('/api/mail', body, config)
            .then(response => response.data)
            .catch(e => e.response);
    },
    signUp(data) {
        return axios.post('/api/signUp', data)
            .then(response => response.data)
            .catch(e => { throw new Error(e.response.error); });
    },
};
