<template lang="pug">
b-container
    b-row(align-h="center" align-v="center")
        b-col(sm="10" md="8" lg="4")
            b-card(
                title="Войти"
                v-if="show === 'signIn'"
                )
                sign-in
            b-card(
                title="Зарегистрироваться"
                v-if="show === 'signUp'"
                )
                sign-up
</template>

<script>
export default {
    methods: {
        
    },
    computed: {
        show() {
            const route = this.$route.fullPath;
            switch(route) {
                case '/auth':
                    return 'signIn';
                case '/registration':
                    return 'signUp';
                default: return 'signIn';
            }
        }
    },
    components: {
        signIn: require('./innerComponents/signIn.vue'),
        signUp: require('./innerComponents/signUp.vue'),
    },
}
</script>
