import { Api } from './../../API-dev/Api'
import { store } from '../index'
import msToTime from '../../components/modulesJs/msToTime'

const statStore = {
  namespaced: true,
  state: {
    docs: [],
    dateRange: {
      start: 0,
      end: Infinity
    }
  },
  mutations: {
    setRange (state, range) {
      state.dateRange = range
    }
  },
  getters: {
    // count of params docs in setted dateRange
    docsCreated (state) {
      return state.docs.filter(doc => doc.date >= state.dateRange.start && doc.date <= state.dateRange.end).length
    },
    docsSigned (state) {
      return state.docs
        .filter(doc => doc.globalStatus === 'resolved')
        .filter(doc => doc.date >= state.dateRange.start && doc.date <= state.dateRange.end)
        .length
    },
    docsRejected (state) {
      return state.docs
        .filter(doc => doc.globalStatus === 'archived')
        .filter(doc => doc.date >= state.dateRange.start && doc.date <= state.dateRange.end)
        .length
    },
    docsTimingSign (state) {
      const docs = state.docs
        .filter(doc => doc.globalStatus === 'resolved')
        .filter(doc => doc.date >= state.dateRange.start && doc.date <= state.dateRange.end)

      if (!docs.length) return 0

      let signTime = 0
      // find middle time to sign all documents
      docs.forEach(doc => {
        doc.routes.forEach(route => {
          signTime += route.dateSigning - route.dateIncoming
        })
        signTime /= doc.routes.length
      })

      signTime /= docs.length
      // parse to time from milliseconds
      const time = msToTime(signTime)
      return `Годин: ${time.hours}, хвилин: ${time.minutes}, секунд: ${time.seconds}`
    },
    docsTimingResolve (state) {
      const docs = state.docs
        .filter(doc => doc.globalStatus === 'resolved')
        .filter(doc => doc.date >= state.dateRange.start && doc.date <= state.dateRange.end)

      if (!docs.length) return 0

      let resolveTime = 0
      // find middle time to resolving documents
      docs.forEach(doc => {
        resolveTime += doc.resolveDate - doc.date
      })
      resolveTime /= docs.length
      const time = msToTime(resolveTime)

      return `Годин: ${time.hours}, хвилин: ${time.minutes}, секунд: ${time.seconds}`
    },
    usersStat (state) {
      // stats for users
      const docs = state.docs
        .filter(doc => doc.date >= state.dateRange.start && doc.date <= state.dateRange.end)

      let stat = []
      const group = store.getters['groupsStore/currentGroup']
      let users = null

      if (group.users) {
        // filter users no-admin only
        users = group.users.filter(user => user.role !== 'Admin')
      }

      // stat object for table
      stat = {
        // table fields
        fields: [
          { value: 'author', text: 'ПІБ', sortable: true },
          { value: 'role', text: 'Роль', sortable: true },
          { value: 'created', text: 'Опублікував документів', sortable: true },
          { value: 'resolvedDocs', text: 'Прийнятих документів', sortable: true },
          { value: 'rejectedDocs', text: 'Відмовлених документів', sortable: true },
          { value: 'signings', text: 'Піставлені підписи', sortable: true },
          { value: 'rejecteds', text: 'Відмовлених підписів', sortable: true }
        ],
        items: []
      }
      // if users exist - create table rows
      if (users) {
        // add table items
        users.forEach(user => {
          stat.items.push({
            value: false,

            author: user.author,

            role: user.role,

            resolvedDocs: docs.filter(doc => {
              return (doc.author_id === user._id && doc.globalStatus === 'resolved')
            }).length,

            rejectedDocs: docs.filter(doc => {
              return (doc.author_id === user._id && doc.globalStatus === 'archieved')
            }).length,

            signings: docs.filter(doc => {
              return doc.routes.find(route => route._id === user._id && route.status === 'resolve') ? doc : null
            }).length,

            rejecteds: docs.filter(doc => {
              return doc.routes.find(route => route._id === user._id && route.status === 'reject') ? doc : null
            }).length,

            created: docs.filter(doc => doc.author_id === user._id).length

          })
        })
      }
      return stat
    }
  },
  actions: {
    getDocsStat (context) {
      return Api.statApi.getDocsStat(store.getters['headerToken'])
        .then(response => { context.state.docs = response })
        .catch(e => { throw new Error(e.message) })
    }
  }
}

export default statStore
