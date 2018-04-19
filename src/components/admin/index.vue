<template lang='pug'>
  v-container(fluid app grid-list-md).bg-simple
    v-subheader.headline Панель адміністратора {{ currentGroup.name }}
    div(v-if='showBlank === "createUser" || showBlank === ""')
      v-subheader.headline Створити роль в групі
      v-layout(row wrap)
        v-flex(xs12 lg6)
          v-card.px-3.py-3.mt-2
            v-form(ref='adminForm' v-model='valid')

              v-text-field(
                type='text'
                v-model='user.name'
                label='ПІБ власника'
                placeholder='Фамілія, Иʼмя, По батькові'
                required
                :rules='rules')

              v-text-field(
                type='text'
                v-model='user.role'
                required
                :rules='rules'
                label='Назва роли корстувача'
                placeholder='Роль')

              v-text-field(
                  type='number'
                  v-model='user.cerTime'
                  label='Строк дії сертификата, діб'
                  placeholder='0 - необмежено'
                  :rules='rules'
                  required)

              v-text-field(
                  type='email'
                  v-model='user.email'
                  required
                  label='Введіть Еmail користувача'
                  description='Увага! На нього відправиться повідомлення та ключі цфрового підпису!'
                  :rules='rules'
                  placeholder='example@mail.ua')

              v-btn(@click.prevent='createUser' color='primary' :disabled='!valid') Створити
        v-flex(xs12 lg6)
          v-card.px-3.py-3.mt-2
            v-subheader.headline Користувачі групи: {{ currentGroup.name }}
            div.users-list
              template(v-for='сurrUser in currentGroup.users')
                v-card.px-3
                  v-subheader {{ сurrUser.author }}
                  p.mb-0 Роль: {{ сurrUser.role }}
                  p.mb-0 Зареєстрован: {{ toDateString(+сurrUser.dateRegistration) }}
                v-divider

    div(v-if='showBlank === "usersStats"')
      v-subheader.headline Статистика групи
      users-stat

    v-snackbar(v-model='showAlert' top right)
      | {{ info }}
      v-btn(flat @click.native='showAlert = false' color='pink') Закрити
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import toDateString from '../modulesJs/toDateString'
export default {
  data () {
    return {
      user: {
        role: '',
        email: '',
        login: '',
        name: '',
        certTime: 0
      },
      info: '',
      showAlert: false,
      valid: false,
      rules: [ v => !!v || 'Поле обовʼязкове!' ],
      showBlank: ''
    }
  },
  computed: {
    ...mapGetters('groupsStore', ['currentGroup']),
    ...mapGetters('usersStore', ['currentUser'])
  },
  methods: {
    ...mapActions('groupsStore', ['createNewUser', 'getCurrentGroup']),
    toDateString,
    createUser (e) {
      this.createNewUser({ ...this.user, group: this.currentGroup._id })
        .then(response => {
          this.$refs.adminForm.reset()
          this.info = response.message
          this.showAlert = true
        })
        .catch(e => {
          this.info = e.message
          this.showAlert = true
        })
    }
  },
  watch: {
    '$route': function () {
      this.showBlank = this.$route.params.blank
    }
  },
  components: {
    usersStat: require('./usersStat')
  }
}
</script>
<style lang='sass' scoped>
.admin
  padding: 40px 0
.users-list
  height: 297px
  overflow-y: scroll
</style>
