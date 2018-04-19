<template lang='pug'>
  div
    v-navigation-drawer(
      fixed
      app
      v-model='sidebar'
      v-if='show !== "adminBar" && show !== "superadminBar"')
      v-list
        v-list-tile
          v-btn(to='/edms' flat) Нові документи
        v-list-tile
          v-btn(to='/edms/addNew' flat) Додати документ
        v-list-tile
          v-btn(to='/edms/myDocuments' flat) Моі документи
        v-list-tile
          v-btn(to='/edms/archive' flat) Архів
    v-navigation-drawer(
      fixed
      app
      v-model='sidebar'
      v-if='show === "superadminBar"')
      v-list
        v-list-tile
          v-btn(to='/edms/superAdmin/createGroup' flat) Створити нову групу
        v-list-tile
          v-btn(to='/edms/superAdmin/createAdmin' flat) Створити адміністратора
        v-list-tile
          v-btn(to='/edms/superAdmin/groups' flat) Групи
    v-navigation-drawer(
      fixed
      app
      v-model='sidebar'
      v-if='show === "adminBar"')
      v-list
        v-list-tile
          v-btn(to='/edms/admin/createUser' flat) Створити нового користувача
        v-list-tile
          v-btn(to='/edms/admin/usersStats' flat) Статистика

    v-toolbar(app dense)
      v-toolbar-side-icon(v-if='show !== "indexBar"' @click='sidebar = !sidebar')
      v-toolbar-title(v-if='show !== "indexBar"') {{ currentUser.author }}
      v-toolbar-title(v-if='show === "indexBar"') EDMS
      v-spacer
      v-btn(@click='logOut' color='secondary' small v-if='show !== "indexBar"') Вийти
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      // get id of current document
      route: this.$router.currentRoute.fullPath,
      sidebar: false
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
      this.sidebar = false
      this.$router.push('/')
      this.logout()
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
