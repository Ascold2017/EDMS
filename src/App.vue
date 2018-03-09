<template lang="pug">
    #app
        app-header
        b-container
            router-view
        app-footer
</template>

<script>
import AppHeader from './components/_common/header';
import AppFooter from './components/_common/footer';

import { mapActions, mapGetters } from 'vuex';
export default {
    name: 'app',
    computed: {

    },
    methods: {
        ...mapActions('usersStore', ['getCurrentUser']),
    },
    components: {
        AppHeader,
        AppFooter,
    },
};
</script>
