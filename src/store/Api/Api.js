import axios from 'axios';
import usersApi from './usersApi';
import documentsApi from './documentsApi';
import groupsApi from './groupsApi';

export const Api = {
    usersApi,
    documentsApi,
    groupsApi,
    logout() {
        return axios.post('http://localhost:3000/logout')
            .then(response => { window.location.href = response.data; })
            .catch(e => { console.error(e); throw new Error(e); });
    },
    sendMail(body) {
        return axios.post('http://localhost:3000/api/mail', body)
            .then(response => response.data)
            .catch(e => { console.log(e); throw new Error(e); });
    },
};
