<template lang='pug'>
  b-row
    b-col
      b-form(@submit.prevent='createAdmin' ref='createAdminForm')
          h2.subtitle Создать администратора группы
          b-form-group(
            label='Выберите группу:'
            description='Группа, для которой создать администратора')
            b-form-select(
              v-model='selectedGroup'
              :options='groupsOptions'
              class='mb-3')
          b-form-group(
            label='Сгенерировать логин админа:'
            description='Логин сгенерируется автоматически')
            b-form-input(
              type='text'
              v-model='admin.login'
              required
              placeholder='Логин администратора')
            b-button(type='button' @click='admin.login = generateInvite()' class='mt-3') Сгенерировать
          b-form-group(
            label='e-mail администратора группы'
            description='Внимание! На этот адрес будут высланы данные авторизации!')
            b-form-input(
              type='email'
              v-model='admin.email'
              placeholder='example@gmail.com'
              required)

          b-button(type='submit' variant='primary') Создать администратора
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import randomizer from '../../modulesJs/randomizer'
export default {
  data () {
    return {
      admin: {
        invite: '',
        login: '',
        email: ''
      },
      selectedGroup: ''
    }
  },
  methods: {
    ...mapActions('groupsStore', ['createNewAdmin']),
    generateInvite () {
      return randomizer(5)
    },
    createAdmin () {
      this.createAdmin({ ...this.admin })
        .then(response => {
          this.$refs.createAdminForm.reset()
          this.$emit('alert', response)
        })
        .catch(e => {
          this.$emit('alert', e.message)
        })
    }
  },
  computed: {
    ...mapGetters('groupsStore', ['groups']),
    groupsOptions () {
      const resultOptions = [{ value: '', text: 'Не выбрано' }]
      for (let group of this.groups) {
        resultOptions.push({ value: group._id, text: group.name })
      }
      return resultOptions
    }
  }
}
</script>
