import Vue from 'vue'
import Vuex from 'vuex'
import usersStore from './modules/usersStore'
import docsStore from './modules/docsStore'
import groupsStore from './modules/groupsStore'
import statStore from './modules/statStore'
import { Api } from '../API-dev/Api'
const openpgp = require('openpgp')

Vue.use(Vuex)

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
      sessionStorage.setItem('edms-token', token)
      state.token = token
    },
    clearToken (state) {
      sessionStorage.removeItem('edms-token')
      state.token = ''
    },
    setKey (state, { privateKey, passphrase, privKeyObj }) {
      state.privateKey = privKeyObj
      sessionStorage.setItem('edms-privateKey', privateKey)
      sessionStorage.setItem('edms-passphrase', passphrase)
    },
    clearKey (state) {
      sessionStorage.removeItem('edms-privateKey')
      sessionStorage.removeItem('edms-passphrase')
      state.privateKey = {}
    }
  },
  actions: {
    // before init - get user token and get user info from server
    initApp (context) {
      const token = sessionStorage.getItem('edms-token')
      if (token) {
        context.commit('setToken', token)

        context.dispatch('decryptPrivateKey', {
          privateKey: sessionStorage.getItem('edms-privateKey'),
          passphrase: sessionStorage.getItem('edms-passphrase')
        })

        return store.dispatch('usersStore/getCurrentUser')
          .then(() => store.dispatch('groupsStore/getCurrentGroup'))
      } else {
        return Promise.resolve()
      }
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
    // login user by login, passphrase and privateKey File
    logIn (context, { login, passphrase, privateKeyFile }) {
      return new Promise((resolve, reject) => {
        // read privateKey File
        const fr = new FileReader()
        fr.readAsText(privateKeyFile, 'utf-8')
        fr.onload = (privKey) => {
          let message = ''
          // decrypt privateKey content with passphrase
          // then - create certificate message, which sign with decrypted private key,
          // and send login and certificate
          context.dispatch('decryptPrivateKey', { privateKey: privKey.target.result, passphrase })
            .then(() => context.dispatch('createAuthCertificate'))
            .then(certificate => {
              return Api.logIn({ userLogin: login, certificate: certificate.data })
                .catch(e => { throw new Error(e.message) })
            })
            .then(response => {
              message = response.message
              context.commit('setToken', response.token)
              return store.dispatch('usersStore/getCurrentUser')
            })
            .then(() => resolve(message))
            .catch(err => reject(err))
        }
      })
    },
    logInAdmin (context, data) {
      // admin just send login and password
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
      if (privateKey && passphrase) {
        return new Promise((resolve, reject) => {
          const privKeyObj = openpgp.key.readArmored(privateKey).keys[0]
          if (privKeyObj.decrypt(passphrase)) {
            context.commit('setKey', { privateKey, passphrase, privKeyObj })
            resolve()
          } else {
            context.commit('clearKey')
            reject(new Error('Неправильна парольна фраза!'))
          }
        })
      }
    },
    createAuthCertificate (context) {
      // certificate - is just some string, which is signing by private key
      const data = Date.now().toString()
      return openpgp.sign({
        data: data, // input as String (or Uint8Array)
        privateKeys: context.state.privateKey, // for signing
        date: Date.now()
      })
    }
  }
})
