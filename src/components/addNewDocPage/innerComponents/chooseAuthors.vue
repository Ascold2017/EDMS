<template lang='pug'>
    b-card.mt-3
        b-form-group(
            label='Выстроить список виз:'
            label-for='authors')
            b-form-input(
                type='text'
                v-model='authorNameOrRole'
                placeholder='Начните поиск по ФИО или Роли')
        b-form-group(
            label='Или выберите готовый список:'
            )
            b-form-select(
                v-model='selectedPreset'
                :options='presetsOptions'
                )
        b-form-group(
            label='Список доступных ролей'
            label-for='authors')
            b-list-group(id='authors').authors-list
                b-list-group-item(
                    v-for='user in computedUsers'
                    :key='user.author'
                    @click='addAuthor(user)'
                    class='authors-list__item'
                    )
                    h3.subtitle.subtitle_small ФИО: {{ user.author }}
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
      // filtering selected users from result collection
      const filterSelected = users => {
        // if no selected users
        if (!this.selectedUsers.length) return users
        // filtering selected users
        return users.filter(resultItem => {
          let selectedUser = this.selectedUsers.find(
            selectedUser => selectedUser._id === resultItem._id
          )
          // if user is selected - filtering from collection
          if (!selectedUser) {
            return resultItem
          } else {
            return null
          }
        })
      }

      if (!this.authorNameOrRole) return filterSelected(this.users)
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
      return filterSelected(result)
    },
    presetsOptions () {
      let result = [{ value: [], text: 'Не выбрано' }]
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
