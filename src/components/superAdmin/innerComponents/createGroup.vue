<template lang='pug'>
  b-row
    b-col
      b-form(@submit.prevent='createGroup' ref='createGroupForm' class='mb-3')
        h2.subtitle.mb-2 Создать новую группу
        b-form-group(label='Введите название группы')
          b-form-input(
          type='text'
          v-model='groupName'
          required
          placeholder='Введите название группы')
        b-form-group(
          label='e-mail администратора группы'
          description='Внимание! На этот адрес будут высланы данные авторизации!')
          b-form-input(
            type='email'
            v-model='adminEmail'
            placeholder='example@gmail.com'
            required)
        b-button(type='submit' variant='primary') Создать группу

    b-modal(
      ref='alertModal'
      title='Внимание!'
      @ok='submitForm')
      h3 Проверьте данные!
      b-form-group(label='Название группы')
        b-form-input(
          v-model='groupName'
          readonly)
      b-form-group(
        label='Email админстратора'
        description='На эту почту будут высланы логин и пароль')
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
