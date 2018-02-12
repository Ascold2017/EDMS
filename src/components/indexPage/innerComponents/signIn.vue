<template lang="pug">
b-form(@submit.prevent="signIn")
    b-alert(varinat="success" v-if="success" show) Вы успешно авторизовались!
    b-alert(variant="danger" v-if="error" show) {{ error }}
    b-form-group(
        label="Введите логин"
        )
        b-form-input(
            v-model="userLogin"
            type="text"
            placeholder="Ваш логин"
        )
    b-form-group(
        label="Введите пароль"
        )
        b-form-input(
            v-model="userPassword"
            type="password"
            placeholder="Ваш пароль"
        )
    b-button(type="submit") Авторизоваться
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    data() {
        return {
            userLogin: '',
            userPassword: '',
            success: false,
            error: '',
        }
    },
    methods: {
        ...mapActions('usersStore', ['getCurrentUser']),
        ...mapActions(['logIn']),
        signIn(e) {
            this.logIn({
                userLogin: this.userLogin,
                userPassword: this.userPassword,
            })
            .then(response => {
                this.success = true;
                this.error = '';
                this.getCurrentUser()
                .then(() => {
                    this.$router.push('edms');
                });
            }).catch(err => {
                this.success = false;
                this.error = err.message;
            })
        }
    }
}
</script>
