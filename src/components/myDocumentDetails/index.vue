<template lang='pug'>
.bg-simple
  b-container
    b-row
      b-col(sm='12' class='mb-3')
        b-card
          h1.title {{ document.title }}
      b-col(sm='12' class='mb-3')
        b-card(v-if='document.author && document.date && document.versions')
          time.text Дата першої публикації {{ toDateString(+document.date) }}
          p.text(v-if='document.versions.lenght > 1') Поточна версія документа {{ document.versions[0].version }}
          time.text(v-if='document.versions.lenght > 1') Дата публикації версіх {{ document.versions[0].version }}: {{ document.versions[0].date }}
    b-row
      b-col
        doc-tabs
    b-row
      b-col
        signers-list(:rejected='false')
      // document info
      b-col(sm='12' lg='6')
        b-alert(
          variant='success'
          v-if='document.globalStatus === "resolved"'
          class='mb-0'
          show
          ) Документ успішно підписа, його можна знайти у
          router-link(:to='"/edms/archive/" + document._id') Архіві
        b-alert(
          variant='primary'
          v-if='document.globalStatus === "waiting"'
          class='mb-0'
          show
          ) Документ на стадії перегляду. Зараз його переглядає: {{ closerViewer }}
        div(v-if='document.globalStatus === "rejected"')
          b-alert(
            variant='danger'
            show
            ) Документ відмовлен в підписі. Ви можете его доробити або закрити.
            b-card.mb-3
              p.subtitle.subtitle_small {{ document.versions[0].rejectReason }}
          b-button(
            id='toArchive'
            @click='closeDocument'
            size='md'
            class='mr-3 mb-3'
            ) Закрити документ
          router-link(
            id='editDocument'
            :to='"/edms/myDocumentEdit/" + id'
            class='btn btn-success btn-md mb-3'
            ) Доробити документ
          b-tooltip(target='editDocument' title='Перейти в редактор версій')
          b-tooltip(target='toArchive' title='Документ відправиться в архів')
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
