<template lang="pug">
b-container
    b-row(align-h="center" align-v="center")
        b-col(sm="10" md="8" lg="4")
            b-card(
                title="Войти"
            )
                b-form(@submit.prevent="signIn")
                    b-alert(varinat="success" v-if="success" show) Вы успешно авторизовались!
                    b-alert(variant="danger" v-if="error" show) {{ error }}
                    b-form-group(
                        label="Введите логин"
                        )
                        b-form-input(
                            v-model="userLogin"
                            type="text"
                            plaheholder="Ваш логин"
                        )
                    b-form-group(
                        label="Введите логин"
                        )
                        b-form-input(
                            v-model="userPassword"
                            type="password"
                            plaheholder="Ваш пароль"
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
                console.log(response);
                this.success = true;
                this.error = '';
                this.getCurrentUser()
                .then(() => {
                    this.$router.push('edms');
                });
            }).catch(err => {
                console.log(err);
                this.success = false;
                this.error = err.message;
            })
        }
    }
}
</script>
