import { Api } from './../../API-dev/Api'
import { store } from '../index'
import randomizer from '../../components/modulesJs/randomizer'

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
        .then(response => { context.state.data = response; return null })
    },
    getCurrentGroup (context) {
      console.log(store.getters['usersStore/currentUser'].groupInvite)
      return Api.groupsApi.getGroupByToken(store.getters['usersStore/currentUser'].groupInvite, store.getters['headerToken'])
        .then(response => { context.state.data = response; return null })
        .catch(e => { throw new Error(e) })
    },
    createNewGroup (context, { groupName, adminEmail }) {
      const newGroupData = {
        name: groupName,
        invite: randomizer(5),
        adminInvite: randomizer(5),
        adminLogin: randomizer(5),
        adminPassword: randomizer(6),
        adminEmail
      }
      return Api.groupsApi.createNewGroup(newGroupData, store.getters['headerToken'])
        .then(response => { context.dispatch('getAllGroups'); return response.data })
        .catch(e => { throw new Error(e.message) })
    },
    createNewAdmin (context, admin) {
      const newAdmin = {
        adminEmail: admin.email,
        adminLogin: randomizer(5),
        adminPassword: randomizer(6),
        adminInvite: randomizer(5),
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
      const adminInfo = {
        ...admin,
        password: randomizer(6)
      }
      return Api.groupsApi.sendInviteAdmin(adminInfo, store.getters['headerToken'])
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
