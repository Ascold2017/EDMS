import { Api } from './../../API/Api'
import { store } from '../index'

const groupsStore = {
  namespaced: true,
  state: {
    data: [],
    currentGroup: {}
  },
  getters: {
    groups (state) {
      return state.data
    },
    currentGroup (state) {
      return state.currentGroup
    }
  },
  actions: {
    getAllGroups (context) {
      return Api.groupsApi.getAllGroups(store.getters['headerToken'])
        .then(response => { context.state.data = response; return null })
    },
    getCurrentGroup (context) {
      return Api.groupsApi.getGroupByToken(store.getters['usersStore/currentUser'].groupInvite, store.getters['headerToken'])
        .then(response => { context.state.currentGroup = response; return null })
        .catch(e => { throw new Error(e) })
    },
    createNewGroup (context, { groupName, adminEmail }) {
      const newGroupData = {
        name: groupName,
        adminEmail
      }
      return Api.groupsApi.createNewGroup(newGroupData, store.getters['headerToken'])
        .then(response => { context.dispatch('getAllGroups'); return response.data })
        .catch(e => { throw new Error(e.message) })
    },
    createNewAdmin (context, admin) {
      const newAdmin = {
        adminEmail: admin.email,
        groupId: admin.groupId
      }
      return Api.groupsApi.createNewAdmin(newAdmin, store.getters['headerToken'])
        .then(response => { context.dispatch('getAllGroups'); return response.data })
        .catch(e => { throw new Error(e.message) })
    },
    removeAdmin (context, { adminId, groupId }) {
      return Api.groupsApi.removeAdmin({ adminId, groupId }, store.getters['headerToken'])
        .then(response => { context.dispatch('getAllGroups'); return response.data })
        .catch(e => { throw new Error(e.message) })
    },
    sendInviteAdmin (context, admin) {
      return Api.groupsApi.sendInviteAdmin(admin, store.getters['headerToken'])
        .then(response => { context.dispatch('getAllGroups'); return response.data })
        .catch(e => { throw new Error(e.message) })
    },
    createNewUser (context, user) {
      return Api.usersApi.createNewUser(user, store.getters['headerToken'])
        .then(response => {
          context.dispatch('getCurrentGroup')
          return response.data
        })
        .catch(e => { throw new Error(e) })
    }
  }
}

export default groupsStore
