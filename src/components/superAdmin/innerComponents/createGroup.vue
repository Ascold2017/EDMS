<template lang='pug'>
  b-row
    b-col
      b-form(@submit.prevent='createGroup' ref='createGroupForm' class='mb-3')
        h2.subtitle.mb-2 Створити нову групу
        b-form-group(label='Введіть назву групи')
          b-form-input(
          type='text'
          v-model='groupName'
          required
          placeholder='Назва групи')
        b-form-group(
          label='E-mail адміністратора групи'
          description='Увага! На цей адрес будуть відіслані дані фвторизації!')
          b-form-input(
            type='email'
            v-model='adminEmail'
            placeholder='example@gmail.com'
            required)
        b-button(type='submit' variant='primary') Створити групу

    b-modal(
      ref='alertModal'
      title='Увага!'
      @ok='submitForm')
      h3 Проверьте данные!
      b-form-group(label='Назва группи')
        b-form-input(
          v-model='groupName'
          readonly)
      b-form-group(
        label='Email адміністратора'
        description='На цю пошту будуть відіслані логін та пароль')
        b-form-input(v-model='adminEmail')

</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      groupName: '',
      adminEmail: '',
      info: ''
    }
  },
  methods: {
    ...mapActions('groupsStore', ['createNewGroup']),
    createGroup () {
      this.$refs.alertModal.show()
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
