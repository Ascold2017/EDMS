import axios from 'axios';

const groupsApi = {
    getAllGroups(config) {
        return axios.get('/api/getAllGroups', config)
            .then(response => response.data)
            .catch(e => { console.log(e); return []; });
    },
    getGroupByToken(token, config) {
        return axios.get(`/api/getGroup/${token}`, config)
            .then(response => response.data)
            .catch(e => { console.log(e); return []; });
    },
    createNewGroup(group, config) {
        return axios.post('/api/createNewGroup', group, config)
            .catch(e => { console.log(e); throw new Error(e); });
    },
    createNewAdmin(admin, config) {
        return axios.post('/api/createNewUser', admin, config)
            .catch(e => { console.log(e); throw new Error(e); });
    },
};
export default groupsApi;
