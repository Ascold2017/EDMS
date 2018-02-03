import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import { store } from '../store';
Vue.use(VueRouter);

const router = new VueRouter({
    routes,
    mode: 'history',
});

let flag = false;
router.beforeEach((to, from, next) => {
    const redirect = (userRole) => {
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
    let userRole = store.state.usersStore.user.role;
    console.log('redirect', userRole);
    if (!userRole && !flag) {
        flag = true;
        store.dispatch('usersStore/getCurrentUser')
            .then(() => {
                console.log(userRole);
                userRole = store.state.usersStore.user.role;
                redirect(userRole);
                return;
            });
    } else if (!flag) {
        flag = true;
        redirect(userRole);
        return;
    }
});

export default router;

