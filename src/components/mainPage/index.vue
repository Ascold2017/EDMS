<template lang='pug'>
  v-container(app fluid fill-height).bg-simple
    v-layout
      v-flex
        v-subheader.headline.mt-3 Документи к підписанню
        v-alert(type='info' :value='!loaded') Завантажується...
        v-alert(type='warning' :value='loaded && !sortingData.length') Нових документів до розгляду немає
        template(v-for='preview in sortingData')
          v-card
            v-layout(row wrap)
              v-flex(xs12 md6)
                v-subheader.headline {{ preview.title }}
              v-flex(xs12 md6)
                v-subheader Дата публікації: {{ toDateString(+preview.date) }}
              v-flex(xs12 md6)
                v-subheader Автор публікації: {{ preview.author }}
              v-flex(xs12 md6)
                v-subheader Поточний маршрут: {{ preview.state }} / {{ preview.total }}
              v-flex(xs12 md6)
                v-subheader Час відкриття візи: {{ incomingDate(preview) }}
              v-flex(xs12)
                v-btn(
                  :to='"/edms/" + preview._id' color='primary')
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
  }
}
</script>
