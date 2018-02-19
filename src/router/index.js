import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import { store } from '../store';
import { sync } from 'vuex-router-sync';
Vue.use(VueRouter);

const router = new VueRouter({
    routes,
    mode: 'history',
});
// sync(store, router);
// before enter to route - check user access
let access = false;
router.beforeResolve((to, from, next) => {
    // prevently - get user from store
    const userToken = store.state.token;
    console.log(userToken);
    if (access) {
        access = false;
        next();
    }
    if (!userToken) {
        console.log('to index');
        access = true;
        next('/auth');
    } else {
        const userRole = store.state.usersStore.user.role;
        switch (userRole) {
        case 'Admin': {
            console.log('to Admin');
            access = true;
            next('/edms/admin');
            break;
        }
        case 'superAdmin': {
            console.log('superAdmin');
            access = true;
            next('/edms/superAdmin');
            break;
        }
        default: {
            console.log('default user');
            access = true;
            if (to.path !== '/edms/admin' && to.path !== '/edms/superAdmin') {
                next();
            } else {
                next('/edms');
            }
        }
        }
    }
});

export default router;

