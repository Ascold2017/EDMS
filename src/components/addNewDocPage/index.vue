<template lang='pug'>
.bg-simple
  b-container
    b-row
      b-col
        b-card(class='mb-3')
          h1.title Додати новий документ
          app-timer(@dateUpdate='date = $event')
    b-row
      b-col
        b-form(@submit.prevent.stop='addNewDoc' enctype='multipart/form-data')
          b-row
            b-col(md='12' lg='6')
              b-card
                b-form-group(
                  label='Назва документа:'
                  label-for='docname'
                  description='Додайте назву документа')
                  b-form-input(
                    id='docname'
                    type='text'
                    v-model='docName'
                    required
                    placeholder='Назва')
                b-form-group(
                  label='Файл:'
                  label-for='file'
                  description='Завантажте файл документа')
                  b-form-file(
                    id='file'
                    @change='getFile'
                    choose-label='Оберіть файл'
                    accept='.pdf'
                    ref='fileInput'
                    required)
                pdfReader(
                  :src='previewDoc'
                  v-if='previewDoc')
                .empty-pdf(v-else)
                  | Завантажте файл документа

                b-form-group(
                  label='Введіть короткий опис документа'
                  class='mt-3')
                  b-form-textarea(
                    v-model='docDescription'
                    placeholder='Описание..'
                    :rows='3'
                    :max-rows='6')
            b-col(md='12' lg='6')
              // Completed presets
              preset-routes(@choosePreset='updateSelectedUsers')
              choose-authors(
                :selectedUsers='selectedUsers'
                @updateSelectedUsers='updateSelectedUsers')

          b-row(class='mt-3')
            b-col
              b-card
                // List for choose document routes
                authors-list(
                  :selectedUsers='selectedUsers'
                  @updateSelectedUser='updateSelectedUsers')

          b-button(type='submit' class='mt-3' ref='submit') Опубликовать

    b-modal(ref='alertModal' hide-footer) {{ infoAlert }}
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
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
      percentLoaded: 0
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
    getFile (event) {
      const file = event.target.files[0]
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
    addNewDoc (e) {
      if (!this.selectedUsers.length) {
        this.showAlert('Укажите исполнителей!')
        return
      }
      if (!this.docDescription) {
        this.showAlert('Укажите описание!')
        return
      }
      this.$refs.submit.disabled = true
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
          e.target.reset()
          this.$refs.fileInput.reset()
          this.selectedUsers = []
          this.previewDoc = ''
          this.$refs.submit.disabled = false
        })
        .catch(e => {
          this.showAlert(e.message)
        })
    },
    showAlert (title) {
      this.infoAlert = title
      this.$refs.alertModal.show()
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
    pdfReader: require('../_common/pdf-reader')
  }
}
</script>
