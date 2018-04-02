<template lang='pug'>
.bg-simple
  b-container
    b-row
      b-col(sm='12' class='mb-3')
        b-card
          h1.title {{ document.title }}
      b-col(sm='12' class='mb-3')
        b-card(v-if='document.author && document.date && document.versions')
          p.text Автор публикації {{ document.author}}
          time.text Дата першої публикації {{ toDateString(+document.date) }}
          div(v-if='document.versions.length > 1')
            p.text Поточна версія документа {{ document.versions[0].version }}
            time.text Дата публикації версії {{ document.versions[0].version }}: {{ toDateString(+document.versions[0].date) }}
    b-row
      b-col
        doc-tabs
    b-row
      b-col(sm='12' lg='6')
        signers-list(:rejected='rejected')
      b-col(sm='12' lg='6')
        // sign form
        b-form(@submit.prevent='submitDoc')
          b-card
            b-form-group(label='Оберіть дію')
              b-form-radio-group(
                v-model='selected'
                name='radioSubComponent'
                :options='options'
                )
            b-form-group(label='Ваш коментар')
              b-form-textarea(
                v-model='comment'
                placeholder='Залиште коментар'
                :rows='3'
                :max-rows='6'
                required
                )
            b-button(type='submit') Відправити

  b-modal(ref='alertModal' hide-footer) {{ infoAlert }}
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
      options: [
        { value: 'resolve', text: 'Підписати документ' },
        { value: 'reject', text: 'Відмовити в підписі' }
      ],
      comment: '',
      infoAlert: '',
      rejected: false
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
            e.target.reset()
            this.getDocumentById(this.id)
          })
          .catch(e => {
            this.showAlert(`Произошла ошибка: ${e.message}`)
          })
      }
    },
    showAlert (title) {
      this.infoAlert = title
      this.$refs.alertModal.show()
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
