<template lang='pug'>

  v-container(app fluid grid-list-md).bg-simple
    v-layout(row wrap)
      v-flex(xs12)
        v-card.px-3.py-3
          v-subheader.headline Додати новий документ
          app-timer(@dateUpdate='date = $event')
      v-flex(xs12 lg6)
        v-form(v-model='validForm' ref='docForm')
          v-card.px-3.py-3
            v-text-field(
              v-model='docName'
              required
              :rules='rules'
              label='Назва документа')

            file-input(
              @file='getFile'
              label='Завантажте файл документа'
              accept='.pdf'
              :required='true')

            pdfReader(
              :src='previewDoc'
              v-if='previewDoc')
            .empty-pdf(v-else)
              | Завантажте файл документа

            v-text-field(
              v-model='docDescription'
              label='Введіть короткий опис документа'
              required
              :rules='rules'
              multi-line)
      v-flex(xs12 lg6)
        // Completed presets
        preset-routes(@choosePreset='updateSelectedUsers')
        choose-authors(
          :selectedUsers='selectedUsers'
          @updateSelectedUsers='updateSelectedUsers')

      v-flex(xs12)
        v-card.px-3.py-3
          // List for choose document routes
          authors-list(
            :selectedUsers='selectedUsers'
            @updateSelectedUser='updateSelectedUsers')

        v-btn(@click.prevent='addNewDoc' :disabled='!validForm || submitting' color='primary') Опублікувати

    v-dialog(v-model='showModal' max-width="290")
      v-card
        v-card-text {{ infoAlert }}
        v-card-actions
          v-btn(flat @click.native='showModal = false') Закрити
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import fileInput from '../_common/fileInput'
export default {
  data () {
    return {
      date: '',
      docName: '',
      docVersion: 'Перша версія',
      docDescription: '',
      file: '',
      selectedUsers: [],
      infoAlert: '',
      previewDoc: '',
      validForm: false,
      rules: [ v => !!v || 'Обовʼязкове поле!' ],
      submitting: false,
      showModal: false
    }
  },
  computed: {
    ...mapGetters('usersStore', ['currentUser'])
  },
  methods: {
    ...mapActions('docsStore', ['addNewDocument']),
    ...mapActions('usersStore', ['getAllUsersFromGroup']),
    updateSelectedUsers (users) {
      this.selectedUsers = users
    },
    getFile (file) {
      if (!file) return
      // check size file
      if (file.size / 1024 > 30000) {
        this.showAlert('Файл має бути менше 30 МБ!')
        return
      }
      // save to send on server
      this.file = file
      // and create preview
      this.previewDoc = `${URL.createObjectURL(file)}`
    },
    addNewDoc () {
      if (!this.selectedUsers.length) {
        this.showAlert('Укажите исполнителей!')
        return
      }
      if (!this.docDescription) {
        this.showAlert('Укажите описание!')
        return
      }
      this.submitting = true
      // create formdata and send
      const formData = new FormData()
      formData.append('title', this.docName)
      formData.append('date', Date.now())
      formData.append('author', this.currentUser.author)
      formData.append('author_id', this.currentUser._id)
      formData.append('total', this.selectedUsers.length)
      formData.append('groupToken', this.currentUser.groupInvite)
      formData.append('routes', JSON.stringify(this.selectedUsers))
      formData.append('file', this.file)
      formData.append('version', this.docVersion)
      formData.append('description', this.docDescription)

      this.addNewDocument(formData)
        .then(response => {
          this.showAlert(response.message)
          this.selectedUsers = []
          this.previewDoc = ''
          this.$refs.docForm.reset()
          this.submitting = false
        })
        .catch(e => {
          this.showAlert(e.message)
        })
    },
    showAlert (title) {
      this.infoAlert = title
      this.showModal = true
    }
  },
  created () {
    this.getAllUsersFromGroup()
  },
  components: {
    chooseAuthors: require('./innerComponents/chooseAuthors'),
    authorsList: require('./innerComponents/authorsList.vue'),
    appTimer: require('./innerComponents/timer.vue'),
    presetRoutes: require('./innerComponents/presetRoutes'),
    pdfReader: require('../_common/pdf-reader'),
    fileInput
  }
}
</script>
