import axios from 'axios';

const config = {
    headers: {
        token: localStorage.getItem('token'),
    },
};

const groupsApi = {
    getAllGroups() {
        return axios.get('http://localhost:3000/api/getAllGroups', config)
            .then(response => response.data)
            .catch(e => { console.log(e); return []; });
    },
    getGroupByToken(token) {
        return axios.get(`http://localhost:3000/api/getGroup/${token}`, config)
            .then(response => response.data)
            .catch(e => { console.log(e); return []; });
    },
    createNewGroup(group) {
        return axios.post('http://localhost:3000/api/createNewGroup', group, config)
            .catch(e => { console.log(e); throw new Error(e); });
    },
    createNewAdmin(admin) {
        return axios.post('http://localhost:3000/api/createNewUser', admin, config)
            .catch(e => { console.log(e); throw new Error(e); });
    },
};
export default groupsApi;
