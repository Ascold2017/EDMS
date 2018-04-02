import { Api } from './../../API/Api'
import { store } from '../index'

const usersStore = {
  namespaced: true,
  state: {
    data: [],
    user: {}
  },
  getters: {
    users (state) {
      return state.data
    },
    currentUser (state) {
      return state.user
    }
  },
  mutations: {
    setUser (state, user) {
      state.user = user
    }
  },
  actions: {
    getAllUsersFromGroup (context) {
      Api.usersApi
        .getAllUsersFromGroup(store.getters['headerToken'])
        .then(response => {
          context.state.data = response
        })
        .catch(e => {
          return []
        })
    },
    getCurrentUser (context) {
      return new Promise((resolve, reject) => {
        Api.usersApi
          .getCurrentUser(store.getters['headerToken'])
          .then(response => {
            context.commit('setUser', response)
            resolve()
          })
          .catch(e => reject(e))
      })
    },
    sendMail (context, data) {
      return Api.sendMail(data, store.getters['headerToken'])
        .then(response => response)
    }
  }
}
export default usersStore
