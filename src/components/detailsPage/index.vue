<template lang='pug'>
  v-container(app fluid fill-height grid-list-md).bg-simple
    v-layout(row wrap)
      v-flex(xs12)
        v-card.px-3.py-3
          v-subheader.headline {{ document.title }}
          div(v-if='document.author && document.date && document.versions')
            v-subheader Автор публикації {{ document.author}}
            v-subheader Дата першої публикації {{ toDateString(+document.date) }}
            div(v-if='document.versions.length > 1')
              v-subheader Поточна версія документа {{ document.versions[0].version }}
              v-subheader Дата публикації версії {{ document.versions[0].version }}: {{ toDateString(+document.versions[0].date) }}
      v-flex(xs12)
        doc-tabs
      v-flex(xs12 lg6)
        signers-list(:rejected='rejected')
      v-flex(xs12 lg6)
        // sign form
        v-card.px-3.py-3
          v-form(v-model='valid' ref='signForm')
            v-subheader Оберіть дію
            v-radio-group(
              v-model='selected'
              required
              :rules='rules')
              v-radio(
                label='Підписати документ'
                value='resolve')
              v-radio(
                label='Відмовити в підписі'
                value='reject')
            v-text-field(
              v-model='comment'
              placeholder='Залиште коментар'
              multi-line
              :rules='rules'
              required)
            v-btn(@click.prevent='submitDoc' :disabled='!valid || submitting' color='primary') Відправити

    v-snackbar(v-model="alert" top right)
      | {{ infoAlert }}
      v-btn(flat @click.native='alert = false' color="pink") Закрити

</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import toDateString from '../modulesJs/toDateString'
export default {
  data () {
    return {
      // get id of current document
      id: this.$router.currentRoute.params.id,
      // current status of doc
      selected: '',
      comment: '',
      infoAlert: '',
      rejected: false,
      valid: false,
      rules: [ v => !!v || 'Поле обовʼязкове!' ],
      submitting: false,
      alert: false
    }
  },
  computed: {
    ...mapGetters('docsStore', ['document']),
    ...mapGetters('usersStore', ['currentUser']),
    ...mapGetters(['privateKey'])
  },
  methods: {
    ...mapActions('docsStore', ['getDocumentById', 'postVote']),
    toDateString,
    submitDoc (e) {
      if (this.selected && this.comment) {
        // post our vote to server
        this.submitting = true
        this.postVote({
          id: this.id,
          vote: this.selected,
          comment: this.comment,
          author: this.currentUser
        })
          .then(response => {
            if (this.selected === 'reject') {
              this.rejected = true
            }
            this.showAlert(response.message)
            this.$refs.signForm.reset()
            this.getDocumentById(this.id)
            this.submitting = false
          })
          .catch(e => {
            this.showAlert(`Виникла помилка: ${e.message}`)
            this.submitting = false
          })
      }
    },
    showAlert (title) {
      this.infoAlert = title
      this.alert = true
    }
  },
  created () {
    this.getDocumentById(this.id)
      .catch(() => {
        this.$router.push('404')
      })
  },
  components: {
    docTabs: require('../_common/docTabs'),
    signersList: require('../_common/signersList')
  }
}
</script>
