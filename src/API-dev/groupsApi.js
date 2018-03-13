import axios from 'axios'

const groupsApi = {
  getAllGroups (config) {
    return axios.get('http://localhost:3000/api/getAllGroups', config)
      .then(response => response.data)
      .catch(e => { return [] })
  },
  getGroupByToken (token, config) {
    return axios.get(`http://localhost:3000/api/getGroup/${token}`, config)
      .then(response => response.data)
      .catch(e => { return [] })
  },
  createNewGroup (group, config) {
    return axios.post('http://localhost:3000/api/createNewGroup', group, config)
      .catch(e => { throw new Error(e.response.data.message) })
  },
  createNewAdmin (admin, config) {
    return axios.post('http://localhost:3000/api/createNewAdmin', admin, config)
      .catch(e => { throw new Error(e.response.data.message) })
  },
  removeAdmin ({ adminId, groupId }, config) {
    return axios.delete(`http://localhost:3000/api/removeAdmin/${groupId}/${adminId}`, config)
      .catch(e => { throw new Error(e.response.data.message) })
  },
  sendInviteAdmin (admin, config) {
    return axios.post('http://localhost:3000/api/sendInviteAdmin', admin, config)
      .catch(e => { throw new Error(e.response.data.message) })
  }
}
export default groupsApi
