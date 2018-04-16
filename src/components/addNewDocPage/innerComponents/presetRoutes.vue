<template lang='pug'>
  div
    v-card.px-3.py-3
      v-subheader Створити новий список віз
      v-btn(@click='showModal = true' color='secondary') Відкрити редактор
    v-dialog(ref='routesEditor' title='Створити новий маршрут' v-model='showModal')
      v-card.px-3.py-3
        v-form(v-model='valid' ref='routesEditorForm')
          v-text-field(
            v-model='presetName'
            required
            :rules='rules'
            label='Введіть назву списку')
          choose-authors(
            @updateSelectedUsers='updatePresetRoute'
            :selectedUsers='selectedUsers')
          authors-list(:selectedUsers='selectedUsers' @updateSelectedUser='updatePresetRoute')
          v-btn(@click.prevent='createNewPreset' color='primary' :disabled='!valid || !selectedUsers.length') Створити Маршрут
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      selectedUsers: [],
      presetName: '',
      showModal: false,
      rules: [ v => !!v || 'Обовʼязкове поле!' ],
      valid: false
    }
  },
  computed: mapGetters('usersStore', ['currentUser']),
  methods: {
    ...mapActions('docsStore', ['createPreset', 'getPresets']),
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
          this.$refs.routesEditorForm.reset()
          this.selectedUsers = []
          this.showModal = false
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
