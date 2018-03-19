import Vue from 'vue'
import Vuex from 'vuex'
import usersStore from './modules/usersStore'
import docsStore from './modules/docsStore'
import groupsStore from './modules/groupsStore'
import statStore from './modules/statStore'
import { Api } from '../API-dev/Api'
const openpgp = require('openpgp')
// import fs from 'fs'

Vue.use(Vuex)
//  Import modules

export const store = new Vuex.Store({
  state: {
    token: '',
    privateKey: {}
  },
  getters: {
    headerToken (state) {
      return {
        headers: {
          token: state.token
        }
      }
    },
    privateKey (state) {
      return state.privateKey
    }
  },
  modules: {
    usersStore,
    docsStore,
    groupsStore,
    statStore
  },
  mutations: {
    setToken (state, token) {
      sessionStorage.setItem('token', token)
      state.token = token
    },
    clearToken (state) {
      sessionStorage.removeItem('token')
      state.token = ''
    },
    setKey (state, privateKey) {
      state.privateKey = privateKey
      // sessionStorage.setItem('privateKey', privateKey)
    },
    clearKey (state) {
      sessionStorage.removeItem('privateKey')
      state.privateKey = ''
    }
  },
  actions: {
    // before init - get user token and get user info from server
    initApp (context) {
      return new Promise(resolve => {
        const token = sessionStorage.getItem('token')
        if (token) {
          context.commit('setToken', token)
          // context.commit('setKey', JSON.parse(sessionStorage.getItem('privateKey')))
          store.dispatch('usersStore/getCurrentUser')
            .then(() => store.dispatch('groupsStore/getCurrentGroup'))
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
          store.state.groupsStore.data = []
          context.commit('clearToken')
          context.commit('clearKey')
        })
    },
    // when log in - set token and create in sessionStorage browser
    logIn (context, { login, passphrase, privateKeyFile }) {
      return new Promise((resolve, reject) => {
        const fr = new FileReader()
        fr.readAsText(privateKeyFile, 'utf-8')
        fr.onload = (privKey) => {
          let message = ''
          context.dispatch('decryptPrivateKey', { privateKey: privKey.target.result, passphrase })
            .then(() => context.dispatch('createAuthCertificate'))
            .then(certificate => {
              return Api.logIn({userLogin: login, certificate: certificate.data})
                .catch(e => { throw new Error(e.message) })
            })
            .then(response => {
              message = response.message
              context.commit('setToken', response.token)
              return store.dispatch('usersStore/getCurrentUser')
            })
            .then(response => resolve(message))
            .catch(err => reject(err))
        }
      })
    },
    logInAdmin (context, data) {
      return Api.logInAdmin(data)
        .then(response => {
          context.commit('setToken', response.token)
          return store.dispatch('usersStore/getCurrentUser')
            .then(() => {
              return store.dispatch('groupsStore/getCurrentGroup')
                .then(() => {
                  return response.message
                })
            })
        })
        .catch(err => { throw new Error(err.message) })
    },
    decryptPrivateKey (context, { privateKey, passphrase }) {
      return new Promise((resolve, reject) => {
        const privKeyObj = openpgp.key.readArmored(privateKey).keys[0]
        if (privKeyObj.decrypt(passphrase)) {
          console.log('Privkey obj', privKeyObj)
          context.commit('setKey', privKeyObj)
          resolve()
        } else {
          context.commit('clearKey')
          reject(new Error('Неверная парольная фраза!'))
        }
      })
    },
    createAuthCertificate (context) {
      const data = Date.now().toString()
      return openpgp.sign({
        data: data, // input as String (or Uint8Array)
        privateKeys: context.state.privateKey, // for signing
        date: Date.now()
      })
    }
  }
})
