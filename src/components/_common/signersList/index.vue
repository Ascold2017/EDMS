<template lang='pug'>
    b-tabs(v-if='!rejected')
      b-tab(title='Подписавшие' v-if='signedAuthors.length')
        b-list-group.signers-list
          b-list-group-item(
            v-for='author in signedAuthors'
            :key='author._id'
            variant='success'
            )
            p.subtitle.subtitle_small {{ author.author }}
            p.subtitle.subtitle_small {{ author.role }}
            p.subtitle.subtitle_small Час підпису: {{ toDateString(+author.dateSigning) }}
            b-card(v-if='author.comment' class='mt-1')
              p.text Коментар підписанта:
              p.text {{ author.comment }}
      b-tab(title='В черзі на підпис' v-if='waitingAuthors.length')
        b-list-group.signers-list
          b-list-group-item(
            v-for='author in waitingAuthors'
            :key='author._id'
            variant='primary'
            )
            p.subtitle.subtitle_small {{ author.author }}
            p.subtitle.subtitle_small {{ author.role }}
            b-card(v-if='author.comment' class='mt-1')
              p.text Коментар підписанта:
              p.text {{ author.comment }}
      b-alert( show variant='danger' v-else) Документ відмовлен в підписі Вами
</template>

<script>
import { mapGetters } from 'vuex'
import toDateString from '../../modulesJs/toDateString'
export default {
  props: {
    rejected: Boolean
  },
  methods: {
    toDateString
  },
  computed: {
    ...mapGetters('docsStore', ['document']),
    signedAuthors () {
      if (!this.document.routes) return []
      return this.document.routes.filter(route => route.status === 'resolve')
    },
    waitingAuthors () {
      if (!this.document.routes) return []
      return this.document.routes.filter(route => route.status === 'waiting')
    }
  }
}
</script>
<style lang="sass" scoped>
.signers-list
  max-height: 300px
  overflow-y: scroll
</style>
