<template lang='pug'>
  v-container(fluid grid-list-md app).bg-simple
    v-alert(type='info' :value='!loaded') Завантажується...
    v-alert(type='warning' :value='loaded && !sortingData.length') У вас немає опублікованих документів!
    template(v-for='preview in sortingData')
      v-card(:color='globalStatus(preview).color').px-3.py-3
        v-subheader.headline {{ preview.title }}
        v-subheader {{ 'Дата публікації: ' + toDateString(+preview.date) }}
        v-subheader Статус: {{ globalStatus(preview).status }}
        v-btn(:to='"/edms/myDocuments/" + preview._id' color='primary')
          | Перейти
          v-icon(right dark) exit_to_app
      v-divider
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import toDateString from '../modulesJs/toDateString'
export default {
  data () {
    return {
      loaded: false
    }
  },
  computed: {
    ...mapGetters('docsStore', ['documents']),
    sortingData () {
      return this.documents.slice(0).sort((prev, next) => prev.date <= next.date)
    }
  },
  methods: {
    ...mapActions('docsStore', ['getOurDocuments']),
    toDateString,
    globalStatus (doc) {
      switch (doc.globalStatus) {
        case 'resolved': return { color: 'success', status: 'Прийнятий' }
        case 'rejected': return { color: 'error', status: 'Відмовлен' }
        case 'waiting': return { color: 'info', status: 'На розгляданні' }
        case 'archived': return { color: 'secondary', status: 'Закритий' }
      }
    }
  },
  created () {
    this.getOurDocuments()
      .then(() => {
        this.loaded = true
      })
  }
}
</script>
