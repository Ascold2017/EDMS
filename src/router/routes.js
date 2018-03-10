const routes = [
  { path: '/', component: require('../components/indexPage') },
  { path: '/auth', component: require('../components/indexPage') },
  { path: '/registration', component: require('../components/indexPage') },
  { path: '/edms', component: require('../components/mainPage') },
  { path: '/edms/addNew', component: require('../components/addNewDocPage') },
  { path: '/edms/myDocuments', component: require('../components/myDocumentsPage') },
  { path: '/edms/myDocuments/:id', component: require('../components/myDocumentDetails') },
  { path: '/edms/myDocumentEdit/:id', component: require('../components/myDocumentEditor') },
  { path: '/edms/archive', component: require('../components/archivePage') },
  { path: '/edms/archive/:id', component: require('../components/archiveDetailsPage') },
  { path: '/edms/admin', component: require('../components/admin') },
  { path: '/edms/superAdmin', component: require('../components/superAdmin') },
  { path: '/edms/404', component: require('../components/404') },
  { path: '/edms/:id', component: require('../components/detailsPage') },
  { path: '*', component: require('../components/404') }
]
export default routes
