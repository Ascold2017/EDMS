<template lang='pug'>
  b-row
    b-col
      b-form(@submit.prevent='createAdmin' ref='createAdminForm')
          h2.subtitle Створити адміністратора групи
          b-form-group(
            label='Виберіть групу:'
            description='Група, для якої створиться адміністратор')
            b-form-select(
              v-model='admin.groupId'
              :options='groupsOptions'
              class='mb-3')
          b-form-group(
            label='Е-mail адміністратора групи'
            description='Увага! На цей адрес будуть відіслані данні авторизації!')
            b-form-input(
              type='email'
              v-model='admin.email'
              placeholder='example@gmail.com'
              required)

          b-button(type='submit' variant='primary') Створити адміністратора
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      admin: {
        email: '',
        groupId: ''
      }
    }
  },
  methods: {
    ...mapActions('groupsStore', ['createNewAdmin']),
    createAdmin () {
      this.createNewAdmin({ ...this.admin })
        .then(response => {
          this.$refs.createAdminForm.reset()
          this.$emit('alert', response.message)
        })
        .catch(e => {
          this.$emit('alert', e.message)
        })
    }
  },
  computed: {
    ...mapGetters('groupsStore', ['groups']),
    groupsOptions () {
      const resultOptions = [{ value: '', text: 'Не обрано' }]
      for (let group of this.groups) {
        resultOptions.push({ value: group._id, text: group.name })
      }
      return resultOptions
    }
  }
}
</script>
