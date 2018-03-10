<template lang='pug'>
    b-container
        section.admin
            h1.title.mb-3 Панель главного администратора EDMS
            b-row
                b-col
                    b-form(@submit.prevent='createGroup' class='mb-3')
                        h2.subtitle.mb-2 Создать новую группу
                        b-form-group(
                            description='Введите название группы')
                            b-form-input(
                            type='text'
                            v-model='group.name'
                            required
                            placeholder='Введите название группы')
                        b-form-group(
                            label='Сгенерировать инвайт-код группы:'
                            description='Код сгенерируется автоматически')
                            b-form-input(
                            type='text'
                            v-model='group.invite'
                            required
                            placeholder='Код группы')
                            b-button(type='button' @click='group.invite = generateInvite()' class='mt-3') Сгенерировать

                        b-form-group(
                            label='Сгенерировать инвайт-код админа:'
                            description='Код сгенерируется автоматически')
                            b-form-input(
                                type='text'
                                v-model='group.adminInvite'
                                required
                                placeholder='Код администратора')
                            b-button(type='button' @click='group.adminInvite = generateInvite()' class='mt-3') Сгенерировать
                        b-form-group(
                            label='Сгенерировать логин админа:'
                            description='Логин сгенерируется автоматически')
                            b-form-input(
                                type='text'
                                v-model='group.adminLogin'
                                required
                                placeholder='Логин администратора')
                            b-button(type='button' @click='group.adminLogin = generateInvite()' class='mt-3') Сгенерировать

                        b-button(type='submit' variant='primary') Создать группу

                b-col
                    h2.subtitle.mb-2 Список групп
                    b-alert(v-if='!groups.length' variant='warning' show) Групп пока нет...
                    b-list-group(v-else)
                        b-list-group-item(v-for='group in groups' :key='group._id')
                            h3 {{ group.name }}
                            h4 Пользователи: {{ group.users.length }}
                            b-list-group
                                b-alert(v-if='!group.users.length' variant='warning' show) Пользователей пока нет
                                b-list-group-item(
                                    v-for='user in group.users'
                                    :key='user._id'
                                    v-else)
                                    b-btn(v-if='user.role === "Admin" && !user.author' @click='openSendModal(user, group)') Отправить доступ
                                    h4 {{ user.author ? user.author : 'Не зарегистрирован' }}
                                    small Роль: {{ user.role ? user.role : 'Не зарегистрирован' }}
            b-row
                b-col
                    b-form(@submit.prevent='createAdmin' v-if='groupsOptions.length')
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
                            label='Сгенерировать инвайт-код админа:'
                            description='Код сгенерируется автоматически')
                            b-form-input(
                                type='text'
                                v-model='admin.invite'
                                required
                                placeholder='Код администратора'
                                readonly)
                            b-button(type='button' @click='admin.invite = generateInvite()' class='mt-3') Сгенерировать

                        b-button(type='submit' variant='primary') Создать админа

            b-modal(ref='modalSend' :title='modalTitle' hide-footer)
                b-form(@submit.prevent='sendInvite')

                    b-form-group(label='Логин:')
                        b-form-input(
                            type='text'
                            v-model='userForMail.login'
                            readonly)

                    b-form-group(label='Инвайт-код:')
                        b-form-input(
                            type='text'
                            v-model='userForMail.token'
                            readonly)

                    b-form-group(label='Почта:' description='На эту почту отправится доступ! Будьте внимательны!')
                        b-form-input(type='email' v-model='userForMail.email' required)

                    b-button(type='submit') Отправить

</template>
<script>
import randomizer from '../modulesJs/randomizer'
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      group: {
        name: '',
        invite: '',
        adminInvite: '',
        adminLogin: ''
      },
      admin: {
        invite: '',
        login: ''
      },
      selectedGroup: '',
      userForMail: {
        token: '',
        login: '',
        email: ''
      },
      modalTitle: 'Отправить доступы админу'
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
  },
  methods: {
    ...mapActions('groupsStore', [
      'getAllGroups',
      'createNewGroup',
      'createNewAdmin'
    ]),
    ...mapActions('usersStore', ['sendMail']),
    generateInvite () {
      return randomizer(5)
    },
    createGroup (e) {
      this.createNewGroup(this.group).then(response => {
        e.target.reset()
        this.getAllGroups()
      })
    },
    createAdmin (e) {
      this.createNewAdmin({
        invite: this.admin.invite,
        group: this.selectedGroup,
        role: 'Admin'
      }).then(response => {
        e.target.reset()
        this.getAllGroups()
      })
    },
    openSendModal (user, group) {
      this.userForMail = {
        ...user,
        subject: `Доступ 'Админ' для группы ${group.name}`
      }
      this.$refs.modalSend.show()
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
  }
}
</script>
<style lang='sass' scoped>
.admin
    padding: 40px 0
ol
    list-style: inside
</style>
