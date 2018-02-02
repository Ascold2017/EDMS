<template lang="pug">
    #app
        app-header
        b-container
            router-view
</template>

<script>
import AppHeader from './components/_common/header';
import { mapActions, mapGetters } from 'vuex';
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
