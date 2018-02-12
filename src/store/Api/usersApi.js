import axios from 'axios';

const config = {
    headers: {
        token: localStorage.getItem('token'),
    },
};

const usersApi = {
    getCurrentUser() {
        return axios.get('http://localhost:3000/api/getCurrentUser', config)
            .then(response => response.data)
            .catch(e => { console.error(e); throw new Error(e); });
    },
    getAllUsersFromGroup() {
        return axios.get('http://localhost:3000/api/getAllUsers', config)
            .then(response => { return response.data; })
            .catch(e => { console.log(e); return []; });
    },
    createNewUser(user) {
        return axios.post('http://localhost:3000/api/createNewUser', user, config)
            .catch(e => { console.log(e); throw new Error(e); });
    },
};
export default usersApi;
