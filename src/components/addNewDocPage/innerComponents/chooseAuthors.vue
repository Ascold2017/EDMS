<template lang='pug'>
  v-card.px-3.py-3
    v-subheader Виставити список віз:
    v-text-field(
      type='text'
      v-model='authorNameOrRole'
      placeholder='Почніть пошук за ПІБ або Роллю')
    v-subheader Або оберіть готовий список:
    v-select(
      v-model='selectedPreset'
      :items='presetsOptions')
    v-subheader Список доступних ролей
    div.authors-list
      template(
        v-for='user in computedUsers')
        v-card(@click.native='addAuthor(user)').px-2.py-2
          h3 ПІБ: {{ user.author }}
          p.mb-0 Роль: {{ user.role }}
        v-divider
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      authorNameOrRole: '',
      selectedPreset: []
    }
  },
  props: {
    selectedUsers: Array
  },
  computed: {
    ...mapGetters('usersStore', ['users']),
    ...mapGetters('docsStore', ['presets']),
    computedUsers () {
      if (!this.authorNameOrRole) return this.filterSelected(this.users)
      // live search by author or role
      let result = this.users.filter(user => {
        // are exist author with input name
        let existByName =
          user.author
            .toLowerCase()
            .indexOf(this.authorNameOrRole.toLowerCase()) !== -1
        // are exist author with input role
        let existByRole =
          user.role
            .toLowerCase()
            .indexOf(this.authorNameOrRole.toLowerCase()) !== -1
        // if exist author with search name or role
        if (existByName || existByRole) return user
        return null
      })
      // filtering selected users from collection
      return this.filterSelected(result)
    },
    presetsOptions () {
      let result = [{ value: [], text: 'Не обрано' }]
      for (let preset of this.presets) {
        result.push({ value: preset.routes, text: preset.title })
      }
      return result
    }
  },
  methods: {
    ...mapActions('docsStore', ['getPresets']),
    addAuthor (user) {
      if (!this.selectedUsers.length) {
        user.canSee = 'yes'
      } else {
        user.canSee = 'no'
      }
      user.status = 'waiting'
      this.selectedUsers.push({ ...user })
      this.$emit('updateSelectedUsers', this.selectedUsers)
    },
    filterSelected  (users) {
      // filtering selected users from result collection
      // if no selected users
      if (!this.selectedUsers.length) return users
      // filtering selected users
      return users.filter(resultItem => {
        let selectedUser = this.selectedUsers.find(
          selectedUser => selectedUser._id === resultItem._id
        )
        // if user is selected - filtering from collection
        return !selectedUser
      })
    }
  },
  watch: {
    selectedPreset () {
      this.$emit('updateSelectedUsers', this.selectedPreset)
    }
  },
  created () {
    this.getPresets()
  }
}
</script>
<style lang='sass' scoped>
.authors-list
  max-height: 335px
  height: 100%
  overflow-y: scroll
  overflow-x: hidden
  &__top
    display: flex
    justify-content: space-between
  &__item
    cursor: pointer
    &:hover
      background-color: #cccccc
</style>
