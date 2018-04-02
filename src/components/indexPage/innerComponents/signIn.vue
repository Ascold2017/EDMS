<template lang='pug'>
b-tabs
  b-tab(title='Як користувач')
    b-form(@submit.prevent='signIn').mt-3
      b-alert(varinat='success' v-if='success' show) Вы успешно авторизовались!
      b-alert(variant='danger' v-if='error' show) {{ error }}
      b-form-group(label='Ваш логін EDMS')
        b-form-input(
          v-model='userLogin'
          placeholder='Логін'
          required)
      b-form-group(label='Завантажити приватний ключ')
        b-form-file(
          required
          v-model='privateKeyFile'
          accept='.key'
          placeholder='Файл приватного ключа')
      b-form-group(label='Введіть парольну фразу')
        b-form-input(
          v-model='passphrase'
          type='password'
          placeholder='Парольна фраза ключа'
          required
          )
      b-button(type='submit') Авторизуватись
  b-tab(title='Як адміністратор')
    b-form(@submit.prevent='signInAdmin').mt-3
      b-alert(varinat='success' v-if='success' show) Ви успішно авторизувались!
      b-alert(variant='danger' v-if='error' show) {{ error }}
      b-form-group(label='Введите логин')
        b-form-input(
          v-model='userLogin'
          type='text'
          placeholder='Ваш логін'
          required)

      b-form-group(label='Введіть пароль')
        b-form-input(
          v-model='userPassword'
          type='password'
          placeholder='Ваш пароль'
          required
          )
      b-button(type='submit') Авторизуватись
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      userLogin: '',
      userPassword: '',
      passphrase: '',
      privateKeyFile: null,
      success: false,
      error: ''
    }
  },
  methods: {
    ...mapActions('usersStore', ['getCurrentUser']),
    ...mapActions(['logIn', 'logInAdmin']),
    signIn (e) {
      this.logIn({
        login: this.userLogin,
        passphrase: this.passphrase,
        privateKeyFile: this.privateKeyFile
      })
        .then(() => {
          this.success = true
          this.error = ''
          this.$router.push('edms')
        })
        .catch(err => {
          this.success = false
          this.error = err.message
        })
    },
    signInAdmin (e) {
      this.logInAdmin({
        userLogin: this.userLogin,
        userPassword: this.userPassword
      })
        .then(() => {
          this.success = true
          this.error = ''
          this.getCurrentUser()
            .then(() => {
              this.$router.push('edms/admin')
            })
        })
        .catch(err => {
          this.success = false
          this.error = err.message
        })
    }
  }
}
</script>
