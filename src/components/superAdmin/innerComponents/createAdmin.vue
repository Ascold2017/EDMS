<template lang='pug'>
  v-form(v-model='valid')
    v-subheader.headline Створити адміністратора групи
    v-select(
      v-model='admin.groupId'
      :items='groupsOptions'
      label='Виберіть групу:'
      description='Група, для якої створиться адміністратор'
      required)
    v-text-field(
      type='email'
      v-model='admin.email'
      placeholder='example@gmail.com'
      label='Е-mail адміністратора групи'
      description='Увага! На цей адрес будуть відіслані данні авторизації!'
      required
      :rules='rules')

    v-btn(@click.prevent='createAdmin' color='primary' :disabled='!valid') Створити адміністратора
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      admin: {
        email: '',
        groupId: ''
      },
      valid: false,
      rules: [ v => !!v || 'Поле обовʼязкове!' ]
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
