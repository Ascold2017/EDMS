<template lang='pug'>
  v-container(fluid grid-list-md app).bg-simple
    v-layout(row wrap)
      v-flex(xs12)
        v-card.px-3.py-3
          v-subheader.headline {{ document.title }}
          v-subheader Дата першої публикації {{ toDateString(+document.date) }}
          v-subheader(v-if='document.versions && document.versions.lenght > 1') Поточна версія документа {{ document.versions[0].version }}
          v-subheader(v-if='document.versions && document.versions.lenght > 1') Дата публикації версіх {{ document.versions[0].version }}: {{ document.versions[0].date }}
      v-flex(xs12)
        doc-tabs
      v-flex(xs12 lg6)
        signers-list(:rejected='false')
      // document info
      v-flex(xs12 lg6)
        v-alert(
          type='success'
          v-if='document.globalStatus === "resolved"'
          :value='true'
          ) Документ успішно підписа, його можна знайти у
          router-link(:to='"/edms/archive/" + document._id') Архіві
        v-alert(
          variant='primary'
          v-if='document.globalStatus === "waiting"'
          :value='true'
          ) Документ на стадії перегляду. Зараз його переглядає: {{ closerViewer }}
        div(v-if='document.globalStatus === "rejected"')
          v-alert(
            variant='error'
            :value='true'
            ) Документ відмовлен в підписі. Ви можете его доробити або закрити.
            v-card
              v-card-text {{ document.versions[0].rejectReason }}
          v-btn(@click='closeDocument' color='error') Закрити документ
          v-btn(:to='"/edms/myDocumentEdit/" + id' color='primary') Доробити документ
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import toDateString from '../modulesJs/toDateString'
export default {
  data () {
    return {
      id: this.$router.currentRoute.params.id
    }
  },
  computed: {
    ...mapGetters('docsStore', ['document']),
    closerViewer () {
      return this.document.routes.find(route => route.status === 'waiting').author
    }
  },
  methods: {
    ...mapActions('docsStore', ['getMyDocumentById', 'closeDocumentById']),
    toDateString,
    closeDocument () {
      this.closeDocumentById(this.id)
    }
  },
  created () {
    this.getMyDocumentById(this.id)
      .catch(e => {
        this.$router.push('404')
      })
  },
  components: {
    docTabs: require('../_common/docTabs'),
    signersList: require('../_common/signersList')
  }
}
</script>
