import axios from 'axios'
import usersApi from './usersApi'
import documentsApi from './documentsApi'
import groupsApi from './groupsApi'
import statApi from './statApi'

export const Api = {
  usersApi,
  documentsApi,
  groupsApi,
  statApi,
  logIn (data) {
    return axios.post('http://localhost:3000/api/signIn', data)
      .then(response => response.data)
      .catch(e => { throw new Error(e.response.data.error) })
  },
  logout () {
    return axios.post('http://localhost:3000/api/logout')
      .then(response => response.data)
      .catch(e => { throw new Error(e.response) })
  },
  sendMail (body, token) {
    return axios.post('http://localhost:3000/api/mail', body, token)
      .then(response => response.data)
      .catch(e => { throw new Error(e.response) })
  },
  signUp (data) {
    return axios.post('http://localhost:3000/api/signUp', data)
      .then(response => response.data)
      .catch(e => { throw new Error(e.response.error) })
  }
}
