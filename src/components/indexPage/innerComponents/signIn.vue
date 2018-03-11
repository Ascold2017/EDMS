<template lang='pug'>
b-form(@submit.prevent='signIn')
  b-alert(varinat='success' v-if='success' show) Вы успешно авторизовались!
  b-alert(variant='danger' v-if='error' show) {{ error }}
  b-form-group(
    label='Введите логин'
    )
    b-form-input(
      v-model='userLogin'
      type='text'
      placeholder='Ваш логин'
      required
      )
  b-form-group(label='Загрузите приватный ключ')
    b-form-file(
      required
      v-model='privateKeyFile'
      accept='.key'
      placeholder='Файл приватного ключа')
  b-form-group(label='Введите парольную фразу')
    b-form-input(
      v-model='passphrase'
      type='password'
      placeholder='Парольная фраза ключа'
      required
      )
  b-button(type='submit') Авторизоваться
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      userLogin: '',
      passphrase: '',
      privateKeyFile: null,
      success: false,
      error: ''
    }
  },
  methods: {
    ...mapActions('usersStore', ['getCurrentUser']),
    ...mapActions(['logIn']),
    signIn (e) {
      this.logIn({
        userLogin: this.userLogin,
        passphrase: this.passphrase,
        privateKeyFile: this.privateKeyFile
      })
        .then(() => {
          this.success = true
          this.error = ''
          this.getCurrentUser()
            .then(() => {
              this.$router.push('edms')
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
