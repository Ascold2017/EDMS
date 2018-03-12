<template lang='pug'>
    b-container
      section.admin
        h1.title.mb-3 Панель главного администратора EDMS
        b-tabs
          b-tab(title='Группы')
            create-group(@alert="openInfo").mt-3
          b-tab(title='Создать нового администратора')
            create-admin(@alert="openInfo").mt-3
          b-tab(title='Создать ключи')
            create-keys(@alert="openInfo").mt-3
      b-modal(ref='infoModal' title='Сообщение')
        | {{ info }}
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      userForMail: {
        token: '',
        login: '',
        email: ''
      },
      info: ''
    }
  },
  methods: {
    ...mapActions('groupsStore', ['getAllGroups']),
    ...mapActions('usersStore', ['sendMail']),
    openInfo (info) {
      this.info = info
      this.$refs.infoModal.show()
    },
    sendInvite (e) {
      this.userForMail.groupInvite = this.group.invite
      const modal = this.$refs.modalSend
      this.modalTitle = 'Письмо отправляется...'

      this.sendMail(this.userForMail).then(response => {
        if (response.result) {
          this.modalTitle = 'Письмо успешно отправлено!'
          setTimeout(() => {
            e.target.reset()
            modal.hide()
            this.modalTitle = 'Отправить доступы админу'
          }, 1500)
        } else {
          this.modalTitle = 'Произошла ошибка при отправке!'
        }
      })
    }
  },
  created () {
    this.getAllGroups()
  },
  components: {
    createGroup: require('./innerComponents/createGroup'),
    createAdmin: require('./innerComponents/createAdmin'),
    createKeys: require('./innerComponents/createKeys')
  }
}
</script>
<style lang='sass' scoped>
.admin
    padding: 40px 0
ol
    list-style: inside
</style>
