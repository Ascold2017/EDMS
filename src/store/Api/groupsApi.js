import axios from 'axios';

const groupsApi = {
    getAllGroups() {
        return axios.get('http://localhost:3000/api/getAllGroups')
            .then(response => response.data)
            .catch(e => { console.log(e); return []; });
    },
    getGroupByToken(token) {
        return axios.get(`http://localhost:3000/api/getGroup/${token}`)
            .then(response => response.data)
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
};
export default groupsApi;
