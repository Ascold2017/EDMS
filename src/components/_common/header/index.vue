<template lang="pug">
b-navbar(toggleable="md" type="dark" variant="info")
    div.acc-title {{ currentUser.author }}
    b-collapse(is-nav id="nav_collapse")
        b-navbar-nav(class="ml-auto")
            router-link(
                to="/edms"
                class="nav-item nav-link"
                v-if="userRole !== 'Admin' && userRole !== 'superAdmin'"
                ) Новые
            router-link(
                to="/edms/addNew"
                class="nav-item nav-link"
                v-if="userRole !== 'Admin' && userRole !== 'superAdmin'"
                ) Добавить
            router-link(
                to="/edms/admin"
                class="nav-item nav-link"
                v-if="userRole === 'Admin'"
                ) Панель администрирования админа
            router-link(
                to="/edms/superAdmin"
                class="nav-item nav-link"
                v-if="userRole === 'superAdmin'"
                ) Панель администрирования суперадмина
            b-button(size="sm" class="my-2 my-sm-0" type="button" @click="logout") Выйти
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
    computed: {
        ...mapGetters('usersStore', ['currentUser']),
        userRole() {
            return this.currentUser.role;
        }
    },
    methods: {
        ...mapActions('usersStore', ['logout', 'getCurrentUser']),
    },
}
</script>
