<template lang='pug'>
.bg-simple
  b-container
    b-row
      b-col(sm='12' class='mb-3')
        b-card
          h1.title {{ document.title }}
      b-col(sm='12' class='mb-3')
        b-card
          time.text Дата первой публикации {{ toDateString(+document.date) }}
          p.text(v-if='document.versions.lenght > 1') Текущая версия документа {{ document.versions[0].version }}
          time.text(v-if='document.versions.lenght > 1') Дата публикации версии {{ document.versions[0].version }}: {{ document.versions[0].date }}
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
          ) Документ успешно подписан, его можно найти в
          router-link(:to='"/edms/archive/" + document._id') Архиве
        b-alert(
          variant='primary'
          v-if='document.globalStatus === "waiting"'
          class='mb-0'
          show
          ) Документ на стадии рассмотрения. Сейчас его рассматривает: {{ closerViewer }}
        div(v-if='document.globalStatus === "rejected"')
          b-alert(
            variant='danger'
            show
            ) Документ отказан в подписи. Вы можете его доработать или закрыть.
            b-card.mb-3
              p.subtitle.subtitle_small {{ document.versions[0].rejectReason }}
          b-button(
            id='toArchive'
            @click='closeDocument'
            size='md'
            class='mr-3 mb-3'
            ) Закрыть документ
          router-link(
            id='editDocument'
            :to='"/edms/myDocumentEdit/" + id'
            class='btn btn-success btn-md mb-3'
            ) Доработать документ
          b-tooltip(target='editDocument' title='Перейти в редактор версий')
          b-tooltip(target='toArchive' title='Документ отправится в архив')
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
