<template lang='pug'>
.bg
  b-container
    b-card.mb-3
      h2.title Документы к подписанию
    b-list-group
      b-alert(variant='primary' show v-if='!loaded') Загрузка...
      b-alert(variant='danger' show v-if='loaded && !sortingData.length') Новых документов к рассмотрению нет
      router-link(
        v-for='preview in sortingData'
        :key='preview._id'
        :to='"/edms/" + preview._id'
        class='list-group-item preview-item list-group-item-action'
        )
        .preview-item__icon(class='waiting')
            i(class='fa fa-file-text-o' aria-hidden='true')
        h2.preview-item__title {{ preview.title }}
        time.preview-item__date Дата публикации: {{ toDateString(+preview.date) }}
        span.preview-item__author Автор публикации: {{ preview.author }}
        span.preview-item__state Текущий маршрут: {{ preview.state }} / {{ preview.total }}
        span.preview-item__incoming Время открытия визы: {{ incomingDate(preview) }}
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
    ...mapGetters('usersStore', ['currentUser']),
    sortingData () {
      if (!this.documents.length) return []
      return this.documents.slice(0).sort((prev, next) => prev.date <= next.date)
    }
  },
  methods: {
    ...mapActions('docsStore', ['getPreviews']),
    ...mapActions('usersStore', ['getCurrentUser']),
    toDateString,
    incomingDate (document) {
      const user = document.routes.find(
        route => route.author === this.currentUser.author
      )
      return this.toDateString(+user.dateIncoming)
    }
  },
  created () {
    this.getPreviews()
      .then(() => {
        this.loaded = true
      })
      .catch(() => {
        this.$router.push('/')
      })
  }
}
</script>
