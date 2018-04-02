<template lang='pug'>
  b-card.mt-3
    b-form-group(label='Виставити список віз:')
      b-form-input(
        type='text'
        v-model='authorNameOrRole'
        placeholder='Почніть пошук за ПІБ або Роллю')
    b-form-group(label='Або оберіть готовий список:')
      b-form-select(
        v-model='selectedPreset'
        :options='presetsOptions')
    b-form-group(label='Список доступних ролей')
      b-list-group(id='authors').authors-list
        b-list-group-item(
          v-for='user in computedUsers'
          :key='user.author'
          @click='addAuthor(user)'
          class='authors-list__item')
          h3.subtitle.subtitle_small ПІБ: {{ user.author }}
          p.subtitle.subtitle_small Роль: {{ user.role }}
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
