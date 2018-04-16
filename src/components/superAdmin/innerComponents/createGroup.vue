<template lang='pug'>
  v-form(v-model='valid')
    v-subheader.headline Створити нову групу
    v-text-field(
      type='text'
      v-model='groupName'
      required
      :rules='rules'
      label='Введіть назву групи'
      placeholder='Назва групи')

    v-text-field(
      type='email'
      v-model='adminEmail'
      placeholder='example@gmail.com'
      label='E-mail адміністратора групи'
      description='Увага! На цей адрес будуть відіслані дані фвторизації!'
      required
      :rules='rules')

    v-btn(@click.prevent='createGroup' color='primary' :disabled='!valid') Створити групу

    v-dialog(v-model='showAlert')
      v-card
        v-card-title
          v-subheader.headline Перевірте дані!
        v-card-text
          v-text-field(
            v-model='groupName'
            label='Назва группи'
            readonly)
          v-text-field(
            v-model='adminEmail'
            readonly
            label='Email адміністратора'
            description='На цю пошту будуть відіслані логін та пароль')
        v-card-actions
          v-btn(@click='submitForm' color='primary') Відправити

</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      groupName: '',
      adminEmail: '',
      info: '',
      valid: false,
      rules: [ v => !!v || 'Поле обовʼязкове!' ],
      showAlert: false
    }
  },
  methods: {
    ...mapActions('groupsStore', ['createNewGroup']),
    createGroup () {
      this.showAlert = true
    },
    submitForm () {
      this.createNewGroup({ groupName: this.groupName, adminEmail: this.adminEmail })
        .then(response => {
          this.$refs.createGroupForm.reset()
          this.$emit('alert', response.message)
        })
        .catch(e => this.$emit('alert', e.message))
    }
  }
}
</script>
<style lang="sass" scoped>
.users-list
  max-height: 500px
  overflow-y: scroll
</style>
