<template lang='pug'>
  b-row
    b-col
      h3 Создать новый сертификат
      b-form(@submit.prevent='submitCert')
        b-form-group(label='Найти пользователя EDMS')
          b-form-input(v-model='search' placeholder='Найти')
        b-list-group.users-list
          b-list-group-item(
            v-for='user in allUsers'
            :key='user._id'
            )
            b-row(align-h='between')
              b-col
                small.block {{ user.author }}
              b-col
                b-button( @click="chooseUser(user)") Выбрать
        b-form-group(label='ФИО владельца')
          b-form-input(type='text' v-model='cert.name' required readonly)
        b-form-group(label='E-Mail владельца')
          b-form-input(type='email' v-model='cert.email' required)
        b-form-group(label='Срок действия сертификата, суток')
          b-form-input(type='number' v-model='cert.time' required)
        b-button(type='submit') Создать сертификат
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      cert: {
        name: '',
        email: '',
        time: ''
      },
      userId: '',
      search: ''
    }
  },
  computed: {
    ...mapGetters('groupsStore', ['groups']),
    allUsers () {
      let result = []
      for (let group of this.groups) {
        console.log('Group: ', group.users)
        result = result.concat(group.users)
      }
      result = result.filter(user => {
        return user.role !== 'Admin' && user.role !== 'superAdmin' && !user.publicKey
      })
      console.log('Result: ', result)
      return result
    }
  },
  methods: {
    ...mapActions('usersStore', ['createKeys']),
    submitCert (e) {
      this.createKeys({ cert: this.cert, userId: this.userId })
        .then(response => {
          this.$emit('alert', response.message)
          e.target.reset()
        })
        .catch(e => this.$emit('alert', e.message))
    },
    chooseUser (user) {
      this.userId = user._id
      this.cert.name = user.author
      this.cert.email = user.email
    }
  }
}
</script>
<style lang="sass" scoped>
.users-list
  max-height: 150px
  overflow-y: scroll
</style>
