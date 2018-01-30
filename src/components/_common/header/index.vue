<template lang="pug">
b-navbar(toggleable="md" type="dark" variant="info")
    div.acc-title {{ currentUser.author }}
    b-collapse(is-nav id="nav_collapse")
        b-navbar-nav(class="ml-auto")
            router-link(to="/edms" class="nav-item nav-link") Новые
            router-link(to="/edms/addNew" class="nav-item nav-link") Добавить
            router-link(to="/edms/admin" class="nav-item nav-link") Панель администрирования админа
            router-link(to="/edms/superAdmin" class="nav-item nav-link") Панель администрирования суперадмина
            b-button(size="sm" class="my-2 my-sm-0" type="button" @click="logout") Выйти
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
    computed: {
        ...mapGetters('usersStore', ['currentUser']),
    },
    methods: {
        ...mapActions('usersStore', ['logout', 'getCurrentUser']),
    },
}
</script>
