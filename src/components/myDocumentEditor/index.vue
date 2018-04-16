<template lang='pug'>
  v-container(fluid grid-list-md app).bg-simple
    v-card.px-3.py-3
      v-subheader.headline {{ document.title }}
      app-timer(@dateUpdate='dateUpd')
    v-card.px-3.py-3
      v-form(v-model='valid' ref='versionForm')
        v-text-field(
            v-model='docVersion'
            label='Назва версии'
            required
            :rules='rules')

        file-input(
          label='Додайте файл документа'
          accept='.pdf'
          :required='true'
          @file='getFile($event)')

        pdf-reader(
          :src='previewDoc'
          v-if='previewDoc')
        .empty-pdf(v-else)
            | Завантажте файл документа

        v-text-field(
          v-model='docDescription'
          label='Введіть короткий опис версії'
          multi-line
          required
          :rules='rules')
        v-btn(@click='addNewVersion' :disabled='!valid || !file || submitting' color='primary') Опублікувати
    v-dialog(v-model='showModal')
      v-card.px-3.py-3 {{ infoAlert }}
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import fileInput from '../_common/fileInput'
export default {
  data () {
    return {
      date: '',
      docVersion: '',
      docDescription: '',
      file: '',
      infoAlert: '',
      previewDoc: '',
      id: this.$router.currentRoute.params.id,
      valid: false,
      rules: [ v => !!v || 'Поле обовʼязкове!' ],
      submitting: false,
      showModal: false
    }
  },
  computed: {
    ...mapGetters('docsStore', ['document'])
  },
  methods: {
    ...mapActions('docsStore', ['addNewDocumentVersion', 'getMyDocumentById']),
    dateUpd (newDate) {
      this.date = newDate
    },
    getFile (file) {
      if (!file) return
      // check size file
      if (file.size / 1024 > 30000) {
        this.showAlert('Завантажуваний файл повинен бути менше 30 МБ!')
        return
      }
      // save to send on server
      this.file = file
      this.previewDoc = `${URL.createObjectURL(file)}`
    },
    addNewVersion (e) {
      const formData = new FormData()
      formData.append('id', this.document._id)
      formData.append('date', Date.now())
      formData.append('file', this.file)
      formData.append('version', this.docVersion)
      formData.append('description', this.docDescription)
      this.submitting = true
      this.addNewDocumentVersion(formData)
        .then(response => {
          this.showAlert(response.message)
          this.$refs.versionForm.reset()
          this.submitting = false
          setTimeout(() => this.$router.push('/edms'), 3000)
        })
        .catch(e => {
          this.submitting = false
          this.showAlert(e.message)
        })
    },
    showAlert (title) {
      this.infoAlert = title
      this.showModal = true
    }
  },
  created () {
    this.getMyDocumentById(this.id).catch(e => {
      this.$router.push('/404')
    })
  },
  components: {
    appTimer: require('../addNewDocPage/innerComponents/timer.vue'),
    pdfReader: require('../_common/pdf-reader'),
    fileInput
  }
}
</script>
