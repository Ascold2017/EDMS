<template lang='pug'>
  b-row
    b-col
      h2.subtitle.mb-2 Список груп
      b-tabs(vertical card pills).users-list
        b-tab(v-for='group in groups' :key='group._id' :title='group.name + " Користувачів: " + group.users.length')
          b-list-group
            b-list-group-item(
              v-for='user in group.users'
              :key='user._id'
              )
              h4 {{ user.author ? user.author : 'Не зареєстрован' }}
              p.mb-0 Роль: {{ user.role ? user.role : 'Не зареєстрован' }}
              p.mb-0 Дата рeєстрації: {{ toDateString(+user.dateRegistration) }}
              p.mb-0 Email: {{ user.email }}
              p.mb-0 Логін: {{ user.login }}
              b-button-group(v-if='user.role === "Admin"').mt-3
                b-button(@click='openSendModal(user._id, user.email)' variant='secondary') Відправити доступи ща раз
                b-button(@click='deleteAdmin(user._id, group._id)' variant='warning') Видалити адміністратора
    b-modal(
      ref='sendModal'
      title='Вкажіть почту, на яку відправиться доступ'
      @ok='submitSend')
      b-form-group(label='Email адміністратора')
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
      this.sendInviteAdmin(this.admin)
        .then(response => this.$emit('alert', response.message))
        .catch(e => this.$emit('alert', e.message))
    }
  },
  created () {
    this.getAllGroups()
  }
}
</script>
