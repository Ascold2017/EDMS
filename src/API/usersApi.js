import axios from 'axios'

const usersApi = {
  getCurrentUser (config) {
    return axios.get('/api/getCurrentUser', config)
      .then(response => response.data)
      .catch(e => { throw new Error(e) })
  },
  getAllUsersFromGroup (config) {
    return axios.get('/api/getAllUsers', config)
      .then(response => { return response.data })
      .catch(e => { return [] })
  },
  createNewUser (user, config) {
    return axios.post('/api/createNewUser', user, config)
      .catch(e => { throw new Error(e) })
  }
}
export default usersApi
