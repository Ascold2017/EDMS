import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import { store } from '../store';
Vue.use(VueRouter);

const router = new VueRouter({
    routes,
    mode: 'history',
});

// flag for no-multiply call
let flag = false;
// before enter to route - check user access
router.beforeEach((to, from, next) => {
    // verify user role and redirection
    const redirect = (userRole) => {
        // admin have access to /edms/admin, superAdmin to superAdmin page, and other - to other pages, not a admin/superAdmin pages
        if (userRole && (
            (userRole === 'Admin' && to.path === '/edms/admin') ||
            (userRole === 'superAdmin' && to.path === '/edms/superAdmin') ||
            (
                (userRole !== 'superAdmin' && userRole !== 'Admin') &&
                (to.path !== '/edms/admin' && to.path !== '/edms/superAdmin')
            )
        )) { next(); } else { next('/404'); }
        flag = false;
    };
    // prevently - get user from store
    let userRole = store.state.usersStore.user.role;

    // if user not loading
    if (!userRole && !flag) {
        // stop multiply call
        flag = true;
        // get user from server
        store.dispatch('usersStore/getCurrentUser')
            .then(() => {
                // get user from store again and execute redirect
                userRole = store.state.usersStore.user.role;
                redirect(userRole);
                return;
            });
    } else
    // if user exist in store - just redirect
    if (!flag) {
        flag = true;
        redirect(userRole);
        return;
    }
});

export default router;

