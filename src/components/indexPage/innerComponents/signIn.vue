<template lang='pug'>
v-tabs(app)
  v-tab Як користувач
  v-tab-item
    v-card
      v-card-text
        v-alert(type='success' v-if='success' :value='true') Ви успішно авторизувались!
        v-alert(type='error' v-if='error' :value='true') {{ error }}
        v-form(v-model='validUser')
          v-text-field(
            prepend-icon='person'
            v-model='userLogin'
            label='Ваш логін'
            :rules='rules'
            required)
          file-input(
            @file="privateKeyFile = $event"
            label='Завантажити приватний ключ'
            :required='true'
            accept='.key')
          v-text-field(
            prepend-icon='lock'
            v-model='passphrase'
            type='password'
            label='Парольна фраза ключа'
            :rules='rules'
            required)
      v-card-actions
        v-spacer
        v-btn(@click.prevent='signIn' :disabled='!validUser' color='primary') Авторизуватись
  v-tab Як адміністратор
  v-tab-item
    v-card
      v-card-text
        v-alert(type='success' v-if='success' :value='true') Ви успішно авторизувались!
        v-alert(type='error' v-if='error' :value='true') {{ error }}
        v-form(v-model='validAdmin')
          v-text-field(
            prepend-icon='person'
            v-model='userLogin'
            type='text'
            label='Ваш логін'
            :rules='rules'
            required)
          v-text-field(
            prepend-icon='lock'
            v-model='userPassword'
            type='password'
            label='Ваш пароль'
            :rules='rules'
            required)
      v-card-actions
        v-spacer
        v-btn(@click.prevent='signInAdmin' :disabled='!validAdmin' color='primary') Авторизуватись
</template>

<script>
import { mapActions } from 'vuex'
import fileInput from '../../_common/fileInput'
export default {
  components: {
    fileInput
  },
  data () {
    return {
      userLogin: '',
      userPassword: '',
      passphrase: '',
      privateKeyFile: null,
      success: false,
      error: '',
      validUser: false,
      validAdmin: false,
      rules: [ v => !!v || 'Обовʼязкове поле!' ]
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
