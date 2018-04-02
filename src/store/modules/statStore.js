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
      return `Часов: ${time.hours}, минут: ${time.minutes}, секунд: ${time.seconds}`
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

      return `Часов: ${time.hours}, минут: ${time.minutes}, секунд: ${time.seconds}`
    },
    usersStat (state) {
      // stats for users
      const docs = state.docs
        .filter(doc => doc.date >= state.dateRange.start && doc.date <= state.dateRange.end)

      let stat = []
      const group = store.getters['groupsStore/groups'][0]
      let users = null

      if (group) {
        users = group.users.filter(user => user.role !== 'Admin')
      }

      if (users) {
        // stat object for table
        stat = {
          // table fields
          fields: [
            { key: 'author', label: 'ПІБ', sortable: true },
            { key: 'role', label: 'Роль', sortable: true },
            { key: 'created', label: 'Опублікував документів', sortable: true },
            { key: 'resolvedDocs', label: 'Прийнятих документів', sortable: true },
            { key: 'rejectedDocs', label: 'Відмовлених документів', sortable: true },
            { key: 'signings', label: 'Піставлені підписи', sortable: true },
            { key: 'rejecteds', label: 'Відмовлених підписів', sortable: true }
          ],
          items: []
        }
        // add table items
        users.forEach(user => {
          stat.items.push({
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
