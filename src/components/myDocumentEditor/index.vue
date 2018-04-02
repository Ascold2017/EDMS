<template lang='pug'>
.bg-simple
  b-container
    b-row
      b-col(sm='12' class='mb-6')
        b-card
          h1.title {{ document.title }}
          app-timer(@dateUpdate='dateUpd')
    b-row
      b-col
        b-card.mt-3
          b-form(@submit.prevent.stop='addNewVersion' enctype='multipart/form-data')
            b-form-group(
              label='Назва версії:'
              label-for='version'
              description='Додайте версію документа')
              b-form-input(
                id='version'
                v-model='docVersion'
                placeholder='Назва версии'
                required)

            b-form-group(
              label='Файл:'
              label-for='file'
              description='Додайте файл документа')
              b-form-file(
                id='file'
                @change='getFile($event)'
                choose-label='Оберіть файл'
                accept='.pdf'
                ref='fileInput'
                required)
            pdf-reader(
              :src='previewDoc'
              v-if='previewDoc')
            .empty-pdf(v-else)
                | Завантажте файл документа

            b-form-group(
              label='Введіть короткий опис версії'
              class='mt-3'
              )
              b-form-textarea(
                v-model='docDescription'
                placeholder='Описання..'
                :rows='3'
                :max-rows='6'
                )
            b-button(type='submit') Опублікувати
  b-modal(ref='alertModal' hide-footer) {{ infoAlert }}
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      date: '',
      docVersion: '',
      docDescription: '',
      file: '',
      infoAlert: '',
      previewDoc: '',
      id: this.$router.currentRoute.params.id
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
    getFile (event) {
      const file = event.target.files[0]
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

      this.addNewDocumentVersion(formData)
        .then(response => {
          this.showAlert(response.message)
          e.target.reset()
          this.$refs.fileInput.reset()
          setTimeout(() => this.$router.push('edms'), 3000)
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
    this.getMyDocumentById(this.id).catch(e => {
      this.$router.push('404')
    })
  },
  components: {
    appTimer: require('../addNewDocPage/innerComponents/timer.vue'),
    pdfReader: require('../_common/pdf-reader')
  }
}
</script>
