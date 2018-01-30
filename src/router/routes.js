const routes = [
    { path: '/', component: require('../components/mainPage') },
    { path: '/edms', component: require('../components/mainPage') },
    { path: '/edms/addNew', component: require('../components/addNewDocPage') },
    { path: '/edms/404', component: require('../components/404') },
    { path: '/edms/admin', component: require('../components/admin') },
    { path: '/edms/superAdmin', component: require('../components/superAdmin') },
    { path: '/edms/:id', component: require('../components/detailsPage') },
    { path: '*', component: require('../components/404') },
];
export default routes;
