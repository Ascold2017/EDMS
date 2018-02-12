import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import { store } from '../store';
Vue.use(VueRouter);

const router = new VueRouter({
    routes,
    mode: 'history',
});

// before enter to route - check user access

router.beforeEach((to, from, next) => {
    // prevently - get user from store
    const userToken = store.state.token;
    console.log(userToken);
    if (!userToken) {
        console.log('to index');
        next();
    } else {
        const userRole = store.state.usersStore.user.role;

        // admin have access to /edms/admin, superAdmin to superAdmin page, and other - to other pages, not a admin/superAdmin pages
        if ((userRole === 'Admin' && to.path === '/edms/admin') ||
            (userRole === 'superAdmin' && to.path === '/edms/superAdmin') ||
                (
                    (userRole !== 'superAdmin' && userRole !== 'Admin') &&
                    (to.path !== '/edms/admin' && to.path !== '/edms/superAdmin')
                )
        ) { next(); } else { next('/404'); }
    }
});

export default router;

