const routes = [
    { path: '/', component: require('../components/mainPage') },
    { path: '/:id', component: require('../components/detailsPage') },
    { path: '/addNew', component: require('../components/addNewDocPage') },
    { path: '/signIn', component: require('../components/signInUp') },
    { path: '/signUp', component: require('../components/signInUp') },
    { path: '*', component: require('../components/404') },
];
export default routes;
