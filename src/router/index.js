import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import { store } from '../store'
Vue.use(VueRouter)

const router = new VueRouter({
  routes,
  mode: 'history'
})

// before enter to route - check user access
let access = false
router.beforeResolve((to, from, next) => {
  // prevently - get user from store
  const userToken = store.state.token

  if (access) {
    access = false
    next()
  }
  if (!userToken || to.path === '/') {
    access = true
    if (to.path === '/') {
      next()
    } else {
      next('/')
    }
  } else {
    const userRole = store.state.usersStore.user.role
    switch (userRole) {
      case 'Admin': {
        if (to.path === '/edms/admin/createUser' || '/edms/admin/usersStats') {
          next()
        } else {
          access = true
          next('/edms/admin')
        }
        break
      }
      case 'superAdmin': {
        if (to.path === '/edms/superAdmin' ||
          '/edms/superAdmin/createGroup' ||
          '/edms/superAdmin/createAdmin' ||
          '/edms/superAdmin/groups') {
          next()
        } else {
          access = true
          next('/edms/superAdmin')
        }
        break
      }
      default: {
        access = true
        if (to.path !== '/edms/admin' && to.path !== '/edms/superAdmin') {
          next()
        } else {
          next('/edms')
        }
      }
    }
  }
})

export default router
