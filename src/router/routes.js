const routes = [
    { path: '/', component: require('../components/mainPage') },
    { path: '/edms', component: require('../components/mainPage') },
    { path: '/edms/addNew', component: require('../components/addNewDocPage') },
    { path: '/edms/:id', component: require('../components/detailsPage') },
    { path: '/edms/404', component: require('../components/404') },
    { path: '*', component: require('../components/404') },
];
export default routes;
