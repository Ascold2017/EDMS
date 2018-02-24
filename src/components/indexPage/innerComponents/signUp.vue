<template lang="pug">
b-form(@submit.prevent="registration")
    b-alert(varinat="success" v-if="success" show) Вы успешно зарегистрировались!
    b-alert(variant="danger" v-if="error" show) {{ error }}
    b-form-group(
        label="Введите логин"
        )
        b-form-input(
            v-model="userData.userLogin"
            type="text"
            placeholder="Ваш логин"
            )
    b-form-group(
        label="Введите пароль"
        )
        b-form-input(
            v-model="userData.userPassword"
            type="password"
            placeholder="Ваш пароль"
            )
    b-form-group(
        label="Введите личный код доступа"
        )
        b-form-input(
            v-model="userData.userInvite"
            type="password"
            placeholder="Ваш код доступа"
            )
    b-form-group(
        label="Введите код доступа группы"
        )
        b-form-input(
            v-model="userData.groupInvite"
            type="password"
            placeholder="код доступа группы"
            )
    b-form-group(
        label="Введите ваш email"
        )
        b-form-input(
            v-model="userData.userEmail"
            type="email"
            placeholder="Ваш email"
            )
    b-form-group(
        label="Введите ваше ФИО"
        )
        b-form-input(
            v-model="userData.userAuthor"
            type="text"
            placeholder="Ваше ФИО"
            )
    b-button(type="submit") Зарегистрироваться
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    data() {
        return {
            userData: {
                userLogin: '',
                userPassword: '',
                groupInvite: '',
                userInvite: '',
                userEmail: '',
                userAuthor: '',
            },
            success: false,
            error: '',
        }
    },
    methods: {
        ...mapActions(['signUp']),
        registration(e) {
            this.signUp({ ...this.userData })
            .then(response => {
                this.success = true;
                this.error = '';
                setTimeout(() => {
                    this.$router.push('/');
                }, 1000);
            })
            .catch(err => {
                this.success = false;
                this.error = err.message;
            })
        }
    }
}
</script>
