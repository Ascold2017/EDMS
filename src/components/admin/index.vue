<template lang='pug'>
  b-container
    section.admin
      h1.title Панель администратора {{ group.name }}
      b-tabs.mt-3
        b-tab(title='Создать роль в группе')
          b-row
            b-col
              b-form(@submit.prevent='createUser' class='mb-3 mt-3')

                b-form-group(label='ФИО владельца')
                  b-form-input(
                    type='text'
                    v-model='user.name'
                    placeholder='Фамилия Имя Отчество'
                    required)

                b-form-group(label='Название роли пользователя')
                  b-form-input(
                    type='text'
                    v-model='user.role'
                    required
                    placeholder='Роль')

                b-form-group(label='Срок действия сертификата, суток')
                  b-form-input(
                    type='number'
                    v-model='user.cerTime'
                    placeholder='0 - неограничено'
                    required)

                b-form-group(
                  label='Введите email пользователя'
                  description='На него отправится уведомление и ключи подписи!')
                  b-form-input(
                    type='email'
                    v-model='user.email'
                    required
                    placeholder='example@mail.ua')

                b-button(type='submit') Создать
            b-col.mt-3
                h2.subtitle Пользователи группы {{ group.name }}
                b-list-group.users-list
                  b-list-group-item(v-for='сurrUser in users' :key='сurrUser._id')
                    h4 {{ сurrUser.author }}
                    p Роль: {{ сurrUser.role }}
                    p(v-if='сurrUser.dateRegistration') Зарегистрирован: {{ toDateString(+сurrUser.dateRegistration) }}
        b-tab(title='Статистика группы')
          users-stat()

    b-modal(ref='infoModal' title='Сообщение')
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
          this.getCurrentGroup(this.group.groupInvite)
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
