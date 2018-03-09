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
      docs.forEach(doc => {
        doc.routes.forEach(route => {
          signTime += route.dateSigning - route.dateIncoming
        })
        signTime /= doc.routes.length
      })
      signTime /= docs.length
      const time = msToTime(signTime)
      return `Часов: ${time.hours}, минут: ${time.minutes}, секунд: ${time.seconds}`
    },
    docsTimingResolve (state) {
      const docs = state.docs
        .filter(doc => doc.globalStatus === 'resolved')
        .filter(doc => doc.date >= state.dateRange.start && doc.date <= state.dateRange.end)
      if (!docs.length) return 0
      let resolveTime = 0
      docs.forEach(doc => {
        resolveTime += doc.resolveDate - doc.date
      })
      resolveTime /= docs.length
      const time = msToTime(resolveTime)

      return `Часов: ${time.hours}, минут: ${time.minutes}, секунд: ${time.seconds}`
    },
    usersStat (state) {
      const docs = state.docs
        .filter(doc => doc.date >= state.dateRange.start && doc.date <= state.dateRange.end)
      let stat = []
      const users = store.getters['groupsStore/groups'][0].users.filter(user => user.role !== 'Admin')
      if (users) {
        stat = {
          fields: [
            { key: 'author', label: 'ФИО', sortable: true },
            { key: 'role', label: 'Роль', sortable: true },
            { key: 'created', label: 'Опубликовал документов', sortable: true },
            { key: 'resolvedDocs', label: 'Принятые документы', sortable: true },
            { key: 'rejectedDocs', label: 'Отказанные документы', sortable: true },
            { key: 'signings', label: 'Поставленные подписи', sortable: true },
            { key: 'rejecteds', label: 'Отказал в подписи', sortable: true }
          ],
          items: []
        }
        users.forEach(user => {
          stat.items.push({
            author: user.author,
            role: user.role,
            resolvedDocs: docs.filter(doc => doc.author_id === user._id && doc.globalStatus === 'resolved').length,
            rejectedDocs: docs.filter(doc => doc.author_id === user._id && doc.globalStatus === 'archieved').length,
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
