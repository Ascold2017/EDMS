<template lang="pug">
b-navbar(toggleable="md" type="dark" variant="info")
    b-collapse(is-nav id="nav_collapse")
        b-navbar-nav(class="ml-auto")
            b-nav-item(href="/") Новые
            b-nav-item(href="/addNew") Добавить
            b-button(size="sm" class="my-2 my-sm-0" type="button" @click="logout") Выйти
</template>

<script>
import { mapActions } from 'vuex';
export default {
    methods: {
        ...mapActions('authStore', ['logout']),
    },
}
</script>
