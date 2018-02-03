import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import { store } from '../store';
Vue.use(VueRouter);

const router = new VueRouter({
    routes,
    mode: 'history',
});

router.beforeEach((to, from, next) => {
    const redirect = (userRole) => {
        console.log(userRole);
        if (userRole && (
            (userRole === 'Admin' && to.path === '/edms/admin') ||
            (userRole === 'superAdmin' && to.path === '/edms/superAdmin') ||
            (
                (userRole !== 'superAdmin' && userRole !== 'Admin') &&
                (to.path !== '/edms/admin' && to.path !== '/edms/superAdmin')
            )
        )) { next(); } else { next(from.path); }
    };
    let userRole = store.state.usersStore.user.role;
    if (!userRole) {
        store.dispatch('usersStore/getCurrentUser')
            .then(() => {
                userRole = store.state.usersStore.user.role;
                redirect(userRole);
            });
    } else {
        redirect(userRole);
    }
});

export default router;

