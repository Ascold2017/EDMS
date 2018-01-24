<template lang="pug">
    #app
        app-header
        .container
            router-view
</template>

<script>
import AppHeader from './components/_common/header';
import { mapActions } from 'vuex';
export default {
    name: 'app',
    methods: {
        ...mapActions('usersStore', ['getCurrentUser']),
    },
    created() {
        console.log('get user');
        this.getCurrentUser();
    },
    components: {
        AppHeader,
    }
};
</script>
