<template lang='pug'>
    b-card
      b-form-group(label='Створити новий список віз')
        b-btn(type='button' @click='showEditor') Відкрити редактор
      b-modal(ref='routesEditor' title='Створити новий маршрут' hide-footer)
        b-form(@submit.prevent.stop='createNewPreset')
          b-form-group(label='Введіть названу Списку')
            b-form-input(
              id='presetname'
              type='text'
              v-model='presetName'
              required
              placeholder='Введіть назву списку')
          choose-authors(
            @updateSelectedUsers='updatePresetRoute'
            :selectedUsers='selectedUsers')
          authors-list(:selectedUsers='selectedUsers' @updateSelectedUser='updatePresetRoute')
          b-btn(type='submit') Создать Маршрут
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      selectedUsers: [],
      presetName: ''
    }
  },
  computed: mapGetters('usersStore', ['currentUser']),
  methods: {
    ...mapActions('docsStore', ['createPreset', 'getPresets']),
    showEditor () {
      this.$refs.routesEditor.show()
    },
    updatePresetRoute (selectedUsers) {
      this.selectedUsers = selectedUsers
    },
    createNewPreset (e) {
      const newPreset = {
        title: this.presetName,
        routes: this.selectedUsers,
        group: this.currentUser.groupInvite
      }
      this.createPreset(newPreset)
        .then(response => {
          e.target.reset()
          this.selectedUsers = []
          this.$refs.routesEditor.hide()
          this.getPresets()
        })
    }
  },
  components: {
    chooseAuthors: require('./chooseAuthors'),
    authorsList: require('./authorsList')
  }
}
</script>
