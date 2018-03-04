import axios from 'axios';

const statApi = {
    getDocsStat(config) {
        return axios.get('/api/getDocsStat', config)
            .then(response => response.data)
            .catch(e => { throw new Error(e.response.data.message); });
    },
};

export default statApi;
