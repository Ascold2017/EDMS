<template lang='pug'>
b-navbar(toggleable='md' type='dark' variant='info')
    b-navbar-brand( to='/edms')
        img(src='~assets/img/logo.png').logo
    div(v-if='show !== "indexBar"').acc-title {{ currentUser.author }}
    b-collapse(is-nav id='nav_collapse')
        b-navbar-nav(
            class='ml-auto'
            v-if='show === "userBar"')
            router-link(
                to='/edms'
                class='nav-item nav-link'
                ) Новые
            router-link(
                to='/edms/addNew'
                class='nav-item nav-link'
                ) Добавить
            router-link(
                to='/edms/myDocuments'
                class='nav-item nav-link'
                ) Мои документы
            router-link(
                to='/edms/archive'
                class='nav-item nav-link'
                ) Архив
            b-button(size='sm' class='my-2 my-sm-0' type='button' @click='logOut') Выйти
        b-navbar-nav(
            class='ml-auto'
            v-if='show === "adminBar"')
            router-link(
                to='/edms/admin'
                class='nav-item nav-link'
                ) Панель администрирования админа
            b-button(size='sm' class='my-2 my-sm-0' type='button' @click='logOut') Выйти
        b-navbar-nav(
            class='ml-auto'
            v-if='show === "superadminBar"')
            router-link(
                to='/edms/superAdmin'
                class='nav-item nav-link'
                ) Панель администрирования суперадмина
            b-button(size='sm' class='my-2 my-sm-0' type='button' @click='logOut') Выйти
    b-navbar-toggle(target='nav_collapse' v-if='show !== "indexBar"')
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      // get id of current document
      route: this.$router.currentRoute.fullPath
    }
  },
  computed: {
    ...mapGetters('usersStore', ['currentUser']),
    show () {
      const route = this.$route.fullPath
      const role = this.currentUser.role

      if (route === '/' || route === '/auth' || route === '/registration') {
        return 'indexBar'
      }
      if (role === 'Admin') return 'adminBar'
      if (role === 'superAdmin') return 'superadminBar'
      return 'userBar'
    }
  },
  methods: {
    ...mapActions(['logout']),
    logOut () {
      this.logout().then(() => this.$router.push('/'))
    }
  }
}
</script>
<style lang="sass" scoped>
.logo
    display: block
    height: 35px
    width: auto
</style>
