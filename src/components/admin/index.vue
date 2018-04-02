<template lang='pug'>
  b-container
    h1.title Панель адміністратора {{ group.name }}
    b-tabs.mt-3
      b-tab(title='Створити роль в групі')
        b-row
          b-col
            b-form(@submit.prevent='createUser' class='mb-3 mt-3')

              b-form-group(label='ПІБ власника')
                b-form-input(
                  type='text'
                  v-model='user.name'
                  placeholder='Фамілія, Иʼмя, По батькові'
                  required)

              b-form-group(label='Назва роли корстувача')
                b-form-input(
                  type='text'
                  v-model='user.role'
                  required
                  placeholder='Роль')

              b-form-group(label='Строк дії сертификата, діб')
                b-form-input(
                  type='number'
                  v-model='user.cerTime'
                  placeholder='0 - необмежено'
                  required)

              b-form-group(
                label='Введіть Уmail корстувача'
                description='Увага! На нього відправиться повідомлення та ключі цфрового підпису!')
                b-form-input(
                  type='email'
                  v-model='user.email'
                  required
                  placeholder='example@mail.ua')

              b-button(type='submit') Створити
          b-col.mt-3
              h2.subtitle Пользователи группы {{ group.name }}
              b-list-group.users-list
                b-list-group-item(v-for='сurrUser in users' :key='сurrUser._id')
                  h4 {{ сurrUser.author }}
                  p.mb-0 Роль: {{ сurrUser.role }}
                  p.mb-0 Зареєстрован: {{ toDateString(+сurrUser.dateRegistration) }}

      b-tab(title='Статистика групи')
        users-stat

    b-modal(ref='infoModal' title='Повідомлення')
      | {{ info }}
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
      info: ''
    }
  },
  computed: {
    ...mapGetters('groupsStore', ['groups']),
    ...mapGetters('usersStore', ['currentUser']),
    users () {
      return this.groups[0].users
    },
    group () {
      return this.groups[0]
    }
  },
  methods: {
    ...mapActions('groupsStore', ['createNewUser', 'getCurrentGroup']),
    ...mapActions('usersStore', ['createKeys']),
    toDateString,
    createUser (e) {
      this.createNewUser({ ...this.user, group: this.group._id })
        .then(response => {
          e.target.reset()
          this.info = response.message
          this.$refs.infoModal.show()
        })
        .catch(e => {
          this.info = e.message
          this.$refs.infoModal.show()
        })
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
</style>
