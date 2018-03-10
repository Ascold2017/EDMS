import { Api } from './../../API-dev/Api'
import usersStore from './usersStore'
import { store } from '../index'

const groupsStore = {
  namespaced: true,
  state: {
    data: []
  },
  getters: {
    groups (state) {
      return state.data
    }
  },
  actions: {
    getAllGroups (context) {
      return Api.groupsApi.getAllGroups(store.getters['headerToken'])
        .then(response => { context.state.data = response })
    },
    getCurrentGroup (context) {
      const groupInvite = usersStore.state.user.groupInvite
      if (groupInvite) {
        return Api.groupsApi.getGroupByToken(usersStore.state.user.groupInvite, store.getters['headerToken'])
          .then(response => { context.state.data = response; return null })
          .catch(e => { throw new Error(e) })
      }
    },
    createNewGroup (context, group) {
      return Api.groupsApi.createNewGroup(group, store.getters['headerToken'])
        .then(response => response.data)
        .catch(e => { throw new Error(e) })
    },
    createNewAdmin (context, admin) {
      return Api.groupsApi.createNewAdmin(admin, store.getters['headerToken'])
        .then(response => response.data)
        .catch(e => { throw new Error(e) })
    },
    createNewUser (context, user) {
      return Api.usersApi.createNewUser(user, store.getters['headerToken'])
        .then(response => response.data)
        .catch(e => { throw new Error(e) })
    }
  }
}

export default groupsStore
