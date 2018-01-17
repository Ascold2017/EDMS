<template lang="pug">
    #app
        app-header
        .container
            router-view
</template>

<script>
import AppHeader from './components/_common/header';
export default {
    name: 'app',
    components: {
        AppHeader,
    }
};
</script>
