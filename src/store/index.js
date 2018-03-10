import Vue from 'vue'
import Vuex from 'vuex'
import usersStore from './modules/usersStore'
import docsStore from './modules/docsStore'
import groupsStore from './modules/groupsStore'
import statStore from './modules/statStore'
import { Api } from '../API-dev/Api'

Vue.use(Vuex)
//  Import modules

export const store = new Vuex.Store({
  state: {
    token: ''
  },
  getters: {
    headerToken (state) {
      return {
        headers: {
          token: state.token
        }
      }
    }
  },
  modules: {
    usersStore,
    docsStore,
    groupsStore,
    statStore
  },
  actions: {
    // before init - get user token and get user info from server
    initApp (context) {
      return new Promise(resolve => {
        const token = sessionStorage.getItem('token')
        if (token) {
          context.state.token = token
          store.dispatch('usersStore/getCurrentUser')
            .then(() => resolve())
        } else {
          resolve()
        }
      })
    },
    // when logout - remove token an user info
    logout (context) {
      return Api.logout()
        .then(response => {
          store.state.usersStore.user = {}
          context.state.token = ''
          sessionStorage.removeItem('token')
        })
    },
    // when log in - set token and create in sessionStorage browser
    logIn (context, data) {
      return Api.logIn(data)
        .then(response => {
          context.state.token = response.token
          sessionStorage.setItem('token', response.token)
          return response.message
        })
        .catch(error => { throw new Error(error) })
    },
    signUp (context, data) {
      return Api.signUp(data)
        .then(response => response)
        .catch(e => { throw new Error(e) })
    }
  }
})
