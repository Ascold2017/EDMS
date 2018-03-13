<template lang='pug'>
  b-row
    b-col
      h2.subtitle.mb-2 Список групп
          b-tabs(vertical card pills).users-list
            b-tab(v-for='group in groups' :key='group._id' :title='group.name + " Пользователей: " + group.users.length')
              b-list-group
                b-list-group-item(
                  v-for='user in group.users'
                  :key='user._id'
                  )
                  h4 {{ user.author ? user.author : 'Не зарегистрирован' }}
                  p.small Роль: {{ user.role ? user.role : 'Не зарегистрирован' }}
                  p.small Дата регистрации: {{ toDateString(+user.dateRegistration) }}
                  p.small Email: {{ user.email }}
                  p.small Login: {{ user.login }}
                  b-button-group(v-if='user.role === "Admin"')
                    b-button(@click='openSendModal(user._id, user.email)' variant='secondary') Отправить доступ повторно
                    b-button(@click='deleteAdmin(user._id, group._id)' variant='warning') Удалить администратора
    b-modal(
      ref='sendModal'
      title='Укажите почту, на которую отправится доступ'
      @ok='submitSend')
      b-form-group(label='Email администратора')
        b-form-input(type='email' v-model='admin.email')
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import toDateString from '../../modulesJs/toDateString'
export default {
  data () {
    return {
      admin: {
        email: '',
        adminId: ''
      }
    }
  },
  computed: {
    ...mapGetters('groupsStore', ['groups'])
  },
  methods: {
    ...mapActions('groupsStore',
      [
        'getAllGroups',
        'removeAdmin',
        'sendInviteAdmin'
      ]),
    toDateString,
    deleteAdmin (adminId, groupId) {
      this.removeAdmin({ adminId, groupId })
    },
    openSendModal (adminId, adminEmail) {
      this.admin = {
        email: adminEmail,
        adminId
      }
      this.$refs.sendModal.show()
    },
    submitSend () {
      console.log(this.admin)
      this.sendInviteAdmin(this.admin)
        .then(response => { console.log(response); this.$emit('alert', response.message) })
        .catch(e => this.$emit('alert', e.message))
    }
  },
  created () {
    this.getAllGroups()
  }
}
</script>
