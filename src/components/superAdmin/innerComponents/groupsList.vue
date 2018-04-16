<template lang='pug'>
  div
    v-subheader.headline Список груп
    v-tabs(dark)
      v-tab(v-for='group,i in groups' :key='i') {{ group.name + " Користувачів: " + group.users.length }}
      v-tab-item(v-for='group,i in groups' :key='i')
        template(v-for='user in group.users')
          v-card
            v-card-title
              v-subheader {{ user.author ? user.author : 'Не зареєстрован' }}
            v-card-text
              p.mb-0 Роль: {{ user.role ? user.role : 'Не зареєстрован' }}
              p.mb-0 Дата рeєстрації: {{ toDateString(+user.dateRegistration) }}
              p.mb-0 Email: {{ user.email }}
              p.mb-0 Логін: {{ user.login }}

            v-card-actions(v-if='user.role === "Admin"')
              v-btn(@click='openSendModal(user._id, user.email)' color='primary') Відправити доступи ща раз
              v-btn(@click='deleteAdmin(user._id, group._id)' color='error') Видалити адміністратора
          v-divider
    v-dialog(v-model='sendModal')
      v-card
        v-card-title
          v-subheader Вкажіть почту, на яку відправиться доступ
        v-card-text
          v-text-field(type='email' v-model='admin.email' label='Email адміністратора')
        v-card-actions
          v-btn(@click.prevent='submitSend' color='primary') Відправити

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
      },
      sendModal: false
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
      this.sendModal = true
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
