<template lang='pug'>
  b-container
    section.admin
      h1.title Панель администратора {{ group.name }}
      b-tabs.mt-3
        b-tab(title='Создать роль в группе')
          b-row
            b-col
              b-form(@submit.prevent='createUser' class='mb-3 mt-3')
                b-form-group(label='Введите название роли пользователя')
                  b-form-input(
                    type='text'
                    v-model='user.role'
                    required
                    placeholder='Роль')
                b-form-group(
                  label='Загрузить публичный ключ пользователя:'
                  description='Данные сертификата отобразятся после загрузки')
                  b-form-file(
                    accept='.key'
                    v-model='user.publicKey'
                    required
                    placeholder='Публичный ключ')

                b-form-group(
                  label='Введите email пользователя'
                  description='На него отправится уведомление')
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
          b-form-group(label='Выбрать промежуток среза статистики').mt-3
              b-button(type='button' @click='showCalendar = !showCalendar') Открыть календарь
          h4 Статистика за {{ title }}
          p Создано документов за период: {{ docsCreated}}
          p Подписано документов за период: {{ docsSigned }}
          p Отказано документов за период: {{ docsRejected }}
          p Среднее время между созданием и финальным подписанием документ: {{ docsTimingResolve }}
          p Среднее время одной подписи: {{ docsTimingSign }}
          h4 Статистика по ролям:
          b-table(
            striped
            bordered
            hover
            :fields='usersStat.fields'
            :items='usersStat.items'
            )
    b-modal(v-model='showCalendar' title='Выбрать промежуток среза статистики' hide-footer )
      date-range(
          class='calendar'
          :first-day-of-week='1'
          v-model='date'
          lang='ru')
      b-button(type='button' @click='submitStat') Получить статистику

</template>

<script>
import toDateString from '../modulesJs/toDateString'
import { DateRange } from 'vue-date-range'
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  data () {
    return {
      user: {
        role: '',
        email: '',
        login: '',
        publicKey: null
      },
      date: {
        startDate: null,
        endDate: null
      },
      loadedStat: false,
      showCalendar: false,
      title: 'все время'
    }
  },
  computed: {
    ...mapGetters('groupsStore', ['groups']),
    ...mapGetters('usersStore', ['currentUser']),
    ...mapGetters('statStore', [
      'docsCreated',
      'docsSigned',
      'docsRejected',
      'docsTimingSign',
      'docsTimingResolve',
      'usersStat'
    ]),
    users () {
      return this.groups[0].users
    },
    group () {
      return this.groups[0]
    }
  },
  methods: {
    ...mapActions('groupsStore', ['createNewUser', 'getCurrentGroup']),
    ...mapActions('statStore', ['getDocsStat']),
    ...mapMutations('statStore', ['setRange']),
    toDateString,
    createUser (e) {
      this.createNewUser({ ...this.user, group: this.group._id })
        .then(response => {
          e.target.reset()
          this.getCurrentGroup(this.group.groupInvite)
        })
        .catch(e => console.log(e))
    },
    submitStat () {
      const start = Date.parse(this.date.startDate._d)
      const end = Date.parse(this.date.endDate._d)
      this.title = `период с ${this.toDateString(start)} по ${this.toDateString(
        end
      )}`
      this.setRange({ start, end })
      this.showCalendar = false
    }
  },
  created () {
    this.getCurrentGroup()
    this.getDocsStat().then(response => {
      this.loadedStat = true
    })
  },
  components: {
    DateRange
  }
}
</script>
<style lang='sass' scoped>
.admin
    padding: 40px 0
.users-list
    max-height: 445px
    overflow-y: scroll
    overflow-x: hidden
ol
    list-style: inside
</style>
