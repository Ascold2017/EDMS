import axios from 'axios'

const usersApi = {
  getCurrentUser (config) {
    return axios.get('http://localhost:3000/api/getCurrentUser', config)
      .then(response => response.data)
      .catch(e => { console.error(e); throw new Error(e) })
  },
  getAllUsersFromGroup (config) {
    return axios.get('http://localhost:3000/api/getAllUsers', config)
      .then(response => { return response.data })
      .catch(e => { console.log(e); return [] })
  },
  createNewUser (user, config) {
    return axios.post('http://localhost:3000/api/createNewUser', user, config)
      .catch(e => { console.log(e); throw new Error(e) })
  },
  createKeys ({ cert, userId }, config) {
    return axios.post('http://localhost:3000/api/createNewKeys', { cert, userId }, config)
      .catch(e => { console.log(e); throw new Error(e) })
  }
}
export default usersApi
