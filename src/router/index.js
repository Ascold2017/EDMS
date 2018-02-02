import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import { sync } from 'vuex-router-sync';
import { store } from '../store';
Vue.use(VueRouter);

const router = new VueRouter({
    routes,
    mode: 'history',
});

router.beforeEach((to, from, next) => {
    const userRole = store.state.usersStore.user.role;
    console.log(userRole);
    if (userRole && (
        (userRole === 'Admin' && to.path === '/edms/admin') ||
        (userRole === 'superAdmin' && to.path === '/edms/superAdmin') ||
        (
            (userRole !== 'superAdmin' && userRole !== 'Admin') &&
            (to.path !== '/edms/admin' && to.path !== '/edms/superAdmin')
        )
    )) { next(); }
});

export default router;

